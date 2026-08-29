"use client";

// Cụm nút chat nổi. Vị trí + kích thước khi xoay ngang màn hình thấp được xử lý
// ở `.floating-contacts` trong globals.css (xếp ngang, thu nhỏ, sát mép dưới).
const CONTACTS = [
  {
    href: "https://www.facebook.com/share/1H5cf45rLH/?mibextid=wwXIfr",
    src: "/mess.jpg",
    alt: "Liên hệ Dev Pồ qua Messenger",
    label: "Nhắn tin cho Dev Pồ qua Messenger",
  },
  {
    href: "https://zalo.me/4289073059490896771",
    src: "/zalo.jpg",
    alt: "Chat Zalo Dev Pồ",
    label: "Nhắn tin cho Dev Pồ qua Zalo",
  },
  {
    href: "https://www.tiktok.com/@devpo_iphone?_r=1&_t=ZG-94CpQsluzJY",
    src: "/tiktok.svg",
    alt: "TikTok Dev Pồ iPhone Lock",
    label: "Theo dõi Dev Pồ trên TikTok",
  },
];

export function FloatingContacts() {
  return (
    <div className="floating-contacts fixed right-4 z-50 flex flex-col gap-3 sm:right-6">
      {CONTACTS.map((c) => (
        <a
          key={c.href}
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-400 shadow-lg transition-all hover:scale-110 hover:shadow-xl animate-wiggle"
          aria-label={c.label}
        >
          {/* inset-0 + object-contain: ảnh luôn vừa khít nút, kể cả khi nút thu nhỏ
              lúc xoay ngang. Trước đây ảnh absolute không có kích thước nên hiển
              thị theo kích thước gốc của file. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.src}
            alt={c.alt}
            width={48}
            height={48}
            loading="lazy"
            className="absolute inset-0 h-full w-full rounded-full object-contain p-1"
          />
        </a>
      ))}
    </div>
  );
}
