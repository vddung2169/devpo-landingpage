"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PartyPopper, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Winner {
  name: string;
  phone: string;
  ticket: string;
}

const CARD_H = 64; // px
const CARD_GAP = 12; // px
const STEP = CARD_H + CARD_GAP;
const TOTAL = 120; // số ô trong dải (nhiều hơn để chạy đủ 20s)
const WIN_INDEX = TOTAL - 6; // vị trí ô người trúng (chừa vài ô phía sau)

/**
 * Overlay "vòng quay may mắn": dải tên chạy dọc qua mũi tên ở giữa, chậm dần
 * trong `durationMs` rồi dừng đúng người trúng. Chỉ hiện vài tên quanh mũi tên.
 */
export function SpinWheel({
  names,
  winner,
  durationMs = 20000,
  onClose,
}: {
  names: string[];
  winner: Winner;
  durationMs?: number;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Dựng dải tên một lần. Lấp ngẫu nhiên từ danh sách tên DUY NHẤT, đảm bảo
  // các ô gần nhau không trùng tên (trong tầm nhìn); người trúng nằm ở WIN_INDEX.
  const [cards] = useState<string[]>(() => {
    const uniq = Array.from(
      new Set(names.map((n) => (n || "").trim()).filter(Boolean)),
    );
    const pool = uniq.length > 0 ? uniq : [winner.name];
    
    const arr: string[] = [];
    for (let i = 0; i < TOTAL; i++) {
      if (i === WIN_INDEX) {
        arr.push(winner.name);
        continue;
      }
      let pick = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1) {
        let guard = 0;
        // Khung nhìn thấy khoảng 5 ô (1 giữa, 2 trên, 2 dưới),
        // nên ta cần check tối đa 4 ô trước đó để không bị trùng lặp trên cùng màn hình.
        const lookback = Math.min(4, pool.length - 1);
        // Quanh khu vực người trúng (WIN_INDEX) khoảng 3 ô thì cấm luôn tên người trúng xuất hiện "nhá hàng"
        const avoidWinner = Math.abs(i - WIN_INDEX) <= 3;
        
        while (
          guard < 50 &&
          (arr.slice(Math.max(0, i - lookback)).includes(pick) ||
            (avoidWinner && pick === winner.name))
        ) {
          pick = pool[Math.floor(Math.random() * pool.length)];
          guard++;
        }
      }
      arr.push(pick);
    }
    return arr;
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const strip = stripRef.current;
    if (!container || !strip) return;

    const ch = container.offsetHeight;
    // Căn tâm ô WIN_INDEX vào giữa (nơi có mũi tên)
    const endY = -(WIN_INDEX * STEP + CARD_H / 2 - ch / 2);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Vị trí đầu
    strip.style.transition = "none";
    strip.style.transform = "translateY(0px)";
    void strip.offsetHeight; // ép reflow để transition áp dụng

    if (reduced) {
      strip.style.transform = `translateY(${endY}px)`;
      const t = window.setTimeout(() => setRevealed(true), 300);
      return () => window.clearTimeout(t);
    }

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Đường cong chuyển động: quay nhanh ở đầu, chậm dần đều và dừng nhẹ nhàng
        strip.style.transition = `transform ${durationMs}ms cubic-bezier(0.15, 0.85, 0.25, 1)`;
        strip.style.transform = `translateY(${endY}px)`;
      });
    });
    const t = window.setTimeout(() => setRevealed(true), durationMs);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Quay thưởng"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {revealed ? "Kết quả" : "Đang quay thưởng…"}
          </div>
          <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            {revealed ? "🎉 Chúc mừng người trúng!" : "Ai sẽ là người may mắn?"}
          </h2>
        </div>

        {/* Vòng quay: mũi tên + dải tên */}
        <div className="relative mx-auto mt-8 w-64 sm:w-72">
          {/* Mũi tên bên trái */}
          <div className="pointer-events-none absolute -left-5 top-1/2 z-20 -translate-y-1/2">
            <div
              className="h-0 w-0 border-y-[10px] border-l-[14px] border-y-transparent border-l-primary drop-shadow"
              aria-hidden
            />
          </div>
          
          {/* Mũi tên bên phải */}
          <div className="pointer-events-none absolute -right-5 top-1/2 z-20 -translate-y-1/2">
            <div
              className="h-0 w-0 border-y-[10px] border-r-[14px] border-y-transparent border-r-primary drop-shadow"
              aria-hidden
            />
          </div>

          {/* Khung dừng ở giữa */}
          <div
            className={`pointer-events-none absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2 rounded-xl border-2 transition-colors duration-500 ${
              revealed
                ? "border-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
                : "border-primary/50 bg-primary/5"
            }`}
            style={{ height: CARD_H + 8 }}
            aria-hidden
          />

          {/* Mờ trên và dưới */}
          <div
            className="relative h-72 overflow-hidden rounded-xl border border-border bg-secondary/30"
            ref={containerRef}
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)",
            }}
          >
            <div
              ref={stripRef}
              className="flex flex-col will-change-transform"
              style={{ gap: CARD_GAP }}
            >
              {cards.map((name, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center justify-center px-4 text-center"
                  style={{ height: CARD_H }}
                >
                  <span
                    className={`line-clamp-2 text-base font-bold transition-all duration-300 ${
                      revealed && i === WIN_INDEX
                        ? "text-primary scale-110"
                        : "text-foreground"
                    }`}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kết quả sau khi dừng */}
        {revealed ? (
          <div className="mt-8 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
              <PartyPopper className="h-6 w-6 text-amber-500" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {winner.name}
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Ticket className="h-4 w-4" />
                <span className="font-mono">{winner.ticket}</span>
                <span>· {winner.phone}</span>
              </div>
            </div>
            <Button onClick={onClose} size="lg" className="mt-4 h-11 w-full font-semibold">
              <X className="mr-2 h-5 w-5" />
              Đóng &amp; công bố
            </Button>
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Vui lòng đợi khoảng {Math.round(durationMs / 1000)} giây…
          </p>
        )}
      </div>
    </div>
  );
}
