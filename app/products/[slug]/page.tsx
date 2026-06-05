import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  categoryLabel,
  getProductBySlug,
  priceToNumber,
  products,
} from "@/data/products";

// Link Messenger dùng chung toàn site (trùng với floating-contacts)
const MESSENGER_LINK =
  "https://www.facebook.com/share/1H5cf45rLH/?mibextid=wwXIfr";

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

  return {
    title: pageTitle,
    description: product.description,
    keywords: [
      product.name,
      `${product.name} giá rẻ`,
      `mua ${product.name}`,
      categoryLabel[product.category],
      "iphone lock",
      "Dev Pồ",
      "devpo",
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${pageTitle} | Dev Pồ`,
      description: product.description,
      url: `/products/${product.slug}`,
      type: "website",
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Dev Pồ`,
      description: product.description,
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
    { label: "Loại sim", value: product.simType },
    { label: "Tình trạng máy", value: product.condition },
    { label: "Tình trạng pin", value: product.battery },
    { label: "Danh mục", value: categoryLabel[product.category] },
  ];

  const siteUrl = "https://www.devpo.vn";

  // Product Schema — giúp Google hiển thị rich snippet (giá, tình trạng còn hàng)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${siteUrl}${product.image}`,
    description: product.description,
    category: categoryLabel[product.category],
    brand: { "@type": "Brand", name: "Apple" },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: priceToNumber(product.priceFrom),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Dev Pồ" },
    },
  };

  // BreadcrumbList Schema — khớp với breadcrumb UI bên dưới
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sản phẩm",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen dark:bg-background">
      <JsonLd data={[productSchema, breadcrumbSchema]} />

      <div className="container mx-auto max-w-6xl px-4 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/products"
            className="transition-colors hover:text-primary"
          >
            Sản phẩm
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground line-clamp-1">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Cột ảnh sản phẩm */}
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-slate-100 dark:bg-slate-800">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {product.badge}
                </div>
              )}
              <Image
                src={product.image}
                alt={`${product.name} ${product.storage} giá tốt tại TP.HCM - Dev Pồ`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Cột thông tin */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>{categoryLabel[product.category]}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span className="text-foreground">{product.storage}</span>
            </div>

            {/* Giá */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-red-500 sm:text-4xl">
                {product.priceFrom}
              </span>
              {product.priceOriginal && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.priceOriginal}
                </span>
              )}
            </div>

            {/* Thông số kỹ thuật */}
            <div className="mt-6 rounded-xl border border-border">
              <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
                Thông số kỹ thuật
              </h2>
              <dl className="divide-y divide-border">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="font-medium text-foreground text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Đặc điểm nổi bật */}
            <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="flex-1 font-semibold h-12 text-base"
              >
                <a
                  href={product.zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Nhắn Zalo Báo Giá
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1 font-semibold h-12 text-base"
              >
                <a
                  href={MESSENGER_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="mr-2 h-5 w-5" />
                  Chat Messenger
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
            Mô tả sản phẩm
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-muted-foreground whitespace-pre-line">
            <p>{product.description}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
