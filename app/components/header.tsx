"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, ChevronDown, Menu, ShieldCheck, Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { GlobalSearch } from "./global-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // transform-gpu: đẩy header lên compositor layer riêng, hết giật sticky
    // trên iOS Safari. backdrop-blur chỉ bật từ md trở lên — trên mobile, blur
    // phải tính lại từng frame khi nội dung (đặc biệt là ticker marquee) trượt
    // bên dưới lúc cuộn, gây rung; nền đặc 95% nhìn gần như không khác.
    <header className="sticky top-0 z-50 w-full transform-gpu border-b border-border bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60">
      <div className="site-header-bar container mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:px-4">
        {/* Phần Logo và Menu Desktop */}
        <div className="flex min-w-0 items-center gap-3 md:gap-4 xl:gap-8">
          <div className="flex shrink-0 items-center justify-center cursor-pointer">
            <Link href="/" className="flex items-center">
              <img
                src="/devpo_logo.jpg"
                alt="Dev Pồ - Cửa hàng iPhone Lock uy tín tại TP.HCM"
                width={137}
                height={56}
                className="site-header-logo h-10 w-auto block sm:h-12 md:h-11 xl:h-14 dark:hidden"
              />
              <img
                src="/devpo_logo_white.png"
                alt="Dev Pồ - Cửa hàng iPhone Lock uy tín tại TP.HCM"
                width={137}
                height={56}
                className="site-header-logo h-8 w-auto hidden sm:h-9 dark:block"
              />
            </Link>
          </div>

          {/* Menu Desktop (Ẩn trên mobile) */}
          <nav className="hidden items-center gap-4 md:flex lg:gap-5 xl:gap-8">
           
            <Link
              href="/guides"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cẩm nang
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tin tức
            </Link>
            <Link
              href="/imsi-codes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Mã IMSI
            </Link>
            {/* "Công cụ" mở dropdown 3 công cụ con */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground data-[state=open]:text-foreground">
                Công cụ
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-xl p-2 shadow-lg">
                {TOOL_LINKS.map((tool) => (
                  <DropdownMenuItem
                    key={tool.href}
                    asChild
                    className="cursor-pointer gap-3 rounded-lg p-3"
                  >
                    <Link href={tool.href}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                        <tool.icon className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{tool.title}</span>
                        <span className="text-xs text-muted-foreground">{tool.desc}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/featured-products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sản phẩm
            </Link>
            <Link
              href="/ipad"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              iPad
            </Link>
          </nav>
        </div>

        {/* Phần Tìm kiếm + Menu Mobile - Dùng DropdownMenu */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Ô tìm kiếm toàn trang */}
          <GlobalSearch />

          {/* Nút chuyển chế độ sáng/tối */}
          <ThemeToggle />

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden outline-none"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>

            {/* align="end" giúp menu canh lề phải thẳng hàng với nút bấm */}
            <DropdownMenuContent
              align="end"
              className="mt-2 w-[220px] rounded-xl p-2 shadow-lg md:hidden"
            >
              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg"
              >
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Trang chủ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg"
              >
                <Link
                  href="/#guides"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Sổ tay iPhone Lock
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg mt-1"
              >
                <Link
                  href="/guides"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Cẩm nang
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg mt-1"
              >
                <Link
                  href="/news"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Tin tức
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg mt-1"
              >
                <Link
                  href="/imsi-codes"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Mã IMSI
                </Link>
              </DropdownMenuItem>

              <DropdownMenuLabel className="mt-1 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Công cụ mua iPhone
              </DropdownMenuLabel>
              {TOOL_LINKS.map((tool) => (
                <DropdownMenuItem
                  key={tool.href}
                  asChild
                  className="cursor-pointer gap-3 rounded-lg p-3"
                >
                  <Link
                    href={tool.href}
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                      <tool.icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{tool.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg mt-1"
              >
                <Link
                  href="/featured-products"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Sản phẩm
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="p-3 text-base cursor-pointer rounded-lg mt-1"
              >
                <Link
                  href="/ipad"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  iPad
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
