"use client";

import { usePathname } from "next/navigation";
import { Ticker } from "./ticker";
import { SiteFooter } from "./footer";

// Các route "gọn" — ẩn ticker + footer để hạn chế scroll (công cụ nội bộ, giveaway).
const CHROMELESS_PREFIXES = ["/give-away", "/noi-bo"];

function isChromeless(pathname: string): boolean {
  return CHROMELESS_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function ConditionalTicker() {
  return isChromeless(usePathname()) ? null : <Ticker />;
}

export function ConditionalFooter() {
  return isChromeless(usePathname()) ? null : <SiteFooter />;
}
