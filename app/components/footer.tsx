"use client";

import Link from "next/link";
// Nhớ import thêm icon từ lucide-react nhé
import {
  Phone,
  MapPin,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border  dark:bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* CỘT 1: Giới thiệu chung (Chiếm 4/12 cột) */}
          <div className="flex flex-col gap-4 md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/devpo_logo.jpg"
                alt="Dev Pồ Logo"
                className="h-14 w-auto rounded-lg shadow-sm"
              />
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Chuyên cung cấp các dòng iPhone Lock, Quốc tế chính hãng. Uy tín,
              chất lượng, giá tốt nhất thị trường kèm dịch vụ hỗ trợ trọn đời.
            </p>

            {/* DÀN ICON MẠNG XÃ HỘI */}
            <div className="mt-2 flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61576332353912"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-blue-600"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/dev_po2002?igsh=MXBjbjBmejlrb3J1MQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-pink-600"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>

              {/* TikTok (Dùng SVG tuỳ chỉnh) */}
              <a
                href="https://www.tiktok.com/@devpo_iphone?_r=1&_t=ZG-94EYLi1dPH6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-black dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span className="sr-only">TikTok</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@devpo-iphonehcm?si=v3cJvDxSPUJHHoV1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-red-600"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>

              {/* Threads (Dùng SVG tuỳ chỉnh) */}
              <a
                href="https://www.threads.com/@dev_po2002?igshid=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-black dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
                </svg>
                <span className="sr-only">Threads</span>
              </a>
            </div>
          </div>

          {/* CỘT 2: Thông tin liên hệ & Chính sách (Chiếm 4/12 cột) */}
          <div className="flex flex-col gap-6 md:col-span-4">
            {/* Khối Liên hệ */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-foreground">
                Thông tin liên hệ
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>3/39A Bình Giã, P.Tân Bình, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-1">
                    <a
                      href="tel:0399208037"
                      className="hover:text-primary transition-colors"
                    >
                      0399 208 037
                    </a>
                    <a
                      href="tel:0909097177"
                      className="hover:text-primary transition-colors"
                    >
                      09 09 09 7177
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Khối Chính sách */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-foreground">
                Chính sách & Hỗ trợ
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" /> Chính sách bảo hành
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" /> Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" /> Hướng dẫn mua trả góp
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 3: Bản đồ Google Maps (Chiếm 4/12 cột) */}
          <div className="flex flex-col gap-3 md:col-span-4">
            <h3 className="text-lg font-bold text-foreground">
              Bản đồ cửa hàng
            </h3>
            {/* Vùng chứa iframe được bo góc và có bóng đổ đẹp mắt */}
            <div className="relative h-56 w-full overflow-hidden rounded-xl border border-border shadow-md md:h-full md:min-h-[220px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.153647580557!2d106.64109797609562!3d10.799541789350657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900420eacc5%3A0xaf29110ccb4bcf5d!2sDEV%20P%E1%BB%92%20-%20Chuy%C3%AAn%20iPhone%20Lock!5e0!3m2!1svi!2s!4v1771994390407!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ đường đi đến Dev Pồ"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Phần dòng chữ bản quyền cuối trang */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Dev Pồ (DevpoStore). All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
