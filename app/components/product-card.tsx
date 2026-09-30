import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Price } from "@/components/ds/price";
import {
  InstallmentBadge,
  ProductBadge,
  SaleBadge,
  hasDiscount,
} from "@/components/ds/product-badge";
import {
  categoryLabel,
  ipadConnectivityLabel,
  type Product,
} from "@/data/products";

interface ProductCardProps {
  product: Product;
  /** Ảnh của 4 card đầu ở màn hình lớn nên tải ngay để cải thiện LCP */
  priority?: boolean;
  className?: string;
}

/**
 * Dòng thông số gọn hiển thị dưới tên máy.
 * iPhone: dung lượng · sim · pin. iPad: dung lượng · kết nối · Apple Pencil.
 * Tối đa 3 mục để dòng không bị xuống hàng trên màn 375px.
 */
function getCardSpecs(product: Product): string[] {
  if (product.category !== "ipad") {
    return [product.storage, product.simType, product.battery];
  }

  const connectivity = product.connectivity
    ? ipadConnectivityLabel[product.connectivity]
    : product.simType;

  const storage = product.storageOptions?.length
    ? product.storageOptions.join(" / ")
    : product.storage;

  return [storage, connectivity, product.condition];
}

/**
 * ProductCard — card sản phẩm chuẩn của toàn site.
 *
 * Bố cục lấy từ apple.com: khung ảnh vuông nền xám, máy nằm trọn bên trong
 * (object-contain) chứ không bị cắt như bản cũ dùng object-cover; phần chữ nằm
 * dưới ảnh, không viền, không bóng — để ảnh sản phẩm là thứ bắt mắt duy nhất.
 *
 * Cả card là một liên kết duy nhất: chỉ 1 điểm dừng khi đi bằng phím Tab và
 * vùng bấm trên mobile rộng bằng cả card.
 */
export function ProductCard({ product, priority, className }: ProductCardProps) {
  const specs = getCardSpecs(product);
  const discounted = hasDiscount(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col rounded-media outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className,
      )}
    >
      {/* Khung ảnh: nền xám cố định tỉ lệ 1:1 nên lưới không bị so le chiều cao */}
      <div className="media-frame aspect-square w-full">
        <Image
          src={product.image}
          alt={`${product.name} ${product.storage} chính hãng giá tốt tại Dev Pồ TP.HCM`}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, (max-width: 1279px) 30vw, 23vw"
          className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:p-7"
        />

        {/* Nhãn trạng thái — tối đa 2 nhãn để không che mất máy */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          {product.badge && <ProductBadge label={product.badge} />}
          {discounted && <SaleBadge />}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pt-3 sm:pt-4">
        <h3 className="text-h4 text-foreground transition-colors group-hover:text-foreground/70">
          {product.name}
        </h3>

        <p className="text-caption text-muted-foreground">
          {categoryLabel[product.category]} · {specs.join(" · ")}
        </p>

        <Price
          value={product.priceFrom}
          original={product.priceOriginal}
          size="sm"
          className="mt-1"
        />

        <div className="mt-auto pt-2">
          <InstallmentBadge />
        </div>
      </div>
    </Link>
  );
}
