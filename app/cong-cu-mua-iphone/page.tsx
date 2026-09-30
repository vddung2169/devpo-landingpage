import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

import { Breadcrumbs } from "@/components/ds/breadcrumbs";

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
    <section className="w-full bg-surface">
      <div className="container-page pb-section pt-6">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Công cụ mua iPhone" },
          ]}
        />

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-caption font-medium text-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Mua iPhone thông minh hơn cùng Dev Pồ
          </p>
          <h1 className="text-h1 mt-5 text-balance text-foreground">
            Bộ công cụ mua iPhone
          </h1>
          <p className="text-lead mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Chọn công cụ bạn cần: ước tính trả góp, bỏ qua khoá quản lý MDM hoặc
            để Dev Pồ tư vấn chiếc iPhone phù hợp nhất với ngân sách của bạn.
          </p>
        </div>

        {/* 3 công cụ dạng thẻ — trỏ sang từng trang riêng */}
        <div className="mx-auto mt-block grid max-w-4xl gap-4 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-media bg-background p-5 text-left transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground">
                <tool.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-h4 text-foreground">
                  {tool.title}
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block text-body text-muted-foreground">
                  {tool.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
