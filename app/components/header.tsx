"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calculator,
  ChevronDown,
  Menu,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { GlobalSearch } from "./global-search";

/** Liên kết chính — thứ tự đặt mua hàng trước, nội dung sau. */
const NAV_LINKS = [
  { href: "/featured-products", label: "Sản phẩm" },
  { href: "/ipad", label: "iPad" },
  { href: "/guides", label: "Cẩm nang" },
  { href: "/news", label: "Tin tức" },
  { href: "/imsi-codes", label: "Mã IMSI" },
];

// 3 công cụ con — dùng chung cho dropdown desktop lẫn menu mobile
const TOOL_LINKS = [
  {
    href: "/cong-cu-mua-iphone/tra-gop",
    icon: Calculator,
    title: "Trả góp",
    desc: "Ước tính lãi & tổng tiền",
  },
  {
    href: "/cong-cu-mua-iphone/bypass-mdm",
    icon: ShieldCheck,
    title: "Bypass MDM",
    desc: "Skip khoá quản lý từ xa",
  },
  {
    href: "/cong-cu-mua-iphone/tu-van-may",
    icon: Sparkles,
    title: "Tư vấn máy",
    desc: "Quiz 3 câu chọn iPhone",
  },
];

// Nhóm hỗ trợ sau mua — tách khỏi TOOL_LINKS vì không thuộc bộ công cụ mua máy
const SUPPORT_LINKS = [
  {
    href: "/fix-loi",
    icon: Wrench,
    title: "Fix lỗi iPhone Lock",
    desc: "Không dịch vụ, không có sim, sim lỗi",
  },
];

/**
 * Nội dung một mục "Công cụ" — icon vuông + tên + mô tả ngắn.
 * Chỉ trả về phần bên trong, KHÔNG tự bọc <Link>, vì ở menu mobile thẻ <Link>
 * đã do <SheetClose asChild> dựng lên — bọc thêm sẽ thành link lồng link.
 */
function ToolItemContent({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Calculator;
  title: string;
  desc: string;
}) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-body font-medium text-foreground">{title}</span>
        <span className="text-caption text-muted-foreground">{desc}</span>
      </span>
    </>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Đổi trang thì đóng menu mobile (bấm link trong Sheet không tự đóng).
  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    // transform-gpu: đẩy header lên compositor layer riêng, hết giật sticky
    // trên iOS Safari. backdrop-blur chỉ bật từ md trở lên — trên mobile, blur
    // phải tính lại từng frame khi nội dung (đặc biệt là ticker marquee) trượt
    // bên dưới lúc cuộn, gây rung; nền đặc 95% nhìn gần như không khác.
    <header className="sticky top-0 z-50 w-full transform-gpu border-b border-border bg-background/95 md:backdrop-blur-xl md:supports-[backdrop-filter]:bg-background/75">
      <div className="site-header-bar container-page flex h-16 items-center justify-between gap-3 lg:h-18">
        {/* --- Logo + menu desktop --- */}
        <div className="flex min-w-0 items-center gap-4 lg:gap-6 xl:gap-10">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-md"
            aria-label="Dev Pồ — về trang chủ"
          >
            <Image
              src="/devpo_logo.jpg"
              alt="Dev Pồ - Cửa hàng iPhone Lock, iPhone Quốc tế và iPad tại TP.HCM"
              width={137}
              height={56}
              priority
              className="site-header-logo h-9 w-auto sm:h-14 dark:hidden"
            />
            <Image
              src="/devpo_logo_white.png"
              alt="Dev Pồ - Cửa hàng iPhone Lock, iPhone Quốc tế và iPad tại TP.HCM"
              width={137}
              height={56}
              priority
              className="site-header-logo hidden h-8 w-auto sm:h-8 dark:block"
            />
          </Link>

          <nav
            aria-label="Điều hướng chính"
            className="hidden shrink-0 items-center gap-0.5 whitespace-nowrap lg:flex xl:gap-1"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-2.5 py-2 text-body font-medium transition-colors xl:px-3",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* "Công cụ" mở dropdown 3 công cụ con + hỗ trợ sau mua */}
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-body font-medium text-muted-foreground outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground xl:px-3">
                Công cụ
                <ChevronDown
                  className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-72 rounded-xl p-2 shadow-e3"
              >
                {TOOL_LINKS.map((tool) => (
                  <DropdownMenuItem
                    key={tool.href}
                    asChild
                    className="cursor-pointer rounded-lg p-2.5"
                  >
                    <Link href={tool.href} className="flex items-center gap-3">
                      <ToolItemContent {...tool} />
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuLabel className="px-2.5 pb-1 pt-3 text-overline uppercase text-muted-foreground">
                  Hỗ trợ sau mua
                </DropdownMenuLabel>
                {SUPPORT_LINKS.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="cursor-pointer rounded-lg p-2.5"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <ToolItemContent {...item} />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* --- Tìm kiếm + chế độ sáng/tối + menu mobile --- */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <GlobalSearch />
          <ThemeToggle />

          {/* Menu mobile dạng Sheet: cao hết màn hình, dễ chạm hơn dropdown nhỏ */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Mở menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(20rem,88vw)] gap-0 overflow-y-auto p-0 [&>button:first-of-type]:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <SheetTitle className="text-h4">Menu</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Đóng menu">
                    <X className="size-5" aria-hidden="true" />
                  </Button>
                </SheetClose>
              </div>

              <nav aria-label="Điều hướng chính" className="flex flex-col p-3">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="rounded-lg px-3 py-3 text-lead font-medium text-foreground transition-colors hover:bg-surface"
                  >
                    Trang chủ
                  </Link>
                </SheetClose>

                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-3 text-lead font-medium transition-colors hover:bg-surface",
                        isActive(link.href)
                          ? "bg-surface text-foreground"
                          : "text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <p className="px-3 pb-2 pt-5 text-overline uppercase text-muted-foreground">
                  Công cụ mua iPhone
                </p>
                {TOOL_LINKS.map((tool) => (
                  <SheetClose asChild key={tool.href}>
                    <Link
                      href={tool.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
                    >
                      <ToolItemContent {...tool} />
                    </Link>
                  </SheetClose>
                ))}

                <p className="px-3 pb-2 pt-5 text-overline uppercase text-muted-foreground">
                  Hỗ trợ sau mua
                </p>
                {SUPPORT_LINKS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface"
                    >
                      <ToolItemContent {...item} />
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
