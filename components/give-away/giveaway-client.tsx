"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  Clock,
  Gift,
  Loader2,
  PartyPopper,
  Search,
  ShieldCheck,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/app/components/reveal";
import { cn } from "@/lib/utils";
import { ZALO_LINK } from "@/data/products";
import { Countdown, useServerCountdown } from "./countdown";
import { RegisterForm } from "./register-form";
import { HistoryList } from "./history-list";
import {
  GIVEAWAY_PHONE_KEY,
  isValidPhone,
  normalizePhone,
  type GiveawayResponse,
  type MyTicket,
} from "@/lib/giveaway";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61576332353912";

// Cộng thêm vào SỐ HIỂN THỊ người tham gia của đợt đang diễn ra (hiệu ứng đám
// đông). Chỉ ảnh hưởng phần nhìn — KHÔNG đổi dữ liệu thật hay danh sách quay thưởng.
const ENTRIES_DISPLAY_BOOST = 200;

function displayEntries(n: number): string {
  return (n + ENTRIES_DISPLAY_BOOST).toLocaleString("vi-VN");
}

function formatDateTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

/** Giờ + ngày/tháng/năm theo giờ VN, vd "21:00 ngày 13/7/2026". */
function formatDrawWhen(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const opts = { timeZone: "Asia/Ho_Chi_Minh" } as const;
  const time = d.toLocaleTimeString("vi-VN", {
    ...opts,
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = d.toLocaleDateString("vi-VN", {
    ...opts,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  return `${time} ngày ${date}`;
}

export function GiveawayClient() {
  const [data, setData] = useState<GiveawayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0); // serverTime − localTime (ms)
  const [myTicket, setMyTicket] = useState<MyTicket | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const mockRef = useRef<string | null>(null);
  const phoneRef = useRef<string | null>(null);

  const load = useCallback(
    async (opts?: { silent?: boolean; phone?: string | null }) => {
      if (!opts?.silent) setLoading(true);
      try {
        const params = new URLSearchParams();
        const phone = opts?.phone ?? phoneRef.current;
        if (phone) params.set("phone", phone);
        if (mockRef.current) params.set("mock", mockRef.current);

        const res = await fetch(`/api/give-away?${params.toString()}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as GiveawayResponse;

        if (!res.ok || json.ok === false) {
          if (!opts?.silent) {
            setError(json.error ?? "Không tải được dữ liệu giveaway.");
          }
          return;
        }

        setError(null);
        setData(json);
        setOffset(new Date(json.serverTime).getTime() - Date.now());
        if (json.myTicket) setMyTicket(json.myTicket);
      } catch {
        if (!opts?.silent) {
          setError("Không tải được dữ liệu giveaway. Vui lòng thử lại.");
        }
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [],
  );

  // Lần đầu: đọc ?mock=, SĐT đã lưu, và hỏi quyền admin
  useEffect(() => {
    mockRef.current = new URLSearchParams(window.location.search).get("mock");
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(GIVEAWAY_PHONE_KEY)
        : null;
    phoneRef.current = stored;
    load({ phone: stored });

    fetch("/api/give-away/draw")
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.admin))
      .catch(() => {});
  }, [load]);

  // Trạng thái closed: tự poll mỗi 30s để bắt thời điểm có kết quả
  const status = data?.active?.status;
  useEffect(() => {
    if (status !== "closed") return;
    const id = window.setInterval(() => load({ silent: true }), 30_000);
    return () => window.clearInterval(id);
  }, [status, load]);

  const refetch = useCallback(() => load({ silent: true }), [load]);

  const showHistory = !!(data?.history && data.history.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero thương hiệu — tĩnh, hiện ngay để không nhảy layout */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>
        <div className="container relative mx-auto px-4 pb-5 pt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
              <Gift className="h-5 w-5" />
              Giveaway
            </h1>
            
          </div>
        </div>
      </section>

      {/* Thân trang */}
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "mx-auto max-w-6xl gap-6 py-6",
            showHistory && "grid lg:grid-cols-3",
          )}
        >
          {/* Nội dung chính — full-width căn giữa khi không có lịch sử */}
          <div className={showHistory ? "lg:col-span-2" : "mx-auto w-full max-w-2xl"}>
            {loading ? (
              <MainSkeleton />
            ) : error && !data ? (
              <ErrorState message={error} onRetry={() => load()} />
            ) : (
              <Reveal>
                <MainContent
                  data={data}
                  offset={offset}
                  myTicket={myTicket}
                  isAdmin={isAdmin}
                  onRegistered={(t) => {
                    setMyTicket(t);
                    phoneRef.current = t.phone;
                    try {
                      window.localStorage.setItem(GIVEAWAY_PHONE_KEY, t.phone);
                    } catch {
                      /* localStorage có thể bị chặn — bỏ qua */
                    }
                    refetch();
                  }}
                  onLookup={(phone) => {
                    phoneRef.current = phone;
                    load({ phone });
                  }}
                  onCountdownDone={refetch}
                  onDrawn={refetch}
                />
              </Reveal>
            )}
          </div>

          {/* Cột lịch sử — desktop bên phải, mobile xuống dưới */}
          {showHistory && (
            <div className="lg:col-span-1">
              <Reveal delay={80}>
                <HistoryList history={data.history} />
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Nội dung chính theo trạng thái                                              */
/* -------------------------------------------------------------------------- */

function MainContent({
  data,
  offset,
  myTicket,
  isAdmin,
  onRegistered,
  onLookup,
  onCountdownDone,
  onDrawn,
}: {
  data: GiveawayResponse | null;
  offset: number;
  myTicket: MyTicket | null;
  isAdmin: boolean;
  onRegistered: (t: MyTicket) => void;
  onLookup: (phone: string) => void;
  onCountdownDone: () => void;
  onDrawn: () => void;
}) {
  const active = data?.active ?? null;

  if (!active) return <EmptyState />;

  if (active.status === "upcoming") {
    return (
      <UpcomingState
        data={data!}
        offset={offset}
        onCountdownDone={onCountdownDone}
      />
    );
  }

  if (active.status === "open") {
    return (
      <OpenState
        data={data!}
        offset={offset}
        myTicket={myTicket}
        isAdmin={isAdmin}
        onRegistered={onRegistered}
        onCountdownDone={onCountdownDone}
        onDrawn={onDrawn}
      />
    );
  }

  if (active.status === "closed") {
    return (
      <ClosedState
        data={data!}
        offset={offset}
        myTicket={myTicket}
        isAdmin={isAdmin}
        onLookup={onLookup}
        onCountdownDone={onCountdownDone}
        onDrawn={onDrawn}
      />
    );
  }

  // announced / ended có winner
  return <AnnouncedState data={data!} />;
}

/* ---------------------------- 0) UPCOMING --------------------------------- */

function UpcomingState({
  data,
  offset,
  onCountdownDone,
}: {
  data: GiveawayResponse;
  offset: number;
  onCountdownDone: () => void;
}) {
  const g = data.active!;
  const remaining = useServerCountdown(g.openAt, offset, onCountdownDone);

  return (
    <div className="flex flex-col gap-4">
      <PrizeHeader giveaway={g} badge="Sắp diễn ra" />

      <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
          <Clock className="h-5 w-5 text-foreground" />
        </div>
        <p className="text-base font-medium text-foreground">
          Đăng ký mở lúc {formatDateTime(g.openAt)}.
        </p>
        <div className="mt-5">
          <Countdown remainingMs={remaining} label="Mở đăng ký sau" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ 1) OPEN ----------------------------------- */

function OpenState({
  data,
  offset,
  myTicket,
  isAdmin,
  onRegistered,
  onCountdownDone,
  onDrawn,
}: {
  data: GiveawayResponse;
  offset: number;
  myTicket: MyTicket | null;
  isAdmin: boolean;
  onRegistered: (t: MyTicket) => void;
  onCountdownDone: () => void;
  onDrawn: () => void;
}) {
  const g = data.active!;
  const remaining = useServerCountdown(g.closeAt, offset, onCountdownDone);

  return (
    <div className="flex flex-col gap-4">
      <PrizeHeader giveaway={data.active!} badge="Đang diễn ra" />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <Countdown remainingMs={remaining} label="Còn lại để đăng ký" />
        <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            Đang có{" "}
            <strong className="text-foreground">
              {displayEntries(g.totalEntries)}
            </strong>{" "}
            người tham gia
          </span>
        </div>
      </div>

      {myTicket ? (
        <TicketCard ticket={myTicket} drawAt={g.drawAt} />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            Đăng ký nhận vé
          </h2>
          <RegisterForm onRegistered={onRegistered} onClosed={onCountdownDone} />
        </div>
      )}

      {isAdmin && (
        <AdminDraw giveawayId={g.id} onDrawn={onDrawn} />
      )}
    </div>
  );
}

/* ----------------------------- 2) CLOSED ---------------------------------- */

function ClosedState({
  data,
  offset,
  myTicket,
  isAdmin,
  onLookup,
  onCountdownDone,
  onDrawn,
}: {
  data: GiveawayResponse;
  offset: number;
  myTicket: MyTicket | null;
  isAdmin: boolean;
  onLookup: (phone: string) => void;
  onCountdownDone: () => void;
  onDrawn: () => void;
}) {
  const g = data.active!;
  const remaining = useServerCountdown(g.drawAt, offset, onCountdownDone);

  return (
    <div className="flex flex-col gap-4">
      <PrizeHeader giveaway={g} badge="Đã đóng đăng ký" />

      <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
          <Clock className="h-5 w-5 text-foreground" />
        </div>
        <p className="text-base font-medium text-foreground">
          Đã đóng đăng ký. Kết quả công bố lúc {formatDrawWhen(g.drawAt)}.
        </p>
        <div className="mt-5">
          <Countdown remainingMs={remaining} label="Còn lại tới giờ quay thưởng" />
        </div>
      </div>

      {myTicket ? (
        <TicketCard ticket={myTicket} drawAt={g.drawAt} />
      ) : (
        <LookupForm onLookup={onLookup} notFound={data.myTicket === null} />
      )}

      {isAdmin && <AdminDraw giveawayId={g.id} onDrawn={onDrawn} />}
    </div>
  );
}

/* --------------------------- 3) ANNOUNCED --------------------------------- */

function AnnouncedState({ data }: { data: GiveawayResponse }) {
  const g = data.active!;
  const w = g.winner;

  return (
    <div className="flex flex-col gap-4">
      <PrizeHeader giveaway={g} badge="Đã có kết quả" />

      <div className="rounded-2xl border border-primary/30 bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15">
          <PartyPopper className="h-7 w-7 text-amber-500" />
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Chúc mừng người trúng thưởng
        </div>
        {w ? (
          <>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {w.name}
            </div>
            <div className="mt-1 font-mono text-lg text-muted-foreground">
              {w.phone}
            </div>
          </>
        ) : (
          <div className="mt-2 text-muted-foreground">Đang cập nhật…</div>
        )}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            Tổng {displayEntries(g.totalEntries)} người tham gia đợt này
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Dev Pồ sẽ liên hệ trực tiếp với người trúng để trao thưởng. Cảm ơn mọi
        người đã tham gia!
      </p>
    </div>
  );
}

/* ----------------------------- 4) EMPTY ----------------------------------- */

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Gift className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold text-foreground">
        Hiện không có giveaway nào đang diễn ra
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Đợt tiếp theo sẽ sớm quay lại. Theo dõi Dev Pồ để không bỏ lỡ nhé!
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Button asChild size="lg" className="h-11 w-full font-semibold sm:w-auto">
          <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
            <Bell className="mr-2 h-5 w-5" />
            Theo dõi qua Zalo
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-11 w-full font-semibold sm:w-auto"
        >
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
            Theo dõi Facebook
          </a>
        </Button>
      </div>
    </div>
  );
}

/* --------------------------- Khối dùng chung ------------------------------ */

function PrizeHeader({
  giveaway,
  badge,
}: {
  giveaway: NonNullable<GiveawayResponse["active"]>;
  badge: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
      <Badge variant="secondary" className="mb-2">
        {badge}
      </Badge>
      <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {giveaway.title}
      </h2>
      <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-1.5">
        <Gift className="h-5 w-5 text-foreground" />
        <span className="text-lg font-bold text-foreground">
          {giveaway.prize}
        </span>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  drawAt,
}: {
  ticket: MyTicket;
  drawAt?: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Ticket className="h-4 w-4" />
        Vé của bạn
      </div>
      <div className="mt-3 rounded-xl bg-secondary p-4 text-center">
        <div className="font-mono text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
          {ticket.ticket}
        </div>
        {ticket.name && (
          <div className="mt-1 text-sm text-muted-foreground">{ticket.name}</div>
        )}
      </div>
      {drawAt && (
        <div className="mt-3 flex items-start justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-center text-sm">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">
            Giữ lại mã vé này nhé — quay thưởng lúc{" "}
            <strong className="text-foreground">{formatDrawWhen(drawAt)}</strong>.
          </span>
        </div>
      )}
    </div>
  );
}

function LookupForm({
  onLookup,
  notFound,
}: {
  onLookup: (phone: string) => void;
  notFound: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setErr("Số điện thoại chưa đúng — cần 10 số, bắt đầu bằng 0.");
      return;
    }
    setErr(null);
    setTouched(true);
    onLookup(normalizePhone(phone));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="mb-1 text-lg font-bold text-foreground">Tra lại mã vé</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Nhập số điện thoại đã đăng ký để xem lại mã vé của bạn.
      </p>
      <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="ga-lookup" className="sr-only">
            Số điện thoại
          </label>
          <Input
            id="ga-lookup"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901234567"
            className="h-11"
            aria-invalid={!!err}
            aria-describedby={err ? "ga-lookup-err" : undefined}
          />
        </div>
        <Button type="submit" size="lg" className="h-11 font-semibold">
          <Search className="mr-2 h-4 w-4" />
          Tra vé
        </Button>
      </form>
      {err && (
        <p id="ga-lookup-err" className="mt-2 text-sm text-destructive">
          {err}
        </p>
      )}
      {touched && !err && notFound && (
        <p className="mt-2 text-sm text-muted-foreground">
          Không tìm thấy vé cho số này. Kiểm tra lại giúp Dev Pồ nhé.
        </p>
      )}
    </div>
  );
}

function AdminDraw({
  giveawayId,
  onDrawn,
}: {
  giveawayId: string;
  onDrawn: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function draw() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/give-away/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giveawayId }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setErr(data.error ?? "Quay thưởng thất bại.");
        return;
      }
      setMsg(
        data.winner?.name
          ? `Đã quay: ${data.winner.name}`
          : "Đã quay thưởng.",
      );
      onDrawn();
    } catch {
      setErr("Không gọi được máy chủ. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldCheck className="h-4 w-4" />
        Khu vực quản trị
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Chỉ hiển thị với admin đã đăng nhập nội bộ. Mã quản trị nằm ở server.
      </p>
      <Button
        type="button"
        onClick={draw}
        disabled={busy}
        variant="outline"
        className="mt-3 font-semibold"
      >
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:hidden" />
            Đang quay…
          </>
        ) : (
          <>
            <Trophy className="mr-2 h-4 w-4" />
            Quay thưởng ngay
          </>
        )}
      </Button>
      {msg && <p className="mt-2 text-sm text-foreground">{msg}</p>}
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
    </div>
  );
}

/* ------------------------------ Skeleton ---------------------------------- */

function MainSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <Skeleton className="mx-auto h-6 w-28" />
        <Skeleton className="mx-auto mt-3 h-7 w-64" />
        <Skeleton className="mx-auto mt-3 h-10 w-40" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Skeleton className="mx-auto h-4 w-40" />
        <div className="mt-4 flex justify-center gap-3">
          <Skeleton className="h-20 w-16" />
          <Skeleton className="h-20 w-16" />
          <Skeleton className="h-20 w-16" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-11 w-full" />
        <Skeleton className="mt-3 h-11 w-full" />
        <Skeleton className="mt-3 h-11 w-full" />
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <h2 className="text-lg font-bold text-foreground">Không tải được dữ liệu</h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{message}</p>
      <Button onClick={onRetry} className="mt-5 font-semibold">
        Thử lại
      </Button>
    </div>
  );
}
