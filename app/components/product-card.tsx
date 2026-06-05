import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, type Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // 3 thông số chính hiển thị trên card (đồng nhất giữa các sản phẩm)
  const cardSpecs = [product.simType, product.condition, product.battery];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {product.badge && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 rounded-full bg-red-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
          {product.badge}
        </div>
      )}

      {/* Cả ảnh dẫn tới trang chi tiết để tăng nội dung Google index được */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        <Image
          src={product.image}
          alt={`${product.name} ${product.storage} giá tốt tại TP.HCM - Dev Pồ`}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="text-sm sm:text-lg font-bold text-foreground line-clamp-1">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-1 flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm font-medium text-muted-foreground">
          <span>{categoryLabel[product.category]}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span className="text-foreground">{product.storage}</span>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
          <span className="text-base sm:text-xl font-bold text-red-500">
            {product.priceFrom}
          </span>
          {product.priceOriginal && (
            <span className="text-[11px] sm:text-sm text-muted-foreground line-through">
              {product.priceOriginal}
            </span>
          )}
        </div>

        <hr className="my-3 sm:my-4 border-border" />

        <ul className="mb-3 sm:mb-6 flex flex-1 flex-col gap-1 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground">
          {cardSpecs.map((spec, index) => (
            <li key={index} className="flex items-start gap-1.5 sm:gap-2">
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
          <Link href={`/products/${product.slug}`}>
            Xem chi tiết
            <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
