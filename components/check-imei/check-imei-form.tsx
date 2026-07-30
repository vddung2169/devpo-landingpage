"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Lock,
  Save,
  Search,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

/**
 * Dịch vụ check CỐ ĐỊNH — chỉ để hiển thị. Server tự quyết định dịch vụ thật
 * qua DHRU_SERVICE_ID, client không gửi và không chọn được.
 */
const SERVICE_LABEL = "Check iCloud · SIM Lock · Model";
const SERVICE_TIME = "vài giây";

type ResultLine = { label: string; value: string };

/** Trạng thái lượt check của thiết bị, do máy chủ quyết định. */
type Snapshot = {
  state: "idle" | "pending" | "done" | "rejected";
  referenceId?: string;
  imei?: string;
  serviceId?: string;
  resetAt?: number;
  result?: ResultLine[];
  raw?: string;
  error?: string;
  /** Sự cố tạm thời phía máy chủ tra cứu — đơn vẫn còn, sẽ tự thử lại. */
  warning?: string;
};

/** Một kết quả đã lưu trên thiết bị, khoá theo IMEI. */
type CacheEntry = {
  imei: string;
  serviceId?: string;
  referenceId?: string;
  result: ResultLine[];
  raw?: string;
  savedAt: number;
};

type CacheMap = Record<string, CacheEntry>;

const CACHE_KEY = "devpo:check-imei:v2";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const POLL_MS = 3000;
/** Sau mốc này thì giãn nhịp hỏi, tránh nện máy chủ khi đơn chạy lâu. */
const SLOW_POLL_AFTER_MS = 2 * 60 * 1000;
const SLOW_POLL_MS = 10_000;
/**
 * Máy chủ tra cứu lỗi liên tục quá lâu thì báo thẳng cho người dùng kèm mã đơn,
 * thay vì để vòng quay chạy mãi. Vẫn thử lại ngầm phòng khi bên kia hồi phục.
 */
const STALE_AFTER_MS = 90_000;

/* -------------------------------------------------------------------------- */
/* Bộ nhớ kết quả trên thiết bị                                                */
/* -------------------------------------------------------------------------- */

/**
 * Kết quả check được giữ 24h ngay trên máy người dùng, khoá theo IMEI. Nhập lại
 * đúng IMEI đã check thì lấy từ đây, không gọi API và không tốn lượt.
 *
 * Đây chỉ là bộ đệm tiện lợi, KHÔNG phải hàng rào hạn mức — hạn mức nằm ở
 * cookie đã ký phía máy chủ (xem lib/imei-quota.ts).
 */
function readCache(): CacheMap {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheMap;
    if (!parsed || typeof parsed !== "object") return {};

    // Dọn các mục đã quá 24h ngay khi đọc.
    const now = Date.now();
    const fresh: CacheMap = {};
    for (const [imei, entry] of Object.entries(parsed)) {
      if (entry?.savedAt && now - entry.savedAt < CACHE_TTL_MS) {
        fresh[imei] = entry;
      }
    }
    return fresh;
  } catch {
    return {};
  }
}

function writeCache(map: CacheMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    // Chế độ ẩn danh hoặc hết dung lượng: bỏ qua, chỉ mất tiện lợi.
  }
}

/** Mục được lưu gần nhất — dùng để hiện lại ngay khi mở trang. */
function latestEntry(map: CacheMap): CacheEntry | undefined {
  return Object.values(map).sort((a, b) => b.savedAt - a.savedAt)[0];
}

/* -------------------------------------------------------------------------- */

const formatClock = (ms: number) =>
  new Date(ms).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

/** "5 giờ 12 phút" — đếm ngược tới lúc được check tiếp. */
function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 60000));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 1) return `${minutes} phút`;
  return "dưới 1 phút";
}

export function CheckImeiForm() {
  const [imei, setImei] = useState("");

  const [cache, setCache] = useState<CacheMap>({});
  const [snapshot, setSnapshot] = useState<Snapshot>({ state: "idle" });
  const [restoring, setRestoring] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const [pendingSince, setPendingSince] = useState<number | null>(null);
  const [warnSince, setWarnSince] = useState<number | null>(null);

  // Giữ snapshot mới nhất cho vòng lặp poll và cho quy tắc chống ghi đè.
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  /** Lưu kết quả vào bộ đệm thiết bị. */
  const remember = useCallback((next: Snapshot) => {
    if (!next.imei || !next.result?.length) return;
    setCache((current) => {
      const updated: CacheMap = {
        ...current,
        [next.imei!]: {
          imei: next.imei!,
          serviceId: next.serviceId,
          referenceId: next.referenceId,
          result: next.result!,
          raw: next.raw,
          savedAt: Date.now(),
        },
      };
      writeCache(updated);
      return updated;
    });
  }, []);

  /** Nhận trạng thái mới từ máy chủ. */
  const apply = useCallback(
    (next: Snapshot) => {
      const current = snapshotRef.current;

      // Kết quả đã xong là bất biến. Phản hồi suy giảm (máy chủ tra cứu lỗi nên
      // trả về "pending") KHÔNG được xoá kết quả đang hiện — đây chính là lý do
      // trước đây reload trang lại mất kết quả.
      const downgrade =
        current.state === "done" &&
        next.state === "pending" &&
        (!next.referenceId || next.referenceId === current.referenceId);
      if (downgrade) {
        setSnapshot({ ...current, warning: next.warning });
        setNow(Date.now());
        return;
      }

      setSnapshot(next);
      setNow(Date.now());

      if (next.state === "pending") {
        setPendingSince((prev) => prev ?? Date.now());
        // Chuỗi lỗi bị ngắt thì tính lại từ đầu.
        setWarnSince((prev) => (next.warning ? (prev ?? Date.now()) : null));
      } else {
        setPendingSince(null);
        setWarnSince(null);
      }

      if (next.state === "done") remember(next);
    },
    [remember],
  );

  // Nạp bộ đệm thiết bị trước tiên — có gì hiện ngay, không chờ mạng.
  useEffect(() => {
    const map = readCache();
    setCache(map);
    writeCache(map); // ghi lại bản đã dọn hạn

    const last = latestEntry(map);
    if (last) {
      setImei(last.imei);
      setSnapshot({
        state: "done",
        imei: last.imei,
        serviceId: last.serviceId,
        referenceId: last.referenceId,
        result: last.result,
        raw: last.raw,
      });
    }
  }, []);

  // Đối chiếu với máy chủ: đơn có thể đã xong trong lúc người dùng đi chỗ khác.
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/check-imei?action=status", {
          signal: ac.signal,
          cache: "no-store",
        });
        const data = (await res.json()) as Snapshot & { ok: boolean };
        if (!data.ok) return;

        apply(data);
        if (data.imei) setImei(data.imei);
      } catch {
        // Mất mạng lúc khôi phục: giữ nguyên bộ đệm đang hiện.
      } finally {
        setRestoring(false);
      }
    })();
    return () => ac.abort();
  }, [apply]);

  // Trong lúc đơn đang xử lý thì hỏi lại máy chủ đều đặn. Dịch vụ chậm (vd #16)
  // có thể mất vài phút, nên không đặt trần số lần hỏi.
  useEffect(() => {
    if (snapshot.state !== "pending") return;

    const ac = new AbortController();
    let timer: ReturnType<typeof setTimeout>;

    const nextDelay = () =>
      pendingSince && Date.now() - pendingSince > SLOW_POLL_AFTER_MS
        ? SLOW_POLL_MS
        : POLL_MS;

    const tick = async () => {
      try {
        const res = await fetch("/api/check-imei?action=status", {
          signal: ac.signal,
          cache: "no-store",
        });
        const data = (await res.json()) as Snapshot & { ok: boolean };
        if (data.ok) apply(data);
      } catch {
        // Lỗi mạng tạm thời: cứ thử lại ở nhịp sau.
      }
      if (snapshotRef.current.state === "pending") {
        timer = setTimeout(tick, nextDelay());
      }
    };

    timer = setTimeout(tick, nextDelay());
    return () => {
      ac.abort();
      clearTimeout(timer);
    };
  }, [snapshot.state, pendingSince, apply]);

  // Nhịp 30s để đồng hồ đếm ngược tự cập nhật.
  useEffect(() => {
    if (!snapshot.resetAt) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [snapshot.resetAt]);

  const imeiDigits = imei.replace(/\D/g, "");
  /** IMEI đang nhập đã có kết quả lưu sẵn -> khỏi gọi API. */
  const cached = imeiDigits.length === 15 ? cache[imeiDigits] : undefined;

  const quotaUsed = snapshot.state === "pending" || snapshot.state === "done";
  const remainingMs = snapshot.resetAt ? snapshot.resetAt - now : 0;
  const canSubmit =
    !cached && !quotaUsed && !restoring && !submitting && imeiDigits.length === 15;

  async function submit() {
    // Đã có trong bộ đệm thì không gọi API, không tốn lượt.
    if (cached) return;

    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/check-imei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Chỉ gửi IMEI — dịch vụ do máy chủ cố định, client không chọn được.
        body: JSON.stringify({ imei: imeiDigits }),
      });
      const data = (await res.json()) as Snapshot & { ok: boolean };

      if (data.state) apply(data);
      if (!data.ok && data.error) setFormError(data.error);
    } catch {
      setFormError("Không gửi được yêu cầu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Desktop: form trái, kết quả phải — cả trang nằm gọn trong một màn hình,
    // hai cột kéo giãn bằng nhau (mặc định của grid là stretch).
    // Mobile: xếp chồng như cũ.
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-6">
      <Card className="gap-4 py-5 lg:h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="h-4 w-4" /> Nhập thông tin
          </CardTitle>
          <CardDescription>
            Bấm *#06# trên máy để lấy IMEI. Miễn phí 1 lần / 24 giờ — kết quả
            được lưu 24 giờ, xem lại không tốn lượt.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cột trái hẹp nên các ô nhập xếp dọc, không chia đôi. */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="imei">IMEI (15 số)</Label>
                <span
                  className={`text-xs tabular-nums ${
                    imeiDigits.length === 15
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {imeiDigits.length}/15
                </span>
              </div>
              {/* Luôn cho sửa, kể cả khi đã hết lượt: người dùng cần nhập lại
                  IMEI cũ để lấy kết quả đã lưu. */}
              <Input
                id="imei"
                inputMode="numeric"
                autoComplete="off"
                placeholder="356789012345678"
                value={imei}
                maxLength={19}
                className="font-mono tracking-wider"
                onChange={(e) => setImei(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) submit();
                }}
              />
            </div>

            {/* Dịch vụ cố định — chỉ hiển thị, không cho chọn. */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Dịch vụ</span>
              <span className="font-medium text-foreground">
                {SERVICE_LABEL}
              </span>
              <span className="w-full text-xs text-muted-foreground">
                ⏱ Kết quả sau {SERVICE_TIME}
              </span>
            </div>
          </div>

          {formError && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {cached ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
              <Save className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                IMEI này đã kiểm tra lúc {formatClock(cached.savedAt)}. Kết quả
                lưu sẵn bên dưới, xem lại không tốn lượt.
              </span>
            </div>
          ) : quotaUsed ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Bạn đã dùng lượt kiểm tra miễn phí.{" "}
                {remainingMs > 0
                  ? `Có thể kiểm tra IMEI khác sau ${formatRemaining(remainingMs)}.`
                  : restoring
                    ? "Đang cập nhật hạn mức…"
                    : "Tải lại trang để kiểm tra tiếp."}
              </span>
            </div>
          ) : (
            <Button
              className="w-full sm:w-auto"
              disabled={!canSubmit}
              onClick={() => submit()}
            >
              {submitting ? (
                <>
                  <Spinner /> Đang đặt lệnh…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" /> Kiểm tra IMEI
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Cột phải: ưu tiên kết quả đã lưu khớp IMEI đang nhập. */}
      <div className="min-w-0 lg:h-full">
        {cached ? (
          <ResultCard
            imei={cached.imei}
            referenceId={cached.referenceId}
            result={cached.result}
            savedAt={cached.savedAt}
            done
          />
        ) : snapshot.state === "pending" ? (
          <PendingCard
            snapshot={snapshot}
            elapsedMs={pendingSince ? now - pendingSince : 0}
            stale={!!warnSince && now - warnSince > STALE_AFTER_MS}
          />
        ) : snapshot.state === "done" || snapshot.state === "rejected" ? (
          <ResultCard
            imei={snapshot.imei}
            referenceId={snapshot.referenceId}
            result={snapshot.result ?? []}
            error={snapshot.error}
            done={snapshot.state === "done"}
          />
        ) : (
          // Chỗ đứng của kết quả trên desktop, giữ bố cục 2 cột không bị lệch.
          // Mobile ẩn đi cho gọn.
          <div className="hidden min-h-56 items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground lg:flex lg:h-full">
            Kết quả tra cứu sẽ hiện ở đây
          </div>
        )}
      </div>
    </div>
  );
}

function PendingCard({
  snapshot,
  elapsedMs,
  stale,
}: {
  snapshot: Snapshot;
  elapsedMs: number;
  stale: boolean;
}) {
  const minutes = Math.floor(elapsedMs / 60000);
  const elapsed =
    minutes >= 1 ? `${minutes} phút` : `${Math.floor(elapsedMs / 1000)} giây`;

  // Máy chủ tra cứu hỏng kéo dài: nói thẳng, đừng để người dùng nhìn vòng quay.
  if (stale) {
    return (
      <Card className="gap-4 py-5 lg:h-full">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-destructive" /> Chưa lấy được
            kết quả
            {snapshot.referenceId && (
              <span className="text-xs font-normal text-muted-foreground">
                Mã tham chiếu #{snapshot.referenceId}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Lệnh kiểm tra IMEI {snapshot.imei} đã được ghi nhận, nhưng máy chủ
            tra cứu đang không trả kết quả về.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Trang vẫn tự thử lại ngầm — cứ để mở hoặc quay lại sau, kết quả sẽ
            hiện ngay khi lấy được. Nếu cần gấp, gửi mã tham chiếu{" "}
            <span className="font-medium text-foreground">
              #{snapshot.referenceId}
            </span>{" "}
            cho bên hỗ trợ.
          </p>
          {snapshot.warning && (
            <p className="rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
              {snapshot.warning}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 py-5 lg:h-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
          <Spinner /> Đang xử lý
          {snapshot.referenceId && (
            <span className="text-xs font-normal text-muted-foreground">
              Mã tham chiếu #{snapshot.referenceId}
            </span>
          )}
          {elapsedMs > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              · đã chờ {elapsed}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Máy chủ đang tra cứu IMEI {snapshot.imei}. Trang sẽ tự hiện kết quả
          ngay khi xong — bạn có thể đóng tab và quay lại sau, kết quả vẫn còn.
        </CardDescription>
      </CardHeader>
      {snapshot.warning && (
        <CardContent>
          <p className="rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            {snapshot.warning}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

function ResultCard({
  imei,
  referenceId,
  result,
  error,
  savedAt,
  done,
}: {
  imei?: string;
  referenceId?: string;
  result: ResultLine[];
  error?: string;
  savedAt?: number;
  done: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        result
          .map((l) => (l.label ? `${l.label}: ${l.value}` : l.value))
          .join("\n"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt chặn clipboard: bỏ qua.
    }
  }

  return (
    <Card className="gap-4 py-5 lg:h-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
          Kết quả
          {done ? (
            <Badge>Thành công</Badge>
          ) : (
            <Badge variant="destructive">Bị từ chối</Badge>
          )}
        </CardTitle>
        {(imei || referenceId) && (
          <CardDescription className="flex flex-wrap gap-x-3 gap-y-0.5">
            {imei && <span className="font-mono">IMEI {imei}</span>}
            {referenceId && <span>Mã tham chiếu #{referenceId}</span>}
            {savedAt && <span>Đã lưu lúc {formatClock(savedAt)}</span>}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result.length > 0 && (
          <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {result.map((line, i) =>
              line.label ? (
                // Nhãn trái, giá trị phải: hai đầu bám mép nên hàng nào cũng
                // cân, không còn khoảng trống lớn ở giữa như bố cục cột cố định.
                <div
                  key={i}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 px-4 py-2.5 text-sm even:bg-secondary/30"
                >
                  <dt className="shrink-0 text-muted-foreground">
                    {line.label}
                  </dt>
                  <dd
                    className={`min-w-0 text-right font-medium break-all text-foreground ${
                      /^[\d\s-]+$/.test(line.value) ? "font-mono" : ""
                    }`}
                  >
                    {line.value}
                  </dd>
                </div>
              ) : (
                <div
                  key={i}
                  className="px-4 py-2.5 text-sm text-foreground even:bg-secondary/30"
                >
                  <dd>{line.value}</dd>
                </div>
              ),
            )}
          </dl>
        )}

        {result.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={copy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Đã sao chép
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Sao chép kết quả
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
