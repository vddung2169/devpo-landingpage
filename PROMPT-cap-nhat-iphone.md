# Prompt: Lấy & cập nhật cấu hình chi tiết iPhone (12 → 17 Pro Max) cho devpo.vn

> Dán prompt này cho một AI agent có quyền truy cập repo `devpo-web`, quyền web (WebSearch/WebFetch) và quyền sửa file.
> Mục tiêu: bổ sung **cấu hình kỹ thuật chi tiết kiểu Thế Giới Di Động** cho toàn bộ mẫu iPhone và render đẹp trên trang chi tiết sản phẩm.

---

## 1. Bối cảnh dự án (đọc kỹ trước khi sửa)

- Framework: **Next.js (App Router) + TypeScript + Tailwind**.
- Nguồn dữ liệu sản phẩm tập trung: `data/products.ts` — đây là **single source of truth**. Trang chủ, trang danh sách `/products`, và trang chi tiết `/products/[slug]` đều đọc từ đây.
- Interface hiện có: `Product` (id, slug, name, category, badge, priceFrom, priceOriginal, storage, simType, condition, battery, image, zaloLink, description, features).
- Ảnh sản phẩm: đặt trong `public/products/<ten>.png`, tham chiếu qua `image: "/products/<ten>.png"`.
- Trang chi tiết: `app/products/[slug]/page.tsx` — hiện render một bảng “Thông số kỹ thuật” đơn giản (5 dòng). Có JSON-LD `Product` + `BreadcrumbList` cho SEO.
- Link liên hệ dùng chung: `ZALO_LINK` (đã khai báo trong `data/products.ts`).

## 2. Việc cần làm

### 2.1. Mở rộng schema (interface `Product`)
Thêm cấu trúc cấu hình chi tiết theo **nhóm**, để tương thích ngược nên đặt **optional**:

```ts
export interface SpecRow {
  label: string;   // VD "Công nghệ màn hình"
  value: string;   // VD "Super Retina XDR OLED"
}
export interface SpecGroup {
  group: string;   // VD "Màn hình"
  rows: SpecRow[];
}
// Thêm vào interface Product:
//   /** Cấu hình kỹ thuật chi tiết theo nhóm (tùy chọn) */
//   techSpecs?: SpecGroup[];
```

Các **nhóm** chuẩn (bám theo cách TGDD trình bày):
1. **Màn hình** — Kích thước, Công nghệ, Độ phân giải, Tần số quét, Độ sáng tối đa, Mặt kính, Tính năng (Dynamic Island/Notch, Always-On…)
2. **Chip & Hiệu năng** — Chip xử lý, GPU, RAM (ghi rõ “Hãng không công bố” nếu là số từ bên thứ ba)
3. **Bộ nhớ** — Các tùy chọn dung lượng
4. **Camera sau** — Số ống kính + độ phân giải + loại (chính/góc siêu rộng/tele), khẩu độ, zoom quang, quay video (4K, ProRes, Cinematic…), tính năng đặc biệt (LiDAR, Camera Control…)
5. **Camera trước** — Độ phân giải, khẩu độ, tính năng
6. **Pin & Sạc** — Dung lượng (mAh, chú thích nguồn), thời lượng video Apple công bố, sạc có dây (công suất), MagSafe/Qi
7. **Thiết kế & Chất liệu** — Chất liệu khung/lưng, Kích thước (mm), Trọng lượng (g), Kháng nước (IP)
8. **Kết nối** — SIM/eSIM, Mạng (4G/5G), Wi-Fi, Bluetooth, NFC, Cổng (Lightning/USB-C + chuẩn USB), Nút Action/Camera Control
9. **Thông tin chung** — Hệ điều hành khi ra mắt, Ngày ra mắt

### 2.2. Điền dữ liệu cho **TẤT CẢ** biến thể (không thiếu mã nào)
Danh sách bắt buộc đầy đủ:

- **iPhone 12:** 12 mini, 12, 12 Pro, 12 Pro Max
- **iPhone 13:** 13 mini, 13, 13 Pro, 13 Pro Max
- **iPhone 14:** 14, 14 Plus, 14 Pro, 14 Pro Max
- **iPhone 15:** 15, 15 Plus, 15 Pro, 15 Pro Max
- **iPhone 16:** 16, 16 Plus, 16 Pro, 16 Pro Max, 16e
- **iPhone 17:** 17, 17 Air (tên chính thức “iPhone Air”), 17 Pro, 17 Pro Max

### 2.3. Nguồn dữ liệu
- **Ưu tiên:** trang cấu hình Thế Giới Di Động (thegioididong.com).
- **Đối chiếu:** Apple.com (trang /specs), GSMArena.
- **Nguyên tắc:** không bịa số. RAM và pin mAh là số bên thứ ba (Apple không công bố) → ghi chú rõ. Model sau 2025 (16e, dòng 17) **bắt buộc web search**, không suy đoán từ trí nhớ.

### 2.4. Ảnh sản phẩm
- Ánh xạ trước với ảnh có sẵn trong `public/products/`.
- Với biến thể thiếu ảnh: tải ảnh chính hãng (nền trắng/trong suốt) về đúng `public/products/<slug>.png`, tối ưu dung lượng (< ~200KB, PNG).
- Đặt tên file theo slug để dễ quản lý.

### 2.5. Render trang chi tiết
- Sửa `app/products/[slug]/page.tsx`: nếu `product.techSpecs` tồn tại → render **bảng cấu hình chi tiết theo nhóm** (mỗi nhóm một tiêu đề, các dòng label/value), giữ nguyên bảng tóm tắt cũ hoặc thay thế hợp lý.
- Đảm bảo dark mode, responsive, và không phá JSON-LD/SEO hiện có.

## 3. Ràng buộc & chất lượng
- Giữ **tương thích ngược**: sản phẩm chưa có `techSpecs` vẫn render bình thường.
- Không đổi `slug` các sản phẩm đang bán (giữ SEO/URL).
- Sau khi sửa: chạy `tsc --noEmit` (hoặc `next build`) để chắc không lỗi kiểu.
- Ghi rõ trong mô tả các trường không chắc chắn thay vì bịa.

## 4. Bàn giao
- Cập nhật trực tiếp `data/products.ts`, `app/products/[slug]/page.tsx`, thêm ảnh vào `public/products/`.
- Liệt kê các file đã đổi và các điểm cần người kiểm chứng (giá VN, RAM, mAh).
