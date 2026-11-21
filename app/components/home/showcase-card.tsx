import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";
import { priceToNumber } from "@/data/products";
import { cn, formatVND } from "@/lib/utils";
import styles from "./home.module.css";

/** Thẻ máy: ảnh trên nền xám, tên, thông số gọn, giá đỏ và số tiền rẻ hơn. */
export function ShowcaseCard({ product, priority }: { product: Product; priority?: boolean }) {
  const now = priceToNumber(product.priceFrom);
  const was = product.priceOriginal ? priceToNumber(product.priceOriginal) : 0;
  const saving = was > now && now > 0 ? was - now : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group flex min-w-0 flex-col">
      <div className="relative aspect-square overflow-hidden rounded-media bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 767px) 46vw, (max-width: 1151px) 30vw, 22vw"
          className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.04]", styles.blend)}
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background px-2.5 py-0.5 text-[0.6875rem] font-semibold">
            {product.badge}
          </span>
        )}
      </div>
      <h3 className="mt-3.5 text-base font-semibold tracking-tight text-foreground">{product.name}</h3>
      <p className="mt-0.5 text-caption text-muted-foreground">
        {product.storage} · {product.battery}
      </p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono">
        <span className="text-[clamp(0.9375rem,0.85rem+0.3vw,1.0625rem)] font-semibold tracking-tight text-price">
          {now > 0 ? product.priceFrom : "Liên hệ"}
        </span>
        {saving > 0 && <span className="text-caption text-price-strike line-through">{product.priceOriginal}</span>}
      </p>
      {saving >= 500000 && <p className="mt-1 text-[0.75rem] font-semibold text-sale-ink">Rẻ hơn {formatVND(saving)}</p>}
    </Link>
  );
}
