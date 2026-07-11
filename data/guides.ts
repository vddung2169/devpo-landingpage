// =============================================================================
// Nguồn dữ liệu bài viết cẩm nang / blog cho devpo.vn
// Mỗi bài có slug riêng để render trang chi tiết /guides/[slug] (bắt từ khóa
// informational trên Google). File này là "single source of truth" cho cả trang
// danh sách /guides và trang chi tiết.
// `content` lưu dạng HTML để render trực tiếp bằng prose (không cần thư viện markdown).
// =============================================================================

export type GuideCategory = "huong-dan" | "so-sanh" | "thu-thuat" | "tin-tuc";

export interface Guide {
  /** ID dạng chuỗi, ổn định theo thời gian */
  id: string;
  /** Định danh trên URL: /guides/[slug] */
  slug: string;
  /** Tiêu đề bài viết (dùng cho h1 + title SEO) */
  title: string;
  /** Mô tả ngắn (dùng cho card + meta description) */
  excerpt: string;
  /** Nội dung bài viết dạng HTML (render trong .prose) */
  content: string;
  /** Ngày đăng (ISO 8601) */
  publishedAt: string;
  /** Ngày cập nhật gần nhất (ISO 8601) */
  updatedAt: string;
  /** Nhóm bài viết dùng cho bộ lọc */
  category: GuideCategory;
  /** Thẻ từ khóa liên quan */
  tags: string[];
  /** Thời gian đọc ước tính (phút) */
  readingTime: number;
  /** Ảnh thumbnail (đường dẫn trong /public) */
  imageUrl: string;
  /** Câu hỏi thường gặp — dùng cho accordion UI + FAQPage JSON-LD (tùy chọn) */
  faq?: { question: string; answer: string }[];
}

/** Nhãn hiển thị tiếng Việt cho từng category */
export const guideCategoryLabel: Record<GuideCategory, string> = {
  "huong-dan": "Hướng dẫn",
  "so-sanh": "So sánh",
  "thu-thuat": "Thủ thuật",
  "tin-tuc": "Tin tức",
};

export const guides: Guide[] = [
  {
    id: "1",
    slug: "iphone-lock-la-gi",
    title: "iPhone Lock Là Gì? Cách Nhận Biết Và Có Nên Mua 2026",
    excerpt:
      "iPhone Lock là gì, vì sao giá rẻ hơn 3-10 triệu so với bản Quốc tế? Cách kiểm tra Carrier Lock, ICCID, IMEI và có nên mua tại Dev Pồ năm 2026.",
    content: `
<p>Nếu bạn đang tìm mua iPhone với mức giá "mềm" hơn hẳn so với thị trường, chắc hẳn đã ít nhất một lần nghe đến cụm từ <strong>iPhone Lock</strong>. Đây là dòng máy được rao bán rất phổ biến tại Việt Nam, đặc biệt ở TP.HCM, nhưng cũng khiến không ít người mua bối rối vì chưa hiểu rõ bản chất. Bài viết này giải thích chính xác iPhone Lock là gì, cách phân biệt với iPhone Quốc tế, và những điều cần biết trước khi xuống tiền.</p>

<h2>1. iPhone Lock là gì?</h2>
<p><strong>iPhone Lock (hay iPhone khóa mạng)</strong> là phiên bản iPhone được Apple sản xuất và bán độc quyền cho một nhà mạng viễn thông cụ thể tại thị trường nước ngoài — phổ biến nhất là Mỹ (AT&amp;T, Verizon, T-Mobile), Nhật Bản (Softbank, Docomo, AU) hoặc Canada (Bell, Rogers, Telus).</p>
<p>Vì được bán kèm hợp đồng thuê bao với nhà mạng, máy bị "khóa mạng" ngay từ nhà máy: chỉ nhận SIM của đúng nhà mạng phát hành, trừ khi được mở khóa hợp lệ hoặc can thiệp kỹ thuật (ghép SIM, gia công khay SIM). Đây là lý do máy có tên gọi "Lock" — đối lập với <strong>iPhone Quốc tế</strong> vốn dùng được mọi nhà mạng ngay từ đầu.</p>
<p>Điều quan trọng cần hiểu: <strong>iPhone Lock không phải là hàng nhái, hàng dựng hay hàng lỗi.</strong> Về phần cứng, chip xử lý, camera, màn hình, pin và hệ điều hành iOS, máy Lock giống 100% bản Quốc tế vì đều xuất xưởng từ cùng dây chuyền của Apple. Sự khác biệt duy nhất nằm ở chính sách khóa mạng do nhà mạng áp đặt, không phải do Apple can thiệp vào phần cứng.</p>

<h2>2. Vì sao iPhone Lock có giá rẻ hơn?</h2>
<p>Nhà mạng nước ngoài trợ giá sâu cho máy khi bán kèm gói cước dài hạn (thường 2 năm), đổi lại họ khóa máy để giữ chân thuê bao. Khi các hợp đồng này được thu gom và xuất khẩu sang thị trường như Việt Nam, mức giá vẫn thấp hơn đáng kể so với bản Quốc tế mua trực tiếp — thông thường chênh lệch từ <strong>3 đến 10 triệu đồng</strong> tùy dòng máy và dung lượng.</p>

<h2>3. Cách kiểm tra iPhone Lock nhanh trong 30 giây</h2>
<h3>Cách 1: Kiểm tra mục Carrier Lock trong Cài đặt</h3>
<p>Vào <strong>Cài đặt &gt; Cài đặt chung &gt; Giới thiệu</strong>, kéo xuống tìm dòng <strong>"Khóa SIM" (Carrier Lock)</strong>. Nếu hiển thị <strong>"Không có giới hạn SIM"</strong> → đây là iPhone Quốc tế. Nếu hiển thị tên nhà mạng cụ thể hoặc <strong>"SIM Locked"</strong> → đây là iPhone Lock.</p>
<h3>Cách 2: Lắp thử SIM của nhà mạng Việt Nam</h3>
<p>Nếu máy chưa qua xử lý ghép SIM mà bạn lắp SIM Viettel/Mobifone/Vinaphone vào không nhận sóng, báo "Không có dịch vụ" — gần như chắc chắn đây là máy Lock chưa mở khóa.</p>
<h3>Cách 3: Kiểm tra mã ICCID</h3>
<p>Vào <strong>Cài đặt &gt; Cài đặt chung &gt; Giới thiệu &gt; ICCID</strong>. Nếu 4 số đầu là <strong>8984</strong>, máy đang chạy trên nền SIM chuẩn quốc tế. Với máy Lock đã ghép SIM, dãy số này sẽ khác vì đi qua lớp giả lập của SIM ghép hoặc chip ICCID.</p>
<h3>Cách 4: Kiểm tra IMEI</h3>
<p>Bấm <strong>*#06#</strong> hoặc vào Cài đặt để lấy số IMEI, sau đó tra cứu để biết nguồn gốc, ngày kích hoạt và tình trạng bảo hành của máy.</p>

<h2>4. iPhone Lock hoạt động ở Việt Nam bằng cách nào?</h2>
<p>Vì bị khóa mạng gốc, để dùng được SIM Việt Nam, máy cần một trong các giải pháp sau:</p>
<ul>
  <li><strong>SIM ghép:</strong> một vi mạch mỏng đặt lót dưới SIM thật trong khay SIM, giúp "đánh lừa" máy nhận diện đúng nhà mạng gốc rồi chuyển sóng sang nhà mạng Việt Nam.</li>
  <li><strong>Chip ICCID (Rsim, Xsim, GPP):</strong> gắn cố định vào khay SIM, ổn định hơn SIM ghép truyền thống, ít bị rớt Active hơn.</li>
  <li><strong>Gia công khay SIM vật lý:</strong> áp dụng cho các đời máy chỉ có eSIM (iPhone 14 trở lên bản Mỹ), kỹ thuật viên khoan và hàn thêm khay SIM vật lý vào máy.</li>
</ul>
<p>Khi giải pháp ghép SIM được thực hiện đúng kỹ thuật, máy vẫn nghe gọi, nhắn tin, dùng 4G/5G bình thường, thậm chí 2 SIM 2 sóng như iPhone Quốc tế. Xem chi tiết từng bước tại <a href="/guides/huong-dan-ghep-sim-iphone-lock">hướng dẫn ghép sim iPhone Lock từ A-Z</a>.</p>

<h2>5. Ưu và nhược điểm của iPhone Lock</h2>
<div class="overflow-x-auto">
<table>
  <thead>
    <tr><th>Ưu điểm</th><th>Nhược điểm cần cân nhắc</th></tr>
  </thead>
  <tbody>
    <tr><td>Rẻ hơn bản Quốc tế 3–10 triệu đồng</td><td>Phụ thuộc chất lượng SIM ghép</td></tr>
    <tr><td>Phần cứng giống 100% bản Quốc tế</td><td>Có thể mất sóng tạm thời sau khi cập nhật iOS</td></tr>
    <tr><td>Dễ tiếp cận iPhone Pro Max đời mới</td><td>iMessage/FaceTime đôi khi báo "đang chờ kích hoạt"</td></tr>
    <tr><td>Đầy đủ tính năng iOS, App Store, iCloud</td><td>Apple không bảo hành khóa mạng tại Việt Nam</td></tr>
  </tbody>
</table>
</div>
<p>Nhìn chung, những rủi ro này phần lớn đến từ <strong>chất lượng SIM ghép và tay nghề kỹ thuật viên</strong>, không phải lỗi của bản thân chiếc máy. Nếu mua tại nơi có đội ngũ kỹ thuật chuyên xử lý lỗi sim ghép và chính sách bảo hành trọn đời, trải nghiệm sử dụng thực tế gần như không khác gì iPhone Quốc tế.</p>

<h2>6. iPhone Lock khác gì iPhone Quốc tế?</h2>
<p>Xem bảng so sánh chi tiết và lời khuyên chọn loại phù hợp tại <a href="/guides/so-sanh-iphone-lock-vs-quoc-te">So sánh iPhone Lock vs iPhone Quốc tế</a>. Tóm tắt: iPhone Lock phù hợp người muốn tiết kiệm chi phí và chấp nhận ghép SIM; iPhone Quốc tế phù hợp người ưu tiên sự ổn định tuyệt đối, ít can thiệp kỹ thuật.</p>

<h2>7. Vậy có nên mua iPhone Lock không?</h2>
<p><strong>Nên cân nhắc mua iPhone Lock nếu:</strong> bạn muốn sở hữu iPhone đời mới, cấu hình cao với ngân sách thấp hơn; chấp nhận việc máy dùng SIM ghép; và quan trọng nhất — mua tại cửa hàng uy tín, có bảo hành lỗi sim ghép trọn đời.</p>
<p><strong>Nên chọn iPhone Quốc tế nếu:</strong> bạn ưu tiên tuyệt đối sự ổn định, thường xuyên đi công tác/du lịch nước ngoài cần đổi SIM liên tục.</p>
<p>Để tìm hiểu toàn bộ hệ sinh thái kiến thức iPhone Lock — từ mã IMSI, bảng giá, đến kinh nghiệm chọn nơi mua — tham khảo <a href="/news/iphone-lock">cẩm nang iPhone Lock đầy đủ</a>.</p>
`,
    publishedAt: "2025-01-15",
    updatedAt: "2026-07-03",
    category: "tin-tuc",
    tags: ["iPhone Lock", "iphone lock là gì", "kiểm tra iPhone Lock", "carrier lock"],
    readingTime: 8,
    imageUrl: "/guides/guide-iphone-lock-la-gi1.png",
    faq: [
      {
        question: "iPhone Lock có phải hàng giả không?",
        answer:
          "Không. iPhone Lock là hàng chính hãng Apple 100%, chỉ khác về chính sách khóa mạng do nhà mạng nước ngoài áp đặt. Chip, camera, màn hình, pin và iOS đều giống hệt bản Quốc tế.",
      },
      {
        question: "iPhone Lock có 2 SIM được không?",
        answer:
          "Có. Sau khi ghép SIM đúng kỹ thuật, máy dùng được 2 SIM 2 sóng (1 SIM vật lý + 1 eSIM, hoặc 2 SIM vật lý tùy đời máy) như iPhone Quốc tế.",
      },
      {
        question: "iPhone Lock có bị khóa iCloud/Activation Lock không?",
        answer:
          "Không liên quan. Carrier Lock (khóa mạng) và Activation Lock (khóa iCloud) là hai khái niệm khác nhau. Nên yêu cầu người bán xóa tài khoản iCloud trước khi giao dịch để chắc chắn máy sạch.",
      },
      {
        question: "Mua iPhone Lock ở đâu để yên tâm?",
        answer:
          "Nên chọn cửa hàng có địa chỉ rõ ràng, cho kiểm tra máy trực tiếp, cam kết bảo hành lỗi sim ghép trọn đời. Xem chi tiết tại bài mua iPhone Lock ở đâu uy tín.",
      },
    ],
  },
  {
    id: "2",
    slug: "so-sanh-iphone-lock-vs-quoc-te",
    title: "So sánh iPhone Lock vs iPhone Quốc tế: Nên mua loại nào?",
    excerpt:
      "Bảng so sánh chi tiết iPhone Lock và iPhone Quốc tế về giá, tính năng, độ ổn định và khả năng bán lại để bạn chọn đúng loại phù hợp.",
    content: `
<p>Khi mua iPhone, nhiều người phân vân giữa bản Lock giá rẻ và bản Quốc tế nguyên bản. Bài viết này so sánh hai loại trên các tiêu chí quan trọng nhất.</p>

<h2>Về giá bán</h2>
<p>iPhone Lock rẻ hơn Quốc tế từ 2 đến 5 triệu đồng tùy dòng. Với các dòng Pro Max đời mới, mức chênh lệch có thể lớn hơn — đây là lý do chính khiến nhiều người chọn Lock.</p>

<h2>Về tính năng và phần cứng</h2>
<p>Hai loại có phần cứng <strong>tương đương hoàn toàn</strong>. Sau khi ghép sim, iPhone Lock nghe gọi, nhắn tin, dùng 4G/5G và 2 sim 2 sóng bình thường như Quốc tế.</p>

<h2>Về độ ổn định</h2>
<p>iPhone Quốc tế cắm sim là dùng, không phụ thuộc sim ghép. iPhone Lock cần sim ghép và đôi khi cần fix lại sau khi cập nhật iOS — nhưng tại Dev Pồ việc này được hỗ trợ miễn phí trọn đời.</p>

<h2>Về khả năng bán lại</h2>
<p>iPhone Quốc tế giữ giá tốt hơn khi bán lại. iPhone Lock có giá bán lại thấp hơn nhưng vốn ban đầu bạn bỏ ra cũng ít hơn.</p>

<h2>Kết luận</h2>
<ul>
  <li>Chọn <strong>iPhone Lock</strong> nếu ưu tiên tiết kiệm chi phí.</li>
  <li>Chọn <strong>iPhone Quốc tế</strong> nếu ưu tiên sự tiện lợi và giữ giá.</li>
</ul>
`,
    publishedAt: "2025-02-02",
    updatedAt: "2025-03-12",
    category: "so-sanh",
    tags: ["iPhone Lock", "iPhone Quốc tế", "so sánh"],
    readingTime: 6,
    imageUrl: "/products/17promax.png",
  },
  {
    id: "3",
    slug: "huong-dan-ghep-sim-iphone-lock",
    title: "Hướng dẫn ghép sim iPhone Lock chi tiết từ A-Z 2025",
    excerpt:
      "Các bước ghép sim iPhone Lock đúng cách, chọn loại sim ghép phù hợp và xử lý các lỗi thường gặp trong quá trình kích hoạt.",
    content: `
<p>Ghép sim là bước bắt buộc để iPhone Lock nhận sim Việt Nam. Dưới đây là hướng dẫn chi tiết, dễ làm theo ngay cả khi bạn lần đầu sử dụng.</p>

<h2>Chuẩn bị</h2>
<ul>
  <li>Một chiếc sim ghép phù hợp với dòng máy và phiên bản iOS.</li>
  <li>Sim Việt Nam (Viettel, Mobifone, Vinaphone...).</li>
  <li>Cây lấy sim.</li>
</ul>

<h2>Các bước ghép sim</h2>
<p>Thực hiện tuần tự như sau:</p>
<ol>
  <li>Đặt sim ghép và sim chính vào đúng vị trí trên khay.</li>
  <li>Lắp khay sim vào máy và chờ máy nhận sim.</li>
  <li>Khi hiện bảng chọn nhà mạng (ICCID), chọn đúng mã theo hướng dẫn của loại sim ghép.</li>
  <li>Chờ máy khởi động lại và bắt sóng.</li>
</ol>

<h2>Lỗi thường gặp và cách xử lý</h2>
<p>Một số lỗi phổ biến:</p>
<ul>
  <li><strong>Mất sóng:</strong> chọn lại mã ICCID hoặc respring máy.</li>
  <li><strong>Không gọi được:</strong> kiểm tra lại vị trí sim ghép.</li>
  <li><strong>Mất danh bạ:</strong> bật lại sim trong phần Cài đặt.</li>
</ul>

<p>Nếu thao tác chưa quen, bạn có thể mang máy đến Dev Pồ để được ghép sim và kiểm tra miễn phí.</p>
`,
    publishedAt: "2025-02-20",
    updatedAt: "2025-04-01",
    category: "huong-dan",
    tags: ["ghép sim", "iPhone Lock", "hướng dẫn"],
    readingTime: 7,
    imageUrl: "/tiktok-videos/image11.png",
  },
  {
    id: "4",
    slug: "top-iphone-lock-gia-re-2025",
    title: "Top 5 iPhone Lock đáng mua nhất năm 2025 giá dưới 20 triệu",
    excerpt:
      "Gợi ý 5 mẫu iPhone Lock có hiệu năng tốt, pin ổn và mức giá dưới 20 triệu đồng — lựa chọn đáng tiền trong tầm giá năm 2025.",
    content: `
<p>Tầm giá dưới 20 triệu đồng có rất nhiều lựa chọn iPhone Lock đáng mua. Dưới đây là 5 gợi ý cân bằng giữa hiệu năng, pin và mức giá.</p>

<h2>1. iPhone 13 Pro Max Lock</h2>
<p>Màn hình 120Hz, pin trâu, hiệu năng vẫn dư dùng cho mọi tác vụ năm 2025. Một trong những lựa chọn đáng tiền nhất tầm giá.</p>

<h2>2. iPhone 14 Pro Lock</h2>
<p>Thiết kế Dynamic Island, camera nâng cấp, kích thước gọn gàng dễ cầm.</p>

<h2>3. iPhone 13 Lock</h2>
<p>Lựa chọn quốc dân: pin tốt, hiệu năng ổn, giá mềm nhất trong danh sách.</p>

<h2>4. iPhone 12 Pro Max Lock</h2>
<p>Màn hình lớn, camera chất lượng, phù hợp người thích máy màn to mà tiết kiệm.</p>

<h2>5. iPhone 14 Lock</h2>
<p>Máy đời mới, pin khỏe, hợp với người dùng phổ thông cần độ ổn định lâu dài.</p>

<h2>Lời khuyên khi chọn mua</h2>
<p>Hãy ưu tiên máy có tình trạng pin tốt, hình thức đẹp và được bảo hành lỗi sim ghép. Liên hệ Dev Pồ để được tư vấn mẫu phù hợp nhất với nhu cầu và ngân sách của bạn.</p>
`,
    publishedAt: "2025-03-05",
    updatedAt: "2025-04-18",
    category: "so-sanh",
    tags: ["iPhone Lock giá rẻ", "top iPhone", "2025"],
    readingTime: 6,
    imageUrl: "/products/15promax.png",
  },
  {
    id: "5",
    slug: "fix-loi-iphone-lock-mat-song",
    title: "Fix lỗi iPhone Lock mất sóng sau khi cập nhật iOS",
    excerpt:
      "Nguyên nhân iPhone Lock mất sóng sau khi lên iOS mới và các cách khắc phục nhanh để máy bắt sóng trở lại.",
    content: `
<p>Mất sóng sau khi cập nhật iOS là lỗi quen thuộc trên iPhone Lock. Nguyên nhân thường do sim ghép chưa tương thích với phiên bản iOS mới. Dưới đây là cách xử lý.</p>

<h2>Nguyên nhân</h2>
<p>Khi cập nhật iOS, mã kích hoạt sim ghép có thể bị reset hoặc không còn phù hợp, khiến máy không nhận sóng nhà mạng.</p>

<h2>Cách khắc phục nhanh</h2>
<ol>
  <li><strong>Respring lại máy:</strong> giúp sim ghép kích hoạt lại mã ICCID.</li>
  <li><strong>Chọn lại nhà mạng:</strong> vào lại bảng chọn ICCID và nhập đúng mã.</li>
  <li><strong>Bật/tắt chế độ máy bay:</strong> buộc máy dò lại sóng.</li>
  <li><strong>Cập nhật mã sim ghép:</strong> dùng mã mới nhất tương ứng với iOS hiện tại.</li>
</ol>

<h2>Phòng tránh cho lần sau</h2>
<ul>
  <li>Hạn chế cập nhật iOS ngay khi vừa ra mắt.</li>
  <li>Tìm hiểu mã sim ghép phù hợp trước khi nâng cấp.</li>
</ul>

<p>Nếu đã thử các cách trên mà máy vẫn mất sóng, hãy mang đến Dev Pồ — chúng tôi hỗ trợ fix lỗi sim ghép miễn phí trọn đời cho máy mua tại shop.</p>
`,
    publishedAt: "2025-03-22",
    updatedAt: "2025-05-02",
    category: "thu-thuat",
    tags: ["fix lỗi", "mất sóng", "iOS", "iPhone Lock"],
    readingTime: 5,
    imageUrl: "/tiktok-videos/image4.png",
  },
  {
    id: "6",
    slug: "iphone-lock",
    title: "iPhone Lock: Cẩm Nang Từ A-Z Cho Người Mới 2026",
    excerpt:
      "Cẩm nang iPhone Lock đầy đủ: định nghĩa, mã IMSI theo nhà mạng, cách ghép sim, ưu nhược điểm, so sánh với Quốc tế và kinh nghiệm mua uy tín 2026.",
    content: `
<p><strong>iPhone Lock</strong> là một trong những từ khóa được tìm kiếm nhiều nhất khi người dùng Việt Nam muốn sở hữu iPhone chính hãng với mức giá tốt hơn thị trường. Bài viết này tổng hợp toàn bộ kiến thức cần thiết — từ định nghĩa, mã IMSI theo nhà mạng, đến kinh nghiệm chọn nơi mua uy tín — để bạn có cái nhìn đầy đủ trước khi quyết định.</p>

<h2>1. iPhone Lock là gì? (Tóm tắt)</h2>
<p>iPhone Lock là iPhone chính hãng Apple được nhà mạng nước ngoài (Mỹ, Nhật, Canada, Hàn Quốc...) bán độc quyền kèm hợp đồng thuê bao, dẫn đến máy bị khóa mạng — chỉ nhận đúng SIM của nhà mạng phát hành trừ khi được mở khóa hoặc ghép SIM. Về phần cứng, chip, camera, pin và hệ điều hành, máy Lock <strong>giống 100%</strong> bản Quốc tế vì cùng xuất xưởng từ Apple.</p>
<p>Nhờ được nhà mạng trợ giá sâu, iPhone Lock rẻ hơn bản Quốc tế từ <strong>3–10 triệu đồng</strong> tùy dòng máy và dung lượng.</p>
<p>👉 Xem phân tích chi tiết, cách kiểm tra máy Lock trong 30 giây tại: <a href="/news/iphone-lock-la-gi">iPhone Lock là gì? Cách nhận biết và có nên mua</a>.</p>

<h2>2. Phân loại iPhone Lock theo nhà mạng</h2>
<p>iPhone Lock được phân loại theo nhà mạng gốc phát hành, mỗi nhà mạng có một mã nhận diện mạng (IMSI) riêng — thông tin kỹ thuật viên dùng để cấu hình SIM ghép chính xác:</p>
<div class="overflow-x-auto">
<table>
  <thead>
    <tr><th>Quốc gia</th><th>Nhà mạng phổ biến</th><th>Đặc điểm</th></tr>
  </thead>
  <tbody>
    <tr><td>Mỹ</td><td>AT&amp;T, Verizon, T-Mobile, Sprint</td><td>Nguồn hàng lớn nhất, đa dạng đời máy</td></tr>
    <tr><td>Nhật Bản</td><td>Softbank, Docomo, AU-KDDI</td><td>Tình trạng máy thường đẹp</td></tr>
    <tr><td>Canada</td><td>Bell/Virgin, Rogers/Fido, Telus/Koodo</td><td>Chất lượng ổn định</td></tr>
    <tr><td>Hàn Quốc</td><td>SK, KT, LG</td><td>Nguồn hàng giới hạn</td></tr>
  </tbody>
</table>
</div>
<p>Bảng mã IMSI đầy đủ theo từng nhà mạng được cập nhật liên tục tại trang <a href="/imsi-codes">Mã IMSI iPhone Lock</a>.</p>

<h2>3. iPhone Lock hoạt động ở Việt Nam như thế nào?</h2>
<p>Vì bị khóa mạng gốc, máy cần một trong các phương pháp sau để dùng SIM Việt Nam bình thường: SIM ghép, chip ICCID (Rsim/GPP), hoặc gia công khay SIM vật lý với các đời máy chỉ có eSIM. Xem hướng dẫn từng bước tại <a href="/guides/huong-dan-ghep-sim-iphone-lock">Hướng dẫn ghép sim iPhone Lock chi tiết từ A-Z</a>.</p>

<h2>4. Ưu và nhược điểm của iPhone Lock</h2>
<p><strong>Ưu điểm:</strong> giá rẻ hơn 3–10 triệu, phần cứng giống 100% bản Quốc tế, dễ tiếp cận các dòng Pro/Pro Max đời mới.</p>
<p><strong>Nhược điểm:</strong> phụ thuộc chất lượng SIM ghép, có thể ảnh hưởng sóng/pin sau khi cập nhật iOS nếu không được hỗ trợ kỹ thuật kịp thời, không có bảo hành khóa mạng chính hãng từ Apple tại Việt Nam. Phần lớn nhược điểm này được khắc phục hoàn toàn nếu bạn mua tại nơi có chính sách bảo hành lỗi sim ghép trọn đời.</p>

<h2>5. iPhone Lock vs iPhone Quốc tế: Nên chọn loại nào?</h2>
<p>Nếu ngân sách là ưu tiên hàng đầu và bạn mua tại nơi uy tín có bảo hành sim ghép trọn đời, iPhone Lock là lựa chọn hợp lý về chi phí — hiệu năng. Nếu bạn cần sự ổn định tuyệt đối và thường xuyên đổi SIM ở nước ngoài, iPhone Quốc tế sẽ phù hợp hơn. Xem bảng so sánh đầy đủ tại <a href="/guides/so-sanh-iphone-lock-vs-quoc-te">So sánh iPhone Lock vs iPhone Quốc tế</a>.</p>

<h2>6. Kinh nghiệm mua iPhone Lock uy tín, tránh rủi ro</h2>
<p>Một số tiêu chí cốt lõi khi chọn nơi mua: cửa hàng có địa chỉ rõ ràng, cho kiểm tra máy trực tiếp trước khi thanh toán, công khai tình trạng máy, và quan trọng nhất là <strong>cam kết bảo hành lỗi sim ghép trọn đời</strong>.</p>
<p>👉 Xem đầy đủ 7 tiêu chí chọn nơi mua uy tín, dấu hiệu nhận biết lừa đảo tại: <a href="/news/mua-iphone-lock-uy-tin">Mua iPhone Lock uy tín ở đâu?</a></p>

<h2>7. Vì sao nên mua iPhone Lock tại Dev Pồ?</h2>
<ul>
  <li><strong>Cam kết hàng zin chuẩn:</strong> không tháo lắp, không thay linh kiện trôi nổi.</li>
  <li><strong>Bảo hành trọn đời lỗi sim ghép:</strong> hỗ trợ kỹ thuật 24/7, kể cả sau khi cập nhật iOS.</li>
  <li><strong>Free ship toàn quốc</strong>, hỗ trợ kiểm tra máy trước khi thanh toán tùy đơn vị vận chuyển.</li>
  <li><strong>Trả góp 0%</strong> qua thẻ tín dụng và các app tài chính, thủ tục nhanh gọn.</li>
  <li>Hơn <strong>1.800 khách hàng</strong> đã trải nghiệm, đánh giá trung bình <strong>9.9/10</strong>.</li>
  <li>Địa chỉ trực tiếp tại <strong>3/39A Bình Giã, P.Tân Bình, TP. Hồ Chí Minh</strong>.</li>
</ul>
<p>Xem bảng giá và các mẫu máy hiện có tại <a href="/featured-products">Sản phẩm iPhone Lock</a>.</p>
`,
    publishedAt: "2026-07-03",
    updatedAt: "2026-07-03",
    category: "tin-tuc",
    tags: ["iPhone Lock", "cẩm nang iPhone Lock", "mã IMSI", "ghép sim"],
    readingTime: 9,
    imageUrl: "/guides/guide-iphone-lock-camnang1.png",
    faq: [
      {
        question: "iPhone Lock có phải hàng chính hãng không?",
        answer:
          "Có. iPhone Lock do Apple sản xuất chính hãng, chỉ khác chính sách khóa mạng từ nhà mạng nước ngoài.",
      },
      {
        question: "iPhone Lock có dùng được lâu dài không?",
        answer:
          "Có, nếu SIM ghép được lắp đúng kỹ thuật và bạn mua tại nơi có bảo hành lỗi sim ghép trọn đời. Rất nhiều người dùng iPhone Lock ổn định 2-3 năm không gặp vấn đề.",
      },
      {
        question: "iPhone Lock có mất giá nhanh hơn iPhone Quốc tế không?",
        answer:
          "Mức khấu hao tương đương, đôi khi iPhone Lock giữ giá tốt hơn ở phân khúc giá rẻ vì nhu cầu mua lại cao.",
      },
      {
        question: "Nên mua iPhone Lock ở TP.HCM tại đâu?",
        answer:
          "Nên ưu tiên cửa hàng chuyên sâu về iPhone Lock, có kỹ thuật xử lý sim ghép tại chỗ và chính sách bảo hành minh bạch — tham khảo chi tiết tại bài mua iPhone Lock uy tín.",
      },
    ],
  },
  {
    id: "7",
    slug: "mua-iphone-lock-uy-tin",
    title: "Mua iPhone Lock Uy Tín Ở Đâu? 7 Tiêu Chí Cần Biết",
    excerpt:
      "7 tiêu chí chọn mua iPhone Lock uy tín, cách nhận biết lừa đảo, checklist kiểm tra máy trước khi thanh toán và địa chỉ uy tín tại TP.HCM.",
    content: `
<p>iPhone Lock hấp dẫn nhờ mức giá rẻ hơn 3–10 triệu so với bản Quốc tế, nhưng đây cũng là phân khúc dễ gặp rủi ro nhất nếu mua nhầm nơi thiếu uy tín — từ máy đã tháo lắp linh kiện, SIM ghép kém chất lượng, đến việc "mất hút" bảo hành sau khi nhận tiền. Bài viết này tổng hợp các tiêu chí thực tế giúp bạn chọn đúng nơi mua iPhone Lock uy tín, tránh mất tiền oan.</p>

<h2>1. Vì sao cần đặc biệt cẩn trọng khi mua iPhone Lock?</h2>
<p>Khác với iPhone Quốc tế (cắm SIM là dùng ngay), iPhone Lock cần được xử lý kỹ thuật (ghép SIM) để hoạt động tại Việt Nam. Điều này đồng nghĩa <strong>chất lượng trải nghiệm phụ thuộc rất lớn vào tay nghề và sự tận tâm của nơi bán</strong> — không chỉ là chất lượng phần cứng của chính chiếc máy.</p>

<h2>2. 7 tiêu chí nhận biết nơi bán iPhone Lock uy tín</h2>
<h3>Tiêu chí 1: Có địa chỉ cửa hàng rõ ràng, cho xem máy trực tiếp</h3>
<p>Cửa hàng uy tín luôn có địa chỉ vật lý cụ thể, sẵn sàng cho khách đến kiểm tra máy tận nơi trước khi thanh toán — thay vì chỉ giao dịch online, chuyển khoản trước.</p>
<h3>Tiêu chí 2: Công khai tình trạng máy minh bạch</h3>
<p>Thông tin về tình trạng máy (mới 100%, likenew, % pin, ngoại hình) cần được ghi rõ, không mập mờ giữa các mức "like new" và "cũ đã sửa chữa".</p>
<h3>Tiêu chí 3: Cho phép kiểm tra Carrier Lock và ICCID trước khi nhận máy</h3>
<p>Nếu người bán <strong>từ chối cho bạn vào Cài đặt kiểm tra mục Carrier Lock</strong>, hoặc từ chối cho Reset máy để kiểm tra sạch iCloud, bạn nên dừng giao dịch ngay.</p>
<h3>Tiêu chí 4: Chính sách bảo hành lỗi sim ghép rõ ràng — càng dài càng tốt</h3>
<p>Vì máy vận hành nhờ SIM ghép, các lỗi mất sóng, rớt Active có thể phát sinh bất cứ lúc nào, đặc biệt sau khi cập nhật iOS. Nơi bán uy tín cần cam kết <strong>bảo hành và fix lỗi sim ghép trọn đời</strong>, không giới hạn 3-6 tháng như bảo hành phần cứng thông thường.</p>
<h3>Tiêu chí 5: Đội ngũ kỹ thuật phản hồi nhanh, hỗ trợ 24/7</h3>
<p>Lỗi sim ghép cần được xử lý ngay khi phát sinh. Hãy ưu tiên nơi có kênh hỗ trợ nhanh (Zalo, hotline) thay vì chỉ có email hoặc form liên hệ chậm trễ.</p>
<h3>Tiêu chí 6: Có lịch sử hoạt động, đánh giá thực từ khách hàng cũ</h3>
<p>Kiểm tra đánh giá trên Google Maps, Facebook, hoặc hỏi trực tiếp phản hồi từ người từng mua. Số lượng đánh giá lớn, điểm trung bình cao và có ảnh/video feedback thực tế là tín hiệu đáng tin cậy.</p>
<h3>Tiêu chí 7: Chính sách đổi trả và hỗ trợ tài chính linh hoạt</h3>
<p>Free ship, hỗ trợ trả góp 0% lãi suất, chính sách đổi trả trong thời gian ngắn sau khi nhận máy — đây đều là các yếu tố thể hiện sự tự tin của cửa hàng vào chất lượng sản phẩm.</p>

<h2>3. Cách kiểm tra máy trước khi thanh toán (checklist nhanh)</h2>
<ol>
  <li>Vào <strong>Cài đặt &gt; Cài đặt chung &gt; Giới thiệu</strong> kiểm tra mục Carrier Lock, ICCID, số IMEI.</li>
  <li>Kiểm tra tình trạng pin: <strong>Cài đặt &gt; Pin &gt; Tình trạng pin</strong>, yêu cầu dung lượng tối đa từ 85–100% tùy cam kết của cửa hàng.</li>
  <li>Thử lắp SIM thực tế của bạn, gọi thử, nhắn tin, bật 4G/5G kiểm tra tốc độ mạng.</li>
  <li>Kiểm tra 2 SIM 2 sóng (nếu máy hỗ trợ) hoạt động đồng thời.</li>
  <li>Kiểm tra ngoại hình: màn hình, camera, cụm loa, cổng sạc, không có dấu hiệu đã bung ép kính hoặc thay vỏ.</li>
  <li>Yêu cầu Reset máy (Cài đặt gốc) để chắc chắn không dính khóa iCloud/Activation Lock của người dùng trước.</li>
  <li>Yêu cầu hóa đơn/phiếu bảo hành ghi rõ điều khoản bảo hành sim ghép.</li>
</ol>

<h2>4. Dấu hiệu cảnh báo cần tránh xa</h2>
<ul>
  <li>Giá rẻ bất thường so với mặt bằng chung (thấp hơn 20-30% so với các cửa hàng khác cùng cấu hình).</li>
  <li>Từ chối cho kiểm tra máy trực tiếp hoặc chỉ giao dịch online, yêu cầu chuyển khoản trước 100%.</li>
  <li>Không có địa chỉ cụ thể, chỉ bán qua các trang rao vặt, hội nhóm không rõ danh tính.</li>
  <li>Chính sách bảo hành mập mờ, không ghi rõ thời hạn hoặc phạm vi bảo hành sim ghép.</li>
</ul>

<h2>5. Mua iPhone Lock uy tín tại Dev Pồ — Tân Bình, TP.HCM</h2>
<p>Nếu bạn đang tìm nơi mua iPhone Lock tại TP.HCM đáp ứng đầy đủ các tiêu chí trên, <strong>Dev Pồ (DevpoStore)</strong> là một địa chỉ đáng tham khảo:</p>
<ul>
  <li><strong>Cam kết hàng zin chuẩn</strong>, không tháo lắp linh kiện trôi nổi, công khai tình trạng máy (Likenew/Newbody/Fullbox) và % pin trước khi giao dịch.</li>
  <li><strong>Bảo hành trọn đời lỗi sim ghép</strong>, đội ngũ kỹ thuật hỗ trợ 24/7 — kể cả khi máy gặp lỗi sau khi cập nhật iOS.</li>
  <li>Cho khách <strong>kiểm tra máy trực tiếp tại cửa hàng</strong> trước khi thanh toán.</li>
  <li><strong>Free ship toàn quốc</strong>, hỗ trợ <strong>trả góp 0%</strong> qua thẻ tín dụng và app tài chính.</li>
  <li>Đã phục vụ hơn <strong>1.800 khách hàng</strong>, đánh giá trung bình <strong>9.9/10</strong>.</li>
  <li>Địa chỉ: <strong>3/39A Bình Giã, Phường Tân Bình, TP. Hồ Chí Minh.</strong></li>
</ul>
<p>Bạn có thể xem thêm bảng mã IMSI theo từng nhà mạng tại <a href="/imsi-codes">trang mã IMSI</a>, hoặc tìm hiểu kỹ hơn về khái niệm và cách vận hành của dòng máy này tại <a href="/news/iphone-lock-la-gi">iPhone Lock là gì?</a> trước khi tham khảo <a href="/featured-products">danh sách sản phẩm iPhone Lock</a> hiện có tại shop.</p>
`,
    publishedAt: "2026-07-03",
    updatedAt: "2026-07-03",
    category: "tin-tuc",
    tags: ["iPhone Lock uy tín", "mua iPhone Lock", "TP.HCM", "kiểm tra iPhone Lock"],
    readingTime: 8,
    imageUrl: "/guides/guide-mua-iphone-lock-uy-tin1.png",
    faq: [
      {
        question: "Mua iPhone Lock ở đâu tại TP.HCM uy tín?",
        answer:
          "Nên chọn cửa hàng chuyên sâu về iPhone Lock, có địa chỉ cụ thể, cho kiểm tra máy trực tiếp và cam kết bảo hành lỗi sim ghép trọn đời — ví dụ như Dev Pồ tại 3/39A Bình Giã, P.Tân Bình, TP.HCM.",
      },
      {
        question: "Làm sao biết cửa hàng có đang lừa đảo hay không?",
        answer:
          "Dấu hiệu cảnh báo gồm: từ chối cho kiểm tra máy trực tiếp, giá rẻ bất thường, không có địa chỉ rõ ràng, và chính sách bảo hành mập mờ.",
      },
      {
        question: "iPhone Lock mua tại cửa hàng uy tín có đắt hơn không?",
        answer:
          "Không đáng kể. Chênh lệch giá giữa các nơi bán thường nhỏ, trong khi rủi ro khi mua nơi không uy tín có thể khiến bạn tốn kém hơn nhiều về sau.",
      },
      {
        question: "Có nên mua iPhone Lock trả góp không?",
        answer:
          "Có thể cân nhắc nếu cửa hàng hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng hoặc app tài chính uy tín, giúp giảm áp lực tài chính khi mua máy đời mới.",
      },
    ],
  },
  {
    id: "8",
    slug: "iphone-lock-khong-nhan-sim-ghep",
    title:
      "iPhone Lock Không Nhận Sim Ghép: 6 Nguyên Nhân & Cách Khắc Phục Tận Gốc (2026)",
    excerpt:
      "iPhone Lock không nhận sim ghép, mất sóng, báo No Service? 6 nguyên nhân thường gặp và cách tự khắc phục tại nhà theo thứ tự an toàn — tránh làm máy văng active.",
    content: `
<blockquote>
<p><strong>Tóm tắt nhanh:</strong> iPhone Lock không nhận sim ghép thường do một trong sáu nguyên nhân: sim ghép lắp lệch, sim ghép lỗi/kém chất lượng, sai mã ICCID, xung đột phần mềm sau khi cập nhật iOS, khay sim hoặc phần cứng hỏng, hoặc Apple đã vá lỗ hổng ở phiên bản iOS bạn đang dùng. Bài viết này hướng dẫn bạn tự kiểm tra và xử lý từng trường hợp theo đúng thứ tự an toàn — từ dễ đến khó — để tránh làm máy "văng active".</p>
</blockquote>

<h2>iPhone Lock không nhận sim ghép là bị gì?</h2>
<p>Sim ghép là một vi mạch nhỏ lắp chung với sim chính, có nhiệm vụ "báo" cho iPhone Lock rằng máy đang dùng đúng sim của nhà mạng đã khóa, nhờ đó máy chịu nhận sóng và hoạt động với sim Việt Nam (Viettel, MobiFone, VinaPhone...).</p>
<p>Khi máy "không nhận sim ghép", biểu hiện thường là: mất sóng hoàn toàn, hiện <strong>Không có dịch vụ (No Service)</strong> hoặc <strong>SIM Not Supported</strong>, chỉ gọi được nhưng không có 4G, hoặc máy bị đẩy về màn hình kích hoạt (active) khi khởi động lại. Tin tốt là <strong>đa số trường hợp là lỗi phần mềm hoặc lắp đặt, bạn tự xử lý được tại nhà.</strong> Chỉ một phần nhỏ là do phần cứng.</p>
<p>Trước khi làm bất cứ điều gì, hãy ghi nhớ <strong>nguyên tắc an toàn số một</strong>: nếu máy đang chạy ổn định, <strong>tuyệt đối không bấm "Xóa tất cả nội dung và cài đặt", không Restore qua iTunes, và không tự ý cập nhật iOS.</strong> Những thao tác này có thể khiến máy văng ra màn hình active và phải làm lại từ đầu với mã ICCID mới — phức tạp hơn nhiều so với lỗi ban đầu.</p>

<h2>6 nguyên nhân khiến iPhone Lock không nhận sim ghép</h2>
<h3>1. Sim ghép lắp lệch, chưa khớp khe</h3>
<p>Đây là nguyên nhân phổ biến và... dễ chịu nhất. Sim ghép rất mỏng, chỉ cần lắp lệch một chút hoặc để bị cong là mất tiếp xúc. Va đập nhẹ khi để trong túi quần cũng có thể làm khay sim xê dịch.</p>
<h3>2. Sim ghép lỗi hoặc kém chất lượng</h3>
<p>Sim ghép giá rẻ trôi nổi rất hay hỏng sau vài tháng, đặc biệt là phần chip tiếp xúc. Một chiếc sim ghép chất lượng thấp cũng có thể không tương thích với model máy hoặc phiên bản iOS của bạn. Tham khảo <a href="/news/top-3-sim-ghep-tot-nhat">các loại sim ghép tốt nhất cho iPhone Lock</a> trước khi thay mới.</p>
<h3>3. Sai mã ICCID</h3>
<p>ICCID là dãy mã kích hoạt giúp "biến" iPhone Lock hoạt động như bản quốc tế. Cộng đồng iPhone Lock cập nhật mã này khá thường xuyên. Nếu bạn đang dùng mã cũ đã bị Apple chặn, máy sẽ không nhận sim dù sim ghép hoàn toàn tốt.</p>
<h3>4. Xung đột phần mềm sau khi cập nhật hoặc reset</h3>
<p>Sau khi cập nhật iOS, đổi sim, hoặc reset cài đặt mạng, cấu hình mạng đôi khi bị xung đột khiến máy tạm thời không nhận sim. Trường hợp này thường khắc phục được bằng thao tác phần mềm.</p>
<h3>5. Apple đã vá lỗ hổng ở phiên bản iOS mới</h3>
<p>Đây là lý do khó chịu nhất và <strong>nằm ngoài tầm kiểm soát của bạn</strong>. Mỗi khi Apple phát hành iOS mới, họ có thể vá lỗ hổng mà sim ghép đang lợi dụng. Khi đó bạn buộc phải chờ cộng đồng ra mã ICCID / sim ghép thế hệ mới, hoặc hạ cấp iOS (nếu còn có thể). Đây cũng chính là lý do người dùng iPhone Lock <strong>không nên vội cập nhật iOS</strong>.</p>
<h3>6. Hỏng phần cứng (khay sim, chân tiếp xúc)</h3>
<p>Nếu máy từng rơi, vào nước, hoặc dùng lâu năm, chân tiếp xúc sim có thể bị oxy hóa hoặc khay sim bị hỏng. Đây là trường hợp duy nhất bạn nên mang máy đến kỹ thuật viên.</p>

<h2>Cách khắc phục iPhone Lock không nhận sim ghép (theo thứ tự an toàn)</h2>
<p>Hãy làm lần lượt từ trên xuống. Đừng nhảy ngay đến bước Restore.</p>
<h3>Bước 1: Kiểm tra và lắp lại sim ghép</h3>
<p>Tháo khay sim, kiểm tra sim ghép có bị cong, xước hay lệch không. Lau nhẹ phần chip tiếp xúc bằng khăn khô, lắp lại thật khớp và cẩn thận. Rất nhiều ca "không nhận sim" chỉ dừng ở bước này là xong.</p>
<figure>
  <img src="/guides/guide-sim-ghep-khay-sim.jpg" alt="Cách đặt sim ghép khớp với sim chính trên khay sim iPhone Lock" loading="lazy" width="800" height="450" />
  <figcaption>Sim ghép đặt lót dưới sim chính — phải khớp khe, không cong vênh thì máy mới nhận sóng.</figcaption>
</figure>
<h3>Bước 2: Thử sim ghép ở một máy khác (để khoanh vùng lỗi)</h3>
<p>Lắp sim ghép của bạn sang một chiếc iPhone Lock khác. Nếu máy kia nhận bình thường → lỗi nằm ở điện thoại của bạn. Nếu máy kia cũng không nhận → sim ghép của bạn đã hỏng, cần thay sim mới. Bước này giúp bạn không mất công sửa nhầm chỗ.</p>
<h3>Bước 3: Bật/tắt Chế độ máy bay</h3>
<p>Vuốt trung tâm điều khiển, bật <strong>Chế độ máy bay</strong> khoảng 15–20 giây rồi tắt đi. Thao tác này buộc máy dò lại tín hiệu nhà mạng, xử lý được nhiều lỗi mất sóng tạm thời.</p>
<h3>Bước 4: Đặt lại cài đặt mạng</h3>
<p>Vào <strong>Cài đặt → Cài đặt chung → Chuyển hoặc Đặt lại iPhone → Đặt lại → Đặt lại cài đặt mạng.</strong> Cách này xóa các cấu hình mạng bị lỗi mà <strong>không làm mất dữ liệu, ảnh hay ứng dụng</strong> của bạn. Sau khi máy khởi động lại, kiểm tra sóng.</p>
<p><em>Lưu ý: chỉ chọn đúng "Đặt lại cài đặt mạng". Không chọn "Xóa tất cả nội dung và cài đặt".</em></p>
<h3>Bước 5: Nhập lại mã kích hoạt sim ghép</h3>
<p>Ở màn hình gọi khẩn cấp, bạn có thể nhập lại mã kích hoạt sim ghép để máy nhận lại cấu hình. Mã và cú pháp thay đổi tùy loại sim ghép và model máy, nên tốt nhất làm theo đúng hướng dẫn của loại sim bạn đang dùng — hoặc nhắn Dev Pồ để được gửi mã ICCID mới nhất phù hợp với máy bạn. Xem thao tác chi tiết tại <a href="/guides/huong-dan-ghep-sim-iphone-lock">hướng dẫn ghép sim iPhone Lock từ A-Z</a>.</p>
<h3>Bước 6: Cập nhật mã ICCID mới nhất</h3>
<p>Nếu nghi mã ICCID cũ đã bị chặn, hãy dùng mã mới nhất mà cộng đồng iPhone Lock đang xài. Đây là lý do nên theo dõi một nguồn cập nhật mã uy tín — bạn có thể tra <a href="/imsi-codes">bảng mã IMSI &amp; ICCID theo từng nhà mạng</a> luôn được Dev Pồ cập nhật.</p>
<h3>Khi nào nên mang máy ra cửa hàng?</h3>
<p>Nếu đã thử hết 6 bước trên mà máy vẫn không nhận sim, khả năng cao là <strong>lỗi phần cứng</strong> (chân sim, khay sim) hoặc do <strong>iOS đã bị vá</strong> cần thợ can thiệp sâu. Lúc này đừng tự Restore — hãy mang đến kỹ thuật viên chuyên iPhone Lock để kiểm tra, tránh làm máy văng active và mất thêm thời gian.</p>

<h2>Cách phòng tránh iPhone Lock mất sim ghép</h2>
<ul>
  <li><strong>Đầu tư sim ghép chất lượng</strong> ngay từ đầu — đây là yếu tố quyết định độ ổn định.</li>
  <li><strong>Không tự ý cập nhật iOS.</strong> Chờ cộng đồng xác nhận phiên bản mới an toàn với sim ghép.</li>
  <li><strong>Hạn chế tháo lắp sim</strong> thường xuyên; khi tháo thì thao tác nhẹ nhàng.</li>
  <li><strong>Nếu máy đang chạy tốt thì đừng đụng vào</strong> — không reset, không xóa cài đặt.</li>
</ul>

<h2>Cần hỗ trợ trực tiếp?</h2>
<p>Nếu bạn đã thử hết mà máy vẫn "cứng đầu", đội kỹ thuật Dev Pồ tại TP.HCM có thể kiểm tra và gửi bạn mã ICCID mới nhất phù hợp với đúng model và nhà mạng của máy. Nhắn tin cho Dev Pồ kèm thông tin máy để được hỗ trợ nhanh nhất.</p>
<p>👉 Xem thêm: <a href="/imsi-codes">Tổng hợp mã ICCID &amp; IMSI tất cả nhà mạng mới nhất</a> · <a href="/news/top-3-sim-ghep-tot-nhat">Sim ghép loại nào tốt nhất cho iPhone Lock</a> · <a href="/news/iphone-lock-la-gi">Có nên mua iPhone Lock không?</a></p>
`,
    publishedAt: "2026-07-07",
    updatedAt: "2026-07-07",
    category: "thu-thuat",
    tags: [
      "sim ghép",
      "iPhone Lock không nhận sim ghép",
      "fix lỗi sim ghép",
      "mã ICCID",
      "iPhone Lock mất sóng",
    ],
    readingTime: 7,
    imageUrl: "/guides/guide-iphone-lock-khong-nhan-sim-ghep.jpg",
    faq: [
      {
        question: "iPhone Lock không nhận sim ghép có tự sửa tại nhà được không?",
        answer:
          "Đa số trường hợp có, vì thường là lỗi phần mềm hoặc lắp đặt. Bạn làm lần lượt 6 bước: lắp lại sim ghép, thử sim ở máy khác, bật/tắt chế độ máy bay, đặt lại cài đặt mạng, nhập lại mã kích hoạt và cập nhật mã ICCID mới. Chỉ khi liên quan phần cứng mới cần ra cửa hàng.",
      },
      {
        question: "Chi phí sửa lỗi sim ghép khoảng bao nhiêu?",
        answer:
          "Nếu chỉ do sim ghép hỏng, chi phí chủ yếu là tiền thay sim ghép mới. Nếu do phần cứng thì tùy tình trạng máy. Tại Dev Pồ, khách mua máy được hỗ trợ kiểm tra và xử lý lỗi sim/sóng.",
      },
      {
        question: "Cập nhật iOS có làm iPhone Lock mất sim ghép không?",
        answer:
          "Có thể. Apple đôi khi vá lỗ hổng mà sim ghép đang dùng, khiến máy mất sóng sau khi lên đời. Vì vậy người dùng iPhone Lock nên chờ cộng đồng xác nhận trước khi cập nhật.",
      },
      {
        question: "Làm sao biết lỗi do sim ghép hay do điện thoại?",
        answer:
          "Thử lắp sim ghép sang một máy iPhone Lock khác. Máy kia nhận → lỗi ở điện thoại bạn; máy kia không nhận → sim ghép đã hỏng.",
      },
    ],
  },
];

/** Bài thuộc chuyên mục Tin tức — tách riêng, hiển thị tại /news */
export const newsGuides = guides.filter((g) => g.category === "tin-tuc");

/** Bài cẩm nang (Hướng dẫn / So sánh / Thủ thuật) — hiển thị tại /guides */
export const handbookGuides = guides.filter((g) => g.category !== "tin-tuc");

/** Đường dẫn trang chi tiết của bài viết — tin tức nằm ở /news, còn lại ở /guides */
export function getGuidePath(guide: Guide): string {
  return guide.category === "tin-tuc"
    ? `/news/${guide.slug}`
    : `/guides/${guide.slug}`;
}

/** Tìm bài viết theo slug — dùng cho trang chi tiết */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/**
 * Lấy danh sách bài liên quan: ưu tiên cùng category, sau đó bù thêm bài khác.
 * Luôn loại trừ chính bài đang xem.
 */
export function getRelatedGuides(slug: string, limit = 3): Guide[] {
  const current = getGuideBySlug(slug);
  if (!current) return guides.slice(0, limit);

  const others = guides.filter((g) => g.slug !== slug);
  const sameCategory = others.filter((g) => g.category === current.category);
  const rest = others.filter((g) => g.category !== current.category);

  return [...sameCategory, ...rest].slice(0, limit);
}
