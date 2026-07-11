import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
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
    <main className="container mx-auto max-w-5xl px-4 pt-12 pb-16 min-h-screen">
      {/* Nút quay lại */}
      <Link
        href="/news"
        className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại danh sách
      </Link>

      {/* Header bài viết */}
      <article>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <div className="mb-8 flex items-center text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{article.date}</span>
        </div>

        {/* Ảnh bìa */}
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority // Ưu tiên tải ảnh bìa này thật nhanh
          />
        </div>

        {/* Nội dung bài viết */}
        {/* Class prose giúp các thẻ text tự động có margin, line-height chuẩn như đọc báo */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-line">
          <p className="font-semibold text-xl mb-6">{article.excerpt}</p>
          <p>{article.content}</p>
        </div>
      </article>
    </main>
  );
}
