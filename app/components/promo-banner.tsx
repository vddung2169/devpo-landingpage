"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

/**
 * Popup banner quảng cáo iPhone 16 Pro Max — theo đúng ngôn ngữ thiết kế của
 * site (monochrome, token màu theme, nền lưới kẻ mờ như hero các trang công
 * cụ), cách hoạt động tham khảo popup của Thegioididong:
 *  - Toàn bộ banner là MỘT khối bấm được (bấm đâu cũng ra trang sản phẩm).
 *  - Nút X tròn nổi ở góc trên phải, chờm ra ngoài mép banner.
 *  - Nút CTA "Mua ngay" to bản nằm ở đáy banner.
 *
 * Logic hiển thị:
 *  - Lần đầu hiện, lưu mốc thời gian vào localStorage (devpo_banner_shown_at).
 *  - Vào lại trong vòng 6 tiếng thì KHÔNG hiện; quá 6 tiếng thì hiện lại và
 *    cập nhật mốc mới.
 *  - Đóng bằng nút X, click ra overlay, hoặc phím Esc (Dialog lo sẵn).
 */

const STORAGE_KEY = "devpo_banner_shown_at";
const SHOW_EVERY_MS = 6 * 60 * 60 * 1000; // 6 tiếng
const OPEN_DELAY_MS = 1200; // chờ trang load xong mới bật cho đỡ sốc
const PRODUCT_HREF = "/products/iphone-16-pro-max-lock";

export function PromoBanner() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Khu nội bộ không phải chỗ chạy quảng cáo.
    if (pathname.startsWith("/noi-bo")) return;

    // localStorage có thể bị chặn (ẩn danh) — khi đó cứ hiện, coi như khách mới.
    let lastShownAt = 0;
    try {
      lastShownAt = Number(localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {}

    // Chưa đủ 6 tiếng kể từ lần hiện trước -> im lặng.
    if (Date.now() - lastShownAt < SHOW_EVERY_MS) return;

    const timer = setTimeout(() => {
      setOpen(true);
      // Lưu mốc NGAY khi hiện (không đợi đóng) — F5 ngay sau đó không hiện lại.
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {}
    }, OPEN_DELAY_MS);

    return () => clearTimeout(timer);
    // Chạy lại khi đổi trang là chủ đích: khách vào thẳng /noi-bo rồi mới ra
    // trang ngoài vẫn được tính; mốc 6h đảm bảo không hiện trùng.
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Tắt nút X mặc định — dùng nút X tròn tự vẽ kiểu TGDD bên dưới.
          overflow-visible để nút X được phép chờm ra ngoài mép banner. */}
      <DialogContent
        showCloseButton={false}
        className="w-[92vw] max-w-sm overflow-visible border-none bg-transparent p-0 shadow-none"
      >
        {/* Tiêu đề cho trình đọc màn hình (Radix bắt buộc phải có) */}
        <DialogTitle className="sr-only">
          Khuyến mãi iPhone 16 Pro Max — chỉ từ 18 triệu
        </DialogTitle>

        {/* Nút X tròn nổi góc trên phải, chờm ra ngoài mép như TGDD */}
        <DialogClose
          aria-label="Đóng quảng cáo"
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </DialogClose>

        {/* Toàn bộ banner là một link — bấm đâu cũng ra trang sản phẩm */}
        <Link
          href={PRODUCT_HREF}
          onClick={() => setOpen(false)}
          className="group relative block overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        >
          {/* Nền lưới kẻ mờ — cùng hoạ tiết với hero các trang công cụ */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] bg-[size:36px_36px]" />
          </div>

          <div className="relative flex flex-col items-center gap-4 px-6 pt-7 pb-6 text-center">
            <Badge
              variant="outline"
              className="border-border bg-background text-md font-bold shadow-sm"
            >
              Deal hot hôm nay
            </Badge>

            {/* Ảnh đã tách nền, cắt từ 16pm.svg */}
            <Image
              src="/promo/iphone-16-pro-max.png"
              alt="iPhone 16 Pro Max đủ 4 màu"
              width={600}
              height={519}
              priority
              className="h-auto w-56 drop-shadow-[0_16px_28px_color-mix(in_oklch,var(--foreground)_18%,transparent)] transition-transform duration-300 group-hover:scale-[1.03] sm:w-64"
            />

            <div className="space-y-1">
              <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                iPhone 16 Pro Max
              </p>
              <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Chỉ từ 18 triệu
              </p>
              <p className="text-sm text-muted-foreground">
                Máy zin đẹp, bảo hành tại Dev Pồ — số lượng có hạn.
              </p>
            </div>

            {/* CTA to bản ở đáy banner — nút primary chuẩn của site */}
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
              Mua ngay
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
