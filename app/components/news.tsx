"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { newsArticles } from "@/lib/data";

export function News() {
  return (
    <section className="py-2 md:py-4">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tin Tức & <span className="text-primary">Thủ Thuật</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Cập nhật những thông tin mới nhất và hướng dẫn chi tiết dành cho
            cộng đồng iPhone Lock.
          </p>
        </div>

        {/* Lưới danh sách bài viết */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-md"
            >
              <Link
                href={`/news/${article.slug}`}
                className="relative h-56 w-full overflow-hidden"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {article.date}
                </div>

                <h3 className="mb-3 text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  <Link href={`/news/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="mb-6 line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {article.excerpt}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center font-medium text-primary hover:underline"
                  >
                    Đọc tiếp <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
