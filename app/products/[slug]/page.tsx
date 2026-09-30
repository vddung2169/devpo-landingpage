import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Facebook, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ds/price";
import { Breadcrumbs } from "@/components/ds/breadcrumbs";
import {
  InstallmentBadge,
  ProductBadge,
  SaleBadge,
  hasDiscount,
} from "@/components/ds/product-badge";
import {
  JsonLd,
  breadcrumbSchema,
  productSchema,
} from "@/components/seo/JsonLd";
import {
  categoryLabel,
  getProductBySlug,
  priceToNumber,
  products,
} from "@/data/products";

// Link Messenger dùng chung toàn site (trùng với floating-contacts)
const MESSENGER_LINK =
  "https://www.facebook.com/share/1H5cf45rLH/?mibextid=wwXIfr";

function productSeoDescription(product: NonNullable<ReturnType<typeof getProductBySlug>>) {
  // iPad không liên quan tới sim ghép — dùng câu chốt riêng cho đúng ngữ cảnh
  const closing =
    product.category === "ipad"
      ? "máy nguyên zin, bảo hành tại cửa hàng."
      : "hỗ trợ fix lỗi sim ghép.";

  return `${product.name} ${categoryLabel[product.category]} ${product.storage}, ${product.condition}, ${product.battery}. Giá ${product.priceFrom} tại Dev Pồ TP.HCM, ${closing}`;
}

// Pre-render tất cả trang sản phẩm tại build time → tốt cho SEO & tốc độ
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

// Tạo title/description riêng cho từng sản phẩm
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm",
      description: "Sản phẩm bạn tìm không tồn tại hoặc đã ngừng kinh doanh.",
    };
  }

  // title template "%s | Dev Pồ" ở layout sẽ tự thêm đuôi " | Dev Pồ"
  const pageTitle = `${product.name} ${product.storage} - Giá ${product.priceFrom}`;
  const seoDescription = productSeoDescription(product);

  return {
    title: pageTitle,
    description: seoDescription,
    keywords: [
      product.name,
      `${product.name} giá rẻ`,
      `mua ${product.name}`,
      categoryLabel[product.category],
      ...(product.category === "ipad"
        ? ["ipad cũ giá rẻ", "máy tính bảng", `${product.name} cũ`]
        : ["iphone lock"]),
      "Dev Pồ",
      "devpo",
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${pageTitle} | Dev Pồ`,
      description: seoDescription,
      url: `/products/${product.slug}`,
      type: "website",
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Dev Pồ`,
      description: seoDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  // Bảng thông số kỹ thuật hiển thị ở cột phải
  const specs = [
    { label: "Dung lượng", value: product.storage },
    // iPad bán theo bản Wi-Fi/Cellular nên gọi là "Kết nối" cho đúng
    {
      label: product.category === "ipad" ? "Kết nối" : "Loại sim",
      value: product.simType,
    },
    { label: "Tình trạng máy", value: product.condition },
    { label: "Tình trạng pin", value: product.battery },
    { label: "Danh mục", value: categoryLabel[product.category] },
  ];

  const siteUrl = "https://www.devpo.vn";

  // Product Schema — giúp Google hiển thị rich snippet (giá, tình trạng còn hàng).
  // Dữ liệu thật từ data/products.ts; techSpecs làm phẳng thành additionalProperty.
  const productJsonLd = productSchema({
    slug: product.slug,
    name: `${product.name} ${product.storage}`,
    image: `${siteUrl}${product.image}`, // URL tuyệt đối, ảnh gốc trong /public
    description: product.description,
    storage: product.storage,
    category: categoryLabel[product.category],
    // Giá "Liên hệ" -> priceToNumber trả 0 -> builder tự bỏ offers
    priceFrom: priceToNumber(product.priceFrom),
    // Máy Likenew / 98-99% -> hàng tân trang; không có máy new seal trong data
    condition: "RefurbishedCondition",
    availability: "InStock",
    extraProperties: (product.techSpecs ?? []).flatMap((group) =>
      group.rows.map((row) => ({
        name: `${group.group} - ${row.label}`,
        value: row.value,
      })),
    ),
    // KHÔNG truyền ratingValue/reviewCount — chưa có hệ thống review thật
  });

  // BreadcrumbList Schema — khớp với breadcrumb UI bên dưới
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Trang chủ", url: siteUrl },
    { name: "Sản phẩm", url: `${siteUrl}/products` },
    { name: product.name, url: `${siteUrl}/products/${product.slug}` },
  ]);

  return (
    <main className="container-page py-section-sm">
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />

      <Breadcrumbs
        className="mb-block"
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* --- Cột ảnh: nền xám, máy nằm trọn trong khung, không bị cắt --- */}
        <div className="media-frame aspect-square w-full lg:sticky lg:top-24">
          <Image
            src={product.image}
            alt={`${product.name} ${product.storage} chính hãng giá tốt tại Dev Pồ TP.HCM`}
            fill
            priority
            sizes="(max-width: 1023px) 92vw, 46vw"
            className="object-contain p-8 sm:p-12"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.badge && <ProductBadge label={product.badge} />}
            {hasDiscount(product) && <SaleBadge />}
          </div>
        </div>

        {/* --- Cột thông tin --- */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-caption text-muted-foreground">
              {categoryLabel[product.category]} · {product.storage}
            </p>
            <h1 className="text-h1 text-balance text-foreground">
              {product.name}
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            <Price
              value={product.priceFrom}
              original={product.priceOriginal}
              size="lg"
            />
            <div>
              <InstallmentBadge />
            </div>
          </div>

          {/* Đặc điểm nổi bật */}
          <ul className="flex flex-col gap-2 text-body text-muted-foreground">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA — hai kênh chat chính của cửa hàng */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="flex-1">
              <a
                href={product.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Nhắn Zalo báo giá
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <a href={MESSENGER_LINK} target="_blank" rel="noopener noreferrer">
                <Facebook className="size-5" aria-hidden="true" />
                Chat Messenger
              </a>
            </Button>
          </div>

          {/* Thông số nhanh */}
          <div className="overflow-hidden rounded-media bg-surface">
            <h2 className="px-5 py-3 text-h4 text-foreground">
              Thông số nhanh
            </h2>
            <dl className="divide-y divide-border">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-body"
                >
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right font-medium text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* --- Cấu hình chi tiết (khi sản phẩm có techSpecs) --- */}
      {product.techSpecs && product.techSpecs.length > 0 && (
        <section className="mt-section">
          <h2 className="text-h2 mb-block text-foreground">Cấu hình chi tiết</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {product.techSpecs.map((group) => (
              <div
                key={group.group}
                className="overflow-hidden rounded-media bg-surface"
              >
                <h3 className="px-5 py-3 text-h4 text-foreground">
                  {group.group}
                </h3>
                <dl className="divide-y divide-border">
                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex gap-4 px-5 py-3 text-body"
                    >
                      <dt className="w-2/5 shrink-0 text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="flex-1 font-medium text-foreground">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Mô tả sản phẩm --- */}
      <section className="mt-section max-w-prose">
        <h2 className="text-h2 mb-block text-foreground">Mô tả sản phẩm</h2>
        <div className="rich-text whitespace-pre-line">
          <p>{product.description}</p>
        </div>
      </section>
    </main>
  );
}
