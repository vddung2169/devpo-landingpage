import { Section, SectionHeader } from "@/components/ds/section";
import { ArticleCard } from "@/components/ds/article-card";
import { newsArticles } from "@/lib/data";

/** Khối tin tức dùng lại ArticleCard chung thay vì tự dựng card riêng. */
export function News() {
  return (
    <Section tone="plain">
      <SectionHeader
        eyebrow="Blog"
        title="Tin tức & thủ thuật"
        description="Cập nhật thông tin mới nhất và hướng dẫn chi tiết dành cho cộng đồng iPhone Lock."
      />

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {newsArticles.map((article, index) => (
          <ArticleCard
            key={article.id}
            href={`/news/${article.slug}`}
            title={article.title}
            excerpt={article.excerpt}
            image={article.image}
            category="Tin tức"
            dateLabel={article.date}
            priority={index === 0}
          />
        ))}
      </div>
    </Section>
  );
}
