// =============================================================================
// Dữ liệu chiến dịch đặt cọc iPhone 18 series (18 Pro / 18 Pro Max / iPhone Duo).
//
// ⚠️ ĐÂY LÀ NƠI DUY NHẤT CẦN SỬA KHI GIÁ HOẶC ƯU ĐÃI THAY ĐỔI.
// Sửa ở đây là bảng giá, JSON-LD, metadata và nút CTA tự cập nhật theo.
// Giá niêm yết cập nhật ngày 12/09/2026.
// =============================================================================

export interface StorageOption {
  /** Dung lượng hiển thị, VD "256GB" */
  size: string;
  /** Giá niêm yết (VNĐ) */
  listPrice: number;
  /**
   * Giá còn tuỳ phiên bản (bảng gốc ghi "GIÁ CUỐI TỪ").
   * Hiện trang chỉ hiện giá niêm yết cố định nên chưa dùng tới — giữ lại để
   * bật lại ngay khi cần hiển thị giá sau ưu đãi.
   */
  isFrom?: boolean;
  /**
   * Ảnh sản phẩm trong /public.
   * TẠM THỜI null -> card render khung placeholder.
   * Có ảnh thật chỉ cần điền, VD "/products/18promax-256.png".
   */
  image?: string | null;
}

export interface PhoneModel {
  id: string;
  /** Tên đầy đủ dùng trong tiêu đề card, tin nhắn Zalo, JSON-LD */
  name: string;
  /** Nhãn ngắn hiển thị trên tab */
  tabLabel: string;
  /** Màu nền placeholder cho ảnh sản phẩm của dòng này */
  accent: string;
  storages: StorageOption[];
}

export const MODELS: PhoneModel[] = [
  {
    id: "18-pro-max",
    name: "iPhone 18 Pro Max",
    tabLabel: "iPhone 18 Pro Max",
    accent: "#6B2436",
    // Tạm dùng chung bộ ảnh của iPhone 18 Pro cho tới khi có ảnh riêng bản Max
    storages: [
      { size: "256GB", listPrice: 41_990_000, image: "/products/18pro-1.png" },
      { size: "512GB", listPrice: 48_490_000, image: "/products/18pro-2.png" },
      { size: "1TB", listPrice: 61_490_000, image: "/products/18pro-3.png" },
      { size: "2TB", listPrice: 80_990_000, image: "/products/18pro-4.png" },
    ],
  },
  {
    id: "18-pro",
    name: "iPhone 18 Pro",
    tabLabel: "iPhone 18 Pro",
    accent: "#3A4A63",
    storages: [
      { size: "256GB", listPrice: 38_990_000, image: "/products/18pro-1.png" },
      { size: "512GB", listPrice: 45_490_000, image: "/products/18pro-2.png" },
      { size: "1TB", listPrice: 58_490_000, image: "/products/18pro-3.png" },
      { size: "2TB", listPrice: 77_990_000, image: "/products/18pro-4.png" },
    ],
  },
  {
    id: "duo",
    name: "iPhone Duo",
    tabLabel: "iPhone Duo",
    accent: "#8A8F98",
    // Mới có 2 ảnh Duo nên dùng xen kẽ cho 4 phiên bản
    storages: [
      { size: "256GB", listPrice: 64_990_000, isFrom: true, image: "/products/duo1.png" },
      { size: "512GB", listPrice: 71_490_000, isFrom: true, image: "/products/duo2.png" },
      { size: "1TB", listPrice: 84_490_000, image: "/products/duo1.png" },
      { size: "2TB", listPrice: 103_990_000, image: "/products/duo2.png" },
    ],
  },
];

export interface Promo {
  label: string;
  value: number;
  note: string;
}

/**
 * Các khoản ưu đãi cộng dồn để ra "giá cuối".
 * Mỗi khoản là mức TỐI ĐA — khách đủ điều kiện mới hưởng trọn, nên phần hiển
 * thị luôn ghi rõ "tối đa".
 *
 * Lưu ý: KHÔNG tính "thu cũ đổi mới" trong bảng giá này. Trợ giá lên đời phụ
 * thuộc tình trạng máy cũ của từng khách nên được báo riêng qua Zalo.
 */
export const PROMOS: Promo[] = [
  {
    label: "Ưu đãi thanh toán",
    value: 4_000_000,
    note: "Áp dụng khi thanh toán qua thẻ tín dụng / ví của ngân hàng liên kết",
  },
  {
    label: "Ưu đãi thành viên Dev Pồ",
    value: 500_000,
    note: "Dành cho khách đã từng mua máy hoặc đặt cọc sớm tại Dev Pồ",
  },
];

/** Tổng ưu đãi tối đa áp dụng cho mọi phiên bản */
export const TOTAL_PROMO = PROMOS.reduce((sum, p) => sum + p.value, 0);

/** Giá cuối sau khi trừ toàn bộ ưu đãi tối đa */
export function finalPrice(listPrice: number): number {
  return listPrice - TOTAL_PROMO;
}

/**
 * Khoảng giá niêm yết của cả chiến dịch — dùng cho tiêu đề trang & JSON-LD.
 * Trang chỉ hiển thị giá niêm yết nên schema phải dùng đúng con số đó, không
 * lấy giá sau ưu đãi (Google yêu cầu giá trong structured data khớp giá hiện
 * trên trang).
 */
export function campaignPriceRange(): { low: number; high: number } {
  const all = MODELS.flatMap((m) => m.storages.map((s) => s.listPrice));
  return { low: Math.min(...all), high: Math.max(...all) };
}

/** Mốc thời gian chiến dịch */
export const TIMELINE = [
  {
    date: "12.09",
    title: "Mở nhận đặt cọc",
    desc: "Bắt đầu nhận giữ suất qua Zalo",
  },
  {
    date: "18.09",
    title: "Bắt đầu giao hàng",
    desc: "Máy về đợt đầu được giao theo đúng thứ tự đặt cọc",
  },
];

/** Thông số kỹ thuật nổi bật iPhone 18 Pro Max — theo công bố của Apple */
export const HIGHLIGHT_SPECS: { group: string; rows: { label: string; value: string }[] }[] = [
  {
    group: "Màn hình",
    rows: [
      { label: "Kích thước", value: "6.9 inch Super Retina XDR OLED" },
      { label: "Độ phân giải", value: "2868 × 1320 pixel" },
      { label: "Độ sáng tối đa", value: "3.000 nits ngoài trời" },
    ],
  },
  {
    group: "Hiệu năng",
    rows: [
      { label: "Chip xử lý", value: "Apple A20 Pro (tiến trình 2nm)" },
      { label: "CPU / GPU", value: "CPU 6 lõi, GPU 7 lõi" },
      { label: "Trí tuệ nhân tạo", value: "Hỗ trợ đầy đủ Apple Intelligence" },
    ],
  },
  {
    group: "Camera",
    rows: [
      { label: "Camera chính", value: "Fusion 48MP, khẩu độ biến thiên ƒ/1.48 - ƒ/4.0" },
      { label: "Góc siêu rộng", value: "48MP" },
      { label: "Tele", value: "48MP, zoom quang 4x / 8x / 16x" },
      { label: "Camera trước", value: "18MP Center Stage" },
    ],
  },
  {
    group: "Pin & Sạc",
    rows: [
      { label: "Xem video", value: "Tối đa 43 giờ" },
      { label: "Sử dụng thông thường", value: "Tối đa 29 giờ" },
      { label: "Sạc nhanh có dây", value: "50% pin trong 15 phút (củ sạc từ 60W)" },
      { label: "Sạc không dây", value: "MagSafe / Qi2 tối đa 25W" },
    ],
  },
];

/** Định dạng tiền Việt: 41990000 -> "41.990.000đ" (tự viết để server và client ra kết quả giống hệt nhau) */
export function formatVnd(amount: number): string {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
}
