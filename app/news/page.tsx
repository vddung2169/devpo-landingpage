import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { newsGuides } from "@/data/guides";
import { newsArticles } from "@/lib/data";

// Khai báo SEO riêng cho trang Tin tức
export const metadata: Metadata = {
  title: "Tin Tức & Thủ Thuật iPhone Lock - Dev Pồ",
  description:
    "Tổng hợp mã ICCID mới nhất, hướng dẫn ghép sim, fix lỗi và mẹo hay sử dụng iPhone Lock từ chuyên gia, iphone lock, iphone lock mới nhất, iphone lock 2026, mã iccid iphone lock, sim ghép iphone lock, thủ thuật iphone lock",
  alternates: { canonical: "/news" },
};

// Chuẩn hoá 2 nguồn dữ liệu (bài dài từ data/guides.ts + tin ngắn từ lib/data.ts)
// về cùng 1 dạng card để hiển thị chung 1 lưới, sắp xếp theo ngày mới nhất.
interface NewsCard {
  key: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  /** Ngày hiển thị dạng dd/mm/yyyy */
  dateLabel: string;
  /** Dùng để sắp xếp mới → cũ */
  sortDate: Date;
  readingTime?: number;
}

// "2026-07-03" -> 03/07/2026
function formatIsoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// "25/02/2026" -> Date(2026, 1, 25)
function parseVnDate(vn: string): Date {
  const [day, month, year] = vn.split("/").map(Number);
  return new Date(year, month - 1, day);
}

const newsItems: NewsCard[] = [
  ...newsGuides.map((guide) => ({
    key: `guide-${guide.slug}`,
    href: `/news/${guide.slug}`,
    title: guide.title,
    excerpt: guide.excerpt,
    image: guide.imageUrl,
    dateLabel: formatIsoDate(guide.publishedAt),
    sortDate: new Date(guide.publishedAt),
    readingTime: guide.readingTime,
  })),
  ...newsArticles.map((article) => ({
    key: `article-${article.slug}`,
    href: `/news/${article.slug}`,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image,
    dateLabel: article.date,
    sortDate: parseVnDate(article.date),
  })),
].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

export default function NewsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 text-center">
            <h1 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              TIN TỨC iPHONE LOCK
            </h1>
            <p className="text-pretty mx-auto max-w-2xl text-lg text-muted-foreground">
              Cập nhật mã ICCID, tình hình sim ghép, giá máy và những thông tin
              mới nhất dành cho cộng đồng iPhone Lock.
            </p>
          </div>

          {/* Lưới bài viết */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                    Tin tức
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.dateLabel}
                    </span>
                    {item.readingTime && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {item.readingTime} phút đọc
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
