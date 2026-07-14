# Nối Giveaway với Google Sheet

Backend: [`scripts/giveaway.gs`](./giveaway.gs) (Google Apps Script) đọc/ghi Google Sheet và
trả JSON đúng định dạng web đang gọi. Web KHÔNG lưu dữ liệu — nơi lưu thật là **Google Sheet**.

Sheet đang dùng:
`https://docs.google.com/spreadsheets/d/10sDZgyu1SDwx33q5lrnQSPmA-8dVpfHx4Jeee_2cvYY/edit`

---

## 1. Chuẩn bị các tab trong Sheet

### Tab danh sách/quay thưởng (đã có sẵn)
Script ưu tiên đọc tab **`Danhsach`**. Tab này có thể là danh sách tên đơn giản, hoặc format đăng ký đầy đủ.

Nếu chỉ quay thưởng từ danh sách có sẵn, mỗi dòng chỉ cần một tên:

| A |
|---|
| Họ tên |
| Nguyễn Văn A |
| Trần Thị B |

Nếu dùng cả form đăng ký trên web, giữ format 4 cột (hàng 1 là tiêu đề):

| A | B | C | D |
|---|---|---|---|
| Thời gian | Số vé | Họ tên | Số điện thoại |

Script tự dùng tab tên `Danhsach` / `DangKy` / `Đăng ký`, nếu không có thì dùng **tab đầu tiên**.

### Tab `Config` (TẠO MỚI — bắt buộc)
Thêm một tab tên đúng là **`Config`**, gõ theo dạng key–value (cột A = tên, cột B = giá trị):

| A | B |
|---|---|
| id | GA-2026-07 |
| title | Giveaway tháng 7 — Tri ân khách hàng Devpo |
| prize | 200.000đ tiền mặt |
| openAt | 2026-07-13 11:00:00 |
| closeAt | 2026-07-13 18:00:00 |
| drawAt | 2026-07-13 18:00:00 |
| endAt | 2026-07-13 23:59:59 |
| winnerTicket | *(để trống — script tự điền khi quay thưởng)* |

- Trạng thái trang **tự suy ra từ giờ**: trước `openAt` = `upcoming` (đếm ngược tới giờ mở); từ `openAt` đến `closeAt` = `open`; sau `closeAt` chưa có người trúng = `closed`; có `winnerTicket` = `announced`; sau `endAt` = trang rỗng.
- `openAt` bỏ trống thì mở đăng ký ngay khi tạo Config (không có bước "sắp diễn ra").
- Ô ngày giờ nên định dạng **Plain text** (Format → Number → Plain text) để không bị lệch múi giờ. Giờ hiểu theo GMT+7.

### Tab `History` (TẠO MỚI — tùy chọn)
Muốn hiện cột "Các đợt đã trao thưởng", thêm tab **`History`** (hàng 1 tiêu đề):

| A (id) | B (title) | C (prize) | D (endAt) | E (totalEntries) | F (winnerName) | G (winnerPhone) |
|---|---|---|---|---|---|---|
| GA-2026-06 | Giveaway tháng 6 | 200.000đ tiền mặt | 2026-06-30 23:59:59 | 88 | Nguyễn Văn A | 0901234567 |

SĐT ở đây web sẽ **tự che** thành `090****567`. Không có tab này thì cột lịch sử tự ẩn.

---

## 2. Dán code Apps Script

1. Mở Sheet → menu **Tiện ích mở rộng → Apps Script**.
2. Xóa nội dung mẫu, dán toàn bộ [`scripts/giveaway.gs`](./giveaway.gs) vào. Lưu.

## 3. Đặt mã quản trị (cho quay thưởng)

Trong Apps Script: **Project Settings (⚙️) → Script Properties → Add property**
- Property: `ADMIN_KEY`
- Value: một chuỗi bí mật tự đặt, ví dụ `devpo-quay-thuong-2026`

(Mã này KHÔNG nằm trong Sheet hay code.)

## 4. Triển khai Web App

1. Nút **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. **Execute as: Me** · **Who has access: Anyone**.
4. **Deploy** → cấp quyền cho Google → copy **Web app URL** (kết thúc bằng `/exec`).

> Mỗi lần sửa code phải **Deploy → Manage deployments → Edit → Deploy** lại (hoặc tạo deployment mới) thì thay đổi mới có hiệu lực.

## 5. Khai báo biến môi trường cho web

Trong `.env.local` (chạy local) **và** Vercel → Project → Environment Variables (production):

```
GIVEAWAY_API=<dán Web app URL /exec ở bước 4>
GIVEAWAY_ADMIN_KEY=<đúng bằng ADMIN_KEY ở bước 3>
```

`GIVEAWAY_ADMIN_KEY` phải **giống hệt** `ADMIN_KEY` — web gửi mã này sang, Apps Script mới cho quay.

Xong: mở `/give-away`. Mỗi đăng ký sẽ được ghi một dòng vào tab danh sách của Sheet. Khi admin bấm quay, web chốt người trúng trên server rồi chạy hiệu ứng trong khoảng **20 giây** trước khi công bố.

---

## Luồng dữ liệu

```
Trình duyệt khách
   → /api/give-away        (Next.js, chỉ trung chuyển, giấu URL + key)
   → Apps Script /exec     (GIVEAWAY_API)
   → GOOGLE SHEET          ← nơi lưu: Thời gian | Số vé | Họ tên | Số điện thoại
```

## Kiểm thử nhanh (khỏi cần web)

Dán Web app URL vào trình duyệt → thấy JSON `{"ok":true,...}` là chạy.
Thêm `?phone=0901234567` để thử tra vé.

## Lưu ý riêng tư
- SĐT **đầy đủ** chỉ nằm trong Sheet (để liên hệ trao thưởng) và chỉ trả về cho **chính chủ** khi tra vé.
- Người trúng / lịch sử hiển thị công khai luôn ở dạng **che** `090****567`.
