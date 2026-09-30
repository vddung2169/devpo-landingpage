import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Bo tròn hoàn toàn (pill) là hình dạng nút chuẩn của design system — giống
  // apple.com và ảnh mẫu. Trước đây mỗi nơi tự thêm "rounded-full" nên nút chỗ
  // vuông chỗ tròn. Focus ring dày 3px + offset để thấy rõ khi đi bằng phím Tab.
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        // Nút chính: nền gần đen (light) / trắng (dark) — màu primary của brand.
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border border-border-strong bg-background text-foreground hover:bg-surface",
        secondary:
          "bg-surface text-foreground hover:bg-surface-strong",
        ghost: "text-foreground hover:bg-surface",
        link: "rounded-none text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-body has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3.5 text-caption has-[>svg]:px-3",
        lg: "h-12 px-7 text-body has-[>svg]:px-6",
        /** CTA chính của hero / trang chi tiết sản phẩm */
        xl: "h-14 px-8 text-lead font-semibold has-[>svg]:px-7",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
