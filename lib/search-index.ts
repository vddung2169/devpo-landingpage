// =============================================================================
// Chỉ mục tìm kiếm toàn trang (global search) cho devpo.vn
// Gom mọi nội dung có thể tìm kiếm — sản phẩm, bài cẩm nang và các trang tĩnh —
// về một mảng phẳng để component GlobalSearch lọc phía client.
// Dữ liệu build sẵn tại module-load nên tìm kiếm chạy tức thì, không cần API.
// =============================================================================

import { products, categoryLabel } from "@/data/products";
import { guides, guideCategoryLabel } from "@/data/guides";

export type SearchDocType = "product" | "guide" | "page";

export interface SearchDoc {
  /** Khoá duy nhất để React render + cmdk value */
  id: string;
  type: SearchDocType;
  /** Tiêu đề hiển thị */
  title: string;
  /** Dòng phụ hiển thị bên dưới tiêu đề (giá, nhóm bài, mô tả trang…) */
  subtitle: string;
  /** Đường dẫn điều hướng khi chọn */
  href: string;
  /** Chuỗi đã chuẩn hoá (không dấu) để so khớp — không hiển thị */
  haystack: string;
}

/**
 * Chuẩn hoá chuỗi tiếng Việt để so khớp không phân biệt dấu / hoa-thường:
 * bỏ dấu thanh, đổi đ → d, gộp khoảng trắng. Nhờ vậy gõ "cam nang" vẫn ra
 * "Cẩm nang", "iphone 17" vẫn ra "iPhone 17 Pro Max".
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu thanh
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

// Các trang tĩnh quan trọng — để người dùng nhảy nhanh tới điểm đến
const staticPages: Omit<SearchDoc, "haystack">[] = [
  {
    id: "page-home",
    type: "page",
    title: "Trang chủ",
    subtitle: "Dev Pồ — iPhone Lock & Quốc tế uy tín",
    href: "/",
  },
  {
    id: "page-products",
    type: "page",
    title: "Sản phẩm nổi bật",
    subtitle: "Danh sách iPhone Lock, Quốc tế và iPad",
    href: "/featured-products",
  },
  {
    id: "page-guides",
    type: "page",
    title: "Cẩm nang iPhone",
    subtitle: "Bài viết hướng dẫn, so sánh, thủ thuật",
    href: "/guides",
  },
  {
    id: "page-imsi",
    type: "page",
    title: "Mã IMSI nhà mạng",
    subtitle: "Bảng mã IMSI, TMSI, GID fix lỗi iPhone Lock",
    href: "/imsi-codes",
  },
  {
    id: "page-tools",
    type: "page",
    title: "Công cụ mua iPhone",
    subtitle: "Máy tính trả góp & quiz chọn máy",
    href: "/cong-cu-mua-iphone",
  },
];

/** Xây một tài liệu tìm kiếm kèm haystack đã chuẩn hoá từ các trường liên quan. */
function toDoc(
  base: Omit<SearchDoc, "haystack">,
  extraKeywords: string[] = [],
): SearchDoc {
  const haystack = normalize(
    [base.title, base.subtitle, ...extraKeywords].join(" "),
  );
  return { ...base, haystack };
}

// Chỉ mục dựng sẵn 1 lần khi import module
export const searchIndex: SearchDoc[] = [
  ...products.map((p) =>
    toDoc(
      {
        id: `product-${p.slug}`,
        type: "product",
        title: p.name,
        subtitle: `${categoryLabel[p.category]} · ${p.storage} · ${p.priceFrom}`,
        href: `/products/${p.slug}`,
      },
      [p.storage, p.simType, p.condition, p.description, ...p.features],
    ),
  ),
  ...guides.map((g) =>
    toDoc(
      {
        id: `guide-${g.slug}`,
        type: "guide",
        title: g.title,
        subtitle: `${guideCategoryLabel[g.category]} · ${g.readingTime} phút đọc`,
        href: `/guides/${g.slug}`,
      },
      [g.excerpt, ...g.tags],
    ),
  ),
  ...staticPages.map((p) => toDoc(p)),
];

export interface SearchResult extends SearchDoc {
  score: number;
}

/**
 * Lọc chỉ mục theo truy vấn (không phân biệt dấu). Mọi từ khoá đều phải xuất
 * hiện trong haystack (AND). Điểm số ưu tiên trùng ở tiêu đề và trùng đầu chuỗi
 * để kết quả liên quan nhất nổi lên trên.
 */
export function searchDocs(query: string, limit = 8): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);

  const results: SearchResult[] = [];
  for (const doc of searchIndex) {
    if (!tokens.every((t) => doc.haystack.includes(t))) continue;

    const title = normalize(doc.title);
    let score = 0;
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 40;
    // thưởng thêm khi tiêu đề bắt đầu bằng từ khoá đầu tiên
    if (tokens[0] && title.startsWith(tokens[0])) score += 15;
    // ưu tiên nhẹ trang tĩnh & sản phẩm hơn bài viết dài
    if (doc.type === "page") score += 5;

    results.push({ ...doc, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
