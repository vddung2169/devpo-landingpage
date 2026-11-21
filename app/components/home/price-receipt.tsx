"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

import { cn, formatVND } from "@/lib/utils";
import { useCountTo } from "./use-count-to";
import styles from "./home.module.css";

export interface ReceiptModel {
  slug: string;
  label: string;
  image: string;
  lockPrice: number;
  internationalPrice: number;
  spec: string;
}

const vnd = (n: number) => formatVND(n).replace(/,/g, ".");

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Phiếu so giá: chọn đời máy → giá Quốc tế bị gạch, giá Lock chạy xuống,
 * số tiền giữ lại "đóng dấu". Đây là chuyển động duy nhất được dàn dựng trên trang.
 */
export function PriceReceipt({ models }: { models: ReceiptModel[] }) {
  const [index, setIndex] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const model = models[index];
  const lockShown = useCountTo(model.internationalPrice, model.lockPrice, {
    duration: 1000,
    delay: 750,
    runKey,
    enabled: !reduceMotion,
  });

  const select = (next: number) => {
    setIndex(next);
    setRunKey((k) => k + 1);
    chipRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    select((index + step + models.length) % models.length);
  };

  return (
    <div className={cn("relative rounded-media bg-background px-5 pt-5 shadow-e3", styles.receipt)}>
      <h2 className="font-mono text-caption font-medium tracking-normal text-muted-foreground">Phiếu so giá · Lock hay Quốc tế?</h2>
      <div role="radiogroup" aria-label="Chọn đời máy để so giá" onKeyDown={onKeyDown} className="mt-3 flex flex-wrap gap-1.5">
        {models.map((m, i) => (
          <button
            key={m.slug}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => select(i)}
            className="min-h-9 rounded-full border border-border px-3.5 text-caption font-medium transition-colors hover:border-border-strong aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground"
          >
            {m.label}
          </button>
        ))}
      </div>

      <div key={runKey} className={cn("mt-5 grid grid-cols-[7.5rem_1fr] items-center gap-4 sm:grid-cols-[10rem_1fr]", !reduceMotion && styles.playing)}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
          <Image src={model.image} alt={`iPhone ${model.label} Lock`} fill sizes="160px" priority className={cn("object-cover", styles.blend, styles.phone)} />
        </div>
        <dl aria-live="polite">
          <div className="py-2.5">
            <dt className="text-caption text-muted-foreground">
              iPhone Quốc tế tại Dev Pồ
            </dt>
            <dd className="relative inline-block font-mono text-[clamp(1.1rem,0.95rem+0.7vw,1.5rem)] font-semibold tracking-tight text-price-strike">
              {vnd(model.internationalPrice)}
              <span className={styles.strike} aria-hidden="true" />
            </dd>
          </div>
          <div className="border-t border-border py-2.5">
            <dt className="text-caption font-semibold text-foreground">iPhone Lock tại Dev Pồ</dt>
            <dd className="font-mono text-[clamp(1.1rem,0.95rem+0.7vw,1.5rem)] font-semibold tracking-tight text-price">
              <span className="sr-only">{vnd(model.lockPrice)}</span>
              <span aria-hidden="true">{vnd(lockShown)}</span>
            </dd>
          </div>
          <div className="mt-1 border-t-2 border-dashed border-border-strong pt-3">
            <dt className="text-caption font-semibold text-foreground">Bạn giữ lại</dt>
            <dd className={cn("mt-1 inline-block rounded-lg bg-sale-soft px-2.5 py-0.5 font-mono text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-semibold tracking-tight text-sale-ink", styles.stamp)}>
              {vnd(model.internationalPrice - model.lockPrice)}
            </dd>
          </div>
        </dl>
      </div>
      <p className="-mx-5 mt-4 border-t border-border px-5 pb-4 pt-3 font-mono text-[0.75rem] text-muted-foreground">{model.spec}</p>
    </div>
  );
}
