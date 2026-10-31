"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Volume2, VolumeX } from "lucide-react";
import type { EventStatus, MyResult, SpinResult } from "@/lib/event-wheel";
import {
  WHEEL_PHONE_KEY,
  WHEEL_REQUEST_KEY,
  safeGet,
  safeSet,
} from "@/lib/event-wheel";
import { Countdown, useCountdown } from "./countdown";
import { SpinForm } from "./spin-form";
import { SpinResult as ResultScreen } from "./spin-result";
import { useSpinSound } from "./use-spin-sound";
import { Wheel } from "./wheel";

/**
 * Trang event "Quay may mắn" (/event-thang10) — thành phần điều phối.
 *
 * Phân chia trách nhiệm:
 *   - server (Apps Script) chốt: đang mở hay chưa, trúng gì, còn quà không, mã ưu đãi
 *   - route /api/event-wheel: giữ token, validate lại, chặn spam
 *   - component này: chỉ hiển thị và chạy hoạt ảnh theo kết quả server trả về
 *
 * localStorage chỉ dùng để nhớ SĐT, giúp khách quay lại trang vẫn tra được mã cũ.
 * Xoá localStorage KHÔNG cho quay thêm lượt — chặn nằm ở server.
 */

type Screen = "form" | "spinning" | "result";

/** requestId bền: khách bấm lại / mạng chập cũng không ghi thêm dòng vào sheet. */
function stableRequestId(): string {
  const saved = safeGet(WHEEL_REQUEST_KEY);
  if (saved) return saved;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `rq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  safeSet(WHEEL_REQUEST_KEY, id);
  return id;
}

/** Nút quay về trang chủ — dùng lại ở mọi trạng thái của trang. */
function HomeButton({ variant = "ghost" }: { variant?: "ghost" | "solid" }) {
  return (
    <Link
      href="/"
      className={
        variant === "solid"
          ? "flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-[#06142b] transition hover:bg-white/90 active:scale-[0.99]"
          : "inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white/80 ring-1 ring-inset ring-white/15 transition hover:bg-white/20 hover:text-white"
      }
    >
      <ArrowLeft className="size-4" />
      Về trang chủ
    </Link>
  );
}

export function EventWheelPage() {
  const [status, setStatus] = useState<EventStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [netError, setNetError] = useState(false);
  const [screen, setScreen] = useState<Screen>("form");
  const [result, setResult] = useState<MyResult | null>(null);
  const [replay, setReplay] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landedRef = useRef(false);
  const sound = useSpinSound();

  /* ----------------------------- tải trạng thái ----------------------------- */

  const load = useCallback(async (): Promise<EventStatus | null> => {
    const phone = safeGet(WHEEL_PHONE_KEY);
    const params = new URLSearchParams();
    if (phone) params.set("phone", phone);
    // ?mock=upcoming|open|ended|empty để xem trước từng giai đoạn.
    // Server CHỈ chấp nhận tham số này ngoài production (xem route.ts), nên trên
    // web thật nó bị bỏ qua — khách không thể tự ép chương trình mở.
    const preview = new URLSearchParams(window.location.search).get("mock");
    if (preview) params.set("mock", preview);
    const qs = params.toString();
    const url = qs ? `/api/event-wheel?${qs}` : "/api/event-wheel";
    try {
      const res = await fetch(url, { cache: "no-store" });
      const data = (await res.json()) as EventStatus;
      setStatus(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  // Thử lại khi lần gọi đầu trượt.
  // Vì sao cần: chỉ cần một cú nấc mạng là khách đang trong event lại thấy
  // "Chương trình chưa mở" rồi bỏ đi — mất khách oan trong khi event vẫn chạy.
  useEffect(() => {
    let huy = false;
    (async () => {
      for (let lan = 0; lan < 3; lan++) {
        const data = await load();
        if (huy) return;
        if (data) {
          // Khách đã quay rồi -> mở thẳng màn kết quả để lấy lại mã.
          if (data.ok && data.myResult) {
            setResult(data.myResult);
            setReplay(true);
            setScreen("result");
          }
          setLoading(false);
          return;
        }
        await new Promise((r) => window.setTimeout(r, 1200 * (lan + 1)));
        if (huy) return;
      }
      setNetError(true);
      setLoading(false);
    })();
    return () => {
      huy = true;
    };
  }, [load]);

  const thuLai = () => {
    setNetError(false);
    setLoading(true);
    void load()
      .then((data) => {
        if (data?.ok && data.myResult) {
          setResult(data.myResult);
          setReplay(true);
          setScreen("result");
        }
        if (!data) setNetError(true);
      })
      .finally(() => setLoading(false));
  };

  /** Lệch giờ giữa máy khách và server — dùng cho đồng hồ đếm ngược. */
  const skewMs = useMemo(() => {
    if (!status?.serverTime) return 0;
    const server = Date.parse(status.serverTime);
    return Number.isNaN(server) ? 0 : server - Date.now();
  }, [status?.serverTime]);

  // Hết giờ ngay trên màn hình -> hỏi lại server để chốt giai đoạn mới.
  const endTimer = useCountdown(
    status?.phase === "open" ? status.endAt : (status?.startAt ?? null),
    skewMs,
  );

  // CẨN THẬN khi sửa effect này: deps phải là `phase` (chuỗi), KHÔNG phải cả
  // object `status`. Mỗi lần load() xong là `status` thành object mới; nếu để
  // nó trong deps thì effect chạy lại -> load() -> lại đổi status -> lặp vô tận,
  // dội request đúng vào lúc 15:00 khi đồng hồ về 0 mà server chưa kịp đổi phase.
  const phaseNow = status?.phase;
  useEffect(() => {
    if (!endTimer.done) return;
    if (phaseNow !== "open" && phaseNow !== "upcoming") return;
    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(id);
  }, [endTimer.done, phaseNow, load]);

  /* ----------------------------- quay thưởng ----------------------------- */

  const spin = async (name: string, phone: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const preview = new URLSearchParams(window.location.search).get("mock");
      const res = await fetch(
        preview
          ? `/api/event-wheel?mock=${encodeURIComponent(preview)}`
          : "/api/event-wheel",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            agree: true,
            requestId: stableRequestId(),
          }),
        },
      );
      const data = (await res.json()) as SpinResult;

      // SĐT đã quay trước đó -> hiện lại phần quà cũ, không quay nữa.
      if (data.already && data.prizeId && data.code) {
        safeSet(WHEEL_PHONE_KEY, phone);
        setResult({
          prizeId: data.prizeId,
          prizeName: data.prizeName ?? "",
          code: data.code,
          at: data.at ?? "",
        });
        setReplay(true);
        setScreen("result");
        return;
      }

      if (!data.ok || !data.prizeId || !data.code) {
        setError(data.error ?? "Không quay được lúc này. Vui lòng thử lại.");
        if (data.phase && data.phase !== "open") void load();
        return;
      }

      safeSet(WHEEL_PHONE_KEY, phone);
      setResult({
        prizeId: data.prizeId,
        prizeName: data.prizeName ?? "",
        code: data.code,
        at: data.at ?? "",
      });
      setReplay(Boolean(data.duplicated));
      landedRef.current = false;
      setScreen("spinning");
      // 5200ms khớp DURATION trong wheel.tsx; nếu đổi ở đó thì đổi cả đây.
      sound.playSpin(5200);
    } catch {
      setError("Mất kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSettled = useCallback(() => {
    if (landedRef.current) return;
    landedRef.current = true;
    setScreen("result");
    sound.playWin();
    // Cập nhật lại tồn kho quà sau khi đã phát một suất.
    void load();
  }, [load, sound]);

  /* ----------------------------- render ----------------------------- */

  const shell = (children: React.ReactNode) => (
    // Trừ chiều cao header (h-16 = 4rem, lg:h-18 = 4.5rem) để nền tối phủ vừa
    // đúng phần còn lại của khung nhìn, không tạo thêm thanh cuộn thừa.
    <main className="min-h-[calc(100dvh-4rem)] bg-[#06142b] text-white lg:min-h-[calc(100dvh-4.5rem)]">
      <div
        className="flex min-h-[calc(100dvh-4rem)] w-full flex-col lg:min-h-[calc(100dvh-4.5rem)]"
        style={{
          // Nền chuyển sắc rất nhẹ — giữ tinh thần tối giản, không loè loẹt.
          backgroundImage:
            "radial-gradient(120% 70% at 50% 0%, #12356b 0%, #06142b 60%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-5 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-6 lg:pt-5">
          {children}
        </div>
      </div>
    </main>
  );

  if (loading) {
    return shell(
      <div className="flex min-h-[60dvh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-white/50" />
        <span className="sr-only">Đang tải chương trình…</span>
      </div>,
    );
  }

  // Không gọi được máy chủ sau 3 lần thử -> nói đúng sự thật và cho thử lại,
  // thay vì báo "chưa mở" làm khách tưởng hết chương trình.
  if (netError || !status) {
    return shell(
      <>
        <div className="flex justify-start">
          <HomeButton />
        </div>
        <div className="mx-auto mt-16 flex max-w-[460px] flex-col items-center gap-5 text-center">
          <span aria-hidden className="text-4xl">
            📡
          </span>
          <h1 className="text-[24px] font-bold leading-tight sm:text-[28px]">
            Không tải được chương trình
          </h1>
          <p className="text-[14px] leading-relaxed text-white/60">
            Có thể do kết nối mạng chập chờn. Bạn thử lại giúp nhé — chương
            trình vẫn đang diễn ra bình thường.
          </p>
          <button
            type="button"
            onClick={thuLai}
            className="h-[52px] w-full max-w-[280px] cursor-pointer rounded-full bg-white text-[15px] font-semibold text-[#06142b] transition hover:bg-white/90 active:scale-[0.99]"
          >
            Thử lại
          </button>
          <HomeButton />
        </div>
      </>,
    );
  }

  // Chưa cấu hình / đã tắt -> vẫn là một trang tử tế, không trắng trơn.
  if (status.phase === "off") {
    return shell(
      <>
        <div className="flex justify-start">
          <HomeButton />
        </div>
        <div className="mx-auto mt-16 flex max-w-[460px] flex-col items-center gap-5 text-center">
          <span aria-hidden className="text-4xl">
            🎁
          </span>
          <h1 className="text-[24px] font-bold leading-tight sm:text-[28px]">
            Chương trình chưa mở
          </h1>
          <p className="text-[14px] leading-relaxed text-white/60">
            Hiện chưa có chương trình quay thưởng nào đang diễn ra. Bạn ghé lại
            sau nhé — hoặc xem các ưu đãi đang có tại DEV PỒ.
          </p>
          <div className="w-full max-w-[280px]">
            <HomeButton variant="solid" />
          </div>
        </div>
      </>,
    );
  }

  const wheelPrizes = status.prizes.filter((p) => !p.het);
  const phase = status.phase;
  // Bố cục ngang hai cột từ lg; dưới lg xếp dọc và cuộn bình thường.
  const wide = (phase === "open" && screen !== "result") || screen === "result";

  return shell(
    <>
      {/* Thanh trên cùng: về trang chủ + bật/tắt tiếng */}
      <div className="flex items-center justify-between gap-3">
        <HomeButton />
        <button
          type="button"
          onClick={sound.toggle}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/70 ring-1 ring-inset ring-white/15 transition hover:bg-white/20 hover:text-white"
          aria-label={
            sound.enabled ? "Tắt âm thanh vòng quay" : "Bật âm thanh vòng quay"
          }
          aria-pressed={sound.enabled}
        >
          {sound.enabled ? (
            <Volume2 className="size-4" />
          ) : (
            <VolumeX className="size-4" />
          )}
        </button>
      </div>

      {/* Desktop: phần nội dung chiếm hết chỗ còn lại và căn giữa dọc, để trang
          không bị dồn lên trên chừa khoảng trống lớn bên dưới. */}
      <div className="mt-4 lg:flex lg:flex-1 lg:items-center">
        <div
          className={`flex w-full flex-col gap-5 ${
            wide
              ? "lg:grid lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:items-start lg:gap-x-12 lg:gap-y-2"
              : ""
          }`}
        >
          {/* ----------------------------- Đầu trang ----------------------------- */}
          <header
            className={`flex flex-col items-center gap-2.5 text-center ${
              screen === "result"
                ? "lg:col-span-2"
                : wide
                  ? "lg:col-start-1 lg:row-start-1"
                  : ""
            }`}
          >
            <h1 className="text-balance text-[26px] font-bold leading-[1.15] sm:text-[30px]">
              QUAY MAY MẮN - NHẬN QUÀ LIỀN TAY!
            </h1>
            <p className="text-balance text-[13px] leading-relaxed text-white/60">
              {screen === "result"
                ? "Phần quà đã được ghi nhận cùng số điện thoại của bạn."
                : "Chỉ diễn ra trong 2 ngày 31/10 – 01/11. Quay ngay để không bỏ lỡ những phần quà cực hấp dẫn!"}
            </p>
          </header>

          {/* ----------------------------- Theo giai đoạn ----------------------------- */}
          {phase === "upcoming" && (
            <div className="mx-auto flex w-full max-w-[460px] flex-col gap-5">
              <div className="rounded-2xl bg-white/[0.06] px-4 py-5 ring-1 ring-inset ring-white/10">
                <Countdown
                  target={status.startAt}
                  skewMs={skewMs}
                  label="Chương trình bắt đầu sau"
                />
              </div>
              <p className="text-center text-[13px] leading-relaxed text-white/60">
                Cơ hội nhận mã giảm giá đến{" "}
                <span className="font-semibold text-white">500.000đ</span>,
                Apple Pencil, AirPods và nhiều ưu đãi khác khi mua iPhone/iPad
                tại DEV PỒ.
              </p>
              <HomeButton variant="solid" />
            </div>
          )}

          {phase === "ended" && screen !== "result" && (
            <div className="mx-auto flex w-full max-w-[460px] flex-col gap-4 text-center">
              <p className="rounded-2xl bg-white/[0.06] px-4 py-5 text-[14px] leading-relaxed text-white/75 ring-1 ring-inset ring-white/10">
                Chương trình{" "}
                <strong className="text-white">QUAY MAY MẮN</strong> đã kết
                thúc. Cảm ơn bạn đã tham gia cùng DEV PỒ!
              </p>
              <p className="text-[13px] text-white/55">
                Khách đã trúng thưởng vui lòng mang mã ưu đãi tới DEV PỒ để được
                áp dụng.
              </p>
              <HomeButton variant="solid" />
            </div>
          )}

          {phase === "open" && screen !== "result" && (
            <>
              {/* Cột trái (desktop): đếm ngược + vòng quay.
                Thứ tự thẻ trong DOM cũng chính là thứ tự trên mobile. */}
              <div className="lg:col-start-1 lg:row-start-2">
                <Countdown
                  target={status.endAt}
                  skewMs={skewMs}
                  label="Thời gian chương trình còn"
                />
              </div>

              <div className="lg:col-start-1 lg:row-start-3">
                <Wheel
                  prizes={wheelPrizes}
                  landOn={
                    screen === "spinning" ? (result?.prizeId ?? null) : null
                  }
                  spinning={screen === "spinning"}
                  onSettled={onSettled}
                />
              </div>

              {/* Cột phải (desktop): form + số lượng quà.
                Gói chung một thẻ để trên mobile vẫn xếp dọc đúng thứ tự. */}
              <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:self-center">
                {screen === "spinning" ? (
                  <p className="text-center text-[14px] font-medium text-white/80">
                    Đang quay… chúc bạn may mắn!
                  </p>
                ) : (
                  <SpinForm
                    onSubmit={spin}
                    submitting={submitting}
                    serverError={error}
                  />
                )}
              </div>
            </>
          )}

          {screen === "result" && result && (
            <div className="lg:col-span-2 lg:row-start-2">
              <ResultScreen result={result} replay={replay} />
            </div>
          )}
        </div>
      </div>
    </>,
  );
}
