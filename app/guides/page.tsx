"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { IphoneLockGuides } from "../components/guides";
import {
  guides,
  guideCategoryLabel,
  type GuideCategory,
} from "@/data/guides";

type FilterValue = "all" | GuideCategory;

// Thứ tự hiển thị bộ lọc category
const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "huong-dan", label: guideCategoryLabel["huong-dan"] },
  { value: "so-sanh", label: guideCategoryLabel["so-sanh"] },
  { value: "thu-thuat", label: guideCategoryLabel["thu-thuat"] },
  { value: "tin-tuc", label: guideCategoryLabel["tin-tuc"] },
];

export default function GuidesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const visibleGuides = useMemo(
    () =>
      activeFilter === "all"
        ? guides
        : guides.filter((g) => g.category === activeFilter),
    [activeFilter],
  );

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {/* ===== Bài viết text (blog cẩm nang) ===== */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 text-center">
            <h1 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              CẨM NANG &amp; HƯỚNG DẪN iPHONE LOCK
            </h1>
            <p className="text-pretty mx-auto max-w-2xl text-lg text-muted-foreground">
              Tổng hợp bài viết kiến thức, so sánh và thủ thuật giúp bạn chọn mua
              và sử dụng iPhone Lock đúng cách.
            </p>
          </div>

          {/* Bộ lọc category */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={activeFilter === filter.value}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-muted-foreground hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Lưới bài viết */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={guide.imageUrl}
                    alt={guide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                    {guideCategoryLabel[guide.category]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
                    {guide.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {guide.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.readingTime} phút đọc
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleGuides.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              Chưa có bài viết trong mục này.
            </p>
          )}
        </div>
      </section>

      {/* ===== Video TikTok (cẩm nang dạng video) ===== */}
      <IphoneLockGuides hideViewAll itemsPerPage={8} />
    </main>
  );
}
