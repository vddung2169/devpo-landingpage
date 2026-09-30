import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";

/** Icon TikTok và Threads không có trong lucide-react nên vẽ bằng SVG. */
function TikTokIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function ThreadsIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
    </svg>
  );
}

const SOCIALS = [
  {
    href: "https://www.facebook.com/profile.php?id=61576332353912",
    label: "Facebook",
    Icon: Facebook,
  },
  {
    href: "https://www.instagram.com/dev_po2002?igsh=MXBjbjBmejlrb3J1MQ%3D%3D&utm_source=qr",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://www.tiktok.com/@devpo_iphone?_r=1&_t=ZG-94EYLi1dPH6",
    label: "TikTok",
    Icon: TikTokIcon,
  },
  {
    href: "https://youtube.com/@devpo-iphonehcm?si=v3cJvDxSPUJHHoV1",
    label: "YouTube",
    Icon: Youtube,
  },
  {
    href: "https://www.threads.com/@dev_po2002?igshid=NTc4MTIwNjQ2YQ==",
    label: "Threads",
    Icon: ThreadsIcon,
  },
];

const SHOP_LINKS = [
  { href: "/featured-products", label: "Tất cả sản phẩm" },
  { href: "/iphonelock", label: "iPhone Lock" },
  { href: "/ipad", label: "iPad cũ giá tốt" },
  { href: "/cong-cu-mua-iphone/tra-gop", label: "Tính trả góp" },
  { href: "/check-imei", label: "Kiểm tra IMEI" },
];

const SUPPORT_LINKS = [
  { href: "/guides", label: "Cẩm nang sử dụng" },
  { href: "/news", label: "Tin tức" },
  { href: "/fix-loi", label: "Fix lỗi iPhone Lock" },
  { href: "/imsi-codes", label: "Mã IMSI mới nhất" },
  { href: "/cong-cu-mua-iphone/bypass-mdm", label: "Bypass MDM" },
];

/** Một cột liên kết trong footer. */
function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3">
      <h3 className="text-overline uppercase text-muted-foreground">{title}</h3>
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-9 items-center text-body text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-surface">
      <div className="container-page py-section">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-12 xl:gap-8">
          {/* --- Giới thiệu + mạng xã hội --- */}
          <div className="flex flex-col gap-5 xl:col-span-4">
            <Link href="/" className="w-fit" aria-label="Dev Pồ — về trang chủ">
              <Image
                src="/devpo_logo.jpg"
                alt="Dev Pồ - Cửa hàng iPhone Lock, iPhone Quốc tế và iPad tại TP.HCM"
                width={137}
                height={56}
                loading="lazy"
                className="h-12 w-auto rounded-lg dark:hidden"
              />
              <Image
                src="/devpo_logo_white.png"
                alt="Dev Pồ - Cửa hàng iPhone Lock, iPhone Quốc tế và iPad tại TP.HCM"
                width={137}
                height={56}
                loading="lazy"
                className="hidden h-9 w-auto dark:block"
              />
            </Link>

            <p className="max-w-sm text-body text-muted-foreground">
              Chuyên iPhone Lock, iPhone Quốc tế và iPad — máy zin nguyên bản,
              giá tốt nhất thị trường kèm dịch vụ hỗ trợ trọn đời.
            </p>

            <ul className="flex flex-wrap items-center gap-1">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Dev Pồ trên ${label}`}
                    className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Hai cột liên kết --- */}
          <div className="grid grid-cols-2 gap-8 xl:col-span-4">
            <LinkColumn title="Mua sắm" links={SHOP_LINKS} />
            <LinkColumn title="Hỗ trợ" links={SUPPORT_LINKS} />
          </div>

          {/* --- Liên hệ + bản đồ --- */}
          <div className="flex flex-col gap-4 md:col-span-2 xl:col-span-4">
            <h3 className="text-overline uppercase text-muted-foreground">
              Ghé cửa hàng
            </h3>

            <ul className="flex flex-col gap-3 text-body text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-foreground"
                  aria-hidden="true"
                />
                <span>3/39A Bình Giã, P. Tân Bình, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-foreground"
                  aria-hidden="true"
                />
                <span className="flex flex-col">
                  <a
                    href="tel:0399208037"
                    className="inline-flex min-h-9 items-center transition-colors hover:text-foreground"
                  >
                    0399 208 037
                  </a>
                  <a
                    href="tel:0909097177"
                    className="inline-flex min-h-9 items-center transition-colors hover:text-foreground"
                  >
                    09 09 09 7177
                  </a>
                </span>
              </li>
            </ul>

            <div className="relative h-52 w-full overflow-hidden rounded-media border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.153647580557!2d106.64109797609562!3d10.799541789350657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900420eacc5%3A0xaf29110ccb4bcf5d!2sDEV%20P%E1%BB%92%20-%20Chuy%C3%AAn%20iPhone%20Lock!5e0!3m2!1svi!2s!4v1771994390407!5m2!1svi!2s"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ đường đi đến cửa hàng Dev Pồ"
                className="absolute inset-0 size-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-section-sm flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-caption text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Dev Pồ (DevpoStore). All rights
            reserved.
          </p>
          <p>3/39A Bình Giã, P. Tân Bình, TP. Hồ Chí Minh</p>
        </div>
      </div>
    </footer>
  );
}
