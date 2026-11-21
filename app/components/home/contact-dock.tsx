import { CONTACT } from "./home-data";

/** Thanh liên hệ cố định dưới đáy trên mobile/tablet (thay 3 bong bóng chat nổi). */
export function ContactDock() {
  const item = "grid min-h-12 place-items-center rounded-full text-[0.875rem] font-semibold";
  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 grid grid-cols-[1fr_1.4fr_1fr] gap-1.5 rounded-full border border-border bg-background/92 p-1.5 shadow-e3 backdrop-blur-xl lg:hidden"
    >
      <a href={CONTACT.tel} className={item}>Gọi</a>
      <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" className={`${item} bg-primary text-primary-foreground`}>Zalo báo giá</a>
      <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className={item}>Messenger</a>
    </nav>
  );
}
