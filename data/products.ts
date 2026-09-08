// =============================================================================
// Nguồn dữ liệu sản phẩm tập trung cho devpo.vn
// Mỗi sản phẩm có 1 slug riêng để render trang chi tiết /products/[slug] (tốt cho SEO).
// File này là "single source of truth" — trang chủ, trang danh sách và trang chi tiết
// đều đọc dữ liệu từ đây.
// =============================================================================

export type ProductCategory = "lock" | "quocte" | "ipad";

/** Dòng máy iPad — dùng cho bộ lọc riêng ở trang /ipad */
export type IpadLine = "pro" | "air" | "mini" | "gen";

/**

- Kiểu kết nối của iPad:
-

* "wifi"     : chỉ có bản Wi-Fi

1.

- "cellular" : chỉ có bản Wi-Fi + Cellular (lắp SIM)

1.

- "both"     : cửa hàng có sẵn cả hai bản */ export type IpadConnectivity = "wifi" | "cellular" | "both";

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

// --- Các trường chỉ dùng cho category "ipad" (bộ lọc /ipad + card riêng) ---
/** Dòng máy: Pro / Air / Mini / Gen — nguồn cho bộ lọc theo dòng */
ipadLine?: IpadLine;
/** Kết nối Wi-Fi hay Wi-Fi + Cellular — nguồn cho bộ lọc kết nối */
connectivity?: IpadConnectivity;
/** Các mức dung lượng đang có, VD ["64GB", "256GB"] — nguồn cho bộ lọc dung lượng */
storageOptions?: string[];
/** Đời Apple Pencil tương thích, VD "Apple Pencil 2" */
pencil?: string;
/** Máy có tặng kèm bút Apple Pencil hay không (hiển thị trên card) */
pencilIncluded?: boolean;
}

/** Link liên hệ dùng chung */
export const ZALO_LINK = "https\://zalo.me/4289073059490896771";

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

/** Nhãn hiển thị cho từng dòng iPad */
export const ipadLineLabel: Record<IpadLine, string> = {
pro: "iPad Pro",
air: "iPad Air",
mini: "iPad Mini",
gen: "iPad Gen",
};

/** Tab lọc theo dòng máy ở trang /ipad */
export const ipadLines: { value: IpadLine | "all"; label: string; desc: string }[] = [
{ value: "all", label: "Tất cả", desc: "Toàn bộ iPad đang có tại Dev Pồ" },
{ value: "pro", label: "iPad Pro", desc: "Mạnh nhất, màn 120Hz, cho dân sáng tạo" },
{ value: "air", label: "iPad Air", desc: "Cân bằng giá và hiệu năng, bán chạy nhất" },
{ value: "mini", label: "iPad Mini", desc: "Nhỏ gọn, cầm một tay, hợp đọc & ghi chú" },
{ value: "gen", label: "iPad Gen", desc: "Giá mềm nhất, hợp học sinh - sinh viên" },
];

/** Nhãn hiển thị cho kiểu kết nối */
export const ipadConnectivityLabel: Record<IpadConnectivity, string> = {
wifi: "Chỉ Wi-Fi",
cellular: "Wi-Fi + Cellular (lắp SIM)",
both: "Có cả bản Wi-Fi và Cellular",
};

/** Tab lọc theo kết nối ở trang /ipad ("both" khớp với cả hai lựa chọn) */
export const ipadConnectivityFilters: { value: "all" | "wifi" | "cellular"; label: string }[] = [
{ value: "all", label: "Tất cả" },
{ value: "wifi", label: "Wi-Fi only" },
{ value: "cellular", label: "Wi-Fi + Cellular" },
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

// Thông số rút gọn của các mẫu iPad bổ sung.
interface IpadQuickSpec {
chip: string;
ram: string;
display: string;
camera: string;
frontCamera: string;
speakers: string;
connector: string;
biometric: string;
releaseYear: string;
}

const supplementalTechSpecsByIpad: Record<string, IpadQuickSpec> = {

  "ipad-pro-m1-11-2021": {
    chip: "Apple M1 (8 nhân CPU, 8 nhân GPU)",
    ram: "8GB",
    display: "Liquid Retina 11 inch, ProMotion 120Hz, True Tone",
    camera: "12MP góc rộng + 10MP siêu rộng, LiDAR",
    frontCamera: "12MP Ultra Wide, Center Stage",
    speakers: "4 loa stereo",
    connector: "Thunderbolt / USB 4",
    biometric: "Face ID",
    releaseYear: "2021",
  },

  "ipad-pro-m1-12-9-2021": {
  chip: "Apple M1 (CPU 8 nhân, GPU 8 nhân)",
  ram: "8GB",
  display:
    "Liquid Retina XDR 12.9 inch, Mini-LED, ProMotion 120Hz, True Tone",
  camera: "12MP góc rộng + 10MP góc siêu rộng, cảm biến LiDAR",
  frontCamera: "12MP Ultra Wide, Center Stage",
  speakers: "4 loa stereo",
  connector: "Thunderbolt / USB 4",
  biometric: "Face ID",
  releaseYear: "2021",
},

  "ipad-gen-8-2020": {
    chip: "Apple A12 Bionic",
    ram: "3GB",
    display: "Retina 10.2 inch",
    camera: "8MP",
    frontCamera: "1.2MP FaceTime HD",
    speakers: "2 loa stereo",
    connector: "Lightning",
    biometric: "Touch ID (nút Home)",
    releaseYear: "2020",
  },

  "ipad-gen-9-2021": {
    chip: "Apple A13 Bionic",
    ram: "3GB",
    display: "Retina 10.2 inch, True Tone",
    camera: "8MP",
    frontCamera: "12MP Ultra Wide, Center Stage",
    speakers: "2 loa stereo",
    connector: "Lightning",
    biometric: "Touch ID (nút Home)",
    releaseYear: "2021",
  },

  "ipad-air-3-2019": {
    chip: "Apple A12 Bionic",
    ram: "3GB",
    display: "Retina 10.5 inch, True Tone",
    camera: "8MP",
    frontCamera: "7MP FaceTime HD",
    speakers: "2 loa stereo",
    connector: "Lightning",
    biometric: "Touch ID (nút Home)",
    releaseYear: "2019",
  },

  "ipad-pro-10-5-2017": {
    chip: "Apple A10X Fusion",
    ram: "4GB",
    display: "Retina 10.5 inch, ProMotion 120Hz, True Tone",
    camera: "12MP",
    frontCamera: "7MP FaceTime HD",
    speakers: "4 loa stereo",
    connector: "Lightning",
    biometric: "Touch ID (nút Home)",
    releaseYear: "2017",
  },

  "ipad-air-m4-11-2026": {
    chip: "Apple M4 (8 nhân CPU, 9 nhân GPU)",
    ram: "12GB",
    display: "Liquid Retina 11 inch, True Tone, Wi-Fi 7",
    camera: "12MP góc rộng",
    frontCamera: "12MP Ultra Wide, Center Stage",
    speakers: "2 loa stereo (4 loa ở bản 13 inch)",
    connector: "USB-C",
    biometric: "Touch ID (nút nguồn)",
    releaseYear: "2026",
  },

  "ipad-pro-2018-12-9": {
    chip: "Apple A12X Bionic",
    ram: "4GB / 6GB (tuỳ bản)",
    display: "Liquid Retina 12.9 inch, ProMotion 120Hz, True Tone",
    camera: "12MP",
    frontCamera: "7MP FaceTime HD",
    speakers: "4 loa stereo",
    connector: "USB-C",
    biometric: "Face ID",
    releaseYear: "2018",
  },
};

function quickIpadSpecToGroups(spec: IpadQuickSpec): SpecGroup[] {
return [
{
group: "Thông số chính",
rows: [
{ label: "Chip xử lý", value: spec.chip },
{ label: "RAM", value: spec.ram },
{ label: "Màn hình", value: spec.display },
{ label: "Camera sau", value: spec.camera },
{ label: "Camera trước", value: spec.frontCamera },
{ label: "Âm thanh", value: spec.speakers },
{ label: "Cổng kết nối", value: spec.connector },
{ label: "Bảo mật", value: spec.biometric },
{ label: "Năm ra mắt", value: spec.releaseYear },
],
},
];
}

// -----------------------------------------------------------------------------
// Bảng cấu hình kỹ thuật chi tiết cho iPad (kiểu Thế Giới Di Động / CellphoneS).
// Nguồn đối chiếu: thegioididong.com, cellphones.com.vn, Apple.
// Ghi chú: Apple KHÔNG công bố RAM và dung lượng pin (mAh) — số mAh quy đổi từ Wh
// và số RAM lấy từ nguồn bên thứ ba, đã ghi rõ "(hãng không công bố)".
// -----------------------------------------------------------------------------
const techSpecsByIpad: Record<string, SpecGroup[]> = {
// ===================== iPad Gen 7 (10.2 inch, 2019) =====================
"ipad-gen-7": [
{
group: "Màn hình",
rows: [
{ label: "Kích thước", value: "10.2 inch" },
{ label: "Công nghệ", value: "Retina IPS LCD, đèn nền LED" },
{ label: "Độ phân giải", value: "2160 × 1620 pixel (264 ppi)" },
{ label: "Tần số quét", value: "60Hz" },
{ label: "Độ sáng tối đa", value: "500 nits" },
{ label: "Mặt kính", value: "Lớp phủ chống bám vân tay" },
{ label: "Tính năng", value: "Dải màu sRGB (chưa có True Tone, màn hình chưa ép kính)" },
],
},
{
group: "Chip & Hiệu năng",
rows: [
{ label: "Chip xử lý", value: "Apple A10 Fusion (64-bit) + đồng xử lý M10" },
{ label: "GPU", value: "PowerVR 6 nhân" },
{ label: "RAM", value: "3GB (hãng không công bố)" },
],
},
{
group: "Bộ nhớ",
rows: [{ label: "Dung lượng", value: "32GB / 128GB" }],
},
{
group: "Camera sau",
rows: [
{ label: "Độ phân giải", value: "8MP, khẩu độ f/2.4" },
{ label: "Quay video", value: "1080p @30fps" },
{ label: "Tính năng", value: "HDR, Live Photos, lấy nét tự động, panorama 43MP" },
],
},
{
group: "Camera trước",
rows: [
{ label: "Độ phân giải", value: "1.2MP FaceTime HD, khẩu độ f/2.4" },
{ label: "Quay video", value: "720p @30fps" },
{ label: "Tính năng", value: "HDR cho ảnh, chế độ chân dung Retina Flash (qua màn hình)" },
],
},
{
group: "Pin & Sạc",
rows: [
{ label: "Dung lượng pin", value: "32.4 Wh (~8.800 mAh — hãng không công bố)" },
{ label: "Thời lượng dùng", value: "Tới 10 giờ lướt web Wi-Fi / 9 giờ mạng di động (Apple công bố)" },
{ label: "Sạc", value: "12W qua cổng Lightning" },
],
},
{
group: "Thiết kế & Chất liệu",
rows: [
{ label: "Chất liệu", value: "Khung nhôm nguyên khối" },
{ label: "Kích thước", value: "250.6 × 174.1 × 7.5 mm" },
{ label: "Trọng lượng", value: "483g (Wi-Fi) / 493g (Wi-Fi + 4G)" },
{ label: "Bảo mật", value: "Touch ID tích hợp phím Home" },
],
},
{
group: "Kết nối",
rows: [
{ label: "SIM", value: "1 Nano SIM + eSIM (chỉ bản Wi-Fi + Cellular)" },
{ label: "Mạng di động", value: "4G LTE (bản Cellular)" },
{ label: "Wi-Fi", value: "Wi-Fi 5 (802.11ac) 2 băng tần, MIMO" },
{ label: "Bluetooth", value: "Bluetooth 4.2" },
{ label: "Định vị", value: "GPS/GNSS, GLONASS, Galileo, QZSS (bản Cellular)" },
{ label: "Cổng kết nối", value: "Lightning, jack tai nghe 3.5mm, Smart Connector" },
],
},
{
group: "Tiện ích & Phụ kiện",
rows: [
{ label: "Bút cảm ứng", value: "Apple Pencil thế hệ 1" },
{ label: "Bàn phím", value: "Smart Keyboard (qua Smart Connector)" },
{ label: "Âm thanh", value: "2 loa stereo" },
],
},
{
group: "Thông tin chung",
rows: [
{ label: "Hệ điều hành", value: "iPadOS 13 (nâng cấp được lên iPadOS 17)" },
{ label: "Ngày ra mắt", value: "Tháng 9/2019" },
],
},
],

// ===================== iPad Pro 11 inch (2020) =====================
"ipad-pro-11-2020": [
{
group: "Màn hình",
rows: [
{ label: "Kích thước", value: "11 inch" },
{ label: "Công nghệ", value: "Liquid Retina IPS LCD, ép kính (laminated), chống phản chiếu" },
{ label: "Độ phân giải", value: "2388 × 1668 pixel (264 ppi)" },
{ label: "Tần số quét", value: "ProMotion thích ứng tối đa 120Hz" },
{ label: "Độ sáng tối đa", value: "600 nits" },
{ label: "Tính năng", value: "True Tone, dải màu rộng P3, viền mỏng đều 4 cạnh" },
],
},
{
group: "Chip & Hiệu năng",
rows: [
{ label: "Chip xử lý", value: "Apple A12Z Bionic, CPU 8 nhân (4 hiệu năng + 4 tiết kiệm điện)" },
{ label: "GPU", value: "8 nhân (Apple thiết kế)" },
{ label: "Neural Engine", value: "8 nhân" },
{ label: "RAM", value: "6GB (hãng không công bố)" },
],
},
{
group: "Bộ nhớ",
rows: [{ label: "Dung lượng", value: "128GB / 256GB / 512GB / 1TB" }],
},
{
group: "Camera sau",
rows: [
{ label: "Camera chính", value: "12MP góc rộng, khẩu độ f/1.8" },
{ label: "Camera phụ", value: "10MP góc siêu rộng, f/2.4, góc nhìn 125°" },
{ label: "Cảm biến LiDAR", value: "Đo chiều sâu phục vụ AR, lấy nét nhanh trong tối" },
{ label: "Quay video", value: "4K @24/30/60fps, slow-motion 1080p @120/240fps" },
{ label: "Zoom", value: "Thu nhỏ 2x, zoom số tối đa 5x" },
{ label: "Đèn flash", value: "True Tone 2 tông màu" },
],
},
{
group: "Camera trước",
rows: [
{ label: "Độ phân giải", value: "7MP TrueDepth, khẩu độ f/2.2" },
{ label: "Quay video", value: "1080p @60fps" },
{ label: "Tính năng", value: "Face ID, chụp chân dung, Animoji/Memoji, Smart HDR" },
],
},
{
group: "Pin & Sạc",
rows: [
{ label: "Dung lượng pin", value: "28.65 Wh (~7.540 mAh — hãng không công bố)" },
{ label: "Thời lượng dùng", value: "Tới 10 giờ lướt web Wi-Fi / 9 giờ mạng di động (Apple công bố)" },
{ label: "Sạc", value: "18W qua cổng USB-C (củ sạc kèm máy)" },
],
},
{
group: "Thiết kế & Chất liệu",
rows: [
{ label: "Chất liệu", value: "Khung nhôm nguyên khối, mặt lưng nhôm" },
{ label: "Kích thước", value: "247.6 × 178.5 × 5.9 mm" },
{ label: "Trọng lượng", value: "471g (Wi-Fi) / 473g (Wi-Fi + 4G)" },
{ label: "Bảo mật", value: "Face ID (nhận diện khuôn mặt mọi chiều xoay)" },
],
},
{
group: "Kết nối",
rows: [
{ label: "SIM", value: "1 Nano SIM + eSIM (chỉ bản Wi-Fi + Cellular)" },
{ label: "Mạng di động", value: "4G LTE Gigabit-class (bản Cellular)" },
{ label: "Wi-Fi", value: "Wi-Fi 6 (802.11ax) 2 băng tần, MIMO" },
{ label: "Bluetooth", value: "Bluetooth 5.0" },
{ label: "Định vị", value: "GPS/GNSS, GLONASS, Galileo, QZSS (bản Cellular)" },
{ label: "Cổng kết nối", value: "USB-C (hỗ trợ xuất màn hình, đọc thẻ, ổ cứng ngoài)" },
],
},
{
group: "Tiện ích & Phụ kiện",
rows: [
{ label: "Bút cảm ứng", value: "Apple Pencil thế hệ 2 (hít nam châm, sạc không dây)" },
{ label: "Bàn phím", value: "Magic Keyboard (có trackpad), Smart Keyboard Folio" },
{ label: "Âm thanh", value: "4 loa stereo tự cân chỉnh theo chiều cầm máy" },
{ label: "Micro", value: "5 micro chất lượng phòng thu" },
],
},
{
group: "Thông tin chung",
rows: [
{ label: "Hệ điều hành", value: "iPadOS 13.4 (nâng cấp được lên iPadOS 26)" },
{ label: "Ngày ra mắt", value: "Tháng 3/2020" },
],
},
],

// ===================== iPad Air 4 (10.9 inch, 2020) =====================
"ipad-air-4": [
{
group: "Màn hình",
rows: [
{ label: "Kích thước", value: "10.9 inch" },
{ label: "Công nghệ", value: "Liquid Retina IPS LCD, ép kính (laminated), chống phản chiếu" },
{ label: "Độ phân giải", value: "2360 × 1640 pixel (264 ppi)" },
{ label: "Tần số quét", value: "60Hz" },
{ label: "Độ sáng tối đa", value: "500 nits" },
{ label: "Tính năng", value: "True Tone, dải màu rộng P3, viền mỏng đều 4 cạnh" },
],
},
{
group: "Chip & Hiệu năng",
rows: [
{ label: "Chip xử lý", value: "Apple A14 Bionic (5nm), CPU 6 nhân" },
{ label: "GPU", value: "4 nhân" },
{ label: "Neural Engine", value: "16 nhân" },
{ label: "RAM", value: "4GB (hãng không công bố)" },
],
},
{
group: "Bộ nhớ",
rows: [{ label: "Dung lượng", value: "64GB / 256GB" }],
},
{
group: "Camera sau",
rows: [
{ label: "Độ phân giải", value: "12MP góc rộng, khẩu độ f/1.8" },
{ label: "Quay video", value: "4K @24/30/60fps, slow-motion 1080p @120/240fps" },
{ label: "Zoom", value: "Zoom số tối đa 5x" },
{ label: "Tính năng", value: "Smart HDR, lấy nét tự động Focus Pixels (không có đèn flash)" },
],
},
{
group: "Camera trước",
rows: [
{ label: "Độ phân giải", value: "7MP FaceTime HD, khẩu độ f/2.2" },
{ label: "Quay video", value: "1080p @60fps" },
{ label: "Tính năng", value: "Smart HDR, quay video tua nhanh, ổn định hình ảnh" },
],
},
{
group: "Pin & Sạc",
rows: [
{ label: "Dung lượng pin", value: "28.6 Wh (~7.600 mAh — hãng không công bố)" },
{ label: "Thời lượng dùng", value: "Tới 10 giờ lướt web Wi-Fi / 9 giờ mạng di động (Apple công bố)" },
{ label: "Sạc", value: "20W qua cổng USB-C (củ sạc kèm máy)" },
],
},
{
group: "Thiết kế & Chất liệu",
rows: [
{ label: "Chất liệu", value: "Khung nhôm nguyên khối" },
{ label: "Kích thước", value: "247.6 × 178.5 × 6.1 mm" },
{ label: "Trọng lượng", value: "458g (Wi-Fi) / 460g (Wi-Fi + 4G)" },
{ label: "Bảo mật", value: "Touch ID tích hợp nút nguồn" },
{ label: "Màu sắc", value: "Xám, Bạc, Vàng hồng, Xanh lá, Xanh dương" },
],
},
{
group: "Kết nối",
rows: [
{ label: "SIM", value: "1 Nano SIM + eSIM (chỉ bản Wi-Fi + Cellular)" },
{ label: "Mạng di động", value: "4G LTE Gigabit-class (bản Cellular)" },
{ label: "Wi-Fi", value: "Wi-Fi 6 (802.11ax) 2 băng tần, MIMO" },
{ label: "Bluetooth", value: "Bluetooth 5.0" },
{ label: "Định vị", value: "GPS/GNSS, GLONASS, Galileo, QZSS (bản Cellular)" },
{ label: "Cổng kết nối", value: "USB-C (hỗ trợ ổ cứng ngoài, xuất màn hình)" },
],
},
{
group: "Tiện ích & Phụ kiện",
rows: [
{ label: "Bút cảm ứng", value: "Apple Pencil thế hệ 2 (hít nam châm, sạc không dây)" },
{ label: "Bàn phím", value: "Magic Keyboard, Smart Keyboard Folio" },
{ label: "Âm thanh", value: "2 loa stereo (khi cầm ngang)" },
],
},
{
group: "Thông tin chung",
rows: [
{ label: "Hệ điều hành", value: "iPadOS 14 (nâng cấp được lên iPadOS 26)" },
{ label: "Ngày ra mắt", value: "Tháng 10/2020" },
],
},
],

// ===================== iPad Air 5 (10.9 inch, 2022) =====================
"ipad-air-5": [
{
group: "Màn hình",
rows: [
{ label: "Kích thước", value: "10.9 inch" },
{ label: "Công nghệ", value: "Liquid Retina IPS LCD, ép kính (laminated), chống phản chiếu" },
{ label: "Độ phân giải", value: "2360 × 1640 pixel (264 ppi)" },
{ label: "Tần số quét", value: "60Hz" },
{ label: "Độ sáng tối đa", value: "500 nits" },
{ label: "Tính năng", value: "True Tone, dải màu rộng P3" },
],
},
{
group: "Chip & Hiệu năng",
rows: [
{ label: "Chip xử lý", value: "Apple M1 (5nm), CPU 8 nhân (4 hiệu năng + 4 tiết kiệm điện)" },
{ label: "GPU", value: "8 nhân" },
{ label: "Neural Engine", value: "16 nhân" },
{ label: "RAM", value: "8GB (hãng không công bố)" },
],
},
{
group: "Bộ nhớ",
rows: [{ label: "Dung lượng", value: "64GB / 256GB" }],
},
{
group: "Camera sau",
rows: [
{ label: "Độ phân giải", value: "12MP góc rộng, khẩu độ f/1.8" },
{ label: "Quay video", value: "4K @24/30/60fps, slow-motion 1080p @120/240fps" },
{ label: "Zoom", value: "Zoom số tối đa 5x" },
{ label: "Tính năng", value: "Smart HDR 3, quay tua nhanh có ổn định (không có đèn flash)" },
],
},
{
group: "Camera trước",
rows: [
{ label: "Độ phân giải", value: "12MP góc siêu rộng, f/2.4, góc nhìn 122°" },
{ label: "Quay video", value: "1080p @60fps" },
{ label: "Tính năng", value: "Center Stage — tự động bám theo người trong khung hình khi gọi video" },
],
},
{
group: "Pin & Sạc",
rows: [
{ label: "Dung lượng pin", value: "28.6 Wh (~7.600 mAh — hãng không công bố)" },
{ label: "Thời lượng dùng", value: "Tới 10 giờ lướt web Wi-Fi / 9 giờ mạng di động (Apple công bố)" },
{ label: "Sạc", value: "20W qua cổng USB-C (củ sạc kèm máy)" },
],
},
{
group: "Thiết kế & Chất liệu",
rows: [
{ label: "Chất liệu", value: "Khung nhôm nguyên khối (nhôm tái chế 100%)" },
{ label: "Kích thước", value: "247.6 × 178.5 × 6.1 mm" },
{ label: "Trọng lượng", value: "461g (Wi-Fi) / 462g (Wi-Fi + 5G)" },
{ label: "Bảo mật", value: "Touch ID tích hợp nút nguồn" },
{ label: "Màu sắc", value: "Xám, Trắng, Hồng, Tím, Xanh dương" },
],
},
{
group: "Kết nối",
rows: [
{ label: "SIM", value: "1 Nano SIM + eSIM (chỉ bản Wi-Fi + Cellular)" },
{ label: "Mạng di động", value: "5G (sub-6GHz) và 4G LTE (bản Cellular)" },
{ label: "Wi-Fi", value: "Wi-Fi 6 (802.11ax) 2 băng tần, MIMO" },
{ label: "Bluetooth", value: "Bluetooth 5.0" },
{ label: "Định vị", value: "GPS/GNSS, GLONASS, Galileo, QZSS (bản Cellular)" },
{ label: "Cổng kết nối", value: "USB-C tốc độ tới 10Gb/s (nhanh gấp 2 lần iPad Air 4)" },
],
},
{
group: "Tiện ích & Phụ kiện",
rows: [
{ label: "Bút cảm ứng", value: "Apple Pencil thế hệ 2 (hít nam châm, sạc không dây)" },
{ label: "Bàn phím", value: "Magic Keyboard, Smart Keyboard Folio" },
{ label: "Âm thanh", value: "2 loa stereo (khi cầm ngang)" },
],
},
{
group: "Thông tin chung",
rows: [
{ label: "Hệ điều hành", value: "iPadOS 15.4 (nâng cấp được lên iPadOS 26)" },
{ label: "Ngày ra mắt", value: "Tháng 3/2022" },
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
priceOriginal: "21.990.000đ",
storage: "256GB",
simType: "2 sim vật lý",
condition: "Hình thức 98-99%",
battery: "Pin 9x-100%",
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
// description/features để trống -> sinh tự động; khai báo sẵn -> dùng bản viết tay.
type DerivedInput = Omit<Product, "zaloLink" | "description" | "features"> &
Partial<Pick<Product, "description" | "features">>;

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
priceFrom: "Từ 1.990.000đ",
priceOriginal: "2.900.000đ",
storage: "32GB - 4G",
simType: "Wi-Fi + 4G (1 Nano SIM)",
condition: "Hình thức 98-99%",
battery: "Pin 8x-9x%",
image: "/products/ipadgen7.png",
description:
"iPad Gen 7 (10.2 inch, 2019) bản 32GB có 4G là lựa chọn máy tính bảng giá rẻ đáng mua nhất tại Dev Pồ cho học sinh, sinh viên và người dùng cơ bản. Màn hình Retina 10.2 inch rộng rãi, chip A10 Fusion mượt mà cho việc học online, xem phim, lướt web và ghi chú. Máy hỗ trợ Apple Pencil thế hệ 1 cùng Smart Keyboard qua cổng Smart Connector, có Touch ID phím Home và vẫn giữ jack tai nghe 3.5mm tiện lợi. Bản Cellular gắn được SIM 4G nên dùng ngoài đường không cần phát Wi-Fi từ điện thoại. Máy nguyên zin nguyên bản, hình thức 98-99%, đã kiểm tra kỹ trước khi giao, bảo hành tại cửa hàng và hỗ trợ trả góp 0%.",
features: [
"Màn hình Retina 10.2 inch, độ phân giải 2160 × 1620",
"Chip A10 Fusion đủ mượt cho học online, xem phim, lướt web",
"Hỗ trợ Apple Pencil 1 và Smart Keyboard (Smart Connector)",
"Có 4G LTE — dùng SIM đi ngoài đường không cần Wi-Fi",
"Pin 32.4 Wh cho tới 10 giờ sử dụng, còn jack tai nghe 3.5mm",
"Máy nguyên zin, hình thức 98-99%, bảo hành tại cửa hàng",
],
ipadLine: "gen",
connectivity: "cellular",
storageOptions: ["32GB"],
pencil: "Apple Pencil 1",
pencilIncluded: false,
techSpecs: techSpecsByIpad["ipad-gen-7"],
},
{
id: 20,
slug: "ipad-pro-2020-11-inch",
name: "iPad Pro 2020 11 inch",
category: "ipad",
priceFrom: "Từ 12.290.000đ",
priceOriginal: "13.890.000đ",
storage: "128GB - 4G",
simType: "Wi-Fi + 4G (1 Nano SIM)",
condition: "Hình thức 98-99%",
battery: "Pin 9x%",
image: "/products/ipadpro2020.png",
description:
"iPad Pro 11 inch 2020 bản 128GB có 4G là chiếc iPad mạnh mẽ nhất trong tầm giá tại Dev Pồ. Màn hình Liquid Retina 11 inch ép kính, chống phản chiếu cùng công nghệ ProMotion 120Hz cho thao tác vuốt chạm và nét vẽ mượt mà bậc nhất — rất hợp với dân thiết kế, vẽ digital và dựng video. Chip A12Z Bionic 8 nhân kèm GPU 8 nhân, RAM 6GB xử lý tốt Procreate, LumaFusion, Photoshop cho iPad. Cụm camera 12MP + 10MP góc siêu rộng kèm cảm biến LiDAR hỗ trợ AR, mở khoá bằng Face ID, 4 loa stereo và cổng USB-C tiện cho ổ cứng ngoài. Hỗ trợ Apple Pencil 2 và Magic Keyboard có trackpad để dùng như một chiếc laptop nhẹ. Máy nguyên zin nguyên bản, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
features: [
"Màn hình Liquid Retina 11 inch, ProMotion 120Hz siêu mượt",
"Chip A12Z Bionic 8 nhân + GPU 8 nhân, RAM 6GB — chiến tốt Procreate, LumaFusion",
"Camera 12MP + 10MP góc siêu rộng kèm cảm biến LiDAR, quay 4K 60fps",
"Mở khoá Face ID, 4 loa stereo, cổng USB-C đa năng",
"Hỗ trợ Apple Pencil 2 và Magic Keyboard có trackpad",
"Có 4G LTE, máy nguyên zin, hình thức 98-99%, pin 9x%",
],
ipadLine: "pro",
connectivity: "cellular",
storageOptions: ["128GB"],
pencil: "Apple Pencil 2",
pencilIncluded: false,
techSpecs: techSpecsByIpad["ipad-pro-11-2020"],
},
{
id: 21,
slug: "ipad-air-4",
name: "iPad Air 4",
category: "ipad",
badge: "Bán Chạy",
priceFrom: "Từ 7.390.000đ",
priceOriginal: "9.890.000đ",
storage: "64GB / 256GB - Wifi / 4G",
simType: "Bản Wi-Fi hoặc Wi-Fi + 4G (1 Nano SIM)",
condition: "Hình thức 98-99%",
battery: "Pin 8x-9x%",
image: "/products/ipadair4.png",
description:
"iPad Air 4 (10.9 inch, 2020) là chiếc iPad bán chạy tại Dev Pồ nhờ cân bằng rất tốt giữa giá và trải nghiệm. Máy mang thiết kế vuông vức viền mỏng giống iPad Pro, màn hình Liquid Retina 10.9 inch ép kính, chống phản chiếu, True Tone và dải màu P3 hiển thị rất đã mắt. Chip A14 Bionic 5nm cho hiệu năng dư dùng để học tập, làm việc văn phòng, vẽ Procreate và chơi game nặng. Touch ID chuyển lên nút nguồn tiện lợi, cổng USB-C kết nối được ổ cứng và màn hình ngoài, hỗ trợ Apple Pencil 2 hít nam châm cùng Magic Keyboard. Có sẵn cả bản Wi-Fi và bản 4G, dung lượng 64GB hoặc 256GB. Máy nguyên zin nguyên bản, hình thức 98-99%, bảo hành tại cửa hàng, hỗ trợ trả góp 0%.",
features: [
"Màn hình Liquid Retina 10.9 inch ép kính, True Tone, màu P3",
"Chip A14 Bionic 5nm — mượt cho học tập, làm việc, vẽ Procreate",
"Thiết kế viền mỏng giống iPad Pro, Touch ID ở nút nguồn",
"Hỗ trợ Apple Pencil 2 sạc nam châm và Magic Keyboard",
"Cổng USB-C, camera 12MP quay 4K, sạc nhanh 20W",
"Tùy chọn 64GB / 256GB, bản Wi-Fi hoặc 4G, hình thức 98-99%",
],
ipadLine: "air",
connectivity: "both",
storageOptions: ["64GB", "256GB"],
pencil: "Apple Pencil 2",
pencilIncluded: false,
techSpecs: techSpecsByIpad["ipad-air-4"],
},
{
id: 22,
slug: "ipad-air-5",
name: "iPad Air 5",
category: "ipad",
badge: "Bán Chạy",
priceFrom: "Từ 10.990.000đ",
priceOriginal: "12.990.000đ",
storage: "64GB / 256GB - Wifi / 4G",
simType: "Bản Wi-Fi hoặc Wi-Fi + 5G (1 Nano SIM)",
condition: "Hình thức 98-99%",
battery: "Pin 8x-9x%",
image: "/products/ipadair5.png",
description:
"iPad Air 5 (10.9 inch, 2022) là chiếc iPad đáng mua nhất hiện nay tại Dev Pồ khi được trang bị chip Apple M1 — đúng con chip trên MacBook Air, CPU 8 nhân và GPU 8 nhân cùng 8GB RAM. Máy chạy mượt mọi tác vụ nặng: dựng video 4K, vẽ Procreate nhiều layer, chia đôi màn hình làm việc, chơi game đồ hoạ cao. Màn hình Liquid Retina 10.9 inch ép kính, True Tone, dải màu P3; camera trước 12MP góc siêu rộng có Center Stage tự động bám theo người khi họp online. Cổng USB-C nhanh gấp đôi iPad Air 4 (tới 10Gb/s), bản Cellular hỗ trợ 5G, Touch ID ở nút nguồn, dùng được Apple Pencil 2 và Magic Keyboard. Máy nguyên zin nguyên bản, hình thức 98-99%, bảo hành tại cửa hàng, hỗ trợ trả góp 0%.",
features: [
"Chip Apple M1 (CPU 8 nhân, GPU 8 nhân, 8GB RAM) — mạnh ngang MacBook Air",
"Màn hình Liquid Retina 10.9 inch ép kính, True Tone, màu P3",
"Camera trước 12MP góc siêu rộng với Center Stage cho học/họp online",
"Cổng USB-C tốc độ tới 10Gb/s, bản Cellular hỗ trợ 5G",
"Hỗ trợ Apple Pencil 2 và Magic Keyboard, Touch ID ở nút nguồn",
"Tùy chọn 64GB / 256GB, bản Wi-Fi hoặc 5G, hình thức 98-99%",
],
ipadLine: "air",
connectivity: "both",
storageOptions: ["64GB", "256GB"],
pencil: "Apple Pencil 2",
pencilIncluded: false,
techSpecs: techSpecsByIpad["ipad-air-5"],
},
  {
    id: 29,
    slug: "ipad-pro-m1-11-inch",
    name: "iPad Pro M1 11 inch",
    category: "ipad",
    priceFrom: "Từ 14.990.000đ",
    priceOriginal: "16.990.000đ",
    storage: "128GB - 5G",
    simType: "Wi-Fi + 5G (1 Nano SIM)",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadprom1.png",
    description:
      "iPad Pro 11 inch M1 (2021) là bước nâng cấp mạnh mẽ với chip Apple M1 cùng hiệu năng ngang laptop, kèm bản 5G cho tốc độ mạng vượt trội khi di chuyển. Màn hình Liquid Retina ProMotion 120Hz mượt mà, RAM 8GB đủ sức cân mọi tác vụ từ chỉnh sửa ảnh, dựng video 4K đến chạy đa nhiệm nặng. Camera sau 12MP + 10MP góc siêu rộng kèm LiDAR hỗ trợ AR chuyên nghiệp, camera trước Ultra Wide có Center Stage tự động lấy nét khi họp video. Hỗ trợ Apple Pencil 2 và Magic Keyboard, biến máy thành công cụ làm việc di động toàn diện. Máy nguyên zin, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
    features: [
      "Chip Apple M1 hiệu năng ngang laptop, RAM 8GB",
      "Bản 5G tốc độ mạng vượt trội, đầy đủ Wi-Fi + Cellular",
      "Màn hình Liquid Retina 11 inch, ProMotion 120Hz",
      "Camera 12MP + 10MP góc siêu rộng, LiDAR hỗ trợ AR",
      "Camera trước Ultra Wide có Center Stage",
      "Hỗ trợ Apple Pencil 2 và Magic Keyboard",
      "Máy nguyên zin, hình thức 98-99%, pin 9x%",
    ],
    ipadLine: "pro",
    connectivity: "cellular",
    storageOptions: ["128GB"],
    pencil: "Apple Pencil 2",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-pro-m1-11-2021"]),
  },

  {
    id: 30,
    slug: "ipad-gen-8-128gb",
    name: "iPad Gen 8 (2020)",
    category: "ipad",
    priceFrom: "Từ 3.990.000đ",
    priceOriginal: "4.990.000đ",
    storage: "128GB - 4G",
    simType: "Wi-Fi + 4G (1 Nano SIM)",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadgen8.png",
    description:
      "iPad Gen 8 (2020) bản 128GB có 4G là lựa chọn phổ thông, giá tốt phù hợp học tập, giải trí và công việc văn phòng nhẹ nhàng. Chip A12 Bionic xử lý mượt các tác vụ hàng ngày, lướt web, xem phim, học online qua Zoom/Google Meet. Dung lượng 128GB thoải mái lưu trữ ảnh, video, tài liệu và ứng dụng học tập. Hỗ trợ Apple Pencil thế hệ 1 để ghi chú, vẽ tay tiện lợi. Máy nguyên zin, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
    features: [
      "Chip Apple A12 Bionic, xử lý mượt tác vụ hàng ngày",
      "Bản 128GB có 4G, thoải mái lưu trữ và học online mọi lúc",
      "Màn hình Retina 10.2 inch, True Tone",
      "Hỗ trợ Apple Pencil thế hệ 1",
      "Touch ID tiện lợi, bảo mật nhanh chóng",
      "Máy nguyên zin, hình thức 98-99%, pin 9x%",
    ],
    ipadLine: "gen",
    connectivity: "cellular",
    storageOptions: ["128GB"],
    pencil: "Apple Pencil 1",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-gen-8-2020"]),
  },

  {
    id: 31,
    slug: "ipad-gen-9",
    name: "iPad Gen 9 (2021)",
    category: "ipad",
    priceFrom: "Từ 4.990.000đ",
    priceOriginal: "5.990.000đ",
    storage: "64GB - 4G",
    simType: "Wi-Fi + 4G (1 Nano SIM)",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadgen9.png",
    description:
      "iPad Gen 9 (2021) nâng cấp chip A13 Bionic mạnh mẽ hơn thế hệ trước, có cả bản 64GB và 256GB đáp ứng nhu cầu học tập, làm việc, giải trí đa dạng. Camera trước 12MP Ultra Wide với Center Stage tự động lấy nét theo khuôn mặt khi gọi video, rất tiện cho học online và họp trực tuyến. Màn hình Retina 10.2 inch True Tone hiển thị màu sắc chân thực. Hỗ trợ Apple Pencil thế hệ 1. Máy nguyên zin, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
    features: [
      "Chip Apple A13 Bionic mạnh mẽ, đa nhiệm mượt mà",
      "Có 2 tuỳ chọn dung lượng: 64GB và 256GB",
      "Camera trước 12MP Ultra Wide, Center Stage tự lấy nét",
      "Màn hình Retina 10.2 inch, True Tone",
      "Hỗ trợ Apple Pencil thế hệ 1",
      "Máy nguyên zin, hình thức 98-99%, pin 9x%",
    ],
    ipadLine: "gen",
    connectivity: "cellular",
    storageOptions: ["64GB", "256GB"],
    pencil: "Apple Pencil 1",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-gen-9-2021"]),
  },

  {
    id: 32,
    slug: "ipad-air-3",
    name: "iPad Air 3 (2019)",
    category: "ipad",
    priceFrom: "Từ 3.490.000đ",
    priceOriginal: "4.290.000đ",
    storage: "64GB - 4G",
    simType: "Wi-Fi + 4G (1 Nano SIM)",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadair3.png",
    description:
      "iPad Air 3 (2019) sở hữu màn hình lớn 10.5 inch cùng chip A12 Bionic hiệu năng cao hơn hẳn phân khúc iPad thường, phù hợp cho công việc, học tập và giải trí đòi hỏi màn hình rộng rãi. Loa stereo cho trải nghiệm xem phim, nghe nhạc sống động. Hỗ trợ Apple Pencil thế hệ 1 để ghi chú, vẽ phác thảo. Bản 64GB có 4G tiện lợi kết nối mạng mọi lúc mọi nơi. Máy nguyên zin, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
    features: [
      "Chip Apple A12 Bionic, hiệu năng cao hơn iPad thường",
      "Màn hình Retina 10.5 inch, True Tone, hiển thị rộng rãi",
      "Loa stereo, trải nghiệm giải trí sống động",
      "Hỗ trợ Apple Pencil thế hệ 1",
      "Có 4G LTE, kết nối mạng mọi lúc mọi nơi",
      "Máy nguyên zin, hình thức 98-99%, pin 9x%",
    ],
    ipadLine: "air",
    connectivity: "cellular",
    storageOptions: ["64GB"],
    pencil: "Apple Pencil 1",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-air-3-2019"]),
  },

  {
    id: 33,
    slug: "ipad-pro-10-5-2017",
    name: "iPad Pro 10.5 inch 2017",
    category: "ipad",
    priceFrom: "Từ 4.600.000đ",
    priceOriginal: "5.590.000đ",
    storage: "64GB - 4G",
    simType: "Wi-Fi + 4G (1 Nano SIM)",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadpro10-5-2017.png",
    description:
      "iPad Pro 10.5 inch 2017 là dòng Pro đời đầu vẫn còn rất bền bỉ, được trang bị màn hình ProMotion 120Hz mượt mà hiếm có ở phân khúc giá này. Chip A10X Fusion mạnh mẽ, xử lý tốt các ứng dụng chỉnh sửa ảnh, ghi chú, làm việc văn phòng. Có cả bản 64GB và 256GB, đi kèm 4G tiện lợi. Hỗ trợ Apple Pencil thế hệ 1. Máy nguyên zin, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
    features: [
      "Chip Apple A10X Fusion, xử lý mượt đa số tác vụ văn phòng",
      "Màn hình ProMotion 120Hz 10.5 inch - hiếm có ở tầm giá này",
      "Có 2 tuỳ chọn dung lượng: 64GB và 256GB",
      "Hỗ trợ Apple Pencil thế hệ 1",
      "Có 4G LTE, kết nối linh hoạt",
      "Máy nguyên zin, hình thức 98-99%, pin 9x%",
    ],
    ipadLine: "pro",
    connectivity: "cellular",
    storageOptions: ["64GB", "256GB"],
    pencil: "Apple Pencil 1",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-pro-10-5-2017"]),
  },

  {
    id: 34,
    slug: "ipad-air-m4-11-inch",
    name: "iPad Air M4 11 inch (2026)",
    category: "ipad",
    priceFrom: "Từ 16.990.000đ",
    priceOriginal: "18.490.000đ",
    storage: "128GB - Wi-Fi",
    simType: "Chỉ Wi-Fi (không SIM)",
    condition: "Hình thức new",
    battery: "Pin 9x-100%",
    image: "/products/ipadairm4.png",
    description:
      "iPad Air M4 11 inch (2026) là thế hệ iPad Air mới nhất, lần đầu tiên được trang bị chip Apple M4 vốn trước đây chỉ có trên dòng Pro, thu hẹp đáng kể khoảng cách hiệu năng giữa Air và Pro. RAM nâng cấp lên 12GB cùng kết nối Wi-Fi 7 tốc độ cao giúp đa nhiệm, chỉnh sửa video 4K, xử lý AI mượt mà hơn hẳn thế hệ M3 trước đó. Máy giữ thiết kế mỏng nhẹ đặc trưng của dòng Air, hỗ trợ đầy đủ Apple Pencil Pro và Magic Keyboard, rất phù hợp cho sinh viên, dân văn phòng và người làm sáng tạo nội dung cần một thiết bị cân bằng giữa sức mạnh và tính di động. Máy nguyên zin, hình thức 98-99%, pin 9x-100%, bảo hành tại cửa hàng.",
    features: [
      "Chip Apple M4 - lần đầu tiên xuất hiện trên dòng Air, hiệu năng tăng ~30% so với M3",
      "RAM 12GB, đa nhiệm và xử lý AI mượt mà",
      "Kết nối Wi-Fi 7 tốc độ cao, thế hệ mới nhất",
      "Màn hình Liquid Retina 11 inch, True Tone",
      "Thiết kế mỏng nhẹ đặc trưng dòng Air",
      "Hỗ trợ Apple Pencil Pro và Magic Keyboard",
      "Máy nguyên zin, hình thức 98-99%, pin 9x-100%",
    ],
    ipadLine: "air",
    connectivity: "wifi",
    storageOptions: ["128GB"],
    pencil: "Apple Pencil Pro",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-air-m4-11-2026"]),
  },

  {
    id: 35,
    slug: "ipad-pro-2018-12-9-inch",
    name: "iPad Pro 2018 12.9 inch",
    category: "ipad",
    priceFrom: "Từ 9.790.000đ",
    priceOriginal: "11.590.000đ",
    storage: "64GB - Wi-Fi",
    simType: "Chỉ Wi-Fi (không SIM)",
    condition: "Hình thức 98-99%",
    battery: "Pin 9x%",
    image: "/products/ipadpro2018-12-9.png",
    description:
      "iPad Pro 2018 12.9 inch sở hữu màn hình lớn cực kỳ lý tưởng cho công việc thiết kế, xem tài liệu, dựng video với không gian hiển thị rộng rãi. Chip A12X Bionic mạnh mẽ, xử lý tốt các phần mềm sáng tạo nặng như Procreate, LumaFusion, Photoshop cho iPad. Mở khoá bằng Face ID nhanh chóng, 4 loa stereo cho trải nghiệm giải trí ấn tượng, cổng USB-C tiện lợi kết nối phụ kiện. Hỗ trợ Apple Pencil thế hệ 2 và Magic Keyboard. Máy nguyên zin, hình thức 98-99%, pin 9x%, bảo hành tại cửa hàng.",
    features: [
      "Màn hình Liquid Retina 12.9 inch, ProMotion 120Hz - không gian làm việc rộng rãi",
      "Chip Apple A12X Bionic, chiến tốt Procreate, LumaFusion",
      "Mở khoá Face ID, 4 loa stereo, cổng USB-C đa năng",
      "Hỗ trợ Apple Pencil thế hệ 2 và Magic Keyboard",
      "Máy nguyên zin, hình thức 98-99%, pin 9x%",
    ],
    ipadLine: "pro",
    connectivity: "wifi",
    storageOptions: ["64GB"],
    pencil: "Apple Pencil 2",
    pencilIncluded: false,
    techSpecs: quickIpadSpecToGroups(supplementalTechSpecsByIpad["ipad-pro-2018-12-9"]),
  },

  {
  id: 36,
  slug: "ipad-pro-m1-12-9-inch",
  name: "iPad Pro M1 12.9 inch",
  category: "ipad",
  badge: "Hot Nhất",
  priceFrom: "Từ 14.990.000đ",
  priceOriginal: "17.990.000đ",
  storage: "128GB / 256GB - Wi-Fi / 5G",
  simType: "Có bản Wi-Fi hoặc Wi-Fi + 5G",
  condition: "Hình thức 98-99%",
  battery: "Pin 9x%",
  image: "/products/ipadprom1-12-9.png",

  description:
    "iPad Pro M1 12.9 inch (2021) là lựa chọn cực kỳ phù hợp cho người cần một chiếc iPad màn hình lớn để thiết kế, dựng video, vẽ Procreate và làm việc chuyên nghiệp. Máy được trang bị chip Apple M1 mạnh ngang MacBook, RAM 8GB trên phiên bản 128GB và 256GB, xử lý mượt các tác vụ nặng và đa nhiệm. Màn hình Liquid Retina XDR 12.9 inch sử dụng công nghệ Mini-LED, hỗ trợ ProMotion 120Hz, hiển thị sắc nét, độ sáng cao và màu sắc sống động. Cụm camera sau 12MP kết hợp camera góc siêu rộng 10MP cùng cảm biến LiDAR, camera trước 12MP Ultra Wide hỗ trợ Center Stage. Máy có Face ID, 4 loa stereo, cổng Thunderbolt và hỗ trợ Apple Pencil 2 cùng Magic Keyboard. Có sẵn bản Wi-Fi và Wi-Fi + 5G, dung lượng 128GB hoặc 256GB.",

  features: [
    "Chip Apple M1 mạnh ngang MacBook, RAM 8GB",
    "Màn hình Liquid Retina XDR 12.9 inch sử dụng Mini-LED",
    "ProMotion 120Hz cho thao tác vuốt chạm và nét vẽ cực mượt",
    "Camera 12MP + 10MP góc siêu rộng, cảm biến LiDAR",
    "Camera trước 12MP Ultra Wide hỗ trợ Center Stage",
    "Face ID, 4 loa stereo và cổng Thunderbolt / USB 4",
    "Hỗ trợ Apple Pencil 2 và Magic Keyboard",
    "Có bản Wi-Fi hoặc Wi-Fi + 5G, dung lượng 128GB và 256GB",
  ],

  ipadLine: "pro",
  connectivity: "both",
  storageOptions: ["128GB", "256GB"],
  pencil: "Apple Pencil 2",
  pencilIncluded: false,

  techSpecs: quickIpadSpecToGroups(
    supplementalTechSpecsByIpad["ipad-pro-m1-12-9-2021"],
  ),
},
];

/** Mô tả sinh tự động — iPad không nói chuyện sim ghép nên tách riêng nội dung */
function autoDescription(p: DerivedInput): string {
if (p.category === "ipad") {
return `${p.name} cũ giá tốt tại Dev Pồ — máy nguyên zin nguyên bản, ${p.storage}, ${p.condition}, ${p.battery}. Máy đã qua kiểm tra kỹ màn hình, cảm ứng, camera, loa, Wi-Fi và pin trước khi giao, phù hợp cho học tập, làm việc, xem phim và vẽ với Apple Pencil. Bảo hành tại cửa hàng, hỗ trợ trả góp 0% và giao hàng toàn quốc. Liên hệ Zalo để được báo giá chi tiết và tư vấn chọn phiên bản Wi-Fi hay Cellular phù hợp.`;
}

return `${p.name} ${categoryLabel[p.category]} chính hãng tại Dev Pồ — máy nguyên zin nguyên bản, ${p.storage}, ${p.simType}, ${p.condition}, ${p.battery}. Đã fix lỗi sim ghép sử dụng ổn định, bảo hành trọn đời, cam kết giá tốt nhất thị trường TP. Hồ Chí Minh. Liên hệ Zalo để được báo giá chi tiết và tư vấn lên đời nhanh chóng.`;
}

/** Đặc điểm nổi bật sinh tự động theo nhóm sản phẩm */
function autoFeatures(p: DerivedInput): string[] {
if (p.category === "ipad") {
return [
p.simType,
p.condition,
p.battery,
"Máy nguyên zin nguyên bản, không bị iCloud ẩn",
"Kiểm tra kỹ màn hình, cảm ứng, camera, loa, Wi-Fi trước khi giao",
"Bảo hành tại cửa hàng, giao hàng toàn quốc, trả góp 0%",
];
}

return [
p.simType,
p.condition,
p.battery,
"Đã fix lỗi sim ghép, sử dụng ổn định",
"Bảo hành trọn đời lỗi sim ghép tại Dev Pồ",
"Giao hàng toàn quốc, hỗ trợ trả góp 0%",
];
}

const derivedProducts: Product[] = derivedInputs.map((p) => ({
...p,
zaloLink: ZALO_LINK,
description: p.description ?? autoDescription(p),
features: p.features ?? autoFeatures(p),
}));

/** Toàn bộ danh mục sản phẩm (sắp theo id) */
export const products: Product[] = [...detailedProducts, ...derivedProducts].sort(
(a, b) => a.id - b.id,
);

/** Chỉ các sản phẩm iPad — dùng cho trang danh mục /ipad */
export const ipadProducts: Product[] = products.filter((p) => p.category === "ipad");

/**

- Các mức dung lượng iPad đang có (gộp từ storageOptions của mọi máy), sắp tăng dần.
- Dùng dựng bộ lọc dung lượng ở /ipad để không phải khai báo tay hai nơi. */ export const ipadStorageOptions: string[] = Array.from( new Set(ipadProducts.flatMap((p) => p.storageOptions ?? [])), ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

/** Các mức tình trạng máy iPad đang có — dựng bộ lọc "tình trạng" ở /ipad */
export const ipadConditionOptions: string[] = Array.from(
new Set(ipadProducts.map((p) => p.condition)),
);

/** Máy có khớp lựa chọn kết nối không ("both" khớp cả Wi-Fi lẫn Cellular) */
export function matchesConnectivity(
product: Product,
filter: "all" | "wifi" | "cellular",
): boolean {
if (filter === "all") return true;
if (!product.connectivity) return false;
return product.connectivity === "both" || product.connectivity === filter;
}

/**

- Thứ tự sản phẩm nổi bật trên trang chủ — cố ý xen kẽ iPhone và iPad để khối
- "Sản phẩm nổi bật" không chỉ toàn iPhone. iPhone vẫn chiếm đa số (thế mạnh
- cốt lõi), nhưng khách luôn thấy ít nhất 3 chiếc iPad ngay màn hình đầu. */ export const homeFeaturedSlugs: string[] = [ "iphone-17-pro-max-lock", "ipad-air-5", "iphone-17-pro-lock", "ipad-pro-2020-11-inch", "iphone-16-pro-max-lock", "ipad-air-4", "iphone-16-pro-lock", "iphone-15-pro-max-lock", ];

const featuredRankBySlug = new Map(homeFeaturedSlugs.map((slug, i) => [slug, i]));

/**

- Điểm ưu tiên khi hiển thị danh sách rút gọn (trang chủ): máy nằm trong
- homeFeaturedSlugs lên trước theo đúng thứ tự đã chọn, phần còn lại giữ nguyên
- thứ tự theo id ở phía sau. */ export function featuredRank(product: Product): number { const rank = featuredRankBySlug.get(product.slug); return rank ?? homeFeaturedSlugs.length + product.id; }

/** Tìm sản phẩm theo slug — dùng cho trang chi tiết */
export function getProductBySlug(slug: string): Product | undefined {
return products.find((p) => p.slug === slug);
}

/** Lấy giá trị số từ chuỗi giá ("Từ 25.590.000đ" -> 25590000) — phục vụ JSON-LD/SEO */
export function priceToNumber(price: string): number {
return Number(price.replace(/\D/g, "")) || 0;
}
