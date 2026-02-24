import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
              </span>
              Sẵn hàng đủ mã
            </div>

            <h1 className="text-balance font-sans text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Dẫn đầu thị trường iPhone Lock - Quốc tế - iPad
            </h1>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Khám phá bộ sưu tập iPhone iPad chất lượng cao, giá cả phải chăng
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Bao bọc bằng div relative để chứa hiệu ứng Glow phía sau */}
              <div className="relative group inline-flex w-full sm:w-auto">
                {/* Hiệu ứng Glow nhịp thở phía sau nút */}
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 via-primary to-purple-600 opacity-60 blur-md animate-pulse transition duration-500 group-hover:opacity-100 group-hover:blur-lg group-hover:duration-200"></div>

                <Button
                  size="lg"
                  className="relative w-full sm:w-auto overflow-hidden bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                  asChild
                >
                  <a
                    href="https://www.messenger.com/channel/61576332353912"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    {/* Vệt sáng lướt ngang (Shimmer Sweep) khi hover */}
                    <span className="absolute left-[-100%] top-0 z-10 h-full w-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[200%]"></span>

                    {/* Nội dung nút */}
                    <span className="relative z-20 font-semibold">
                      Nhận báo giá Sale ngay
                    </span>

                    {/* Icon rung lắc nhẹ khi hover */}
                    <MessageCircle className="relative z-20 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">20+</div>
                <div className="text-sm text-muted-foreground">Sản phẩm</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">
                  Khách hàng hài lòng
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">9.9</div>
                <div className="text-sm text-muted-foreground">Đánh giá</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
              {/* <img
                src="/background-2.jpg"
                alt="Latest smartphones"
                className="h-full w-full object-cover"
              /> */}
              <Image
                src="/background-2.jpg"
                alt="Latest smartphones"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
