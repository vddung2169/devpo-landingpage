"use client";

import React, { useMemo, useState } from "react";

import { Section, SectionHeader } from "@/components/ds/section";
import { ArticleCard } from "@/components/ds/article-card";
import { EmptyState, FilterChips } from "@/components/ds/filters";
import { IphoneLockGuides } from "../components/guides";
import {
  handbookGuides,
  guideCategoryLabel,
  type GuideCategory,
} from "@/data/guides";

type FilterValue = "all" | GuideCategory;

// Thứ tự hiển thị bộ lọc category (Tin tức đã tách riêng sang /news)
const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "huong-dan", label: guideCategoryLabel["huong-dan"] },
  { value: "so-sanh", label: guideCategoryLabel["so-sanh"] },
  { value: "thu-thuat", label: guideCategoryLabel["thu-thuat"] },
];

export default function GuidesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const visibleGuides = useMemo(
    () =>
      activeFilter === "all"
        ? handbookGuides
        : handbookGuides.filter((g) => g.category === activeFilter),
    [activeFilter],
  );

  return (
    <>
      {/* ===== Bài viết text (blog cẩm nang) ===== */}
      <Section tone="plain">
        <SectionHeader
          align="center"
          as="h1"
          eyebrow="Kiến thức"
          title="Cẩm nang & hướng dẫn iPhone, iPad"
          description="Tổng hợp bài viết kiến thức, so sánh và thủ thuật giúp bạn chọn mua và sử dụng iPhone Lock, iPhone Quốc tế và iPad đúng cách."
        />

        <div className="mb-block flex justify-center">
          <FilterChips
            label="Lọc bài viết theo chuyên mục"
            options={filters}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {visibleGuides.length > 0 ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {visibleGuides.map((guide, index) => (
              <ArticleCard
                key={guide.id}
                href={`/guides/${guide.slug}`}
                title={guide.title}
                excerpt={guide.excerpt}
                image={guide.imageUrl}
                category={guideCategoryLabel[guide.category]}
                readingTime={guide.readingTime}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có bài viết trong mục này" />
        )}
      </Section>

      {/* ===== Video TikTok (cẩm nang dạng video) ===== */}
      <IphoneLockGuides hideViewAll itemsPerPage={8} />
    </>
  );
}
