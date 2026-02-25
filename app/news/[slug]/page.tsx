import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
import { newsArticles } from "@/lib/data";

// Hàm này nhận vào params là đường link (slug) trên trình duyệt
export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 2. DÙNG LỆNH "await" ĐỂ GIẢI MÃ PARAMS
  const resolvedParams = await params;

  // 3. SỬ DỤNG "resolvedParams.slug" ĐỂ TÌM BÀI VIẾT
  const article = newsArticles.find((a) => a.slug === resolvedParams.slug);

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
