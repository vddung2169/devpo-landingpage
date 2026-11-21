import { cn } from "@/lib/utils";

interface PlaceholderProps {
  children: React.ReactNode;
  /** Giải thích cần bổ sung gì — hiện khi rê chuột */
  hint?: string;
  className?: string;
}

const isDev = process.env.NODE_ENV !== "production";

/**
 * Đánh dấu nội dung TẠM trên trang chủ, chờ Dev Pồ thay bằng số liệu thật.
 * - Khi chạy `pnpm dev`: nền vàng, gạch đứt để dễ tìm.
 * - Khi build production: hiện như chữ thường (không lộ ô vàng lên web),
 *   NHƯNG nội dung vẫn là chữ tạm — nhớ sửa trong home-data.ts / component trước khi push.
 * Tìm nhanh mọi chỗ cần sửa: grep "<Placeholder" trong app/components/home/.
 */
export function Placeholder({ children, hint, className }: PlaceholderProps) {
  if (!isDev) return <>{children}</>;
  return (
    <span
      title={hint ? `Cần bổ sung: ${hint}` : "Cần bổ sung"}
      className={cn(
        "cursor-help rounded-sm border-b border-dashed border-warning-ink bg-warning-soft px-1 font-medium text-warning-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
