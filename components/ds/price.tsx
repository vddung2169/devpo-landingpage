import * as React from "react";

import { cn } from "@/lib/utils";
import { priceToNumber } from "@/data/products";

interface PriceProps extends React.ComponentProps<"div"> {
  /** Giá bán hiển thị, VD "Từ 25.590.000đ" */
  value: string;
  /** Giá gốc gạch ngang, VD "28.500.000đ" (tùy chọn) */
  original?: string;
  /** "sm" cho card trong lưới, "md" mặc định, "lg" cho trang chi tiết */
  size?: "sm" | "md" | "lg";
  /** Hiện thêm nhãn "-12%" khi có giá gốc */
  showDiscount?: boolean;
}

const sizeClass = {
  sm: { now: "text-base", was: "text-caption" },
  md: { now: "text-h3", was: "text-caption" },
  lg: { now: "text-h2", was: "text-body" },
} as const;

/**
 * Price — cụm giá bán dùng chung.
 *
 * Đỏ (`text-price`) là màu duy nhất được phép dùng cho số tiền trong toàn site.
 * Trước đây mỗi nơi tự viết `text-red-500`, `text-red-600`, `text-2xl font-bold
 * text-red-500`… nên cỡ chữ và sắc đỏ lệch nhau giữa các trang.
 */
function Price({
  value,
  original,
  size = "md",
  showDiscount = true,
  className,
  ...props
}: PriceProps) {
  const cls = sizeClass[size];

  // Chỉ tính % khi cả hai giá đều đọc được thành số và giá gốc thực sự cao hơn.
  const now = priceToNumber(value);
  const was = original ? priceToNumber(original) : 0;
  const discount =
    showDiscount && was > 0 && now > 0 && was > now
      ? Math.round(((was - now) / was) * 100)
      : 0;

  return (
    <div
      data-slot="price"
      className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}
      {...props}
    >
      <span className={cn("font-bold tracking-tight text-price", cls.now)}>
        {value}
      </span>

      {original && (
        <span className={cn("text-price-strike line-through", cls.was)}>
          {original}
        </span>
      )}

      {discount > 0 && (
        <span className="rounded-full bg-sale-soft px-1.5 py-0.5 text-caption font-semibold text-sale-ink">
          −{discount}%
        </span>
      )}
    </div>
  );
}

export { Price };
