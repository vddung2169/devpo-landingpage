"use client";

import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ds/section";
import { EmptyState, FilterChips } from "@/components/ds/filters";
import { ProductCard } from "../components/product-card";
import {
  ipadConditionOptions,
  ipadConnectivityFilters,
  ipadLineLabel,
  ipadLines,
  ipadProducts,
  ipadStorageOptions,
  matchesConnectivity,
  type IpadLine,
} from "@/data/products";

type LineFilter = IpadLine | "all";
type ConnectivityFilter = "all" | "wifi" | "cellular";

export function IpadGrid() {
  const [line, setLine] = useState<LineFilter>("all");
  const [connectivity, setConnectivity] = useState<ConnectivityFilter>("all");
  const [storage, setStorage] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  // Chỉ dùng cho mobile: từ breakpoint sm trở lên panel luôn mở (xem class bên dưới)
  const [showFilters, setShowFilters] = useState(false);

  // Bộ lọc dung lượng & tình trạng dựng thẳng từ dữ liệu sản phẩm để không phải
  // sửa hai nơi mỗi khi cửa hàng nhập thêm máy mới.
  const storageFilters = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...ipadStorageOptions.map((s) => ({ value: s, label: s })),
    ],
    [],
  );

  const conditionFilters = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...ipadConditionOptions.map((c) => ({ value: c, label: c })),
    ],
    [],
  );

  const filtered = useMemo(
    () =>
      ipadProducts.filter((product) => {
        const matchLine = line === "all" || product.ipadLine === line;
        const matchConnectivity = matchesConnectivity(product, connectivity);
        const matchStorage =
          storage === "all" || (product.storageOptions ?? []).includes(storage);
        const matchCondition =
          condition === "all" || product.condition === condition;

        return matchLine && matchConnectivity && matchStorage && matchCondition;
      }),
    [line, connectivity, storage, condition],
  );

  // Nhãn các tiêu chí đang bật — hiển thị tóm tắt khi panel đang thu gọn ở mobile
  const activeLabels = [
    line !== "all" ? ipadLineLabel[line] : null,
    connectivity !== "all"
      ? ipadConnectivityFilters.find((f) => f.value === connectivity)?.label
      : null,
    storage !== "all" ? storage : null,
    condition !== "all" ? condition : null,
  ].filter(Boolean) as string[];

  const hasFilter = activeLabels.length > 0;

  const resetFilters = () => {
    setLine("all");
    setConnectivity("all");
    setStorage("all");
    setCondition("all");
  };

  return (
    <Section id="danh-sach-ipad" tone="plain" size="sm">
      {/* Bảng bộ lọc riêng cho iPad — 1 hàng tóm tắt + panel 2 cột tiêu chí */}
      <div className="mb-block overflow-hidden rounded-media bg-surface">
        {/* Thanh tóm tắt: luôn hiện, kiêm nút mở/đóng bộ lọc trên mobile */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-expanded={showFilters}
            aria-controls="ipad-filter-panel"
            className="flex items-center gap-2 text-body font-semibold text-foreground sm:pointer-events-none"
          >
            <SlidersHorizontal
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            Bộ lọc
            {hasFilter && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {activeLabels.length}
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-300 sm:hidden",
                showFilters && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {/* Tóm tắt tiêu chí đang bật — chỉ cần khi panel đóng ở mobile */}
          {hasFilter && !showFilters && (
            <span className="min-w-0 flex-1 truncate text-caption text-muted-foreground sm:hidden">
              {activeLabels.join(" · ")}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <p className="text-caption text-muted-foreground">
              <strong className="text-foreground">{filtered.length}</strong>/
              {ipadProducts.length} máy
            </p>
            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Xoá lọc
              </Button>
            )}
          </div>
        </div>

        {/* Panel tiêu chí: thu gọn mặc định trên mobile, luôn mở từ sm trở lên */}
        <div
          id="ipad-filter-panel"
          className={cn(
            "grid-cols-1 gap-x-8 gap-y-4 border-t border-border px-4 py-4 sm:grid sm:grid-cols-2",
            showFilters ? "grid" : "hidden",
          )}
        >
          <FilterChips
            showLabel
            label="Dòng máy"
            options={ipadLines.map((l) => ({ value: l.value, label: l.label }))}
            active={line}
            onChange={setLine}
          />
          <FilterChips
            showLabel
            label="Kết nối"
            options={ipadConnectivityFilters}
            active={connectivity}
            onChange={setConnectivity}
          />
          <FilterChips
            showLabel
            label="Dung lượng"
            options={storageFilters}
            active={storage}
            onChange={setStorage}
          />
          <FilterChips
            showLabel
            label="Tình trạng"
            options={conditionFilters}
            active={condition}
            onChange={setCondition}
          />
        </div>
      </div>

      {/* Lưới sản phẩm iPad */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có iPad khớp bộ lọc này"
          description="Hàng iPad về liên tục và không phải lúc nào cũng lên hết website. Bạn thử nới bộ lọc, hoặc nhắn Zalo để Dev Pồ kiểm tra kho giúp bạn."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={resetFilters}>
                Xoá bộ lọc
              </Button>
              <Button asChild>
                <a
                  href="https://zalo.me/4289073059490896771"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hỏi kho qua Zalo
                </a>
              </Button>
            </div>
          }
        />
      )}
    </Section>
  );
}
