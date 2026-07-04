"use client";

import Link from "next/link";
import { Calculator, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { InstallmentCalculator } from "../components/installment-calculator";
import { ProductQuiz } from "../components/product-quiz";
import { MdmBypass } from "../components/mdm-bypass";

// Điều hướng nhanh trong hero — trỏ tới 2 công cụ bên dưới
const TOOLS = [
  {
    href: "#tra-gop",
    icon: Calculator,
    title: "Máy tính trả góp",
    desc: "Xem ngay số tiền phải trả mỗi tháng",
  },
  {
    href: "#quiz-chon-may",
    icon: Sparkles,
    title: "Quiz chọn máy",
    desc: "3 câu hỏi để tìm đúng iPhone hợp bạn",
  },
  {
    href: "#bypass-mdm",
    icon: ShieldCheck,
    title: "Bypass MDM",
    desc: "Tải tool & hướng dẫn skip khoá quản lý",
  },
];

export default function CongCuMuaIphonePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/40">
        {/* Nền trang trí nhẹ, ăn khớp tông monochrome của site */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>

        <div className="container relative mx-auto px-4 pb-12 pt-6 md:pb-16">
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
              Chọn đúng iPhone, trả góp nhẹ nhàng
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              Ước tính số tiền trả góp mỗi tháng và trả lời 3 câu hỏi nhanh để Dev Pồ gợi ý
              chiếc iPhone phù hợp nhất với ngân sách của bạn.
            </p>
          </div>

          {/* Điều hướng nhanh dạng thẻ — thay cho 2 pill rời rạc */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {TOOLS.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <tool.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    {tool.title}
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{tool.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Khung nội dung dùng chung để 2 công cụ canh thẳng hàng dọc */}
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl divide-y divide-border">
          {/* Máy tính trả góp */}
          <section id="tra-gop" className="scroll-mt-24 py-12 md:py-16">
            <ToolHeader
              index="01"
              icon={Calculator}
              eyebrow="Máy tính trả góp"
              title="Trả góp bao nhiêu mỗi tháng?"
              desc="Chọn máy, điều chỉnh số tiền trả trước và kỳ hạn để xem ngay số tiền phải trả hằng tháng."
            />
            <div className="mt-8">
              <InstallmentCalculator />
            </div>
          </section>

          {/* Quiz chọn máy */}
          <section id="quiz-chon-may" className="scroll-mt-24 py-12 md:py-16">
            <ToolHeader
              index="02"
              icon={Sparkles}
              eyebrow="Quiz chọn máy"
              title="Chưa biết chọn máy nào?"
              desc="Trả lời 3 câu hỏi nhanh, Dev Pồ sẽ gợi ý ngay chiếc iPhone hợp với bạn nhất."
            />
            <div className="mt-8">
              <ProductQuiz />
            </div>
          </section>

          {/* Bypass MDM */}
          <section id="bypass-mdm" className="scroll-mt-24 py-12 md:py-16">
            <ToolHeader
              index="03"
              icon={ShieldCheck}
              eyebrow="Bypass MDM"
              title="Bỏ qua khoá quản lý MDM"
              desc="Tải tool về máy tính và làm theo hướng dẫn bằng hình ảnh để skip màn hình Remote Management trên iPhone/iPad."
            />
            <div className="mt-8">
              <MdmBypass />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Header thống nhất cho từng công cụ: số thứ tự + icon + tiêu đề + mô tả ngắn
function ToolHeader({
  index,
  icon: Icon,
  eyebrow,
  title,
  desc,
}: {
  index: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-sm font-bold text-foreground">
        {index}
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-xl text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
