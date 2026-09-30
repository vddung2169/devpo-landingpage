"use client";

import { useMemo, useState } from "react";

import { Section } from "@/components/ds/section";
import { EmptyState, FilterChips, SearchField } from "@/components/ds/filters";
import {
  categoryLabel,
  productCategories,
  products,
  type ProductCategory,
} from "@/data/products";
import { ProductCard } from "./product-card";

type Filter = ProductCategory | "all";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchCategory =
          activeCategory === "all" || product.category === activeCategory;

        const target =
          `${product.name} ${categoryLabel[product.category]} ${product.storage}`
            .toLowerCase()
            .replace(/\s+/g, "");
        const matchSearch = searchQuery
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .every((term) => target.includes(term));

        return matchCategory && matchSearch;
      }),
    [activeCategory, searchQuery],
  );

  return (
    <Section tone="plain" size="sm">
      <div className="mb-block flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterChips
          label="Lọc theo loại máy"
          options={productCategories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <SearchField
          label="Tìm kiếm sản phẩm"
          placeholder="Tìm iPhone, iPad…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không tìm thấy sản phẩm nào"
          description="Thử lại với từ khóa hoặc danh mục khác."
        />
      )}
    </Section>
  );
}
