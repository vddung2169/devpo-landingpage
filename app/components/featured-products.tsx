"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ds/section";
import { EmptyState, FilterChips, SearchField } from "@/components/ds/filters";
import { categoryLabel, featuredRank, products } from "@/data/products";
import { ProductCard } from "./product-card";

interface FeaturedProductsProps {
  /** Có giá trị = bản rút gọn ở trang chủ; bỏ trống = bản đầy đủ có phân trang */
  limit?: number;
}

const CATEGORIES = ["Tất cả", "iPhone Lock", "iPhone Quốc tế", "iPad"].map(
  (label) => ({ value: label, label }),
);
const ITEMS_PER_PAGE = 8;

export function FeaturedProducts({ limit }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // BƯỚC 1: LỌC SẢN PHẨM THEO CẢ TAB VÀ TỪ KHÓA TÌM KIẾM
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchCategory =
          activeTab === "Tất cả" ||
          categoryLabel[product.category] === activeTab;

        const targetString =
          `${product.name} ${categoryLabel[product.category]} ${product.storage}`
            .toLowerCase()
            .replace(/\s+/g, "");

        const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
        const matchSearch = searchTerms.every((term) =>
          targetString.includes(term),
        );

        return matchCategory && matchSearch;
      }),
    [activeTab, searchQuery],
  );

  const isPaginated = !limit;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // BƯỚC 2: CẮT MẢNG ĐÃ LỌC ĐỂ HIỂN THỊ
  // Bản rút gọn (trang chủ) sắp lại theo thứ tự nổi bật đã chọn sẵn — iPhone xen
  // kẽ iPad để khối này không chỉ toàn iPhone. Bản đầy đủ giữ nguyên thứ tự theo
  // id để phân trang ổn định.
  const displayProducts = isPaginated
    ? filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : [...filteredProducts]
        .sort((a, b) => featuredRank(a) - featuredRank(b))
        .slice(0, limit);

  const handleTabChange = (category: string) => {
    setActiveTab(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Gõ tìm kiếm thì cũng phải tự động về Trang 1
  };

  return (
    <Section id="products" tone="plain">
      <SectionHeader
        eyebrow="Kho máy Dev Pồ"
        title="Sản phẩm nổi bật"
        description=""
        action={
          limit ? (
            <Button asChild variant="outline">
              <Link href="/featured-products">
                Xem tất cả
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* --- Thanh lọc: chip danh mục + ô tìm kiếm --- */}
      <div className="mb-block flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterChips
          label="Lọc theo loại máy"
          options={CATEGORIES}
          active={activeTab}
          onChange={handleTabChange}
        />

        <SearchField
          label="Tìm kiếm sản phẩm"
          placeholder="Tìm iPhone, iPad…"
          value={searchQuery}
          onChange={handleSearchChange}
          className="md:max-w-xs"
        />
      </div>

      {/* --- Lưới sản phẩm --- */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product, index) => (
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
          description="Thử lại với từ khóa khác (VD: Pro Max, iPad Air…)"
        />
      )}

      {/* --- Phân trang (chỉ ở bản đầy đủ) --- */}
      {isPaginated && totalPages > 1 && (
        <nav
          aria-label="Phân trang sản phẩm"
          className="mt-block flex items-center justify-center gap-2"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(i + 1)}
              aria-label={`Trang ${i + 1}`}
              aria-current={currentPage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            aria-label="Trang sau"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </nav>
      )}
    </Section>
  );
}
