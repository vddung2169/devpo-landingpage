import { Reveal } from "@/app/components/reveal";
import { Breadcrumbs } from "@/components/ds/breadcrumbs";

/**
 * Khung chung cho từng trang công cụ con (Trả góp / Bypass MDM / Tư vấn máy).
 * Gồm hero + breadcrumb thống nhất, phần thân công cụ truyền vào qua children.
 */
export function ToolPageLayout({
  eyebrow,
  title,
  description,
  icon: Icon,
  parent = { href: "/cong-cu-mua-iphone", label: "Công cụ mua iPhone" },
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Cấp giữa của breadcrumb; đặt null nếu công cụ nằm ngay dưới trang chủ. */
  parent?: { href: string; label: string } | null;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hero */}
      <section className="w-full border-b border-border bg-surface">
        <div className="container-page pb-section-sm pt-6">
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              ...(parent ? [{ label: parent.label, href: parent.href }] : []),
              { label: eyebrow },
            ]}
          />

          <div className="mx-auto mt-8 max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-caption font-medium text-foreground">
              <Icon className="size-3.5" />
              {eyebrow}
            </p>
            <h1 className="text-h1 mt-5 text-balance text-foreground">
              {title}
            </h1>
            <p className="text-lead mx-auto mt-4 max-w-4xl text-pretty text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Thân công cụ */}
      <div className="py-4">
        <div className="mx-auto max-w-5xl">
          <Reveal>{children}</Reveal>
        </div>
      </div>
    </>
  );
}
