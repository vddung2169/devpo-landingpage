"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function QuestionIPLock() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative  overflow-hidden rounded-2xl bg-card">
              <img
                src="/iplock.png"
                alt="Latest smartphones"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-balance font-sans text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-5xl">
              iPhone Lock là gì?
            </h1>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              iPhone Lock là phiên bản iPhone được nhà mạng khóa SIM. Nhưng hiện
              nay đã có thể mở khoá để xài sim sóng bình thường. Mọi tính năng,
              cấu tạo, phần cứng đều giống iPhone quốc tế 100% vì đều được Apple
              sản xuất chính hãng. Giá iPhone Lock rẻ hơn từ 3-10 triệu so với
              iPhone quốc tế.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  window.open("https://vt.tiktok.com/ZGdaQh1eN/", "_blank");
                }}
              >
                Video test iPhone Lock
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  window.open("https://vt.tiktok.com/ZGdax3QBC/", "_blank");
                }}
              >
                Cẩm nang iPhone Lock
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ƯU ĐIỂM */}
      <div className="container mx-auto px-4 mt-24">
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-balance font-sans text-2xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-5xl">
            Ưu điểm iPhone Lock
          </h1>

          {/* Grid layout cho 4 card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* 1️⃣ Giá cả phải chăng */}
            <div className="flex flex-col h-full items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-foreground text-lg">
                  Giá cả phải chăng
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  iPhone Lock có giá rẻ hơn nhiều so với iPhone quốc tế, tiết
                  kiệm từ 3–10 triệu đồng.
                </p>
              </div>
            </div>

            {/* 2️⃣ Sóng ổn định */}
            <div className="flex flex-col h-full items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-foreground text-lg">
                  Sóng ổn định
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Không cần sử dụng SIM ghép, sóng ổn định như quốc tế, có thể
                  xài 2 SIM 2 sóng.
                </p>
              </div>
            </div>

            {/* 3️⃣ Chất lượng tương đương */}
            <div className="flex flex-col h-full items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-foreground text-lg">
                  Chất lượng tương đương
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Cấu hình, phần cứng, tính năng giống hệt iPhone quốc tế 100%.
                </p>
              </div>
            </div>

            {/* 4️⃣ Bảo hành trọn đời */}
            <div className="flex flex-col h-full items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-foreground text-lg">
                  Bảo hành trọn đời
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  DEV PỒ bao khoá máy trọn đời, hỗ trợ 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
