export function Ticker() {
  const messages = [
    "🎉 Free Ship toàn quốc",
    "⚡ Hỗ trợ trọn đời",
    "💎 Cam kết hàng zin chuẩn",
    "🔥 iPhone Lock",
    "📱 Hỗ trợ trả góp bao đậu",
  ];

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Duplicate messages for seamless loop */}
        {[...messages, ...messages, ...messages, ...messages, ...messages].map(
          (message, index) => (
            <span
              key={index}
              className="inline-flex items-center mx-8 text-sm font-medium"
            >
              {message}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
