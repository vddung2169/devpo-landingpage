import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge — nhãn trạng thái dùng chung cho toàn site.
 *
 * Hai trục biến thể:
 *  - `variant` : chọn TÔNG màu theo ý nghĩa, không theo tên màu.
 *      sale     (đỏ)    → Giảm giá, Sale
 *      info     (xanh)  → Mới về, Mới
 *      success  (lục)   → Trả góp 0%, Còn hàng, Đã kiểm tra
 *      warning  (cam)   → Hot nhất, Sắp hết
 *      neutral  (xám)   → nhãn phụ, thông tin trung tính
 *  - `size`    : "sm" (11px) cho nhãn đè lên ảnh sản phẩm — cần nhỏ để không
 *                che mất máy; "default" (13px) cho nhãn nằm trong nội dung.
 *  - `tint`    : chọn ĐỘ ĐẬM nền.
 *      soft   (mặc định) → nền phớt + chữ đậm màu: dùng trong nội dung
 *      solid              → nền đặc + chữ trắng: dùng khi đè lên ảnh sản phẩm
 *      outline            → chỉ viền: dùng khi cần thật nhẹ
 *
 * Các variant cũ của shadcn (default/secondary/destructive/outline) được giữ
 * nguyên để không phá 9 chỗ đang dùng `variant="secondary"`.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border font-semibold leading-none transition-[color,box-shadow] [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        // --- Tông ngữ nghĩa (bảng màu design system) ---
        sale: "",
        info: "",
        success: "",
        warning: "",
        neutral: "",
        // --- Giữ tương thích với shadcn ---
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90",
      },
      size: {
        sm: "px-2 py-1 text-[0.6875rem] [&>svg]:size-2.5",
        default: "px-2.5 py-1 text-caption [&>svg]:size-3",
      },
      tint: {
        soft: "",
        solid: "",
        outline: "bg-transparent",
      },
    },
    compoundVariants: [
      // sale
      { variant: "sale", tint: "soft", class: "border-transparent bg-sale-soft text-sale-ink" },
      { variant: "sale", tint: "solid", class: "border-transparent bg-sale text-white" },
      { variant: "sale", tint: "outline", class: "border-sale/40 text-sale-ink" },
      // info
      { variant: "info", tint: "soft", class: "border-transparent bg-info-soft text-info-ink" },
      { variant: "info", tint: "solid", class: "border-transparent bg-info text-white" },
      { variant: "info", tint: "outline", class: "border-info/40 text-info-ink" },
      // success
      { variant: "success", tint: "soft", class: "border-transparent bg-success-soft text-success-ink" },
      { variant: "success", tint: "solid", class: "border-transparent bg-success text-white" },
      { variant: "success", tint: "outline", class: "border-success/40 text-success-ink" },
      // warning
      { variant: "warning", tint: "soft", class: "border-transparent bg-warning-soft text-warning-ink" },
      { variant: "warning", tint: "solid", class: "border-transparent bg-warning text-white" },
      { variant: "warning", tint: "outline", class: "border-warning/40 text-warning-ink" },
      // neutral
      { variant: "neutral", tint: "soft", class: "border-transparent bg-tone-neutral-soft text-tone-neutral-ink" },
      { variant: "neutral", tint: "solid", class: "border-transparent bg-foreground text-background" },
      { variant: "neutral", tint: "outline", class: "border-border text-foreground" },
      // shadcn "outline" cũ
      { variant: "default", tint: "outline", class: "border-border bg-transparent text-foreground" },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "default",
      tint: "soft",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  tint,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, tint }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
