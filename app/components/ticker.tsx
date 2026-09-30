const MESSAGES = [
  "Free ship toàn quốc",
  "Hỗ trợ trọn đời",
  "Cam kết hàng zin chuẩn",
  "Trả góp 0% — bao đậu",
  "Thu cũ lên đời 0đ",
];

/**
 * Thanh chạy cam kết dịch vụ ngay dưới header.
 * Nền đen (light) / trắng (dark) theo token primary — không dùng màu riêng.
 *
 * Animation `scroll` trong globals.css dịch sang trái đúng -50%, nên danh sách
 * phải lặp CHÍNH XÁC 2 lần thì điểm kết mới trùng điểm đầu và vòng lặp liền
 * mạch. (Bản cũ lặp 5 lần -> -50% rơi vào giữa danh sách, thấy rõ mối nối.)
 */
export function Ticker() {
  const loop = [...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES];

  return (
    <div className="site-ticker flex min-h-9 w-full items-center overflow-hidden bg-primary py-2 text-primary-foreground">
      {/* Bản đọc được cho trình đọc màn hình — chuỗi động lặp lại sẽ gây nhiễu. */}
      <ul className="sr-only">
        {MESSAGES.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>

      <div className="flex animate-scroll whitespace-nowrap" aria-hidden="true">
        {loop.map((message, index) => (
          <span
            key={index}
            className="mx-6 inline-flex items-center text-caption font-medium sm:mx-8"
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
