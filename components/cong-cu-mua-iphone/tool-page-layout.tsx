import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/app/components/reveal";

/**
 * Khung chung cho từng trang công cụ con (Trả góp / Bypass MDM / Tư vấn máy).
 * Gồm hero + breadcrumb thống nhất, phần thân công cụ truyền vào qua children.
 */
export function ToolPageLayout({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
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
            <Link
              href="/cong-cu-mua-iphone"
              className="transition-colors hover:text-foreground"
            >
              Công cụ mua iPhone
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{eyebrow}</span>
          </nav>

          <div className="mx-auto mt-8 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm md:text-sm">
              <Icon className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-4xl text-pretty text-base text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Thân công cụ */}
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl py-12 md:py-16">
          <Reveal>{children}</Reveal>
        </div>
      </div>
    </main>
  );
}
