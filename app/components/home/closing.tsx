import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONTACT } from "./home-data";

const FOOTER_GROUPS = [
  { title: "Mua máy", links: [["iPhone Lock", "/featured-products"], ["iPad", "/ipad"], ["Đặt cọc iPhone 18 Pro", "/dat-coc-18pro"], ["Tính trả góp", "/cong-cu-mua-iphone/tra-gop"]] },
  { title: "Hỗ trợ", links: [["Fix lỗi iPhone Lock", "/fix-loi"], ["Mã IMSI nhà mạng", "/imsi-codes"], ["Bypass MDM", "/cong-cu-mua-iphone/bypass-mdm"]] },
  { title: "Theo dõi", links: [["TikTok", CONTACT.tiktok], ["YouTube", CONTACT.youtube], ["Facebook", CONTACT.facebook]] },
];

/** CTA cuối trang + footer gọn (cùng nền tối để khép trang). */
export function Closing() {
  return (
    <div className="bg-primary text-primary-foreground">
      <section aria-labelledby="cta-title" className="container-page flex flex-col items-center py-[clamp(3rem,2rem+4vw,5.5rem)] text-center">
        <h2 id="cta-title" className="text-h2">Chưa chắc đời nào hợp với bạn?</h2>
        <p className="text-lead mt-3 opacity-75">Nhắn ngân sách và nhu cầu, Dev Pồ gợi ý 2 – 3 máy kèm giá chốt.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a>
          </Button>
          <Button asChild size="xl" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer">Nhắn Messenger</a>
          </Button>
        </div>
      </section>

      <footer className="border-t border-primary-foreground/15 pb-28 pt-12 text-[0.875rem] lg:pb-12">
        <div className="container-page grid grid-cols-2 gap-8 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <Image src="/devpo_logo_white.png" alt="Dev Pồ" width={137} height={56} className="mb-3 h-7 w-auto dark:invert" />
            <p className="max-w-xs opacity-70">Cửa hàng iPhone Lock, iPhone Quốc tế và iPad cũ tại TP.HCM.</p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col">
              <h3 className="mb-2 text-[0.875rem] font-semibold">{group.title}</h3>
              {group.links.map(([label, href]) =>
                href.startsWith("http") ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-8 items-center opacity-70 hover:opacity-100">{label}</a>
                ) : (
                  <Link key={label} href={href} className="flex min-h-8 items-center opacity-70 hover:opacity-100">{label}</Link>
                ),
              )}
            </nav>
          ))}
        </div>
      </footer>
    </div>
  );
}
