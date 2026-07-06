import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { IphoneLockQuiz } from "./quiz";

export const metadata: Metadata = {
  title: "iPhone Lock TP.HCM - Giá tốt, bảo hành lỗi sim ghép trọn đời",
  description:
    "Mua iPhone Lock giá rẻ, uy tín tại TP. Hồ Chí Minh. Dev Pồ chuyên iPhone Lock Nhật/Mỹ zin nguyên bản, ghép sim ổn định, fix lỗi & bảo hành trọn đời. Tư vấn iPhone Lock miễn phí.",
  keywords: [
    "iphone lock",
    "iphone lock hcm",
    "iphone lock tphcm",
    "iphone lock giá rẻ",
    "mua iphone lock",
    "iphone lock nhật",
    "iphone lock mỹ",
    "ghép sim iphone lock",
    "iphone lock uy tín",
  ],
  alternates: { canonical: "/iphonelock" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://www.devpo.vn/iphonelock",
    siteName: "Dev Pồ - DevpoStore",
    title: "iPhone Lock TP.HCM - Giá tốt, bảo hành trọn đời | Dev Pồ",
    description:
      "Mua iPhone Lock giá rẻ, uy tín tại TP. Hồ Chí Minh. Ghép sim ổn định, fix lỗi & bảo hành trọn đời tại Dev Pồ.",
  },
};

// FAQ schema — tăng cơ hội hiển thị rich result cho các truy vấn về iPhone Lock
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "iPhone Lock là gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "iPhone Lock là máy bị khóa mạng bởi nhà mạng nước ngoài (Nhật, Mỹ...), cần dùng sim ghép để hoạt động tại Việt Nam. Giá iPhone Lock thường rẻ hơn bản Quốc tế 20-40% với cùng cấu hình.",
      },
    },
    {
      "@type": "Question",
      name: "Mua iPhone Lock ở TP.HCM chỗ nào uy tín?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dev Pồ là địa chỉ mua iPhone Lock uy tín tại TP. Hồ Chí Minh, máy zin nguyên bản, ghép sim ổn định, hỗ trợ fix lỗi và bảo hành lỗi sim ghép trọn đời.",
      },
    },
    {
      "@type": "Question",
      name: "iPhone Lock có bị lỗi sim ghép không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "iPhone Lock có thể gặp lỗi sim ghép sau khi cập nhật iOS. Tại Dev Pồ, khách hàng được hỗ trợ fix lỗi sim ghép miễn phí và bảo hành trọn đời.",
      },
    },
  ],
};

export default function IphoneLockPage() {
  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <JsonLd data={faqSchema} />

      {/* Hero SEO — chứa H1 nhắm từ khóa chính "iPhone Lock" */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white px-4 py-14 dark:from-[#0b0f19] dark:to-background sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
            iPhone Lock giá tốt, uy tín tại TP. Hồ Chí Minh
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Dev Pồ chuyên cung cấp <strong>iPhone Lock</strong> (Nhật, Mỹ) zin
            nguyên bản, giá rẻ hơn bản Quốc tế mà cấu hình vẫn cao cấp. Ghép sim
            ổn định, hỗ trợ fix lỗi và bảo hành lỗi sim ghép trọn đời tại{" "}
            <strong>TP. Hồ Chí Minh</strong>.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/products">Xem iPhone Lock đang bán</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#quiz">Làm trắc nghiệm tư vấn</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Quiz */}
      <IphoneLockQuiz />

      {/* Nội dung SEO — vì sao chọn iPhone Lock tại Dev Pồ */}
      <section className="w-full px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Vì sao nên mua iPhone Lock tại Dev Pồ?
          </h2>
          <ul className="mt-6 space-y-4">
            {[
              "iPhone Lock giá rẻ hơn bản Quốc tế 20-40% với cùng cấu hình, máy zin nguyên bản.",
              "Ghép sim ổn định, sóng khỏe, hỗ trợ fix lỗi sim ghép miễn phí sau khi cập nhật iOS.",
              "Bảo hành lỗi sim ghép trọn đời, đổi trả rõ ràng, minh bạch.",
              "Cửa hàng iPhone Lock uy tín tại TP. Hồ Chí Minh, tư vấn tận tâm trước và sau khi mua.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Câu hỏi thường gặp về iPhone Lock
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                iPhone Lock là gì?
              </h3>
              <p className="mt-2 text-muted-foreground">
                iPhone Lock là máy bị khóa mạng bởi nhà mạng nước ngoài (Nhật,
                Mỹ...), cần dùng sim ghép để hoạt động tại Việt Nam. Giá iPhone
                Lock thường rẻ hơn bản Quốc tế 20-40% với cùng cấu hình.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Mua iPhone Lock ở TP.HCM chỗ nào uy tín?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Dev Pồ là địa chỉ mua iPhone Lock uy tín tại TP. Hồ Chí Minh,
                máy zin nguyên bản, ghép sim ổn định, hỗ trợ fix lỗi và bảo hành
                lỗi sim ghép trọn đời.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                iPhone Lock có bị lỗi sim ghép không?
              </h3>
              <p className="mt-2 text-muted-foreground">
                iPhone Lock có thể gặp lỗi sim ghép sau khi cập nhật iOS. Tại Dev
                Pồ, khách hàng được hỗ trợ fix lỗi sim ghép miễn phí và bảo hành
                trọn đời.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
