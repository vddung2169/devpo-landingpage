"use client";

import { useState } from "react";

import {
  featuredRank,
  priceToNumber,
  products,
  type ProductCategory,
} from "@/data/products";
import { cn } from "@/lib/utils";
import { CONTACT } from "./home-data";
import { ArrowLink } from "./arrow-link";
import { Placeholder } from "./placeholder";
import { ShowcaseCard } from "./showcase-card";

const TABS: { value: ProductCategory; label: string }[] = [
  { value: "lock", label: "iPhone Lock" },
  { value: "quocte", label: "iPhone Quốc tế" },
  { value: "ipad", label: "iPad" },
];
const PER_TAB = 7;

/** Máy có giá rõ ràng lên trước theo thứ tự nổi bật, sau đó tới giá cao → thấp. */
function pick(category: ProductCategory) {
  return products
    .filter((p) => p.category === category && priceToNumber(p.priceFrom) > 0)
    .sort(
      (a, b) =>
        featuredRank(a) - featuredRank(b) ||
        priceToNumber(b.priceFrom) - priceToNumber(a.priceFrom),
    )
    .slice(0, PER_TAB);
}

/** Khối "Máy đang có ở cửa hàng" — 3 tab, 7 máy + ô hỏi máy khác. */
export function ProductShowcase() {
  const [tab, setTab] = useState<ProductCategory>("lock");
  const list = pick(tab);

  return (
    <section
      id="may"
      aria-labelledby="may-title"
      className="scroll-mt-20 py-section"
    >
      <div className="container-page">
        <div className="mb-block flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="may-title" className="text-h2 text-foreground">
              Máy đang có ở cửa hàng
            </h2>
            <p className="mt-2 text-muted-foreground">
              Giá máy Lock đã gồm độ sim.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Loại máy"
            className="inline-flex max-w-full self-start overflow-x-auto rounded-full bg-surface p-1"
          >
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "min-h-10 whitespace-nowrap rounded-full px-4 text-[0.875rem] font-semibold transition-colors",
                  tab === t.value
                    ? "bg-background text-foreground shadow-e1"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div
          role="tabpanel"
          className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-4"
        >
          {list.length === 0 ? (
            <div className="col-span-full rounded-media border border-dashed border-border-strong px-6 py-12 text-center">
              <p className="font-semibold">Chưa có dữ liệu iPhone Quốc tế</p>
              <p className="mt-1 text-muted-foreground">
                <Placeholder hint="danh sách máy Quốc tế và giá">
                  Cần bổ sung danh sách máy Quốc tế
                </Placeholder>
              </p>
            </div>
          ) : (
            <>
              {list.map((p, i) => (
                <ShowcaseCard key={p.slug} product={p} priority={i < 2} />
              ))}
              <a
                href={CONTACT.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-col justify-between gap-4 rounded-media border border-dashed border-border-strong p-5 transition-colors hover:border-foreground"
              >
                <strong className="text-[1.0625rem] leading-snug">
                  Không thấy đời máy bạn cần?
                </strong>
                <span className="text-caption text-muted-foreground">
                  Nhắn Dev Pồ đời máy, dung lượng, màu. Máy mới về được báo
                  trước.
                </span>
                <span className="font-semibold">Nhắn Zalo →</span>
              </a>
            </>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <ArrowLink href="/featured-products">
            Xem toàn bộ {products.length} mẫu máy
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
