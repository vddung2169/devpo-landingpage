import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center justify-center py-4 cursor-pointer">
            <img
              src="/devpo_logo.jpg"
              alt="App Logo Light"
              className="h-14 block dark:hidden"
            />
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {/* <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sản phẩm
            </Link>
            <Link
              href="#deals"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ưu đãi
            </Link> */}
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
            {/* <Link
              href="#support"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Hỗ trợ
            </Link> */}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
