import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getGuideBySlug,
  getRelatedGuides,
  guideCategoryLabel,
  guides,
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

// Pre-render tất cả trang bài viết tại build time → tốt cho SEO & tốc độ
export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Không tìm thấy bài viết",
      description: "Bài viết bạn tìm không tồn tại hoặc đã bị gỡ.",
    };
  }

  return {
    title: guide.title,
    description: guide.excerpt,
    keywords: [...guide.tags, "Dev Pồ", "iPhone Lock", "cẩm nang"],
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} | Dev Pồ`,
      description: guide.excerpt,
      url: `/guides/${guide.slug}`,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      images: [{ url: guide.imageUrl, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} | Dev Pồ`,
      description: guide.excerpt,
      images: [guide.imageUrl],
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return notFound();
  }

  const related = getRelatedGuides(slug, 3);

  // Article Schema — giúp Google hiển thị rich snippet bài viết
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
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
      "@id": `${SITE_URL}/guides/${guide.slug}`,
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
        name: "Cẩm nang",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${SITE_URL}/guides/${guide.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen dark:bg-background">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

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
          <Link href="/guides" className="transition-colors hover:text-primary">
            Cẩm nang
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
            [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:text-muted-foreground
            [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_ol]:text-muted-foreground
            [&_li]:leading-relaxed
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_a]:font-medium [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

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
                  href={`/guides/${post.slug}`}
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
