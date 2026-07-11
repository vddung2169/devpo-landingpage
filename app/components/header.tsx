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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Phần Logo và Menu Desktop */}
        <div className="flex items-center gap-8">
          <div className="flex items-center justify-center py-4 cursor-pointer">
            <Link href="/">
              <img
                src="/devpo_logo.jpg"
                alt="Dev Pồ - Cửa hàng iPhone Lock uy tín tại TP.HCM"
                width={137}
                height={56}
                className="h-14 w-auto block dark:hidden"
              />
              <img
                src="/devpo_logo_white.png"
                alt="Dev Pồ - Cửa hàng iPhone Lock uy tín tại TP.HCM"
                width={137}
                height={56}
                className="h-9 w-auto hidden dark:block"
              />
            </Link>
          </div>

          {/* Menu Desktop (Ẩn trên mobile) */}
          <nav className="hidden items-center gap-8 md:flex">
           
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
          </nav>
        </div>

        {/* Phần Tìm kiếm + Menu Mobile - Dùng DropdownMenu */}
        <div className="flex items-center gap-2">
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
              className="w-[220px] p-2 rounded-xl shadow-lg mt-2 md:hidden"
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
                <Link href="/featured-products" className="w-full font-medium">
                  Sản phẩm
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
