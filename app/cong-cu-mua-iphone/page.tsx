import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Công cụ mua iPhone thông minh — Trả góp, Bypass MDM & Tư vấn máy",
  description:
    "Bộ công cụ mua iPhone tại Dev Pồ: tính trả góp iPhone, tool Bypass MDM (skip khoá quản lý từ xa) kèm hướng dẫn bằng hình ảnh và quiz tư vấn chọn máy 3 câu hỏi.",
  alternates: { canonical: "/cong-cu-mua-iphone" },
};

// 3 công cụ, mỗi công cụ giờ là một trang riêng
const TOOLS = [
  {
    href: "/cong-cu-mua-iphone/tra-gop",
    icon: Calculator,
    title: "Trả góp",
    desc: "Ước tính tiền lãi & tổng tiền phải trả",
  },
  {
    href: "/cong-cu-mua-iphone/bypass-mdm",
    icon: ShieldCheck,
    title: "Bypass MDM",
    desc: "Tải tool & hướng dẫn skip khoá quản lý",
  },
  {
    href: "/cong-cu-mua-iphone/tu-van-may",
    icon: Sparkles,
    title: "Tư vấn máy",
    desc: "3 câu hỏi để tìm đúng iPhone hợp bạn",
  },
];

export default function CongCuMuaIphonePage() {
  return (
    <main className="h-full bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        {/* Nền trang trí nhẹ, ăn khớp tông monochrome của site */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>

        <div className="container relative mx-auto px-4 pb-12 pt-6 md:pb-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">Công cụ mua iPhone</span>
          </nav>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm md:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Mua iPhone thông minh hơn cùng Dev Pồ
            </div>
            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Bộ công cụ mua iPhone
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              Chọn công cụ bạn cần: ước tính trả góp, bỏ qua khoá quản lý MDM hoặc để Dev Pồ
              tư vấn chiếc iPhone phù hợp nhất với ngân sách của bạn.
            </p>
          </div>

          {/* 3 công cụ dạng thẻ — trỏ sang từng trang riêng */}
          <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-background p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <tool.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    {tool.title}
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
