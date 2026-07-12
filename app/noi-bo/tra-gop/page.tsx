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
    <main className="bg-background">
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
              <Calculator className="h-5 w-5" />
              Báo giá trả góp nhanh
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Lock className="h-3 w-3" />
              Nội bộ · Dev Pồ
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl py-5">
          <Reveal>
            <TraGopBaoKhach />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
