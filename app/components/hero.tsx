import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuoteCTA } from "./quote-cta";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5 md:gap-8">
            {/* Badge trạng thái */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary md:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
              </span>
              Sẵn hàng đủ mã
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-balance font-sans text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Dẫn đầu thị trường <br className="hidden md:block" />
              <span className="text-primary">iPhone Lock - Quốc tế - iPad</span>
            </h1>

            <p className="max-w-[600px] text-pretty text-base leading-relaxed text-muted-foreground md:text-xl">
              Khám phá bộ sưu tập iPhone iPad chất lượng cao, giá cả phải chăng nhất thị trường hiện nay.
            </p>

            {/* Nút Nhận báo giá Sale ngay */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <QuoteCTA />

              <Button
                asChild
                variant="outline"
                className="h-14 w-full sm:w-auto sm:px-8"
              >
                <Link
                  href="/cong-cu-mua-iphone"
                  className="flex items-center justify-center gap-2 text-base font-semibold"
                >
                  <Calculator className="h-5 w-5" />
                  Tính trả góp &amp; Quiz chọn máy
                </Link>
              </Button>
            </div>

            {/* Thống kê (Stats) - Responsive tối ưu */}
            <div className="flex flex-wrap items-center gap-6 pt-4 md:gap-10">
              <div className="min-w-[80px]">
                <div className="text-2xl font-bold text-foreground md:text-3xl">30+</div>
                <div className="text-xs text-muted-foreground md:text-sm">Sản phẩm</div>
              </div>
              <div className="hidden h-10 w-px bg-border md:block" />
              <div className="min-w-[80px]">
                <div className="text-2xl font-bold text-foreground md:text-3xl">1800+</div>
                <div className="text-xs text-muted-foreground md:text-sm">Khách hàng</div>
              </div>
              <div className="hidden h-10 w-px bg-border md:block" />
              <div className="min-w-[80px]">
                <div className="text-2xl font-bold text-foreground md:text-3xl">9.9</div>
                <div className="text-xs text-muted-foreground md:text-sm">Đánh giá</div>
              </div>
            </div>
          </div>

          {/* Hình ảnh bên phải/dưới */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl opacity-50" />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl md:aspect-square">
              <Image
                src="/background-2.jpg"
                alt="iPhone Lock và iPhone Quốc tế chính hãng tại Dev Pồ"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}