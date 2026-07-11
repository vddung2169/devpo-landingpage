import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen dark:bg-background">
      <JsonLd data={schemas} />

      <article className="container mx-auto max-w-3xl px-4 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={section.href} className="transition-colors hover:text-primary">
            {section.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground line-clamp-1">
            {guide.title}
          </span>
        </nav>

        {/* Category + tiêu đề */}
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {guideCategoryLabel[guide.category]}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {guide.title}
        </h1>

        {/* Meta: tác giả, ngày đăng, thời gian đọc */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              DP
            </span>
            Dev Pồ
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {guide.readingTime} phút đọc
          </span>
        </div>

        {/* Ảnh thumbnail */}
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-slate-100 dark:bg-slate-800">
          <Image
            src={guide.imageUrl}
            alt={guide.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {/* Nội dung bài viết (HTML).
            Tự style bằng arbitrary variants vì dự án chưa cài @tailwindcss/typography
            (class `prose` sẽ không có tác dụng, và Preflight reset h2/ul/ol). */}
        <div
          className="mt-8 text-base
            [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground sm:[&_h2]:text-2xl
            [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:text-muted-foreground
            [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_ol]:text-muted-foreground
            [&_li]:leading-relaxed
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_a]:font-medium [&_a]:text-primary [&_a]:underline
            [&_blockquote]:my-6 [&_blockquote]:rounded-xl [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote_p]:mb-0
            [&_figure]:my-6 [&_figure_img]:w-full [&_figure_img]:rounded-xl [&_figure_img]:border [&_figure_img]:border-border
            [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground
            [&_table]:my-6 [&_table]:w-full [&_table]:min-w-max [&_table]:border-collapse [&_table]:text-sm
            [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground
            [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* FAQ — chỉ hiển thị khi bài viết có khai báo câu hỏi thường gặp */}
        {guide.faq && guide.faq.length > 0 && <GuideFaq faq={guide.faq} />}

        {/* Tags */}
        {guide.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA box */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              Cần tư vấn thêm? Chat ngay với Dev Pồ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Đội ngũ Dev Pồ hỗ trợ 24/7, tư vấn chọn máy và báo giá nhanh chóng.
            </p>
          </div>
          <Button asChild size="lg" className="font-semibold">
            <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat Zalo ngay
            </a>
          </Button>
        </div>

        {/* Bài viết liên quan */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">
              Bài viết liên quan
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.id}
                  href={getGuidePath(post)}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-xs font-semibold text-primary">
                      {guideCategoryLabel[post.category]}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
