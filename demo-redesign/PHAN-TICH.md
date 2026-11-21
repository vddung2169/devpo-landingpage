# Phân tích trang chủ devpo.vn và bản demo bố cục mới

Cách xem demo: mở file `demo-redesign/index.html` bằng trình duyệt (bấm đúp là được, không cần chạy `pnpm dev`). Demo dùng chung ảnh trong `public/`, không sửa bất kỳ file nào của web đang chạy.

Những chỗ có **nền vàng, gạch chân đứt** trong demo là thông tin tạm, cần anh/chị bổ sung.

---

## 1. Trang chủ hiện tại đang có gì (theo thứ tự)

1. Header + thanh chữ chạy (Free ship, Hỗ trợ trọn đời…)
2. Hero: "iPhone Lock, Quốc tế & iPad" + 2 nút + 3 con số (30+ mẫu, 2.800+ khách, 9.9 điểm)
3. Sản phẩm nổi bật (8 máy, có lọc + tìm kiếm)
4. iPhone Lock là gì + 4 ưu điểm
5. iPad Lock là gì + 3 loại iPad + lời khuyên
6. Cẩm nang video TikTok (15 video, có phân trang)
7. Bảng mã IMSI nhà mạng
8. Ảnh khách hàng (36 ảnh)
9. Đoạn văn SEO "Cửa hàng iPhone Lock… uy tín"
10. Hỏi đáp (13 câu)

## 2. Vì sao chưa giữ được người xem

**a. Hero không nói được lý do để mua.** Tiêu đề chỉ liệt kê loại hàng, câu phụ "chất lượng cao, giá phải chăng nhất thị trường" cửa hàng nào cũng nói. Điểm mạnh thật của Dev Pồ là *cùng chiếc iPhone mà rẻ hơn vài triệu, có người lo sim ghép trọn đời*, nhưng phải cuộn xuống khối thứ 3 mới thấy.

**b. Thứ tự thông tin ngược với tâm lý khách.** Khách lần đầu nghe "iPhone Lock" thường lo: máy này có rủi ro không? Trang hiện tại đưa bảng giá trước, giải thích sau, còn bằng chứng tin cậy (ảnh khách, địa chỉ, cửa hàng thật) nằm gần cuối trang.

**c. Quá nhiều nội dung kỹ thuật trên trang chủ.** Bảng mã IMSI, 15 video cẩm nang và 2 khối giải thích dài (iPhone + iPad) là nội dung cho người *đã mua*, không phải người *đang cân nhắc*. Chúng đẩy phần chốt đơn ra xa.

**d. Thiếu "mua thế nào".** Không có chỗ nào nói rõ: nhắn ai, có được xem máy trước không, ship thì kiểm hàng ra sao, lỗi thì làm gì. Đây là câu hỏi số một của khách ở tỉnh.

**e. Cửa hàng thật bị giấu.** Ảnh cửa hàng (`background-2.jpg`) rất đẹp nhưng chỉ làm ảnh nền hero, không có chú thích. Địa chỉ, giờ mở cửa, nút chỉ đường không xuất hiện trên trang chủ (chỉ có trong câu hỏi đáp cuối trang).

**f. Con số chưa có nguồn.** "9.9 điểm đánh giá" không nói điểm của đâu, dễ làm khách nghi ngờ. "2.800+ khách" cũng vậy.

**g. Thông tin mâu thuẫn.** Khối ưu điểm ghi "rẻ hơn 3–10 triệu", phần hỏi đáp ghi "rẻ hơn 2–5 triệu". Menu có "iPhone Quốc tế" nhưng dữ liệu sản phẩm chưa có máy Quốc tế nào.

**h. Giao diện đều đều.** Mọi khối cùng một kiểu (tiêu đề + lưới thẻ bo góc), cùng hiệu ứng mờ dần trượt lên khi cuộn, nên mắt không biết đâu là điểm chính. Thanh chữ chạy và 3 bong bóng chat nổi cũng chiếm chỗ trên điện thoại.

## 3. Bản demo thay đổi gì

Giữ nguyên toàn bộ màu (trắng, gần đen, xám #f5f5f7, đỏ cho giá) và font Be Vietnam Pro. Chỉ đổi bố cục, thứ tự và chuyển động.

| Thứ tự mới | Mục đích |
|---|---|
| 1. Hero "Cùng một chiếc iPhone. Rẻ hơn vài triệu." + **Phiếu so giá** | Nói ngay lý do mua. Phiếu so giá cho khách chọn đời máy và thấy số tiền giữ lại |
| 2. Dải 4 cam kết (tĩnh, không chạy chữ) | Trọn đời, test tận tay, 0đ ship, trả góp 0% |
| 3. Máy đang có ở cửa hàng | Tab Lock / Quốc tế / iPad, mỗi máy ghi rõ "Rẻ hơn x đ", ô cuối "Không thấy máy bạn cần? Nhắn Zalo" |
| 4. Lock khác Quốc tế đúng một chỗ: khay sim | Bảng so sánh ngắn thay cho 2 khối giải thích dài; iPad gói vào một mục mở rộng |
| 5. Mua ở Dev Pồ diễn ra thế nào (4 bước) | Trả lời "mua thế nào, có rủi ro không" |
| 6. Khách nhận máy tại cửa hàng | Trích lời khách + điểm Google Maps + ảnh khách dạng lưới so le |
| 7. Xem trước khi mua (3 video) | Chỉ giữ 3 video đáng xem nhất, còn lại ở trang Cẩm nang |
| 8. Hỏi đáp (6 câu) + thẻ cửa hàng | Ảnh cửa hàng, địa chỉ, giờ mở cửa, 2 số điện thoại, nút chỉ đường |
| 9. CTA cuối + footer | |

**Chuyển ra khỏi trang chủ:** bảng mã IMSI, 12 video cẩm nang còn lại, 7 câu hỏi đáp còn lại, đoạn văn SEO (gộp vào mô tả hero và footer).

**Chuyển động:** chỉ một khoảnh khắc chính, là phiếu so giá ở hero: máy trượt vào, giá Quốc tế bị gạch đỏ, giá Lock chạy xuống, rồi "đóng dấu" số tiền khách giữ lại. Bấm đời máy khác thì chạy lại. Các khối khác chỉ có hiệu ứng khi rê chuột. Người dùng bật "Giảm chuyển động" sẽ thấy ngay kết quả cuối, không có hiệu ứng.

**Trên điện thoại:** 3 bong bóng chat được thay bằng một thanh cố định dưới đáy (Gọi · Zalo báo giá · Messenger), dễ bấm hơn và không che nội dung.

## 4. Thông tin cần anh/chị bổ sung

Ưu tiên cao (ảnh hưởng trực tiếp tới việc khách tin và chốt đơn):

1. **Giá iPhone Quốc tế** cùng đời, cùng dung lượng cho 17 Pro Max, 16 Pro Max, 15 Pro Max, 14 Pro Max. Phiếu so giá đang dùng số tạm (31,49tr / 23,49tr / 18,99tr / 14,99tr).
2. **Danh sách máy Quốc tế đang bán** (nếu có), vì tab "iPhone Quốc tế" đang trống.
3. **Điểm và số lượt đánh giá Google Maps thật**, thay cho "9.9 điểm".
4. **2–4 câu nhận xét thật của khách** (tên hoặc tên viết tắt, máy đã mua, tỉnh thành).
5. **Chính sách bảo hành phần cứng:** bao lâu, bao những gì, đổi trả trong bao nhiêu ngày.
6. **Giờ mở cửa.**

Ưu tiên vừa:

7. Thống nhất mức chênh giá Lock so với Quốc tế: 3–10 triệu hay 2–5 triệu.
8. Ship COD có được mở hộp kiểm tra máy trước khi trả tiền không (tuỳ đơn vị vận chuyển nào).
9. Thời gian phản hồi tin nhắn trung bình (đang ghi tạm "~5 phút").
10. Số "2.800+ khách": có giữ không, nếu giữ thì đếm từ đâu.
11. Ngày cập nhật bảng giá gần nhất (để ghi "Cập nhật ngày…").
12. Thêm 1–2 ảnh mặt tiền cửa hàng (nhìn từ ngoài đường) để khách dễ tìm.

## 5. Bước tiếp theo đề xuất

Khi anh/chị duyệt bố cục, có thể chuyển demo này vào code Next.js thật (component mới trong `app/components/`, đọc giá từ `data/products.ts`), thay trang chủ hiện tại trên một nhánh riêng để xem trước trên Vercel rồi mới đưa lên web chính.
