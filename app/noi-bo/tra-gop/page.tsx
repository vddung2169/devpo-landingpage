import type { Metadata } from "next";
import { Calculator, Lock } from "lucide-react";
import { Reveal } from "@/app/components/reveal";
import { TraGopBaoKhach } from "@/components/noi-bo/tra-gop-bao-khach";

export const metadata: Metadata = {
  title: "Nội bộ — Báo giá trả góp nhanh",
  description:
    "Công cụ nội bộ: nhập số tiền máy, tiền trả trước và loại trả góp để báo giá cho khách nhanh hơn.",
  // Trang nội bộ — không index, không cho theo dõi liên kết
  robots: { index: false, follow: false },
};

export default function NoiBoTraGopPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Lock className="h-3.5 w-3.5" />
              Trang nội bộ · Dev Pồ
            </div>
            <h1 className="mt-4 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              <Calculator className="h-6 w-6" />
              Báo giá trả góp nhanh
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
              Nhập số tiền máy, tiền trả trước và chọn loại trả góp — hệ thống
              tính sẵn mọi kỳ hạn và tạo tin nhắn để báo khách trong một chạm.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl py-8 md:py-12">
          <Reveal>
            <TraGopBaoKhach />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
