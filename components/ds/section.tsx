import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Section — khung ngoài chuẩn của mọi khối nội dung.
 *
 * Trước đây mỗi khối tự viết `py-12`, `py-16`, `py-20 md:py-32`, `py-14 sm:py-20`…
 * (8 biến thể khác nhau) và nền thì `bg-white dark:bg-[#0b0f19]`, `bg-slate-50`,
 * `bg-secondary/40`… Component này gom lại còn 2 lựa chọn:
 *
 *  - `tone` : "plain" (nền trang) hoặc "surface" (xám nhạt) — xen kẽ nhau để
 *             mắt phân biệt được các khối mà không cần kẻ viền.
 *  - `size` : "default" | "sm" | "none" — khoảng cách dọc lấy từ token
 *             --spacing-section / --spacing-section-sm, tự co giãn theo bề rộng.
 */
const sectionVariants = cva("w-full", {
  variants: {
    tone: {
      plain: "bg-background",
      surface: "bg-surface",
      transparent: "",
    },
    size: {
      default: "py-section",
      sm: "py-section-sm",
      none: "",
    },
    divider: {
      none: "",
      top: "border-t border-border",
      bottom: "border-b border-border",
      both: "border-y border-border",
    },
  },
  defaultVariants: { tone: "plain", size: "default", divider: "none" },
});

interface SectionProps
  extends React.ComponentProps<"section">,
    VariantProps<typeof sectionVariants> {
  /** false nếu khối tự lo phần khung bên trong (VD: carousel tràn mép) */
  contained?: boolean;
  /** Class thêm cho lớp khung bên trong (.container-page) */
  containerClassName?: string;
}

function Section({
  className,
  containerClassName,
  tone,
  size,
  divider,
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(sectionVariants({ tone, size, divider }), className)}
      {...props}
    >
      {contained ? (
        <div className={cn("container-page", containerClassName)}>{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

// Bỏ `title` gốc của thẻ div (kiểu string, hiện tooltip) để dùng làm tiêu đề ReactNode.
interface SectionHeaderProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Chữ nhỏ in hoa phía trên tiêu đề (tùy chọn) */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Nút/link nằm bên phải tiêu đề trên desktop (VD "Xem tất cả") */
  action?: React.ReactNode;
  /** "left" (mặc định) hợp với lưới sản phẩm; "center" hợp với khối giới thiệu */
  align?: "left" | "center";
  /** Cấp thẻ tiêu đề — đổi theo ngữ cảnh SEO, không đổi kích thước hiển thị */
  as?: "h1" | "h2" | "h3";
}

/**
 * SectionHeader — tiêu đề khối dùng chung.
 * Thay cho 25 biến thể class <h2> đang viết tay rải rác trong dự án.
 */
function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
  className,
  ...props
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      data-slot="section-header"
      className={cn(
        "mb-block flex flex-col gap-4",
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className={cn("flex flex-col gap-2", centered && "items-center")}>
        {eyebrow && (
          <span className="text-overline uppercase text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <Heading
          className={cn(
            "text-h2 text-balance text-foreground",
            centered && "max-w-2xl",
          )}
        >
          {title}
        </Heading>
        {description && (
          <p
            className={cn(
              "text-lead max-w-3xl text-pretty text-muted-foreground",
              centered && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { Section, SectionHeader, sectionVariants };
