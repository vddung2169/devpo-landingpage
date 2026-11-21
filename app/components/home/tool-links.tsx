import Link from "next/link";
import { ArrowRight, Calculator, ShieldCheck, Signal, Sparkles, Wrench } from "lucide-react";

import { TOOLS } from "./home-data";

const ICONS = { "tra-gop": Calculator, "tu-van": Sparkles, fix: Wrench, mdm: ShieldCheck, imsi: Signal } as const;

const GROUPS = [
  { id: "buy", title: "Trước khi mua", note: "Tính tiền, chọn đúng máy" },
  { id: "care", title: "Sau khi mua", note: "Sửa lỗi sim, gỡ khoá, tra mã nhà mạng" },
] as const;

/** Công cụ và dịch vụ hỗ trợ của Dev Pồ, chia theo trước / sau khi mua. */
export function ToolLinks() {
  return (
    <section id="cong-cu" aria-labelledby="cong-cu-title" className="scroll-mt-20 bg-surface py-section">
      <div className="container-page">
        <div className="mb-block max-w-2xl">
          <h2 id="cong-cu-title" className="text-h2 text-foreground">Công cụ và hỗ trợ miễn phí</h2>
          <p className="mt-2 text-muted-foreground">Dùng được cả khi bạn chưa mua máy ở Dev Pồ.</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className="text-h3 text-foreground">{group.title}</h3>
              <p className="text-caption text-muted-foreground">{group.note}</p>
              <ul className="mt-4 border-t border-border-strong">
                {TOOLS.filter((t) => t.group === group.id).map((tool) => {
                  const Icon = ICONS[tool.id];
                  return (
                    <li key={tool.id} className="border-b border-border">
                      <Link href={tool.href} className="group flex items-center gap-4 py-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-background text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-foreground">{tool.title}</span>
                          <span className="block text-caption text-pretty text-muted-foreground">{tool.desc}</span>
                        </span>
                        <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
