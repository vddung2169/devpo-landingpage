import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

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
              <div className="relative group inline-flex w-full sm:w-auto">
                {/* Hiệu ứng Glow nhịp thở */}
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 via-primary to-purple-600 opacity-70 blur-md animate-pulse transition duration-500 group-hover:opacity-100 group-hover:blur-lg"></div>

                <Button
                  className="relative h-14 w-full sm:w-auto sm:px-8 overflow-hidden rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  asChild
                >
                  <a
                    href="https://www.messenger.com/channel/61576332353912"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    {/* Shimmer Sweep */}
                    <span className="absolute left-[-100%] top-0 z-10 h-full w-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[250%]"></span>

                    <span className="relative z-20 text-lg font-bold md:text-xl">
                      Nhận báo giá Sale ngay
                    </span>
                    <MessageCircle className="relative z-20 h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
                  </a>
                </Button>
              </div>
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
                alt="Latest smartphones"
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