"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      activeCategory === "all" || product.category === activeCategory;

    const target = `${product.name} ${categoryLabel[product.category]} ${product.storage}`
      .toLowerCase()
      .replace(/\s+/g, "");
    const matchSearch = searchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .every((term) => target.includes(term));

    return matchCategory && matchSearch;
  });

  return (
    <section className="container mx-auto px-2 py-8 sm:px-4">
      {/* Tìm kiếm */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-sm md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm iPhone, iPad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 sm:h-12 w-full rounded-full border border-input bg-background px-10 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Bộ lọc theo danh mục */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {productCategories.map((category) => (
          <Button
            key={category.value}
            variant={activeCategory === category.value ? "default" : "outline"}
            className="rounded-full h-8 px-3 text-xs sm:h-10 sm:px-6 sm:text-sm transition-all duration-300"
            onClick={() => setActiveCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Lưới sản phẩm */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <Search className="mb-2 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
          <p className="text-sm">Vui lòng thử lại với từ khóa hoặc danh mục khác.</p>
        </div>
      )}
    </section>
  );
}
