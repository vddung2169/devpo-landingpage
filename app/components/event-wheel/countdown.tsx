"use client";

import { useEffect, useState } from "react";

/**
 * Đồng hồ đếm ngược tới mốc `target`.
 *
 * Lệch giờ máy khách được bù bằng `skewMs`: hiệu số giữa giờ server (serverTime
 * trong phản hồi API) và giờ máy khách. Nhờ vậy khách đổi giờ hệ thống cũng
 * không làm đồng hồ sai — và dù sao thì quyền mở/đóng vẫn do server quyết.
 */
export function useCountdown(target: string | null, skewMs: number) {
  const [left, setLeft] = useState<number>(() =>
    target ? Date.parse(target) - (Date.now() + skewMs) : 0,
  );

  useEffect(() => {
    if (!target) return;
    const end = Date.parse(target);
    if (Number.isNaN(end)) return;

    const tick = () => setLeft(end - (Date.now() + skewMs));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target, skewMs]);

  const clamped = Math.max(0, left);
  return {
    ms: clamped,
    done: clamped <= 0,
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Dãy ô số đếm ngược. Dùng chữ số tabular để không bị nhảy ngang mỗi giây. */
export function Countdown({
  target,
  skewMs,
  label,
}: {
  target: string | null;
  skewMs: number;
  label: string;
}) {
  const t = useCountdown(target, skewMs);
  if (!target) return null;

  const cells: Array<[string, string]> = [
    ...(t.days > 0 ? ([[pad(t.days), "ngày"]] as Array<[string, string]>) : []),
    [pad(t.hours), "giờ"],
    [pad(t.minutes), "phút"],
    [pad(t.seconds), "giây"],
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
        {label}
      </span>
      <div className="flex items-center gap-1.5" role="timer" aria-live="off">
        {cells.map(([value, unit], i) => (
          <div key={unit} className="flex items-center gap-1.5">
            {i > 0 && <span className="pb-3 text-white/30">:</span>}
            <div className="flex min-w-[46px] flex-col items-center rounded-xl bg-white/10 px-2 py-1.5 ring-1 ring-inset ring-white/15">
              <span className="font-mono text-lg font-semibold tabular-nums text-white sm:text-xl">
                {value}
              </span>
              <span className="text-[10px] text-white/50">{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
