import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  href: string;
  title: string;
  excerpt?: string;
  image: string;
  /** Nhãn chuyên mục hiện ở góc ảnh (VD "Hướng dẫn", "Tin tức") */
  category?: string;
  /** Ngày đăng đã định dạng sẵn để hiển thị (VD "12/07/2025") */
  dateLabel?: string;
  /** Ngày ISO cho thẻ <time> — tốt cho SEO, không hiển thị */
  dateTime?: string;
  readingTime?: number;
  /** Ảnh bài đầu tiên nên tải ngay để cải thiện LCP trang danh sách */
  priority?: boolean;
  className?: string;
}

/**
 * ArticleCard — card bài viết dùng chung cho Cẩm nang và Tin tức.
 *
 * Trước đây khối này được viết lại 3 lần (app/guides/page.tsx,
 * app/news/page.tsx, app/components/news.tsx) với bo góc và bóng lệch nhau.
 */
export function ArticleCard({
  href,
  title,
  excerpt,
  image,
  category,
  dateLabel,
  dateTime,
  readingTime,
  priority,
  className,
}: ArticleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-media outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="media-frame aspect-[16/10] w-full">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 30vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {category && (
          <Badge
            variant="neutral"
            tint="solid"
            size="sm"
            className="absolute left-3 top-3 shadow-e1"
          >
            {category}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1 pt-3 sm:pt-4">
        <h3 className="text-h3 line-clamp-2 text-balance-tight text-foreground transition-colors group-hover:text-foreground/70">
          {title}
        </h3>

        {excerpt && (
          <p className="text-body line-clamp-2 text-muted-foreground">{excerpt}</p>
        )}

        {(dateLabel || readingTime) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-caption text-muted-foreground">
            {dateLabel && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                <time dateTime={dateTime}>{dateLabel}</time>
              </span>
            )}
            {readingTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {readingTime} phút đọc
              </span>
            ) : null}
          </div>
        )}
      </div>
    </Link>
  );
}
