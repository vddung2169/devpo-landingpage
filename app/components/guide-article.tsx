import Image from "next/image";
import { Calendar, Clock, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ds/breadcrumbs";
import { ArticleCard } from "@/components/ds/article-card";
import { JsonLd } from "@/components/seo/JsonLd";
import { GuideFaq } from "../guides/components/guide-faq";
import {
  getGuidePath,
  getRelatedGuides,
  guideCategoryLabel,
  type Guide,
} from "@/data/guides";
import { ZALO_LINK } from "@/data/products";

const SITE_URL = "https://www.devpo.vn";

// Định dạng ngày kiểu Việt Nam: 2025-03-10 -> 10/03/2025
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// =============================================================================
// Trang chi tiết bài viết dùng chung cho cả 2 chuyên mục:
// - Cẩm nang (/guides/[slug]) — category huong-dan / so-sanh / thu-thuat
// - Tin tức (/news/[slug]) — category tin-tuc
// Breadcrumb + JSON-LD tự đổi theo chuyên mục của bài viết.
// =============================================================================
export function GuideArticle({ guide }: { guide: Guide }) {
  const isNews = guide.category === "tin-tuc";
  const section = isNews
    ? { name: "Tin tức", href: "/news" }
    : { name: "Cẩm nang", href: "/guides" };
  const canonicalUrl = `${SITE_URL}${getGuidePath(guide)}`;

  const related = getRelatedGuides(guide.slug, 3);

  // Article Schema — giúp Google hiển thị rich snippet bài viết
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: `${SITE_URL}${guide.imageUrl}`,
    author: { "@type": "Organization", name: "Dev Pồ", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Dev Pồ",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/devpo_logo.jpg`,
      },
    },
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  // BreadcrumbList Schema — khớp với breadcrumb UI bên dưới
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: section.name,
        item: `${SITE_URL}${section.href}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonicalUrl,
      },
    ],
  };

  // FAQPage Schema — chỉ thêm khi bài viết có khai báo faq (dùng chung dữ liệu với GuideFaq UI)
  const faqSchema = guide.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  const schemas = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <main className="container-prose py-section-sm">
      <JsonLd data={schemas} />

      <article>
        <Breadcrumbs
          className="mb-block"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: section.name, href: section.href },
            { label: guide.title },
          ]}
        />

        {/* Chuyên mục + tiêu đề */}
        <Badge variant="neutral">{guideCategoryLabel[guide.category]}</Badge>
        <h1 className="text-h1 mt-3 text-balance text-foreground">
          {guide.title}
        </h1>

        {/* Meta: tác giả, ngày đăng, thời gian đọc */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-muted-foreground">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              DP
            </span>
            Dev Pồ
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            <time dateTime={guide.publishedAt}>
              {formatDate(guide.publishedAt)}
            </time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {guide.readingTime} phút đọc
          </span>
        </div>

        {/* Ảnh bìa */}
        <div className="media-frame mt-6 aspect-[16/9] w-full">
          <Image
            src={guide.imageUrl}
            alt={guide.title}
            fill
            priority
            sizes="(max-width: 768px) 92vw, 736px"
            className="object-cover"
          />
        </div>

        {/* Nội dung bài viết (HTML) — style bằng .rich-text trong globals.css,
            vì dự án không cài @tailwindcss/typography nên class `prose` vô tác dụng. */}
        <div
          className="rich-text mt-8"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* FAQ — chỉ hiển thị khi bài viết có khai báo câu hỏi thường gặp */}
        {guide.faq && guide.faq.length > 0 && <GuideFaq faq={guide.faq} />}

        {/* Tags */}
        {guide.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="neutral">#{tag}</Badge>
              </li>
            ))}
          </ul>
        )}

        {/* CTA liên hệ */}
        <aside className="mt-block flex flex-col items-center gap-4 rounded-media bg-surface p-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-h3 text-foreground">
              Cần tư vấn thêm? Chat ngay với Dev Pồ
            </h2>
            <p className="text-body mt-1 text-muted-foreground">
              Đội ngũ Dev Pồ hỗ trợ 24/7, tư vấn chọn máy và báo giá nhanh chóng.
            </p>
          </div>
          <Button asChild size="lg">
            <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" aria-hidden="true" />
              Chat Zalo ngay
            </a>
          </Button>
        </aside>

        {/* Bài viết liên quan */}
        {related.length > 0 && (
          <section className="mt-section">
            <h2 className="text-h2 mb-block text-foreground">
              Bài viết liên quan
            </h2>
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-3">
              {related.map((post) => (
                <ArticleCard
                  key={post.id}
                  href={getGuidePath(post)}
                  title={post.title}
                  image={post.imageUrl}
                  category={guideCategoryLabel[post.category]}
                  readingTime={post.readingTime}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
