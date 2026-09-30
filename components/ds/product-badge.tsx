import * as React from "react";

import { Badge } from "@/components/ui/badge";
import type { Product, ProductBadge as ProductBadgeLabel } from "@/data/products";

/** Nhãn dữ liệu (data/products.ts) → tông màu ngữ nghĩa trong design system. */
const LABEL_TONE: Record<ProductBadgeLabel, "sale" | "info" | "success" | "warning"> = {
  "Hot Nhất": "warning",
  "Bán Chạy": "info",
  "Mới Về": "success",
};

type Tint = "solid" | "soft";
type Size = "sm" | "default";

interface ProductBadgeProps {
  label: ProductBadgeLabel;
  /** "solid" khi badge đè lên ảnh, "soft" khi nằm trong vùng chữ */
  tint?: Tint;
  /** "sm" (mặc định) cho nhãn đè lên ảnh — nhỏ để không che mất máy */
  size?: Size;
  className?: string;
}

/** Nhãn nổi bật của sản phẩm — màu đi theo ý nghĩa, không còn đỏ hết như trước. */
function ProductBadge({
  label,
  tint = "solid",
  size = "sm",
  className,
}: ProductBadgeProps) {
  return (
    <Badge
      variant={LABEL_TONE[label]}
      tint={tint}
      size={size}
      className={className}
    >
      {label}
    </Badge>
  );
}

/** Nhãn "Giảm giá" — chỉ hiện khi sản phẩm có giá gốc cao hơn giá bán. */
function SaleBadge({
  tint = "solid",
  size = "sm",
}: { tint?: Tint; size?: Size }) {
  return (
    <Badge variant="sale" tint={tint} size={size}>
      Giảm giá
    </Badge>
  );
}

/** Nhãn "Trả góp 0%" — áp dụng cho mọi máy, dùng ở card và trang chi tiết. */
function InstallmentBadge({
  tint = "soft",
  size = "sm",
}: { tint?: Tint; size?: Size }) {
  return (
    <Badge variant="success" tint={tint} size={size}>
      Trả góp 0%
    </Badge>
  );
}

/** Nhãn "Mới" cho bài viết / sản phẩm vừa cập nhật. */
function NewBadge({ tint = "soft", size = "sm" }: { tint?: Tint; size?: Size }) {
  return (
    <Badge variant="info" tint={tint} size={size}>
      Mới
    </Badge>
  );
}

/** Có giảm giá thật hay không (giá gốc phải cao hơn giá bán). */
function hasDiscount(product: Product): boolean {
  if (!product.priceOriginal) return false;
  const now = Number(product.priceFrom.replace(/\D/g, ""));
  const was = Number(product.priceOriginal.replace(/\D/g, ""));
  return was > now && now > 0;
}

export { ProductBadge, SaleBadge, InstallmentBadge, NewBadge, hasDiscount };
