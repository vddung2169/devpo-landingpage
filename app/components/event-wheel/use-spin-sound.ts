"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WHEEL_SOUND_KEY, safeGet, safeSet } from "@/lib/event-wheel";

/**
 * Âm thanh vòng quay — sinh bằng Web Audio, KHÔNG tải file mp3 nào.
 * Lý do: thêm asset âm thanh là thêm request + dung lượng cho mọi khách, kể cả
 * người không bật tiếng. Tiếng "tạch" và tiếng chuông đều tổng hợp tại chỗ.
 *
 * MẶC ĐỊNH TẮT. Trình duyệt cũng chặn tự phát tiếng khi chưa có tương tác —
 * AudioContext chỉ được tạo sau khi khách tự bấm bật loa.
 */
export function useSpinSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timersRef = useRef<number[]>([]);

  // Đọc lựa chọn đã lưu (nếu khách từng bật ở lần trước).
  useEffect(() => {
    setEnabled(safeGet(WHEEL_SOUND_KEY) === "1");
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      safeSet(WHEEL_SOUND_KEY, next ? "1" : "0");
      if (next && !ctxRef.current) {
        try {
          ctxRef.current = new AudioContext();
        } catch {
          /* trình duyệt không hỗ trợ — bỏ qua, vòng quay vẫn chạy */
        }
      }
      return next;
    });
  }, []);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /** Một tiếng "tạch" ngắn khi kim vượt qua mép ô. */
  const tick = useCallback((ctx: AudioContext, at: number, gain: number) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1250, at);
    amp.gain.setValueAtTime(0, at);
    amp.gain.linearRampToValueAtTime(gain, at + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.055);
    osc.connect(amp).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + 0.06);
  }, []);

  /**
   * Chạy chuỗi tiếng tạch thưa dần theo đúng kiểu giảm tốc của vòng quay.
   * Khoảng cách giữa các tiếng suy ra từ nghịch đảo đường cong ease-out:
   * kim đi qua các mép ô cách đều nhau, nên tiếng thưa dần khi vòng chậm lại.
   */
  const playSpin = useCallback(
    (durationMs: number) => {
      const ctx = ctxRef.current;
      if (!enabled || !ctx) return;
      void ctx.resume();

      clearTimers();
      const TICKS = 46;
      for (let i = 1; i <= TICKS; i++) {
        const p = i / TICKS; // phần rotation đã đi được
        const t = 1 - Math.pow(1 - p, 1 / 3); // nghịch đảo ease-out cubic
        const at = ctx.currentTime + (t * durationMs) / 1000;
        tick(ctx, at, 0.05 + 0.05 * (1 - p));
      }
    },
    [enabled, clearTimers, tick],
  );

  /** Tiếng chuông ngắn khi trúng thưởng — hai nốt, không chói. */
  const playWin = useCallback(() => {
    const ctx = ctxRef.current;
    if (!enabled || !ctx) return;
    void ctx.resume();

    [0, 0.14].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      const at = ctx.currentTime + offset;
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 659 : 988, at); // E5 -> B5
      amp.gain.setValueAtTime(0, at);
      amp.gain.linearRampToValueAtTime(0.16, at + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
      osc.connect(amp).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.6);
    });
  }, [enabled]);

  const stop = useCallback(() => clearTimers(), [clearTimers]);

  return { enabled, toggle, playSpin, playWin, stop };
}
