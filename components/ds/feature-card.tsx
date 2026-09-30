import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Bỏ `title` gốc của div (string, hiện tooltip) để dùng làm tiêu đề ReactNode.
interface FeatureCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: LucideIcon;
  title: React.ReactNode;
  children: React.ReactNode;
  /** "surface" khi đặt trên nền trắng, "plain" khi đặt trên nền xám */
  tone?: "surface" | "plain";
}

/**
 * FeatureCard — ô nội dung ngắn: icon + tiêu đề + mô tả.
 *
 * Dùng cho "Ưu điểm iPhone Lock", "Phân biệt 3 loại iPad", "Vì sao chọn Dev Pồ"…
 * Trước đây mỗi khối tự dựng lại cùng một markup với icon xanh hard-code và
 * bóng đổ khác nhau.
 */
function FeatureCard({
  icon: Icon,
  title,
  children,
  tone = "surface",
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-3 rounded-media p-5 sm:p-6",
        tone === "surface" ? "bg-surface" : "bg-background",
        className,
      )}
      {...props}
    >
      {Icon && (
        <span className="flex size-10 items-center justify-center rounded-full bg-background text-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-h4 text-foreground">{title}</h3>
      <p className="text-body text-pretty text-muted-foreground">{children}</p>
    </div>
  );
}

export { FeatureCard };
