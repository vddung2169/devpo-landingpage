import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, TriangleAlert, ArrowRight } from "lucide-react";
import { ToolPageLayout } from "@/components/cong-cu-mua-iphone/tool-page-layout";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { deviceTypes } from "./fix-data";
import { FixGuide } from "./fix-guide";

const SITE_URL = "https://www.devpo.vn";

export const metadata: Metadata = {
  title: "Hướng dẫn fix lỗi iPhone Lock — Không dịch vụ, không có sim",
  description:
    "Hướng dẫn fix lỗi iPhone Lock chi tiết theo từng loại máy: sim ghép, độ CNC EID và độ E-Sim EID. Xử lý lỗi Không dịch vụ, Không có sim, Sim không hợp lệ ngay tại nhà.",
  keywords: [
    "fix lỗi iphone lock",
    "iphone lock không dịch vụ",
    "iphone lock không có sim",
    "sim không hợp lệ",
    "lỗi sim ghép",
    "độ cnc eid",
    "độ esim eid",
    "iphone lock mất sóng",
    "dev pồ",
  ],
  alternates: { canonical: "/fix-loi" },
  openGraph: {
    type: "article",
    locale: "vi_VN",
    url: `${SITE_URL}/fix-loi`,
    siteName: "Dev Pồ - DevpoStore",
    title: "Hướng dẫn fix lỗi iPhone Lock | Dev Pồ",
    description:
      "Fix lỗi Không dịch vụ, Không có sim, Sim không hợp lệ cho iPhone Lock dùng sim ghép, độ CNC EID và độ E-Sim EID.",
  },
};

// Mỗi nhánh loại máy × lỗi là một quy trình HowTo riêng — giúp Google hiểu
// đây là hướng dẫn từng bước và có cơ hội hiển thị rich result.
const howToSchemas = deviceTypes.flatMap((device) =>
  device.symptoms.map((symptom) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Fix lỗi "${symptom.label}" trên iPhone ${device.short}`,
    description: symptom.hint,
    totalTime: "PT15M",
    tool: [{ "@type": "HowToTool", name: "iPhone Lock" }],
    step: symptom.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.text,
      text: step.note ? `${step.text}. ${step.note}` : step.text,
      url: `${SITE_URL}/fix-loi#${device.id}-${symptom.id}`,
    })),
  })),
);

export default function FixLoiPage() {
  return (
    <>
      <JsonLd
        data={[
          ...howToSchemas,
          breadcrumbSchema([
            { name: "Trang chủ", url: SITE_URL },
            { name: "Hướng dẫn fix lỗi iPhone Lock", url: `${SITE_URL}/fix-loi` },
          ]),
        ]}
      />

      <ToolPageLayout
        eyebrow="Fix lỗi iPhone Lock"
        icon={Wrench}
        parent={null}
        title="Hướng dẫn fix lỗi iPhone Lock"
        description="Máy báo Không dịch vụ, Không có sim hay Sim không hợp lệ? Chọn đúng loại máy và lỗi đang gặp, làm lần lượt các cách bên dưới — phần lớn trường hợp tự xử lý được tại nhà trong vài phút."
      >
        {/* Trình chẩn đoán tương tác */}
        <FixGuide />

        {/* Lưu ý chung trước khi thao tác */}
        <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-5 md:p-6">
          <h2 className="text-lg font-bold text-foreground">
            Lưu ý trước khi fix
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              • Làm lần lượt từ cách đầu tiên xuống, mỗi cách chờ máy ổn định
              rồi mới kiểm tra lại — đừng làm dồn nhiều cách cùng lúc.
            </li>
            <li>
              • Với sim ghép, sau khi bấm Restart/Refresh phải đợi chạy xong mới
              được bấm tiếp; bấm quá nhanh dễ làm máy mất sóng lâu hơn.
            </li>
            <li>
              • Nếu cần tra mã nhà mạng khi ghép sim, xem thêm{" "}
              <Link href="/imsi-codes" className="font-medium text-foreground underline underline-offset-4">
                bảng mã IMSI / ICCID
              </Link>{" "}
              luôn được Dev Pồ cập nhật.
            </li>
          </ul>
        </div>

        {/* Nội dung đầy đủ — render sẵn cho SEO và để khách xem/in toàn bộ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Toàn bộ hướng dẫn theo từng loại máy
          </h2>

          <div className="mt-6 space-y-8">
            {deviceTypes.map((device, di) => (
              <article
                key={device.id}
                id={device.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 md:p-7"
              >
                <h3 className="text-xl font-bold text-foreground">
                  {di + 1}. {device.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {device.desc}
                </p>

                <div className="mt-5 space-y-6">
                  {device.symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      id={`${device.id}-${symptom.id}`}
                      className="scroll-mt-24"
                    >
                      <h4 className="text-base font-semibold text-foreground">
                        Máy báo &ldquo;{symptom.label}&rdquo;
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {symptom.hint} Thử một trong các cách sau, hoặc làm hết
                        tất cả các cách:
                      </p>
                      <ol className="mt-3 space-y-2.5">
                        {symptom.steps.map((step, i) => (
                          <li
                            key={step.text}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span
                              className={
                                step.warning
                                  ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500/60 text-amber-600 dark:text-amber-400"
                                  : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground"
                              }
                            >
                              {step.warning ? (
                                <TriangleAlert className="h-3 w-3" />
                              ) : (
                                i + 1
                              )}
                            </span>
                            <span>
                              <span className="font-medium text-foreground">
                                {step.text}
                              </span>
                              {step.note && (
                                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                  {step.note}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Điều hướng sang các trang liên quan */}
        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            {
              href: "/imsi-codes",
              title: "Bảng mã IMSI & ICCID nhà mạng",
              desc: "Tra mã theo từng nhà mạng để ghép sim lên sóng ổn định.",
            },
            {
              href: "/guides",
              title: "Cẩm nang iPhone Lock",
              desc: "Bài viết hướng dẫn, kinh nghiệm dùng máy lock lâu dài.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/40"
            >
              <span>
                <span className="block font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {item.desc}
                </span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </section>
      </ToolPageLayout>
    </>
  );
}
