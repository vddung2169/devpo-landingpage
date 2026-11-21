"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./footer";
import { FloatingContacts } from "./floating-contacts";

// Trang chủ tự có footer và thanh liên hệ riêng (app/components/home/).
const isHome = (pathname: string) => pathname === "/";

// Các route "gọn" — ẩn ticker + footer để hạn chế scroll (công cụ nội bộ, giveaway).
const CHROMELESS_PREFIXES = ["/give-away", "/noi-bo", "/event-thang10"];

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isChromeless(pathname: string): boolean {
  return isHome(pathname) || CHROMELESS_PREFIXES.some((p) => matches(pathname, p));
}

export function ConditionalFooter() {
  return isChromeless(usePathname()) ? null : <SiteFooter />;
}

/** Bong bóng chat nổi — ẩn ở trang chủ (đã có thanh liên hệ dưới đáy). */
export function ConditionalFloatingContacts() {
  return isHome(usePathname()) ? null : <FloatingContacts />;
}
