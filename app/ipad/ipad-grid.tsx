"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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

/**
 * Một nhóm bộ lọc dạng chip bo tròn. Nhãn nằm trên, chip nằm dưới và các nhóm
 * xếp 2 cột từ breakpoint sm — nhờ vậy 4 tiêu chí chỉ chiếm 2 hàng thay vì 4.
 */
function FilterGroup<T extends string>({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={active === option.value ? "default" : "outline"}
            className="h-7 rounded-full px-3 text-xs transition-all duration-300 sm:h-8 sm:px-4"
            aria-pressed={active === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

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
    <section className="container mx-auto px-2 py-8 sm:px-4" id="danh-sach-ipad">
      {/* Bảng bộ lọc riêng cho iPad — gọn 1 hàng tóm tắt + 2 hàng tiêu chí */}
      <div className="mb-6 rounded-2xl border border-border bg-card shadow-sm">
        {/* Thanh tóm tắt: luôn hiện, kiêm nút mở/đóng bộ lọc trên mobile */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-expanded={showFilters}
            aria-controls="ipad-filter-panel"
            className="flex items-center gap-2 text-sm font-semibold text-foreground sm:pointer-events-none"
          >
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            Bộ lọc
            {hasFilter && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {activeLabels.length}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 sm:hidden ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Tóm tắt tiêu chí đang bật — chỉ cần khi panel đóng ở mobile */}
          {hasFilter && !showFilters && (
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground sm:hidden">
              {activeLabels.join(" · ")}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <p className="text-xs text-muted-foreground sm:text-sm">
              <strong className="text-foreground">{filtered.length}</strong>/
              {ipadProducts.length} máy
            </p>
            {hasFilter && (
              <Button
                variant="ghost"
                className="h-7 gap-1.5 rounded-full px-2.5 text-xs"
                onClick={resetFilters}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Xoá lọc
              </Button>
            )}
          </div>
        </div>

        {/* Panel tiêu chí: thu gọn mặc định trên mobile, luôn mở từ sm trở lên */}
        <div
          id="ipad-filter-panel"
          className={`${
            showFilters ? "grid" : "hidden"
          } grid-cols-1 gap-x-8 gap-y-3 border-t border-border px-3 py-3 sm:grid sm:grid-cols-2 sm:px-4 sm:py-3.5`}
        >
          <FilterGroup
            label="Dòng máy"
            options={ipadLines.map((l) => ({ value: l.value, label: l.label }))}
            active={line}
            onChange={setLine}
          />
          <FilterGroup
            label="Kết nối"
            options={ipadConnectivityFilters}
            active={connectivity}
            onChange={setConnectivity}
          />
          <FilterGroup
            label="Dung lượng"
            options={storageFilters}
            active={storage}
            onChange={setStorage}
          />
          <FilterGroup
            label="Tình trạng"
            options={conditionFilters}
            active={condition}
            onChange={setCondition}
          />
        </div>
      </div>

      {/* Lưới sản phẩm iPad */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <Search className="mb-2 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-foreground">
            Chưa có iPad khớp bộ lọc này
          </p>
          <p className="max-w-md text-sm">
            Hàng iPad về liên tục và không phải lúc nào cũng lên hết website. Bạn
            thử nới bộ lọc, hoặc nhắn Zalo để Dev Pồ kiểm tra kho giúp bạn.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="rounded-full" onClick={resetFilters}>
              Xoá bộ lọc
            </Button>
            <Button asChild className="rounded-full">
              <Link
                href="https://zalo.me/4289073059490896771"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hỏi kho qua Zalo
              </Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
