import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { priceToNumber, products, type ProductCategory } from "@/data/products";
import { cn, formatVND } from "@/lib/utils";
import { Placeholder } from "./placeholder";
import styles from "./home.module.css";

interface Line {
  category: ProductCategory;
  name: string;
  pitch: string;
  image: string;
  href: string;
}

const LINES: Line[] = [
  {
    category: "lock",
    name: "iPhone Lock",
    pitch: "Đời cao, giá mềm. Sim ghép cài sẵn, fix lỗi trọn đời.",
    image: "/products/17promax.png",
    href: "/featured-products",
  },
  {
    category: "quocte",
    name: "iPhone Quốc tế",
    pitch: "Lắp sim Viettel, Mobi, Vina là dùng. Không cần sim ghép.",
    image: "/products/16promax.png",
    href: "/featured-products",
  },
  {
    category: "ipad",
    name: "iPad",
    pitch: "Pro, Air, Mini, Gen. Bản Wi-Fi và 4G, ghi rõ trên từng máy.",
    image: "/products/ipadair5.png",
    href: "/ipad",
  },
];

/** Giá thấp nhất và số mẫu đang có của một dòng máy (đọc từ data/products.ts). */
function stats(category: ProductCategory) {
  const priced = products
    .filter((p) => p.category === category)
    .map((p) => priceToNumber(p.priceFrom))
    .filter((n) => n > 0);
  return {
    count: products.filter((p) => p.category === category).length,
    min: priced.length ? Math.min(...priced) : 0,
  };
}

/** Ba dòng máy Dev Pồ bán — đặt ngay dưới hero để khách biết shop không chỉ có iPhone Lock. */
export function CategoryBand() {
  return (
    <section
      id="dong-may"
      aria-labelledby="dong-may-title"
      className="scroll-mt-20 pt-section"
    >
      <div className="container-page">
        {/* <h2 id="dong-may-title" className="text-h2 mb-block text-foreground">Ba dòng máy, một cửa hàng</h2> */}
        <ul className="grid gap-4 md:grid-cols-3">
          {LINES.map((line) => {
            const { count, min } = stats(line.category);
            return (
              <li key={line.category}>
                <Link
                  href={line.href}
                  className="group grid grid-cols-[6.5rem_1fr] items-center gap-4 rounded-media bg-surface p-3 pr-5 transition-colors hover:bg-surface-strong md:grid-cols-1 md:p-5"
                >
                  <span className="relative block aspect-square overflow-hidden rounded-xl bg-surface-strong">
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 104px, 30vw"
                      className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
                        styles.blend,
                      )}
                    />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center justify-between gap-2 text-h3 text-foreground">
                      {line.name}
                      <ArrowUpRight
                        className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-caption text-pretty text-muted-foreground">
                      {line.pitch}
                    </span>
                    <span className="mt-1 font-mono text-caption font-semibold">
                      {min > 0 ? (
                        <>
                          <span className="text-price">
                            Từ {formatVND(min)}
                          </span>
                          <span className="font-sans font-normal text-muted-foreground">
                            {" "}
                            · {count} mẫu
                          </span>
                        </>
                      ) : (
                        <Placeholder hint="danh sách và giá máy Quốc tế">
                          Cần bổ sung giá
                        </Placeholder>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
