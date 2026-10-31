"use client";

import { useEffect, useRef } from "react";

/**
 * Confetti bằng canvas thuần — không thêm thư viện (giữ bundle nhỏ, không ảnh
 * hưởng Core Web Vitals của các trang khác vì component này chỉ nạp khi trúng thưởng).
 *
 * Tông màu theo nhận diện: xanh dương + trắng + vàng nhạt. Không dùng đỏ
 * (đỏ dành riêng cho giá bán).
 */

const COLORS = ["#2f6fd0", "#7fb0e8", "#ffffff", "#f5c66b", "#12356b"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
}

export function Confetti({ fire }: { fire: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Tôn trọng thiết lập giảm chuyển động của hệ điều hành.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const count = rect.width < 420 ? 70 : 110;
    const pieces: Piece[] = Array.from({ length: count }, () => ({
      x: rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.5,
      y: rect.height * 0.35 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * -8 - 3,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: 5 + Math.random() * 5,
      h: 8 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf = 0;
    const started = performance.now();
    const LIFE = 2600;

    const draw = (now: number) => {
      const elapsed = now - started;
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const p of pieces) {
        p.vy += 0.16; // trọng lực
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / LIFE);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (elapsed < LIFE) {
        raf = window.requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    raf = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(raf);
  }, [fire]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
}
