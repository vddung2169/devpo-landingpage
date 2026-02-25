"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                alt="App Logo Light"
                className="h-14 block dark:hidden"
              />
            </Link>
          </div>

          {/* Menu Desktop (Ẩn trên mobile) */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#guides"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sổ tay iPhone Lock
            </Link>
            <Link
              href="#carriers"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Mã IMSI
            </Link>
          </nav>
        </div>

        {/* Phần Nút Menu Mobile - Dùng DropdownMenu */}
        <div className="flex items-center gap-4">
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
                  href="#guides"
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
                  href="#carriers"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-medium"
                >
                  Mã IMSI
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
