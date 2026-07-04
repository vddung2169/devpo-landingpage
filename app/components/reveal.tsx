"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// <Reveal> — hiệu ứng fade + trượt lên khi phần tử cuộn vào khung nhìn.
// Dùng IntersectionObserver (không thêm thư viện), tôn trọng prefers-reduced-motion,
// và SSR-safe (nội dung vẫn nằm trong DOM cho SEO, chỉ ẩn về mặt hình ảnh).
//
// Cách dùng: bọc quanh section/khối bất kỳ.
//   <Reveal>...</Reveal>
//   <Reveal delay={120} y={32}>...</Reveal>   // trễ 120ms, trượt từ 32px
// =============================================================================

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Độ trễ bắt đầu animation (ms) — dùng để tạo hiệu ứng so le (stagger). */
  delay?: number;
  /** Khoảng trượt ban đầu theo trục Y (px). */
  y?: number;
  /** true: chỉ chạy 1 lần; false: chạy lại mỗi khi cuộn ra/vào. */
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Người dùng tắt hiệu ứng chuyển động, hoặc trình duyệt không hỗ trợ observer
    // -> hiện ngay, không animate.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{
        transform: shown ? "none" : `translateY(${y}px)`,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out will-change-transform motion-reduce:transition-none",
        shown ? "opacity-100" : "opacity-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
