// =============================================================================
// JSON-LD Structured Data cho Dev Pồ (devpo.vn) — Next.js App Router.
//
// CÁCH DÙNG:
//  - app/layout.tsx      -> <JsonLd data={[storeSchema, websiteSchema]} /> (site-wide)
//  - app/page.tsx        -> FAQPage schema KHÔNG đặt ở đây: components/FaqSection.tsx
//                           tự sinh schema từ đúng mảng câu hỏi đang hiển thị
//                           (single source of truth — Google yêu cầu khớp text).
//  - app/products/[slug] -> <JsonLd data={[productSchema({...}), breadcrumbSchema([...])]} />
// =============================================================================

const SITE_URL = "https://www.devpo.vn";
const STORE_ID = `${SITE_URL}/#store`; // để Product tham chiếu tới seller

// ---------- Component render an toàn ----------
// Truyền vào 1 object schema.org (hoặc mảng object) -> render <script type="application/ld+json">.
// Dùng được trong Server Component (không cần "use client").
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // escape "<" để tránh đóng thẻ script sớm / XSS
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// =============================================================================
// 1) ELECTRONICS STORE / LOCAL BUSINESS — đặt SITE-WIDE trong app/layout.tsx
//    Giúp lên Google Maps / local pack khi khách search "mua iphone lock Tân Bình".
//    KHÔNG có aggregateRating — chỉ thêm khi có hệ thống review thật.
// =============================================================================
export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  "@id": STORE_ID,
  name: "Dev Pồ - DevpoStore",
  alternateName: "Dev Pồ",
  description:
    "Cửa hàng chuyên iPhone Lock, iPhone Quốc tế và iPad giá tốt tại TP.HCM. Máy zin nguyên bản, hỗ trợ fix lỗi sim ghép và bảo hành trọn đời.",
  url: SITE_URL,
  logo: `${SITE_URL}/devpo_logo.jpg`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "+84399208037",
  // Số phụ – khai báo thêm qua contactPoint
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+84399208037",
      contactType: "sales",
      areaServed: "VN",
      availableLanguage: ["vi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+84909097177",
      contactType: "customer support",
      areaServed: "VN",
      availableLanguage: ["vi"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "3/39A Bình Giã, Phường Tân Bình",
    addressLocality: "Thành phố Hồ Chí Minh",
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.7995418,
    longitude: 106.641098,
  },
  hasMap: "https://www.google.com/maps?cid=0xaf29110ccb4bcf5d",
  // Giờ mở cửa thực tế: 9h–21h, cả tuần
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  priceRange: "10.000.000đ - 30.000.000đ",
  currenciesAccepted: "VND",
  paymentAccepted: "Tiền mặt, Chuyển khoản, Trả góp 0%",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61576332353912",
    "https://www.instagram.com/dev_po2002",
    "https://www.tiktok.com/@devpo_iphone",
    "https://youtube.com/@devpo-iphonehcm",
    "https://www.threads.com/@dev_po2002",
  ],
};

// =============================================================================
// 2) WEBSITE — đặt SITE-WIDE trong app/layout.tsx
// =============================================================================
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Dev Pồ - DevpoStore",
  url: SITE_URL,
  inLanguage: "vi-VN",
  publisher: { "@id": STORE_ID },
  // Tìm kiếm trên site hiện là client-side (⌘K, không có route /search?q=...).
  // Nếu sau này có trang kết quả tìm kiếm dạng URL thì bật lại khối dưới:
  // potentialAction: {
  //   "@type": "SearchAction",
  //   target: {
  //     "@type": "EntryPoint",
  //     urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
  //   },
  //   "query-input": "required name=search_term_string",
  // },
};

// =============================================================================
// 3) PRODUCT + OFFER — builder dùng cho app/products/[slug]/page.tsx
//    Gọi với dữ liệu thật từ data/products.ts.
// =============================================================================
type ProductInput = {
  slug: string;
  name: string; // "iPhone 17 Pro Max Lock 256GB"
  image: string | string[]; // URL tuyệt đối (https://www.devpo.vn/...)
  description: string;
  storage: string; // giữ nguyên chuỗi hiển thị: "256GB", "128GB / 256GB"...
  category?: string; // "iPhone Lock" / "iPhone Quốc tế" / "iPad"
  priceFrom?: number; // giá "Từ ..." dạng số: 25590000; bỏ trống/0 = giá "Liên hệ"
  priceTo?: number; // giá trần nếu có nhiều biến thể
  sku?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  condition?: "NewCondition" | "RefurbishedCondition" | "UsedCondition";
  // Thông số kỹ thuật bổ sung (đã làm phẳng từ techSpecs)
  extraProperties?: { name: string; value: string }[];
  ratingValue?: number; // CHỈ thêm khi có review THẬT
  reviewCount?: number;
};

export function productSchema(p: ProductInput) {
  const images = Array.isArray(p.image) ? p.image : [p.image];
  const hasPrice = typeof p.priceFrom === "number" && p.priceFrom > 0;
  const hasRange =
    hasPrice && typeof p.priceTo === "number" && p.priceTo > (p.priceFrom as number);

  // Giá "Liên hệ" (không có số) -> bỏ hẳn offers, không emit price: 0
  const offers = !hasPrice
    ? undefined
    : hasRange
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "VND",
          lowPrice: p.priceFrom,
          highPrice: p.priceTo,
          offerCount: 1,
          availability: `https://schema.org/${p.availability ?? "InStock"}`,
          seller: { "@id": STORE_ID },
        }
      : {
          "@type": "Offer",
          url: `${SITE_URL}/products/${p.slug}`,
          priceCurrency: "VND",
          price: p.priceFrom,
          priceValidUntil: "2026-12-31", // TODO: cập nhật định kỳ
          itemCondition: `https://schema.org/${p.condition ?? "RefurbishedCondition"}`,
          availability: `https://schema.org/${p.availability ?? "InStock"}`,
          seller: { "@id": STORE_ID },
        };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/products/${p.slug}/#product`,
    name: p.name,
    image: images,
    description: p.description,
    sku: p.sku ?? p.slug,
    brand: { "@type": "Brand", name: "Apple" },
    category: p.category ?? "iPhone",
    additionalProperty: [
      { "@type": "PropertyValue", name: "Dung lượng", value: p.storage },
      ...(p.extraProperties ?? []).map((prop) => ({
        "@type": "PropertyValue",
        name: prop.name,
        value: prop.value,
      })),
    ],
    ...(offers ? { offers } : {}),
  };

  // CHỈ thêm rating khi có review thật (Google phạt nếu bịa)
  if (p.ratingValue && p.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.ratingValue,
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

// =============================================================================
// 4) BREADCRUMB — builder cho các trang con (sản phẩm, cẩm nang...)
//    Ví dụ: breadcrumbSchema([
//      { name: "Trang chủ", url: SITE_URL },
//      { name: "Sản phẩm", url: `${SITE_URL}/products` },
//      { name: "iPhone 17 Pro Max Lock", url: `${SITE_URL}/products/iphone-17-pro-max-lock` },
//    ])
// =============================================================================
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
