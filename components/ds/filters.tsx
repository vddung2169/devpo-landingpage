"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface FilterChipsProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
  /** true = nhãn hiện trên chip; false = chỉ đọc được bằng trình đọc màn hình */
  showLabel?: boolean;
  className?: string;
}

/**
 * FilterChips — dãy chip lọc bo tròn, dùng chung cho /products, /featured-products
 * và /ipad. Trước đây mỗi trang tự dựng bằng <Button> với cỡ chữ và chiều cao
 * khác nhau, nên cùng một bộ lọc mà mỗi trang nhìn một kiểu.
 *
 * Dùng <button aria-pressed> thay vì <Button variant> để trình đọc màn hình
 * thông báo đúng trạng thái đang bật/tắt của từng chip.
 */
function FilterChips<T extends string>({
  label,
  options,
  active,
  onChange,
  showLabel = false,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel ? (
        <span className="text-overline uppercase text-muted-foreground">
          {label}
        </span>
      ) : null}

      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = active === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                "rounded-full px-4 py-2 text-body font-medium transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:bg-surface-strong hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SearchFieldProps extends React.ComponentProps<"input"> {
  label: string;
}

/** Ô tìm kiếm dạng pill nền xám — dùng chung cho mọi trang có lọc sản phẩm. */
function SearchField({ label, className, ...props }: SearchFieldProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label={label}
        className="h-11 w-full rounded-full bg-surface pl-11 pr-4 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...props}
      />
    </div>
  );
}

/** Khối thông báo khi bộ lọc không ra kết quả nào. */
function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-media bg-surface px-6 py-16 text-center">
      <Search className="size-10 text-muted-foreground" aria-hidden="true" />
      <p className="text-h3 text-foreground">{title}</p>
      {description && (
        <p className="text-body text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export { FilterChips, SearchField, EmptyState };
