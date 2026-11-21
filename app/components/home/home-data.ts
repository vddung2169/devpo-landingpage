// =============================================================================
// Dữ liệu riêng cho trang chủ (app/page.tsx).
// Giá máy Lock đọc thẳng từ data/products.ts; chỉ những thông tin web chưa có
// (giá Quốc tế, liên hệ, điểm đánh giá…) mới khai báo ở đây. Mục nào có
// `placeholder: true` là số TẠM, cần Dev Pồ cung cấp số thật.
// =============================================================================

/** Một dòng trong phiếu so giá ở hero */
export interface CompareModel {
  /** slug máy Lock trong data/products.ts — giá Lock, ảnh, tình trạng lấy từ đây */
  slug: string;
  /** slug máy Quốc tế cùng đời, cùng dung lượng trong data/products.ts */
  internationalSlug: string;
  /** Nhãn ngắn trên chip */
  label: string;
}

/** Giá cả hai bên đều đọc từ data/products.ts (giá Quốc tế Dun cập nhật 21/11/2026). */
export const COMPARE_MODELS: CompareModel[] = [
  { slug: "iphone-18-pro-max-lock", internationalSlug: "iphone-18-pro-max-quoc-te", label: "18 Pro Max" },
  { slug: "iphone-17-pro-max-lock", internationalSlug: "iphone-17-pro-max-quoc-te", label: "17 Pro Max" },
  { slug: "iphone-16-pro-max-lock", internationalSlug: "iphone-16-pro-max-quoc-te", label: "16 Pro Max" },
  { slug: "iphone-14-pro-max-lock", internationalSlug: "iphone-14-pro-max-quoc-te", label: "14 Pro Max" },
];

export const CONTACT = {
  /** Số chính của cửa hàng (Dun xác nhận 21/11/2026) */
  phone: "0909 097 177",
  tel: "tel:0909097177",
  zalo: "https://zalo.me/4289073059490896771",
  messenger: "https://www.messenger.com/channel/61576332353912",
  facebook: "https://www.facebook.com/share/1H5cf45rLH/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@devpo_iphone",
  youtube: "https://youtube.com/@devpo-iphonehcm",
  address: "3/39A Bình Giã, Phường Tân Bình, TP.HCM",
  maps: "https://maps.app.goo.gl/nerdwNtA6Q3Qv45j7",
};

/** Lời khách — đang là chỗ trống, chờ trích từ Google Maps / Facebook */
export const REVIEW_QUOTES = [
  {
    id: "q1",
    text: "Lời nhận xét thật của khách, lấy từ Google Maps hoặc Facebook.",
    who: "Tên khách",
    detail: "iPhone 16 Pro Max Lock",
  },
  {
    id: "q2",
    text: "Câu nhận xét thứ hai, ưu tiên khách ở tỉnh mua qua ship.",
    who: "Tên khách",
    detail: "Đà Nẵng",
  },
];

/** Toàn bộ ảnh khách trong public/feedback (giống dải ảnh trang chủ cũ) */
export const FEEDBACK_PHOTOS = [
  "IMG_3592",
  "IMG_3593",
  "IMG_3594",
  "IMG_3595",
  "IMG_3596",
  "IMG_3597",
  "IMG_3598",
  "IMG_3599",
  "IMG_3600",
  "IMG_3601",
  "IMG_3602",
  "IMG_3603",
  "IMG_3604",
  "IMG_3605",
  "IMG_3606",
  "IMG_3607",
  "IMG_3608",
  "IMG_3609",
  "IMG_2326",
  "IMG_2751",
  "IMG_2855",
  "IMG_2856",
  "IMG_2857",
  "IMG_2858",
  "IMG_2859",
  "IMG_2860",
  "IMG_2862",
  "IMG_2863",
  "IMG_2864",
  "IMG_2865",
  "IMG_2866",
  "IMG_2911",
  "IMG_2954",
  "IMG_2955",
  "IMG_2956",
  "IMG_2961",
];

export const VIDEO_PICKS = [
  {
    id: "v1",
    title: "Thông tin về iPhone Lock năm 2026",
    image: "/tiktok-videos/image1.png",
    url: "https://vt.tiktok.com/ZGduqTg8w/",
  },
  {
    id: "v2",
    title: "Giải đáp 999 câu hỏi về iPhone Lock",
    image: "/tiktok-videos/image3.png",
    url: "https://vt.tiktok.com/ZGduqE1jj/",
  },
  {
    id: "v3",
    title: "Fix lỗi iPhone Lock EID mới",
    image: "/tiktok-videos/image4.png",
    url: "https://vt.tiktok.com/ZGdasxNv2/",
  },
];

/** Các công cụ và dịch vụ hỗ trợ đang có trên web */
export const TOOLS = [
  {
    id: "tra-gop",
    group: "buy",
    title: "Tính trả góp",
    desc: "Ước tính trả trước, góp mỗi tháng và tổng tiền cho máy bạn chọn.",
    href: "/cong-cu-mua-iphone/tra-gop",
  },
  {
    id: "tu-van",
    group: "buy",
    title: "Tư vấn chọn máy",
    desc: "Trả lời 3 câu hỏi, nhận gợi ý đời iPhone hợp nhu cầu và ngân sách.",
    href: "/cong-cu-mua-iphone/tu-van-may",
  },
  {
    id: "fix",
    group: "care",
    title: "Fix lỗi iPhone Lock",
    desc: "Không dịch vụ, không nhận sim, lỗi sim ghép sau khi cập nhật iOS.",
    href: "/fix-loi",
  },
  {
    id: "mdm",
    group: "care",
    title: "Bypass MDM",
    desc: "Gỡ khoá quản lý từ xa (MDM) trên iPhone, iPad doanh nghiệp.",
    href: "/cong-cu-mua-iphone/bypass-mdm",
  },
  {
    id: "imsi",
    group: "care",
    title: "Mã IMSI nhà mạng",
    desc: "Tra mã IMSI, GID của AT&T, Verizon, Softbank… để ghép sim đúng.",
    href: "/imsi-codes",
  },
] as const;

/** 6 câu hỏi khách hay nhắn nhất. `placeholder` = câu trả lời đang chờ bổ sung */
export const TOP_FAQS = [
  {
    q: "iPhone Lock có dùng được sim Việt Nam không?",
    a: "Dùng được bình thường như máy Quốc tế: nghe gọi, nhắn tin, 4G/5G như máy Quốc tế. Không giới hạn bất cứ tính năng gì",
  },
  {
    q: "Cập nhật iOS xong bị mất sóng thì sao?",
    a: "Bên shop có sẵn cẩm nang fix lỗi làm online tại nhà luôn, Dev Pồ xử lý miễn phí trọn đời máy.",
  },
  {
    q: "Mua online có được kiểm tra máy trước không?",
    a: "Có luôn ạ, Dev Pồ gửi video máy thật trước khi chốt, và bạn kiểm tra máy khi nhận hàng.",
  },
  {
    q: "Có trả góp không?",
    a: "Có trả góp 0% qua thẻ tín dụng và các app tài chính. Nhắn Zalo để được tính gói phù hợp.",
  },
  {
    q: "Làm sao kiểm tra máy là hàng zin?",
    a: "Ở cửa hàng, kỹ thuật kiểm tra IMEI, iCloud, MDM và tình trạng máy cùng bạn trước khi thanh toán. Mua online thì Dev Pồ gửi video kiểm tra máy thật.",
  },
];
