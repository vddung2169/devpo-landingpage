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
    title: "iPhone Lock là gì? Có nên mua iPhone Lock năm 2025 không?",
    excerpt:
      "Giải thích iPhone Lock là gì, vì sao giá rẻ hơn bản quốc tế và những điều cần cân nhắc trước khi mua iPhone Lock trong năm 2025.",
    content: `
<p>iPhone Lock là những chiếc iPhone được các nhà mạng nước ngoài (Mỹ, Nhật, Canada...) bán ra kèm hợp đồng trả góp dài hạn. Đổi lại mức giá rẻ, máy bị <strong>khóa mạng</strong> — chỉ dùng được sim của nhà mạng phát hành. Để sử dụng sim Việt Nam, máy cần được ghép sim hoặc fix lỗi.</p>

<h2>Vì sao iPhone Lock rẻ hơn iPhone Quốc tế?</h2>
<p>Phần cứng của iPhone Lock <em>giống hệt</em> bản quốc tế: cùng con chip, cùng camera, cùng màn hình. Khác biệt duy nhất nằm ở việc máy bị giới hạn nhà mạng. Vì được trợ giá theo hợp đồng, iPhone Lock thường rẻ hơn bản quốc tế từ 2 đến 5 triệu đồng tùy dòng máy.</p>

<h2>Có nên mua iPhone Lock năm 2025 không?</h2>
<p>Câu trả lời phụ thuộc vào nhu cầu của bạn:</p>
<ul>
  <li><strong>Nên mua</strong> nếu bạn muốn dùng iPhone cao cấp với chi phí tiết kiệm và chấp nhận dùng sim ghép.</li>
  <li><strong>Cân nhắc</strong> nếu bạn cần máy nguyên bản để bán lại giá cao về sau.</li>
</ul>
<p>Hiện nay công nghệ ghép sim đã rất ổn định, máy hoạt động nghe gọi, 4G/5G mượt mà như quốc tế. Tại Dev Pồ, mỗi máy đều được kiểm tra kỹ và bảo hành trọn đời lỗi sim ghép.</p>

<h2>Lưu ý khi mua iPhone Lock</h2>
<p>Hãy chọn nơi bán uy tín, kiểm tra IMEI rõ ràng và có chính sách hỗ trợ fix lỗi sau khi cập nhật iOS. Đây là yếu tố quyết định trải nghiệm lâu dài của bạn.</p>
`,
    publishedAt: "2025-01-15",
    updatedAt: "2025-03-10",
    category: "huong-dan",
    tags: ["iPhone Lock", "kiến thức", "mua iPhone"],
    readingTime: 5,
    imageUrl: "/background-2.jpg",
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
];

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
