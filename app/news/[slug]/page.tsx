import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";

import { Breadcrumbs } from "@/components/ds/breadcrumbs";
import { GuideArticle } from "../../components/guide-article";
import { newsGuides } from "@/data/guides";
import { newsArticles } from "@/lib/data";

// Pre-render toàn bộ bài tin tức tại build time (cả bài dài lẫn tin ngắn)
export function generateStaticParams() {
  return [
    ...newsGuides.map((guide) => ({ slug: guide.slug })),
    ...newsArticles.map((article) => ({ slug: article.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const guide = newsGuides.find((g) => g.slug === slug);
  if (guide) {
    return {
      title: guide.title,
      description: guide.excerpt,
      keywords: [...guide.tags, "Dev Pồ", "iPhone Lock", "tin tức"],
      alternates: { canonical: `/news/${guide.slug}` },
      openGraph: {
        title: `${guide.title} | Dev Pồ`,
        description: guide.excerpt,
        url: `/news/${guide.slug}`,
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

  const article = newsArticles.find((a) => a.slug === slug);
  if (article) {
    return {
      title: article.title,
      description: article.excerpt,
      alternates: { canonical: `/news/${article.slug}` },
    };
  }

  return {
    title: "Không tìm thấy bài viết",
    description: "Bài viết bạn tìm không tồn tại hoặc đã bị gỡ.",
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Bài tin tức dạng dài (tách từ cẩm nang) — render layout bài viết đầy đủ
  const guide = newsGuides.find((g) => g.slug === slug);
  if (guide) {
    return <GuideArticle guide={guide} />;
  }

  // Tin ngắn (dữ liệu cũ trong lib/data.ts)
  const article = newsArticles.find((a) => a.slug === slug);
  if (!article) {
    return notFound();
  }

  return (
    <main className="container-prose py-section-sm">
      <article>
        <Breadcrumbs
          className="mb-block"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tin tức", href: "/news" },
            { label: article.title },
          ]}
        />

        <h1 className="text-h1 text-balance text-foreground">
          {article.title}
        </h1>

        <p className="mt-4 flex items-center gap-1.5 text-caption text-muted-foreground">
          <Calendar className="size-4" aria-hidden="true" />
          {article.date}
        </p>

        {/* Ảnh bìa */}
        <div className="media-frame mt-6 aspect-[16/9] w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 92vw, 736px"
            className="object-cover"
          />
        </div>

        {/* Nội dung — .rich-text thay cho class `prose` (dự án không cài typography) */}
        <div className="rich-text mt-8 whitespace-pre-line">
          <p className="text-lead font-semibold text-foreground">
            {article.excerpt}
          </p>
          <p>{article.content}</p>
        </div>
      </article>
    </main>
  );
}
