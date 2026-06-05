// =============================================================================
// Nguồn dữ liệu sản phẩm tập trung cho devpo.vn
// Mỗi sản phẩm có 1 slug riêng để render trang chi tiết /products/[slug] (tốt cho SEO).
// File này là "single source of truth" — trang chủ, trang danh sách và trang chi tiết
// đều đọc dữ liệu từ đây.
// =============================================================================

export type ProductCategory = "lock" | "quocte" | "ipad";

export type ProductBadge = "Hot Nhất" | "Bán Chạy" | "Mới Về";

export interface Product {
  /** ID số, dùng cho key và sắp xếp */
  id: number;
  /** Định danh trên URL: /products/[slug] */
  slug: string;
  /** Tên hiển thị đầy đủ */
  name: string;
  /** Nhóm sản phẩm dùng cho bộ lọc */
  category: ProductCategory;
  /** Nhãn nổi bật góc ảnh (tùy chọn) */
  badge?: ProductBadge;
  /** Giá bán hiển thị, ví dụ "Từ 25.590.000đ" */
  priceFrom: string;
  /** Giá gốc gạch ngang, ví dụ "28.500.000đ" (tùy chọn) */
  priceOriginal?: string;
  /** Dung lượng, ví dụ "256GB" */
  storage: string;
  /** Loại sim, ví dụ "2 sim 2 sóng" / "2 sim vật lý" */
  simType: string;
  /** Tình trạng hình thức máy, ví dụ "Likenew / Newbody / Fullbox" */
  condition: string;
  /** Tình trạng pin, ví dụ "Pin 100%" */
  battery: string;
  /** Đường dẫn ảnh trong /public */
  image: string;
  /** Link nhắn Zalo báo giá */
  zaloLink: string;
  /** Mô tả dài (SEO + hiển thị trang chi tiết) */
  description: string;
  /** Các điểm nổi bật / đặc điểm sản phẩm */
  features: string[];
}

/** Link liên hệ dùng chung */
export const ZALO_LINK = "https://zalo.me/4289073059490896771";

/** Nhãn hiển thị cho từng category */
export const categoryLabel: Record<ProductCategory, string> = {
  lock: "iPhone Lock",
  quocte: "iPhone Quốc tế",
  ipad: "iPad",
};

/** Danh sách tab dùng cho bộ lọc (UI) */
export const productCategories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "lock", label: "iPhone Lock" },
  { value: "quocte", label: "iPhone Quốc tế" },
  { value: "ipad", label: "iPad" },
];

// -----------------------------------------------------------------------------
// 4 sản phẩm chủ lực — mô tả & đặc điểm viết tay, tối ưu SEO
// -----------------------------------------------------------------------------
const detailedProducts: Product[] = [
  {
    id: 1,
    slug: "iphone-17-pro-max-lock",
    name: "iPhone 17 Pro Max Lock",
    category: "lock",
    badge: "Mới Về",
    priceFrom: "Từ 25.590.000đ",
    priceOriginal: "28.500.000đ",
    storage: "256GB",
    simType: "2 sim 2 sóng",
    condition: "Likenew / Newbody / Fullbox",
    battery: "Pin 100%",
    image: "/products/17promax.png",
    zaloLink: ZALO_LINK,
    description:
      "iPhone 17 Pro Max Lock 256GB là siêu phẩm cao cấp nhất nhà Apple với mức giá Lock cực hời tại Dev Pồ. Máy Likenew / Newbody / Fullbox, pin 100%, đã fix lỗi sim ghép chạy 2 sim 2 sóng ổn định như máy quốc tế. Màn hình lớn sắc nét, chip A19 Pro mạnh mẽ, cụm camera nâng cấp cho trải nghiệm quay chụp đỉnh cao. Bảo hành trọn đời lỗi sim ghép, cam kết giá tốt nhất thị trường TP. Hồ Chí Minh.",
    features: [
      "Màn hình Super Retina XDR ProMotion 120Hz siêu mượt",
      "Chip A19 Pro mạnh mẽ, chiến mọi tựa game nặng",
      "Cụm camera Pro 48MP, quay video 4K chuyên nghiệp",
      "2 sim 2 sóng — đã fix lỗi sim ghép, dùng ổn định",
      "Máy Likenew / Newbody / Fullbox, pin 100%",
      "Bảo hành trọn đời lỗi sim ghép tại Dev Pồ",
    ],
  },
  {
    id: 2,
    slug: "iphone-17-pro-lock",
    name: "iPhone 17 Pro Lock",
    category: "lock",
    badge: "Hot Nhất",
    priceFrom: "Từ 22.590.000đ",
    priceOriginal: "25.000.000đ",
    storage: "256GB",
    simType: "2 sim 2 sóng",
    condition: "Likenew / Newbody / Fullbox",
    battery: "Pin 100%",
    image: "/products/17promax.png",
    zaloLink: ZALO_LINK,
    description:
      "iPhone 17 Pro Lock 256GB — lựa chọn flagship gọn gàng với hiệu năng đỉnh cao và mức giá Lock tiết kiệm hàng triệu đồng so với bản quốc tế. Máy Likenew / Newbody / Fullbox, pin 100%, đã fix lỗi sim ghép chạy 2 sim 2 sóng mượt mà. Thiết kế khung titan sang trọng, camera Pro sắc nét. Mua tại Dev Pồ được bảo hành trọn đời lỗi sim ghép, hỗ trợ lên đời nhanh chóng.",
    features: [
      "Thiết kế khung titan cao cấp, cầm chắc tay",
      "Chip A19 Pro, hiệu năng hàng đầu phân khúc",
      "Camera Pro 48MP sắc nét, zoom quang học",
      "2 sim 2 sóng — đã fix lỗi sim ghép, dùng ổn định",
      "Máy Likenew / Newbody / Fullbox, pin 100%",
      "Bảo hành trọn đời lỗi sim ghép tại Dev Pồ",
    ],
  },
  {
    id: 3,
    slug: "iphone-16-pro-max-lock",
    name: "iPhone 16 Pro Max Lock",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 17.990.000đ",
    priceOriginal: "20.990.000đ",
    storage: "256GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 99%",
    battery: "Pin 100%",
    image: "/products/16promax.png",
    zaloLink: ZALO_LINK,
    description:
      "iPhone 16 Pro Max Lock 256GB là chiếc máy bán chạy nhất tại Dev Pồ nhờ mức giá cực tốt mà vẫn giữ trọn trải nghiệm flagship. Máy 2 sim vật lý, hình thức 99% như mới, pin 100%. Màn hình lớn, chip A18 Pro mạnh mẽ, camera đa năng cho mọi nhu cầu. Bảo hành trọn đời lỗi sim ghép, cam kết hàng nguyên zin nguyên bản, giá tốt nhất TP. Hồ Chí Minh.",
    features: [
      "Màn hình lớn 6.9 inch ProMotion 120Hz",
      "Chip A18 Pro mượt mà, tiết kiệm pin",
      "Camera Pro 48MP, nút Camera Control tiện lợi",
      "2 sim vật lý — máy nguyên zin nguyên bản",
      "Hình thức 99% như mới, pin 100%",
      "Bảo hành trọn đời lỗi sim ghép tại Dev Pồ",
    ],
  },
  {
    id: 4,
    slug: "iphone-16-pro-lock",
    name: "iPhone 16 Pro Lock",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 15.490.000đ",
    priceOriginal: "17.990.000đ",
    storage: "256GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x-100%",
    image: "/products/16promax.png",
    zaloLink: ZALO_LINK,
    description:
      "iPhone 16 Pro Lock 256GB mang đến trải nghiệm Pro trọn vẹn trong thân máy nhỏ gọn, giá Lock cực hấp dẫn. Máy 2 sim vật lý, hình thức 98-99%, pin 9x-100%. Khung titan bền bỉ, chip A18 Pro hiệu năng cao, camera Pro sắc nét. Mua tại Dev Pồ được bảo hành trọn đời lỗi sim ghép, hỗ trợ trả góp và giao hàng toàn quốc.",
    features: [
      "Khung titan nhẹ và bền, thiết kế cao cấp",
      "Chip A18 Pro hiệu năng cao, chơi game tốt",
      "Camera Pro 48MP, nút Camera Control",
      "2 sim vật lý — máy nguyên zin nguyên bản",
      "Hình thức 98-99%, pin 9x-100%",
      "Bảo hành trọn đời lỗi sim ghép tại Dev Pồ",
    ],
  },
];

// -----------------------------------------------------------------------------
// Các sản phẩm còn lại — dữ liệu chuyển từ kho hiện có, mô tả/đặc điểm tạo tự động
// -----------------------------------------------------------------------------
type DerivedInput = Omit<Product, "zaloLink" | "description" | "features">;

const derivedInputs: DerivedInput[] = [
  {
    id: 5,
    slug: "iphone-15-pro-max-lock",
    name: "iPhone 15 Pro Max",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 14.990.000đ",
    priceOriginal: "17.000.000đ",
    storage: "256GB / 512GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/15promax.png",
  },
  {
    id: 6,
    slug: "iphone-17-lock",
    name: "iPhone 17",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 16.990.000đ",
    priceOriginal: "18.000.000đ",
    storage: "256GB",
    simType: "2 sim vật lý",
    condition: "Likenew / Newbody",
    battery: "Pin 100%",
    image: "/products/iphone17.png",
  },
  {
    id: 7,
    slug: "iphone-17-air-lock",
    name: "iPhone 17 Air",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 16.990.000đ",
    priceOriginal: "17.000.000đ",
    storage: "256GB",
    simType: "Nguyên bản",
    condition: "Likenew / Newbody",
    battery: "Pin 100%",
    image: "/products/iphone17air.png",
  },
  {
    id: 8,
    slug: "iphone-16-lock",
    name: "iPhone 16",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 10.990.000đ",
    priceOriginal: "11.900.000đ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Likenew",
    battery: "Pin 9x-100%",
    image: "/products/iphone16.png",
  },
  {
    id: 9,
    slug: "iphone-16-plus-lock",
    name: "iPhone 16 Plus",
    category: "lock",
    priceFrom: "Từ 11.990.000đ",
    priceOriginal: "13.900.000đ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x-100%",
    image: "/products/iphone16.png",
  },
  {
    id: 10,
    slug: "iphone-15-plus-lock",
    name: "iPhone 15 Plus",
    category: "lock",
    priceFrom: "Từ 9.690.000đ",
    priceOriginal: "11.900.000đ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x-100%",
    image: "/products/iphone15.png",
  },
  {
    id: 11,
    slug: "iphone-15-lock",
    name: "iPhone 15",
    category: "lock",
    priceFrom: "Từ 8.690.000đ",
    priceOriginal: "10.900.000đ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x-100%",
    image: "/products/iphone15.png",
  },
  {
    id: 12,
    slug: "iphone-14-pro-max-lock",
    name: "iPhone 14 Pro Max",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 11.990.000đ",
    priceOriginal: "12.900.000đ",
    storage: "128GB / 256GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone14promax.png",
  },
  {
    id: 13,
    slug: "iphone-14-pro-lock",
    name: "iPhone 14 Pro",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 9.990.000đ",
    priceOriginal: "11.900.000đ",
    storage: "128GB / 256GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone14promax.png",
  },
  {
    id: 14,
    slug: "iphone-13-pro-max-lock",
    name: "iPhone 13 Pro Max",
    category: "lock",
    priceFrom: "Từ 8.490.000đ",
    priceOriginal: "9.900.000đ",
    storage: "128GB / 256GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone13promax.png",
  },
  {
    id: 15,
    slug: "iphone-14-plus-lock",
    name: "iPhone 14 Plus",
    category: "lock",
    badge: "Bán Chạy",
    priceFrom: "Từ 7.490.000đ",
    priceOriginal: "8.900.000đ",
    storage: "128GB / 256GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone14.png",
  },
  {
    id: 16,
    slug: "iphone-14-lock",
    name: "iPhone 14",
    category: "lock",
    priceFrom: "Từ 6.490.000đ",
    priceOriginal: "7.900.000đ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone14.png",
  },
  {
    id: 17,
    slug: "iphone-13-lock",
    name: "iPhone 13",
    category: "lock",
    priceFrom: "Từ 5.490.000đ",
    priceOriginal: "6.900.000đ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone13.png",
  },
  {
    id: 18,
    slug: "iphone-12-pro-max-lock",
    name: "iPhone 12 Pro Max",
    category: "lock",
    priceFrom: "Từ 7.490.000đ",
    priceOriginal: "8.900.000đ",
    storage: "128GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone12promax.png",
  },
  {
    id: 19,
    slug: "ipad-gen-7",
    name: "iPad Gen 7",
    category: "ipad",
    priceFrom: "Từ 3.490.000đ",
    priceOriginal: "4.900.000đ",
    storage: "32GB - 4G",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-9x%",
    image: "/products/ipadgen7.png",
  },
  {
    id: 20,
    slug: "ipad-pro-2020-11-inch",
    name: "iPad Pro 2020 11 inch",
    category: "ipad",
    priceFrom: "Từ 12.290.000đ",
    priceOriginal: "13.890.000đ",
    storage: "128GB - 4G",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadpro2020.png",
  },
  {
    id: 21,
    slug: "ipad-air-4",
    name: "iPad Air 4",
    category: "ipad",
    badge: "Bán Chạy",
    priceFrom: "Từ 7.390.000đ",
    priceOriginal: "8.890.000đ",
    storage: "64GB / 256GB - Wifi / 4G",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-9x%",
    image: "/products/ipadair4.png",
  },
];

const derivedProducts: Product[] = derivedInputs.map((p) => ({
  ...p,
  zaloLink: ZALO_LINK,
  description: `${p.name} ${categoryLabel[p.category]} chính hãng tại Dev Pồ — máy nguyên zin nguyên bản, ${p.storage}, ${p.simType}, ${p.condition}, ${p.battery}. Đã fix lỗi sim ghép sử dụng ổn định, bảo hành trọn đời, cam kết giá tốt nhất thị trường TP. Hồ Chí Minh. Liên hệ Zalo để được báo giá chi tiết và tư vấn lên đời nhanh chóng.`,
  features: [
    p.simType,
    p.condition,
    p.battery,
    "Đã fix lỗi sim ghép, sử dụng ổn định",
    "Bảo hành trọn đời lỗi sim ghép tại Dev Pồ",
    "Giao hàng toàn quốc, hỗ trợ trả góp 0%",
  ],
}));

/** Toàn bộ danh mục sản phẩm (giữ thứ tự theo id) */
export const products: Product[] = [...detailedProducts, ...derivedProducts];

/** Tìm sản phẩm theo slug — dùng cho trang chi tiết */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Lấy giá trị số từ chuỗi giá ("Từ 25.590.000đ" -> 25590000) — phục vụ JSON-LD/SEO */
export function priceToNumber(price: string): number {
  return Number(price.replace(/\D/g, "")) || 0;
}
