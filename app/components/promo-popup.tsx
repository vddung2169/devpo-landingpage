"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export interface PromoProduct {
  slug: string;
  name: string;
  image: string;
  priceFrom: string;
  badge?: string;
  /** Chuỗi "Rẻ hơn ..." đã định dạng sẵn, hoặc rỗng */
  savingText?: string;
}

/** Đã tắt trong phiên này thì không hiện lại khi khách chuyển trang. */
const STORAGE_KEY = "devpo-promo-closed";
/** Màn hình từ mức này trở lên đã có banner hai bên nên không cần cửa sổ. */
const DESKTOP_QUERY = "(min-width: 1440px)";
/** Cho khách đọc nội dung một chút rồi mới hiện. */
const DELAY_MS = 4000;

function wasClosed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberClosed() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Trình duyệt chặn lưu trữ: bỏ qua, chỉ là cửa sổ có thể hiện lại ở trang sau
  }
}

/**
 * Cửa sổ quảng cáo cho điện thoại, tablet, laptop nhỏ (thay cho banner hai bên).
 * Hiện một lần mỗi phiên, sau vài giây; tắt bằng nút X, phím Esc hoặc bấm ra ngoài.
 */
export function PromoPopup({ products }: { products: PromoProduct[] }) {
  const [open, setOpen] = useState(false);
  const [product, ...others] = products;

  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches || wasClosed()) return;
    const timer = window.setTimeout(() => {
      // Khách vừa xoay ngang / phóng to cửa sổ thành màn rộng thì thôi
      if (!window.matchMedia(DESKTOP_QUERY).matches) setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) rememberClosed();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[min(22rem,calc(100%-2rem))] max-w-none block overflow-y-auto overflow-x-hidden rounded-media border-0 bg-foreground p-0 text-background shadow-e3 sm:max-w-none"
      >
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          aria-label="Tắt quảng cáo"
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-e3 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
        >
          <X className="size-5" />
        </button>

        <div className="px-5 pt-5 pr-16">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-background/60">
            {product.badge ?? "Đang có sẵn"}
          </p>
          <DialogTitle className="mt-1 text-xl font-semibold leading-snug tracking-tight text-background">
            {product.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Máy đang bán tại Dev Pồ, giá {product.priceFrom}
          </DialogDescription>
        </div>

        <Link
          href={`/products/${product.slug}`}
          onClick={() => handleOpenChange(false)}
          className="relative mx-auto mt-3 block aspect-square w-[62%] overflow-hidden rounded-2xl"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image src={product.image} alt="" fill sizes="240px" className="object-contain" />
        </Link>

        <div className="px-5 pb-5">
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[clamp(1.25rem,0.9rem+1.6vw,1.5rem)] font-semibold tracking-tight">{product.priceFrom}</p>
              {product.savingText && (
                <p className="mt-0.5 text-[0.8125rem] font-semibold text-background/70">{product.savingText}</p>
              )}
            </div>
            <Link
              href={`/products/${product.slug}`}
              onClick={() => handleOpenChange(false)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
            >
              Xem máy <ArrowRight className="size-4" />
            </Link>
          </div>

          {others.length > 0 && (
            <ul className="mt-4 space-y-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={() => handleOpenChange(false)}
                    className="flex items-center gap-3 rounded-2xl bg-background/10 p-2 transition-colors hover:bg-background/15"
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-background">
                      <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-0.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block font-mono text-[0.8125rem] font-semibold text-background/75">
                        {p.priceFrom}
                      </span>
                    </span>
                    <ArrowRight className="mr-1 size-4 shrink-0 text-background/60" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[0.8125rem] font-semibold">
            <Link
              href="/featured-products"
              onClick={() => handleOpenChange(false)}
              className="rounded-full border border-background/25 py-2.5 transition-colors hover:border-background/60"
            >
              Tất cả iPhone
            </Link>
            <Link
              href="/ipad"
              onClick={() => handleOpenChange(false)}
              className="rounded-full border border-background/25 py-2.5 transition-colors hover:border-background/60"
            >
              iPad
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
