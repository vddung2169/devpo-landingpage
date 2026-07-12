// =============================================================================
// Nguồn dữ liệu sản phẩm tập trung cho devpo.vn
// Mỗi sản phẩm có 1 slug riêng để render trang chi tiết /products/[slug] (tốt cho SEO).
// File này là "single source of truth" — trang chủ, trang danh sách và trang chi tiết
// đều đọc dữ liệu từ đây.
// =============================================================================

export type ProductCategory = "lock" | "quocte" | "ipad";

export type ProductBadge = "Hot Nhất" | "Bán Chạy" | "Mới Về";

/** Một dòng thông số trong bảng cấu hình chi tiết (VD: "Công nghệ màn hình" → "OLED") */
export interface SpecRow {
  label: string;
  value: string;
}

/** Một nhóm thông số kỹ thuật (VD: "Màn hình", "Camera sau"...) */
export interface SpecGroup {
  /** Tên nhóm hiển thị làm tiêu đề */
  group: string;
  /** Các dòng thông số trong nhóm */
  rows: SpecRow[];
}

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
  /** Cấu hình kỹ thuật chi tiết theo nhóm (tùy chọn — hiển thị bảng đầy đủ ở trang chi tiết) */
  techSpecs?: SpecGroup[];
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
// Bảng cấu hình kỹ thuật chi tiết theo model (kiểu Thế Giới Di Động).
// Key = định danh model gốc; nhiều SKU (Lock/Quốc tế) có thể dùng chung 1 key.
// Nguồn đối chiếu: Apple.com, Thế Giới Di Động, GSMArena.
// Ghi chú: Apple KHÔNG công bố RAM và dung lượng pin (mAh) — các số này lấy từ
// GSMArena/nguồn bên thứ ba và đã ghi chú "(hãng không công bố)".
// -----------------------------------------------------------------------------
// Fragment: techSpecsByModel — sẽ chèn vào data/products.ts
// Key = định danh model gốc; nhiều SKU (bản Lock/Quốc tế) có thể trỏ chung 1 key.


const techSpecsByModel: Record<string, SpecGroup[]> = {
  // ===================== iPhone 17 series =====================
  "17-pro-max": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.9 inch" },
        { label: "Công nghệ", value: "OLED Super Retina XDR, Always-On, True Tone" },
        { label: "Độ phân giải", value: "2868 × 1320 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 3000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield 2 (mặt trước)" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A19 Pro (3nm), CPU 6 nhân" },
        { label: "GPU", value: "6 nhân (Neural Accelerators + ray tracing)" },
        { label: "Neural Engine", value: "16 nhân" },
        { label: "RAM", value: "12GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "256GB / 512GB / 1TB / 2TB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera 48MP (Pro Fusion)" },
        { label: "Camera chính", value: "48MP, 24mm, ƒ/1.78, OIS dịch cảm biến gen 2" },
        { label: "Góc siêu rộng", value: "48MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "48MP, 100mm, ƒ/2.8, tetraprism, zoom quang 4x" },
        { label: "Zoom", value: "Zoom quang tới 16x, zoom số tối đa 40x" },
        { label: "Quay video", value: "4K Dolby Vision 120fps, ProRes 4K 120fps, ProRAW, quay Log, quay 2 camera" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "18MP Center Stage, ƒ/1.9, tự động lấy nét; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "5088 mAh (bản eSIM — nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 39 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong 20 phút (củ ≥40W)" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Thân nhôm nguyên khối (unibody)" },
        { label: "Kích thước", value: "163.4 × 78.0 × 8.8 mm" },
        { label: "Trọng lượng", value: "233 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "eSIM kép (eSIM-only; một số thị trường có Nano-SIM)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave, 4×4 MIMO)" },
        { label: "Wi-Fi", value: "Wi-Fi 7 (chip Apple N1)" },
        { label: "Bluetooth", value: "Bluetooth 6" },
        { label: "Cổng kết nối", value: "USB-C (USB 3, tới 10 Gb/s)" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 26" },
        { label: "Ngày ra mắt", value: "Tháng 9/2025" },
      ],
    },
  ],

  "17-pro": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.3 inch" },
        { label: "Công nghệ", value: "OLED Super Retina XDR, Always-On, True Tone" },
        { label: "Độ phân giải", value: "2622 × 1206 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 3000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield 2 (mặt trước)" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A19 Pro (3nm), CPU 6 nhân" },
        { label: "GPU", value: "6 nhân (Neural Accelerators + ray tracing)" },
        { label: "Neural Engine", value: "16 nhân" },
        { label: "RAM", value: "12GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "256GB / 512GB / 1TB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera 48MP (Pro Fusion)" },
        { label: "Camera chính", value: "48MP, 24mm, ƒ/1.78, OIS dịch cảm biến gen 2" },
        { label: "Góc siêu rộng", value: "48MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "48MP, 100mm, ƒ/2.8, tetraprism, zoom quang 4x" },
        { label: "Zoom", value: "Zoom quang tới 16x, zoom số tối đa 40x" },
        { label: "Quay video", value: "4K Dolby Vision 120fps, ProRes 4K 120fps, ProRAW, quay Log, quay 2 camera" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "18MP Center Stage, ƒ/1.9, tự động lấy nét; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4252 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 33 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong 20 phút (củ ≥40W)" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Thân nhôm nguyên khối (unibody)" },
        { label: "Kích thước", value: "150.0 × 71.9 × 8.75 mm" },
        { label: "Trọng lượng", value: "206 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "eSIM kép (eSIM-only)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave, 4×4 MIMO)" },
        { label: "Wi-Fi", value: "Wi-Fi 7 (chip Apple N1)" },
        { label: "Bluetooth", value: "Bluetooth 6" },
        { label: "Cổng kết nối", value: "USB-C (USB 3, tới 10 Gb/s)" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 26" },
        { label: "Ngày ra mắt", value: "Tháng 9/2025" },
      ],
    },
  ],

  "17-air": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.5 inch" },
        { label: "Công nghệ", value: "OLED Super Retina XDR" },
        { label: "Độ phân giải", value: "2736 × 1260 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 3000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield 2 (trước) + Ceramic Shield (lưng)" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A19 Pro, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân (Neural Accelerators)" },
        { label: "Neural Engine", value: "16 nhân" },
        { label: "RAM", value: "12GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "256GB / 512GB / 1TB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "1 camera 48MP (Fusion)" },
        { label: "Camera chính", value: "48MP, 26mm, ƒ/1.6, OIS" },
        { label: "Tele", value: "2x quang học 12MP, 52mm (cắt từ cảm biến chính)" },
        { label: "Zoom", value: "Zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision 24/25/30/60fps" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "18MP Center Stage, ƒ/1.9, tự động lấy nét; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3149 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 27 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong 30 phút (củ ≥20W)" },
        { label: "Sạc không dây", value: "MagSafe / Qi2 tới 20W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung titan siêu mỏng" },
        { label: "Kích thước", value: "156.2 × 74.7 × 5.6 mm (mỏng nhất dòng iPhone)" },
        { label: "Trọng lượng", value: "165 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "eSIM kép (eSIM-only)" },
        { label: "Mạng di động", value: "5G sub-6GHz (chip modem Apple C1X, không mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 7 (chip Apple N1)" },
        { label: "Bluetooth", value: "Bluetooth 6" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 26" },
        { label: "Ngày ra mắt", value: "Tháng 9/2025" },
      ],
    },
  ],

  "17": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.3 inch" },
        { label: "Công nghệ", value: "OLED Super Retina XDR" },
        { label: "Độ phân giải", value: "2622 × 1206 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng tới 120Hz (lần đầu trên bản tiêu chuẩn)" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 3000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield 2 (mặt trước)" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A19 (3nm), CPU 6 nhân" },
        { label: "GPU", value: "5 nhân (Neural Accelerators)" },
        { label: "Neural Engine", value: "16 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "256GB / 512GB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera 48MP (Dual Fusion)" },
        { label: "Camera chính", value: "48MP, 26mm, ƒ/1.6, chống rung dịch cảm biến" },
        { label: "Góc siêu rộng", value: "48MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "2x quang học 12MP (cắt từ cảm biến chính)" },
        { label: "Zoom", value: "Zoom quang 2x, zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision tới 60fps" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "18MP Center Stage, ƒ/1.9, tự động lấy nét" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3692 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 30 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong 20 phút (củ ≥40W)" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính màu" },
        { label: "Kích thước", value: "149.6 × 71.5 × 7.95 mm" },
        { label: "Trọng lượng", value: "177 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "eSIM kép (eSIM-only tùy thị trường)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 7" },
        { label: "Bluetooth", value: "Bluetooth 6" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 26" },
        { label: "Ngày ra mắt", value: "Tháng 9/2025" },
      ],
    },
  ],

  // ===================== iPhone 16 series =====================
  "16-pro-max": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.9 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2868 × 1320 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield thế hệ mới" },
        { label: "Tính năng", value: "Dynamic Island, Always-On" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A18 Pro (3nm), CPU 6 nhân" },
        { label: "GPU", value: "6 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "256GB / 512GB / 1TB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera (48MP + 48MP + 12MP)" },
        { label: "Camera chính", value: "48MP Fusion, 24mm, ƒ/1.8, sensor-shift OIS gen 2" },
        { label: "Góc siêu rộng", value: "48MP, 13mm, ƒ/2.2, lấy nét tự động (macro)" },
        { label: "Tele", value: "12MP tetraprism, 120mm, ƒ/2.8, zoom quang 5x, kèm LiDAR" },
        { label: "Zoom", value: "Zoom quang dải 8x, zoom số tối đa 25x" },
        { label: "Quay video", value: "4K Dolby Vision 120fps, ProRes, quay Log" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4685 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 33 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (tới 25W với củ 30W)" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung Titan (grade 5), lưng kính mờ" },
        { label: "Kích thước", value: "163.0 × 77.6 × 8.25 mm" },
        { label: "Trọng lượng", value: "227 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản Mỹ dual eSIM)" },
        { label: "Mạng di động", value: "5G (mmWave tùy thị trường)" },
        { label: "Wi-Fi", value: "Wi-Fi 7" },
        { label: "Bluetooth", value: "Bluetooth 5.3, UWB gen 2" },
        { label: "Cổng kết nối", value: "USB-C (USB 3, tới 10 Gb/s), DisplayPort" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 18" },
        { label: "Ngày ra mắt", value: "Tháng 9/2024" },
      ],
    },
  ],

  "16-pro": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.3 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2622 × 1206 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield thế hệ mới" },
        { label: "Tính năng", value: "Dynamic Island, Always-On" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A18 Pro (3nm), CPU 6 nhân" },
        { label: "GPU", value: "6 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera (48MP + 48MP + 12MP)" },
        { label: "Camera chính", value: "48MP Fusion, 24mm, ƒ/1.8, sensor-shift OIS gen 2" },
        { label: "Góc siêu rộng", value: "48MP, 13mm, ƒ/2.2, lấy nét tự động (macro)" },
        { label: "Tele", value: "12MP tetraprism, 120mm, ƒ/2.8, zoom quang 5x, kèm LiDAR" },
        { label: "Zoom", value: "Zoom quang dải 8x, zoom số tối đa 25x" },
        { label: "Quay video", value: "4K Dolby Vision 120fps, ProRes, quay Log" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3582 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 27 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (tới 25W với củ 30W)" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung Titan (grade 5), lưng kính mờ" },
        { label: "Kích thước", value: "149.6 × 71.5 × 8.25 mm" },
        { label: "Trọng lượng", value: "199 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản Mỹ dual eSIM)" },
        { label: "Mạng di động", value: "5G (mmWave tùy thị trường)" },
        { label: "Wi-Fi", value: "Wi-Fi 7" },
        { label: "Bluetooth", value: "Bluetooth 5.3, UWB gen 2" },
        { label: "Cổng kết nối", value: "USB-C (USB 3, tới 10 Gb/s), DisplayPort" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 18" },
        { label: "Ngày ra mắt", value: "Tháng 9/2024" },
      ],
    },
  ],

  "16-plus": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2796 × 1290 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A18 (3nm), CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera (48MP + 12MP)" },
        { label: "Camera chính", value: "48MP Fusion, 26mm, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "2x quang học 12MP, 52mm (cắt từ cảm biến chính)" },
        { label: "Zoom", value: "Zoom quang 2x, zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision tới 60fps" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4674 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 27 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "160.9 × 77.8 × 7.8 mm" },
        { label: "Trọng lượng", value: "199 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản Mỹ dual eSIM)" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 7" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 18" },
        { label: "Ngày ra mắt", value: "Tháng 9/2024" },
      ],
    },
  ],

  "16": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2556 × 1179 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A18 (3nm), CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera (48MP + 12MP)" },
        { label: "Camera chính", value: "48MP Fusion, 26mm, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "2x quang học 12MP, 52mm (cắt từ cảm biến chính)" },
        { label: "Zoom", value: "Zoom quang 2x, zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision tới 60fps" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K Dolby Vision 60fps" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3561 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 22 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút" },
        { label: "Sạc không dây", value: "MagSafe 25W, Qi2 25W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "147.6 × 71.6 × 7.8 mm" },
        { label: "Trọng lượng", value: "170 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản Mỹ dual eSIM)" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 7" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Nút Action, nút Camera Control" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 18" },
        { label: "Ngày ra mắt", value: "Tháng 9/2024" },
      ],
    },
  ],

  "16e": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2532 × 1170 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch) — không có Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A18 (3nm), CPU 6 nhân" },
        { label: "GPU", value: "4 nhân (bản rút gọn)" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    {
      group: "Bộ nhớ",
      rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }],
    },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "1 camera 48MP (Fusion)" },
        { label: "Camera chính", value: "48MP, 26mm, ƒ/1.6, OIS" },
        { label: "Tele", value: "2x quang học 12MP, 52mm (cắt từ cảm biến chính)" },
        { label: "Zoom", value: "Zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision tới 60fps" },
      ],
    },
    {
      group: "Camera trước",
      rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9" }],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4005 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 26 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (củ ≥20W)" },
        { label: "Sạc không dây", value: "Qi 7.5W (KHÔNG có MagSafe)" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "146.7 × 71.5 × 7.8 mm" },
        { label: "Trọng lượng", value: "167 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản Mỹ dual eSIM)" },
        { label: "Mạng di động", value: "5G (modem Apple C1, không mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Nút Action (không có Camera Control)" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 18" },
        { label: "Ngày ra mắt", value: "Tháng 2/2025" },
      ],
    },
  ],

  // ===================== iPhone 15 series =====================
  "15-pro-max": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2796 × 1290 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island, Always-On" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A17 Pro, CPU 6 nhân" },
        { label: "GPU", value: "6 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "256GB / 512GB / 1TB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera (48MP + 12MP + 12MP)" },
        { label: "Camera chính", value: "48MP, 24mm, ƒ/1.78, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "12MP tetraprism, 120mm, ƒ/2.8, zoom quang 5x" },
        { label: "Zoom", value: "Zoom quang dải 10x, zoom số tối đa 25x" },
        { label: "Quay video", value: "4K Dolby Vision 60fps, ProRes, quay Log, Cinematic, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4422 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 29 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W qua USB-C (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi2 15W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung titan, lưng kính mờ nhám" },
        { label: "Kích thước", value: "159.9 × 76.7 × 8.25 mm" },
        { label: "Trọng lượng", value: "221 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6E" },
        { label: "Bluetooth", value: "Bluetooth 5.3, UWB gen 2, Thread" },
        { label: "Cổng kết nối", value: "USB-C (USB 3, tới 10 Gb/s)" },
        { label: "Phím bấm", value: "Nút Action" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 17" },
        { label: "Ngày ra mắt", value: "Tháng 9/2023" },
      ],
    },
  ],

  "15-pro": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1179 × 2556 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island, Always-On" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A17 Pro, CPU 6 nhân" },
        { label: "GPU", value: "6 nhân" },
        { label: "RAM", value: "8GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera (48MP + 12MP + 12MP)" },
        { label: "Camera chính", value: "48MP, 24mm, ƒ/1.78, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "12MP, 77mm, ƒ/2.8, zoom quang 3x" },
        { label: "Zoom", value: "Zoom quang 3x, zoom số tối đa 15x" },
        { label: "Quay video", value: "4K 60fps, ProRes tới 4K 60fps (ổ ngoài), quay Log, Cinematic" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3274 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 23 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W qua USB-C (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi2 15W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung titan, lưng kính mờ nhám" },
        { label: "Kích thước", value: "146.6 × 70.6 × 8.25 mm" },
        { label: "Trọng lượng", value: "187 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6E" },
        { label: "Bluetooth", value: "Bluetooth 5.3, UWB gen 2, Thread" },
        { label: "Cổng kết nối", value: "USB-C (USB 3, tới 10 Gb/s)" },
        { label: "Phím bấm", value: "Nút Action" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 17" },
        { label: "Ngày ra mắt", value: "Tháng 9/2023" },
      ],
    },
  ],

  "15-plus": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2796 × 1290 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A16 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera (48MP + 12MP)" },
        { label: "Camera chính", value: "48MP, 26mm, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Tele", value: "2x quang học (cắt từ cảm biến 48MP)" },
        { label: "Zoom", value: "Zoom quang 2x, zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision 60fps, Cinematic, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4383 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 26 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W qua USB-C" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi2 15W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính nhuộm màu" },
        { label: "Kích thước", value: "160.9 × 77.8 × 7.8 mm" },
        { label: "Trọng lượng", value: "201 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 17" },
        { label: "Ngày ra mắt", value: "Tháng 9/2023" },
      ],
    },
  ],

  "15": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1179 × 2556 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A16 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera (48MP + 12MP)" },
        { label: "Camera chính", value: "48MP, 26mm, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Tele", value: "2x quang học (cắt từ cảm biến 48MP)" },
        { label: "Zoom", value: "Zoom quang 2x, zoom số tối đa 10x" },
        { label: "Quay video", value: "4K Dolby Vision 60fps, Cinematic, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3349 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 20 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W qua USB-C" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi2 15W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính nhuộm màu" },
        { label: "Kích thước", value: "147.6 × 71.6 × 7.8 mm" },
        { label: "Trọng lượng", value: "171 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "USB-C (USB 2, 480 Mb/s)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 17" },
        { label: "Ngày ra mắt", value: "Tháng 9/2023" },
      ],
    },
  ],

  // ===================== iPhone 14 series =====================
  "14-pro-max": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2796 × 1290 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island, Always-On" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A16 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera (48MP + 12MP + 12MP)" },
        { label: "Camera chính", value: "48MP, 24mm, ƒ/1.78, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "12MP, 77mm, ƒ/2.8, zoom quang 3x" },
        { label: "Zoom", value: "Zoom quang dải 6x, zoom số tối đa 15x" },
        { label: "Quay video", value: "4K 60fps, ProRes 4K 30fps, Cinematic 4K HDR, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9, tự động lấy nét; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4323 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 29 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~35 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung thép không gỉ, lưng kính nhám" },
        { label: "Kích thước", value: "160.7 × 77.6 × 7.85 mm" },
        { label: "Trọng lượng", value: "240 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 16" },
        { label: "Ngày ra mắt", value: "Tháng 9/2022" },
      ],
    },
  ],

  "14-pro": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1179 × 2556 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng 1–120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1600 nits HDR, 2000 nits ngoài trời" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Dynamic Island, Always-On" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A16 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera (48MP + 12MP + 12MP)" },
        { label: "Camera chính", value: "48MP, 24mm, ƒ/1.78, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.2, góc 120°" },
        { label: "Tele", value: "12MP, 77mm, ƒ/2.8, zoom quang 3x" },
        { label: "Zoom", value: "Zoom quang dải 6x, zoom số tối đa 15x" },
        { label: "Quay video", value: "4K 60fps, ProRes 4K 30fps, Cinematic 4K HDR, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9, tự động lấy nét; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3200 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 23 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung thép không gỉ, lưng kính nhám" },
        { label: "Kích thước", value: "147.5 × 71.5 × 7.85 mm" },
        { label: "Trọng lượng", value: "206 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 16" },
        { label: "Ngày ra mắt", value: "Tháng 9/2022" },
      ],
    },
  ],

  "14-plus": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "2778 × 1284 pixel (458 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch) — không có Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A15 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera (12MP + 12MP)" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.5, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Zoom", value: "Zoom số tối đa 5x" },
        { label: "Quay video", value: "4K Dolby Vision 60fps, Cinematic 4K HDR, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9, tự động lấy nét; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4325 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 26 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "160.8 × 78.1 × 7.8 mm" },
        { label: "Trọng lượng", value: "203 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 16" },
        { label: "Ngày ra mắt", value: "Tháng 9/2022" },
      ],
    },
  ],

  "14": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1170 × 2532 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch) — không có Dynamic Island" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A15 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera (12MP + 12MP)" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.5, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Zoom", value: "Zoom số tối đa 5x" },
        { label: "Quay video", value: "4K Dolby Vision 60fps, Cinematic 4K HDR, Action mode" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/1.9, tự động lấy nét; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3279 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 20 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "146.7 × 71.5 × 7.8 mm" },
        { label: "Trọng lượng", value: "172 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM (bản US chỉ eSIM)" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 16" },
        { label: "Ngày ra mắt", value: "Tháng 9/2022" },
      ],
    },
  ],

  // ===================== iPhone 13 series =====================
  "13-pro-max": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1284 × 2778 pixel (458 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng tới 120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch)" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A15 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera 12MP" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.5, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/1.8, góc 120°, macro" },
        { label: "Tele", value: "12MP, 77mm, ƒ/2.8, zoom quang 3x" },
        { label: "Zoom", value: "Zoom quang dải 6x, zoom số tối đa 15x" },
        { label: "Quay video", value: "4K 60fps, ProRes, Cinematic, Dolby Vision HDR, ProRAW" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "4352 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 28 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (củ ≥20W)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung thép không gỉ, lưng kính" },
        { label: "Kích thước", value: "160.8 × 78.1 × 7.65 mm" },
        { label: "Trọng lượng", value: "240 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G (sub-6GHz)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 15" },
        { label: "Ngày ra mắt", value: "Tháng 9/2021" },
      ],
    },
  ],

  "13-pro": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "LTPO Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1170 × 2532 pixel (460 ppi)" },
        { label: "Tần số quét", value: "ProMotion thích ứng tới 120Hz" },
        { label: "Độ sáng tối đa", value: "1000 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch)" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A15 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "5 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera 12MP" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.5, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/1.8, góc 120°, macro" },
        { label: "Tele", value: "12MP, 77mm, ƒ/2.8, zoom quang 3x" },
        { label: "Zoom", value: "Zoom quang dải 6x, zoom số tối đa 15x" },
        { label: "Quay video", value: "4K 60fps, ProRes, Cinematic, Dolby Vision HDR, ProRAW" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3095 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 22 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (củ ≥20W)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung thép không gỉ, lưng kính" },
        { label: "Kích thước", value: "146.7 × 71.5 × 7.65 mm" },
        { label: "Trọng lượng", value: "204 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G (sub-6GHz)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 15" },
        { label: "Ngày ra mắt", value: "Tháng 9/2021" },
      ],
    },
  ],

  "13": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1170 × 2532 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch) nhỏ hơn" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A15 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "4 nhân" },
        { label: "RAM", value: "4GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera 12MP" },
        { label: "Camera chính", value: "12MP, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, ƒ/2.4, góc 120°" },
        { label: "Zoom", value: "Zoom số tối đa 5x" },
        { label: "Quay video", value: "4K 60fps, Cinematic, Dolby Vision HDR" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3240 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 19 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (củ ≥20W)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "146.7 × 71.5 × 7.65 mm" },
        { label: "Trọng lượng", value: "174 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 15" },
        { label: "Ngày ra mắt", value: "Tháng 9/2021" },
      ],
    },
  ],

  "13-mini": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "5.4 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1080 × 2340 pixel (476 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch) nhỏ hơn" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A15 Bionic, CPU 6 nhân" },
        { label: "GPU", value: "4 nhân" },
        { label: "RAM", value: "4GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera 12MP" },
        { label: "Camera chính", value: "12MP, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, ƒ/2.4, góc 120°" },
        { label: "Zoom", value: "Zoom số tối đa 5x" },
        { label: "Quay video", value: "4K 60fps, Cinematic, Dolby Vision HDR" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "2438 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 17 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "50% trong ~30 phút (củ ≥20W)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "131.5 × 64.2 × 7.65 mm" },
        { label: "Trọng lượng", value: "141 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 15" },
        { label: "Ngày ra mắt", value: "Tháng 9/2021" },
      ],
    },
  ],

  // ===================== iPhone 12 series =====================
  "12-pro-max": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.7 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1284 × 2778 pixel (458 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch)" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A14 Bionic (5nm), CPU 6 nhân" },
        { label: "GPU", value: "4 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera 12MP + LiDAR" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.6, sensor-shift OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Tele", value: "12MP, 65mm, ƒ/2.2, zoom quang 2.5x" },
        { label: "Zoom", value: "Zoom quang dải 5x, zoom số tối đa 12x" },
        { label: "Quay video", value: "4K 60fps, Dolby Vision HDR, ProRAW" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "3687 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 20 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung thép không gỉ, lưng kính" },
        { label: "Kích thước", value: "160.8 × 78.1 × 7.4 mm" },
        { label: "Trọng lượng", value: "228 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 14" },
        { label: "Ngày ra mắt", value: "Tháng 10/2020" },
      ],
    },
  ],

  "12-pro": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1170 × 2532 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "800 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch)" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A14 Bionic (5nm), CPU 6 nhân" },
        { label: "GPU", value: "4 nhân" },
        { label: "RAM", value: "6GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "3 camera 12MP + LiDAR" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.6, OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Tele", value: "12MP, 52mm, ƒ/2.0, zoom quang 2x" },
        { label: "Zoom", value: "Zoom quang dải 4x, zoom số tối đa 10x" },
        { label: "Quay video", value: "4K 60fps, Dolby Vision HDR, ProRAW" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "2815 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 17 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung thép không gỉ, lưng kính" },
        { label: "Kích thước", value: "146.7 × 71.5 × 7.4 mm" },
        { label: "Trọng lượng", value: "189 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 14" },
        { label: "Ngày ra mắt", value: "Tháng 10/2020" },
      ],
    },
  ],

  "12": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "6.1 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1170 × 2532 pixel (460 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "625 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch)" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A14 Bionic (5nm), CPU 6 nhân" },
        { label: "GPU", value: "4 nhân" },
        { label: "RAM", value: "4GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "64GB / 128GB / 256GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera 12MP" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.6, OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Zoom", value: "Zoom số tối đa 5x" },
        { label: "Quay video", value: "4K 60fps, Dolby Vision HDR" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "2815 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 17 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "146.7 × 71.5 × 7.4 mm" },
        { label: "Trọng lượng", value: "164 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 14" },
        { label: "Ngày ra mắt", value: "Tháng 10/2020" },
      ],
    },
  ],

  "12-mini": [
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "5.4 inch" },
        { label: "Công nghệ", value: "Super Retina XDR OLED" },
        { label: "Độ phân giải", value: "1080 × 2340 pixel (476 ppi)" },
        { label: "Tần số quét", value: "60Hz" },
        { label: "Độ sáng tối đa", value: "625 nits (thường), 1200 nits HDR" },
        { label: "Mặt kính", value: "Ceramic Shield" },
        { label: "Tính năng", value: "Tai thỏ (notch)" },
      ],
    },
    {
      group: "Chip & Hiệu năng",
      rows: [
        { label: "Chip xử lý", value: "Apple A14 Bionic (5nm), CPU 6 nhân" },
        { label: "GPU", value: "4 nhân" },
        { label: "RAM", value: "4GB (hãng không công bố)" },
      ],
    },
    { group: "Bộ nhớ", rows: [{ label: "Dung lượng", value: "64GB / 128GB / 256GB" }] },
    {
      group: "Camera sau",
      rows: [
        { label: "Cấu hình", value: "2 camera 12MP" },
        { label: "Camera chính", value: "12MP, 26mm, ƒ/1.6, OIS" },
        { label: "Góc siêu rộng", value: "12MP, 13mm, ƒ/2.4, góc 120°" },
        { label: "Zoom", value: "Zoom số tối đa 5x" },
        { label: "Quay video", value: "4K 60fps, Dolby Vision HDR" },
      ],
    },
    { group: "Camera trước", rows: [{ label: "Độ phân giải", value: "12MP TrueDepth, ƒ/2.2; 4K 60fps" }] },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "2227 mAh (nguồn bên thứ ba)" },
        { label: "Thời lượng video", value: "Tối đa 15 giờ (Apple công bố)" },
        { label: "Sạc có dây", value: "20W (50% trong ~30 phút)" },
        { label: "Sạc không dây", value: "MagSafe 15W, Qi 7.5W" },
      ],
    },
    {
      group: "Thiết kế & Chất liệu",
      rows: [
        { label: "Chất liệu", value: "Khung nhôm, lưng kính" },
        { label: "Kích thước", value: "131.5 × 64.2 × 7.4 mm" },
        { label: "Trọng lượng", value: "135 g" },
        { label: "Kháng nước bụi", value: "IP68 (6m trong 30 phút)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "SIM", value: "Nano-SIM + eSIM" },
        { label: "Mạng di động", value: "5G (sub-6 + mmWave)" },
        { label: "Wi-Fi", value: "Wi-Fi 6" },
        { label: "Bluetooth", value: "Bluetooth 5.0" },
        { label: "Cổng kết nối", value: "Lightning (USB 2.0)" },
        { label: "Phím bấm", value: "Công tắc gạt im lặng" },
      ],
    },
    {
      group: "Thông tin chung",
      rows: [
        { label: "Hệ điều hành", value: "iOS 14" },
        { label: "Ngày ra mắt", value: "Tháng 10/2020" },
      ],
    },
  ],
};

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
    techSpecs: techSpecsByModel["17-pro-max"],
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
    techSpecs: techSpecsByModel["17-pro"],
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
    techSpecs: techSpecsByModel["16-pro-max"],
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
    techSpecs: techSpecsByModel["16-pro"],
  },
];

// -----------------------------------------------------------------------------
// Các sản phẩm còn lại — mô tả/đặc điểm tạo tự động. Mỗi mục gắn techSpecs theo model.
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
    techSpecs: techSpecsByModel["15-pro-max"],
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
    techSpecs: techSpecsByModel["17"],
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
    techSpecs: techSpecsByModel["17-air"],
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
    techSpecs: techSpecsByModel["16"],
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
    techSpecs: techSpecsByModel["16-plus"],
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
    techSpecs: techSpecsByModel["15-plus"],
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
    techSpecs: techSpecsByModel["15"],
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
    techSpecs: techSpecsByModel["14-pro-max"],
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
    techSpecs: techSpecsByModel["14-pro"],
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
    techSpecs: techSpecsByModel["13-pro-max"],
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
    techSpecs: techSpecsByModel["14-plus"],
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
    techSpecs: techSpecsByModel["14"],
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
    techSpecs: techSpecsByModel["13"],
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
    techSpecs: techSpecsByModel["12-pro-max"],
  },
  {
    id: 22,
    slug: "iphone-15-pro-lock",
    name: "iPhone 15 Pro",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "128GB / 256GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/15promax.png",
    techSpecs: techSpecsByModel["15-pro"],
  },
  {
    id: 23,
    slug: "iphone-16e-lock",
    name: "iPhone 16e",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "128GB",
    simType: "2 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x-100%",
    image: "/products/iphone16.png",
    techSpecs: techSpecsByModel["16e"],
  },
  {
    id: 24,
    slug: "iphone-13-pro-lock",
    name: "iPhone 13 Pro",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "128GB / 256GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone13promax.png",
    techSpecs: techSpecsByModel["13-pro"],
  },
  {
    id: 25,
    slug: "iphone-13-mini-lock",
    name: "iPhone 13 mini",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "128GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone13.png",
    techSpecs: techSpecsByModel["13-mini"],
  },
  {
    id: 26,
    slug: "iphone-12-pro-lock",
    name: "iPhone 12 Pro",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "128GB / 256GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone12promax.png",
    techSpecs: techSpecsByModel["12-pro"],
  },
  {
    id: 27,
    slug: "iphone-12-lock",
    name: "iPhone 12",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "64GB / 128GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone12.png",
    techSpecs: techSpecsByModel["12"],
  },
  {
    id: 28,
    slug: "iphone-12-mini-lock",
    name: "iPhone 12 mini",
    category: "lock",
    priceFrom: "Liên hệ",
    storage: "64GB / 128GB",
    simType: "1 sim vật lý",
    condition: "Hình thức 98-99%",
    battery: "Pin 8x-100%",
    image: "/products/iphone12.png",
    techSpecs: techSpecsByModel["12-mini"],
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

/** Toàn bộ danh mục sản phẩm (sắp theo id) */
export const products: Product[] = [...detailedProducts, ...derivedProducts].sort(
  (a, b) => a.id - b.id,
);

/** Tìm sản phẩm theo slug — dùng cho trang chi tiết */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Lấy giá trị số từ chuỗi giá ("Từ 25.590.000đ" -> 25590000) — phục vụ JSON-LD/SEO */
export function priceToNumber(price: string): number {
  return Number(price.replace(/\D/g, "")) || 0;
}
