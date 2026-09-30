import type { Metadata } from "next";

import { Section, SectionHeader } from "@/components/ds/section";
import { ArticleCard } from "@/components/ds/article-card";
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
  /** Ngày dạng ISO cho thẻ <time dateTime> — không hiển thị, chỉ phục vụ SEO */
  dateTime: string;
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
    dateTime: guide.publishedAt,
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
    dateTime: parseVnDate(article.date).toISOString().slice(0, 10),
  })),
].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

export default function NewsPage() {
  return (
    <Section tone="plain">
      <SectionHeader
        align="center"
        as="h1"
        eyebrow="Blog"
        title="Tin tức iPhone Lock"
        description="Cập nhật mã ICCID, tình hình sim ghép, giá máy và những thông tin mới nhất dành cho cộng đồng iPhone Lock."
      />

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {newsItems.map((item, index) => (
          <ArticleCard
            key={item.key}
            href={item.href}
            title={item.title}
            excerpt={item.excerpt}
            image={item.image}
            category="Tin tức"
            dateLabel={item.dateLabel}
            dateTime={item.dateTime}
            readingTime={item.readingTime}
            priority={index < 3}
          />
        ))}
      </div>
    </Section>
  );
}
