# Event "Quay may mắn" — thiết lập backend

Toàn bộ logic quyết định (trúng gì, còn bao nhiêu quà, SĐT đã quay chưa, sinh mã)
nằm trong `scripts/event-wheel.gs` chạy trên Google Apps Script.

**Vì sao không gọi thẳng Google Sheets API từ Next.js:** devpo.vn không có
database. Muốn ghi Sheets mà không bị trùng dòng / không bị hai người cùng
giành suất quà cuối thì cần khoá — Apps Script có `LockService`, gọi Sheets API
từ Next.js thì không có gì đảm bảo.

---

## Bước 1 — Mở Apps Script gắn với sheet event

1. Mở sheet: <https://docs.google.com/spreadsheets/d/1_o0P08bfSTGFRnh3g-NCsIw8_2mYUAY5XYFm0S0bvP0/edit>
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá nội dung `Code.gs`, dán toàn bộ `scripts/event-wheel.gs` vào.
4. Lưu (Ctrl/Cmd + S).

## Bước 2 — Tạo sẵn các sheet

Trong Apps Script Editor, chọn hàm `buildStatus_` rồi bấm **Run** một lần.
Lần chạy đầu sẽ xin quyền truy cập Sheets — bấm cho phép.

Sau khi chạy, sheet sẽ tự có 3 tab:

| Tab | Dùng để |
|---|---|
| `Luot_Quay` | mỗi lượt quay một dòng: STT, Thời gian quay, Họ tên, SĐT, Phần thưởng, Mã ưu đãi |
| `Giai_Thuong` | **sửa tỉ lệ và số lượng quà ở đây** — không cần sửa code |
| `Config` | bật/tắt chương trình, giờ bắt đầu/kết thúc, token |

## Bước 3 — Chỉnh cấu hình

Mở tab **`Config`**:

| key | value | ý nghĩa |
|---|---|---|
| `enabled` | `TRUE` | đặt `FALSE` để tắt hẳn chương trình |
| `startAt` | `2026-10-31 15:00` | giờ VN. **Sửa ở đây để dời giờ mở, không cần deploy lại web** |
| `endAt` | `2026-11-01 23:59` | giờ VN |
| `token` | (chuỗi tự sinh) | **copy giá trị này**, lát nữa dán vào Vercel |

Mở tab **`Giai_Thuong`** để chỉnh số lượng quà thật:

| id | Tên giải | Tỉ lệ (%) | Số lượng |
|---|---|---|---|
| ipad300k | Giảm 300.000đ | 17 | 30 |
| ipad200k | Giảm 200.000đ | 26 | 50 |
| ipad100k | Giảm 100.000đ | 36 | 100 |
| pencil | Tặng Apple Pencil | 4 | 5 |
| airpods | Tặng AirPods | 2 | 3 |
| **iphone500k** | Giảm 500.000đ | **5 (ghim cứng)** | 20 |
| cuongluc | Dán cường lực + vệ sinh | 10 | 500 |

Bộ số trên cộng tròn **100**, nên cột "Tỉ lệ" đọc đúng là phần trăm thật.
Chi phí giảm giá kỳ vọng: **164.000đ/lượt quay**.

Lưu ý về tỉ lệ:

- `iphone500k` **luôn đúng 5%** bất kể bạn sửa cột "Tỉ lệ" — con số 5% được ghim
  trong code theo yêu cầu. Khi giải này hết số lượng, 5% đó tự chia lại cho các
  giải còn lại.
- Các giải khác chia nhau 95% còn lại **theo tỉ lệ tương đối**, nên không bắt
  buộc phải cộng tròn 100 — nhưng **nên** giữ tổng = 100 để con số trong sheet
  đọc đúng là phần trăm thật.
- ⚠️ Hệ quả của "tỉ lệ tương đối": hạ tỉ lệ một giải thì phần đó **tự chảy sang
  các giải còn lại**, kể cả giải đắt tiền. Ví dụ hạ `cuongluc` 35 → 10 mà không
  sửa gì khác sẽ đẩy chi phí từ 122k lên 157k/lượt. Sửa một ô thì rà lại cả cột.
- Giải hết số lượng sẽ tự biến mất khỏi vòng quay, không cần làm gì thêm
  (khách không thấy con số tồn kho, nhưng ô giải sẽ không còn trên vòng).

Cột **"Đã phát"** do hệ thống tự tăng — đừng sửa tay trong lúc event đang chạy.

## Bước 4 — Deploy Web App

1. Góc phải trên: **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. *Execute as*: **Me**.
4. *Who has access*: **Anyone**.
5. Bấm **Deploy**, copy **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`).

> *Who has access = Anyone* nghe đáng lo nhưng cần thiết: server Next.js phải gọi
> được. Đổi lại, mọi request bắt buộc kèm `token` ở Bước 3 — thiếu token thì bị
> từ chối. Token chỉ nằm ở server, không bao giờ ra trình duyệt khách.

## Bước 5 — Gửi lại cho tôi 2 giá trị

```
EVENT_WHEEL_API   = <Web app URL vừa copy ở Bước 4>
EVENT_WHEEL_TOKEN = <giá trị token ở tab Config>
```

Hai biến này đặt ở **Vercel → project devpo-landingpage → Settings →
Environment Variables** (Production), và thêm vào `.env.local` khi chạy máy.

Cả hai đều **không** có tiền tố `NEXT_PUBLIC_` nên không lọt vào bundle client.

---

## Kiểm tra nhanh sau khi deploy

Dán vào trình duyệt (thay `<URL>` và `<TOKEN>`):

```
<URL>?token=<TOKEN>
```

Kết quả đúng là JSON dạng:

```json
{
  "ok": true,
  "phase": "upcoming",
  "startAt": "2026-10-31T08:00:00.000Z",
  "prizes": [{ "id": "ipad300k", "ten": "Giảm 300.000đ", "con_lai": 30, "het": false }]
}
```

- `"phase"` sẽ là `upcoming` → `open` → `ended` tuỳ thời điểm.
- Nếu thấy `{"ok":false,"error":"Token không hợp lệ."}` thì token dán sai.

## Kiểm tra tỉ lệ 5%

Trong Apps Script Editor, chạy hàm `testTiLe500K()` rồi xem **Execution log**.
Hàm này chỉ bốc thử 200.000 lần trong bộ nhớ, **không ghi gì vào sheet**.

---

# Phần frontend (đã code sẵn, không cần sửa gì)

## Các file đã thêm vào website

| File | Việc |
|---|---|
| `lib/event-wheel.ts` | kiểu dữ liệu, validate SĐT, mô tả & điều kiện từng giải, thể lệ |
| `lib/event-wheel-mock.ts` | dữ liệu giả để chạy thử khi chưa có URL Apps Script (chỉ ở máy dev) |
| `app/api/event-wheel/route.ts` | proxy giữ token, validate lại, chặn spam, cache 8 giây |
| `app/components/event-wheel/*` | trang event, form, vòng quay, màn kết quả, đếm ngược, confetti, âm thanh |
| `app/event-thang10/page.tsx` | route + metadata SEO của trang |
| `app/components/conditional-chrome.tsx` | ẩn ticker/footer ở trang event cho gọn |
| `app/sitemap.ts` | thêm `/event-thang10` |

Đây là một **trang riêng** tại `/event-thang10`, **không phải popup**. Các trang
khác của website hoàn toàn không bị đụng tới — không có modal tự bật ở đâu cả.

## Trang hiển thị gì theo từng giai đoạn

| Trạng thái (do server chốt) | Khách thấy gì |
|---|---|
| `off` (chưa cấu hình env, hoặc `enabled=FALSE`) | trang "Chương trình chưa mở" + nút về trang chủ |
| `upcoming` | thông báo sắp diễn ra + đếm ngược tới giờ mở |
| `open` | vòng quay + form nhập thông tin |
| `ended` | thông báo đã kết thúc |

Mọi trạng thái đều có nút **"Về trang chủ"** ở góc trên bên trái. Khách đã quay
rồi thì vào lại trang sẽ thấy đúng phần quà và mã cũ (tra theo SĐT đã lưu).

Bố cục: từ 1024px trở lên trang chia **2 cột nằm ngang** (vòng quay bên trái,
form bên phải) và vừa trọn màn hình, không phải cuộn. Trên điện thoại xếp dọc
một cột và cuộn bình thường.

**Không hiển thị số lượng quà còn lại cho khách.** Số lượng vẫn được quản lý
đầy đủ ở tab `Giai_Thuong` và backend vẫn tự loại giải đã hết khỏi vòng quay —
chỉ là khách không nhìn thấy con số.

**Link để chạy quảng cáo / gửi khách:** `https://www.devpo.vn/event-thang10`

## Xem thử trước khi event chạy

Chỉ hoạt động ở máy dev (`pnpm dev`), **production bỏ qua tham số này** nên khách
không thể tự ép chương trình mở:

```
http://localhost:3000/event-thang10?mock=upcoming   # màn sắp diễn ra
http://localhost:3000/event-thang10?mock=open       # vòng quay
http://localhost:3000/event-thang10?mock=ended      # đã kết thúc
http://localhost:3000/event-thang10?mock=empty      # hết sạch quà
```

Muốn quay thử lại nhiều lần: mở DevTools → Console → `localStorage.clear()` rồi F5
(ở chế độ mock, dữ liệu lượt quay nằm trong RAM, restart server là sạch).

## Bật chương trình thật

1. Làm xong Bước 1–4 ở trên, lấy được `EVENT_WHEEL_API` và `EVENT_WHEEL_TOKEN`.
2. Dán vào **Vercel → Settings → Environment Variables** (môi trường *Production*).
3. Dán vào `.env` ở máy để chạy thử.
4. Deploy lại (hoặc Redeploy trên Vercel) để biến môi trường có hiệu lực.

**Thiếu 2 biến này thì production tự coi là chương trình TẮT**, trang
`/event-thang10` sẽ hiện "Chương trình chưa mở" — không có chuyện phát quà giả
trên web thật.

## Tắt / dời giờ sau khi đã chạy

Sửa trực tiếp tab **`Config`** trong Google Sheet, **không cần deploy lại**:

- `enabled` = `FALSE` → tắt ngay, trang chuyển sang "Chương trình chưa mở".
- `startAt` / `endAt` → dời giờ mở hoặc đóng.
- Tab `Giai_Thuong` → đổi số lượng hoặc tỉ lệ từng giải.

Website đọc lại cấu hình mỗi 8 giây (có cache để đỡ tốn hạn mức Apps Script),
nên thay đổi có hiệu lực sau khoảng 10 giây.

## Những thứ đã được kiểm thử

- Tỉ lệ giải 500K: chạy 500.000 lượt trên đúng hàm `pickPrize_` trong file `.gs`
  → **5.012%** (yêu cầu 5%). Khi giải này hết hàng → 0%, phần 5% tự chia lại.
- Một SĐT chỉ quay được một lần, kể cả khi xoá `localStorage` hoặc tải lại trang.
- Gửi trùng `requestId` (bấm lại / mạng chập) → trả lại kết quả cũ, **không ghi
  thêm dòng vào sheet**.
- Chặn quay khi chưa tới giờ / đã hết giờ / hết sạch quà — kiểm tra ở server.
- Form: thiếu tên, SĐT sai định dạng, chưa tick thể lệ → không quay được
  (chặn ở cả client lẫn server).
- Rate limit chống spam, nới rộng cho khách dùng 4G chung IP (CGNAT).
- Toàn bộ luồng trên trình duyệt: vào trang → nhập → quay → vòng dừng đúng ô →
  hiện mã → tải lại trang vẫn ra đúng mã cũ, không có lỗi JS.
- Nút "Về trang chủ" điều hướng đúng; desktop 1440×900 và 1366×768 không phải cuộn.
- Các trang hiện có (`/`, `/products`, `/ipad`, `/guides`, `/news`, `/check-imei`,
  `/give-away`) vẫn trả HTTP 200, SEO/JSON-LD không đổi.

## Việc còn lại cần bạn làm

1. Làm Bước 1–4 (tạo Apps Script, deploy Web App) → gửi lại 2 giá trị env.
2. Kiểm tra lại số lượng quà thật ở tab `Giai_Thuong` (hiện đang để số mẫu:
   300K=30, 200K=50, 100K=100, Pencil=5, AirPods=3, 500K=20, cường lực=500).
3. Xác nhận giờ bắt đầu/kết thúc ở tab `Config`.
4. Nếu muốn khách vào được từ website (thay vì chỉ qua link), nói tôi gắn thêm
   banner/nút trỏ tới `/event-thang10` ở trang chủ — hiện tại trang chỉ truy cập
   qua link trực tiếp.
