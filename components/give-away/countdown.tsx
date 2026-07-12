"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Đếm ngược tới mốc `targetIso`, dùng giờ SERVER làm gốc (không tin Date.now()
 * của máy khách). `serverOffsetMs` = serverTime − localTime tại lúc fetch.
 * Khi về 0 sẽ gọi `onDone` (thường là refetch API để lấy trạng thái mới).
 */
export function useServerCountdown(
  targetIso: string | undefined,
  serverOffsetMs: number,
  onDone?: () => void,
): number {
  const compute = () =>
    targetIso ? new Date(targetIso).getTime() - (Date.now() + serverOffsetMs) : 0;

  const [remaining, setRemaining] = useState(compute);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const firedRef = useRef(false);

  useEffect(() => {
    if (!targetIso) return;
    firedRef.current = false;

    const tick = () => {
      const r = compute();
      setRemaining(r);
      if (r <= 0 && !firedRef.current) {
        firedRef.current = true;
        onDoneRef.current?.();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso, serverOffsetMs]);

  return remaining;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Hiển thị đồng hồ đếm ngược dạng khối Ngày/Giờ/Phút/Giây. */
export function Countdown({
  remainingMs,
  label,
}: {
  remainingMs: number;
  label?: string;
}) {
  const ms = Math.max(0, remainingMs);
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const blocks = [
    ...(days > 0 ? [{ v: days, l: "Ngày" }] : []),
    { v: hours, l: "Giờ" },
    { v: minutes, l: "Phút" },
    { v: seconds, l: "Giây" },
  ];

  return (
    <div>
      {label && (
        <div className="mb-2 text-center text-sm font-medium text-muted-foreground">
          {label}
        </div>
      )}
      <div
        className="flex items-stretch justify-center gap-2 sm:gap-3"
        role="timer"
        aria-live="off"
      >
        {blocks.map((b, i) => (
          <div
            key={b.l}
            className="flex min-w-[3.5rem] flex-col items-center rounded-xl border border-border bg-card px-2 py-3 shadow-sm sm:min-w-[4.5rem] sm:px-3"
          >
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
              {i === 0 && days > 0 ? b.v : pad(b.v)}
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              {b.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
