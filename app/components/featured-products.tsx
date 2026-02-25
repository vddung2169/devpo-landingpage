"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Nhớ import thêm icon Search từ lucide-react nhé
import {
  Check,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { products } from "@/lib/products";

interface FeaturedProductsProps {
  limit?: number;
}

const categories = ["Tất cả", "iPhone Lock", "iPhone Quốc tế", "iPad"];
const ITEMS_PER_PAGE = 8;

export function FeaturedProducts({ limit }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  // Thêm State để lưu từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // BƯỚC 1: LỌC SẢN PHẨM THEO CẢ TAB VÀ TỪ KHÓA TÌM KIẾM
  const filteredProducts = products.filter((product) => {
    const matchCategory = activeTab === "Tất cả" || product.type === activeTab;

    const targetString = `${product.name} ${product.type} ${product.capacity}`
      .toLowerCase()
      .replace(/\s+/g, "");

    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

    const matchSearch = searchTerms.every((term) =>
      targetString.includes(term),
    );

    return matchCategory && matchSearch;
  });

  const isPaginated = !limit;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // BƯỚC 2: CẮT MẢNG ĐÃ LỌC ĐỂ HIỂN THỊ
  const displayProducts = isPaginated
    ? filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : filteredProducts.slice(0, limit);

  // Hàm xử lý khi bấm chuyển Tab
  const handleTabChange = (category: string) => {
    setActiveTab(category);
    setCurrentPage(1);
  };

  // Hàm xử lý khi gõ tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Gõ tìm kiếm thì cũng phải tự động về Trang 1
  };

  return (
    <section className="py-12" id="products">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sản phẩm <span className="text-primary">Nổi Bật</span>
          </h2>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Các dòng máy nguyên zin, chất lượng cao tại DEV PỒ
          </p>
        </div>

        {/* CỤM THANH TÌM KIẾM VÀ TABS */}
        <div className="mb-8 flex flex-col items-center gap-4">
          {/* Thanh tìm kiếm */}
          <div className="relative w-full max-w-sm md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm iPhone, iPad..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex h-10 sm:h-12 w-full rounded-full border border-input bg-background px-10 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground"
            />
          </div>

          {/* Cụm Tabs Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeTab === category ? "default" : "outline"}
                className="rounded-full h-8 px-3 text-xs sm:h-10 sm:px-6 sm:text-sm transition-all duration-300"
                onClick={() => handleTabChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {product.badge && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 rounded-full bg-red-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                    {product.badge}
                  </div>
                )}

                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-5">
                  <h3 className="text-sm sm:text-lg font-bold text-foreground line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm font-medium text-muted-foreground">
                    <span>{product.type}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                    <span className="text-foreground">{product.capacity}</span>
                  </div>

                  <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                    <span className="text-base sm:text-xl font-bold text-red-500">
                      {product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[11px] sm:text-sm text-muted-foreground line-through">
                        {product.oldPrice}
                      </span>
                    )}
                  </div>

                  <hr className="my-3 sm:my-4 border-border" />

                  <ul className="mb-3 sm:mb-6 flex flex-1 flex-col gap-1 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
                    {product.specs.map((spec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-1.5 sm:gap-2"
                      >
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="w-full font-semibold text-xs sm:text-base h-9 sm:h-11"
                    size="sm"
                  >
                    <a
                      href={product.zaloLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Tư vấn & Báo giá
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
            <p className="text-sm">
              Vui lòng thử lại với từ khóa khác (VD: Pro Max, iPad...)
            </p>
          </div>
        )}

        {/* XEM TẤT CẢ VÀ PHÂN TRANG */}
        {limit && filteredProducts.length > limit && (
          <div className="mt-12 flex justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href="/featured-products">
                Xem tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {isPaginated && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(i + 1)}
                className={`rounded-full ${currentPage === i + 1 ? "font-bold" : ""}`}
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
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
