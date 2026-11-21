"use client";

import { useEffect, useState } from "react";

/**
 * Đếm số từ `from` về `to` (ease-out), làm tròn tới nghìn đồng.
 * Đổi `runKey` để chạy lại. `enabled=false` (giảm chuyển động) trả thẳng `to`.
 */
export function useCountTo(
  from: number,
  to: number,
  { duration, delay, runKey, enabled }: { duration: number; delay: number; runKey: number; enabled: boolean },
): number {
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!enabled) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round((from + (to - from) * eased) / 1000) * 1000);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [from, to, duration, delay, runKey, enabled]);

  return value;
}
