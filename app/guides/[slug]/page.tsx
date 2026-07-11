import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { GuideArticle } from "../../components/guide-article";
import { getGuideBySlug, handbookGuides } from "@/data/guides";

// Pre-render tất cả trang bài viết tại build time → tốt cho SEO & tốc độ
// (bài Tin tức đã tách sang /news/[slug] nên không pre-render ở đây)
export function generateStaticParams() {
  return handbookGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide || guide.category === "tin-tuc") {
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

  // Bài Tin tức đã chuyển nhà sang /news — redirect 308 giữ SEO cho URL cũ
  if (guide.category === "tin-tuc") {
    permanentRedirect(`/news/${guide.slug}`);
  }

  return <GuideArticle guide={guide} />;
}
