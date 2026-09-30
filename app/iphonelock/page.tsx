import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ds/section";
import { FaqSection } from "@/components/FaqSection";
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

// Một nguồn FAQ duy nhất: <FaqSection> vừa render accordion vừa sinh FAQPage
// JSON-LD từ chính mảng này, nên nội dung hiển thị và structured data không
// bao giờ lệch nhau (bản cũ khai báo hai nơi, phải sửa tay cả hai).
const IPHONE_LOCK_FAQS = [
  {
    question: "iPhone Lock là gì?",
    answer:
      "iPhone Lock là máy bị khóa mạng bởi nhà mạng nước ngoài (Nhật, Mỹ...), cần dùng sim ghép để hoạt động tại Việt Nam. Giá iPhone Lock thường rẻ hơn bản Quốc tế 20-40% với cùng cấu hình.",
  },
  {
    question: "Mua iPhone Lock ở TP.HCM chỗ nào uy tín?",
    answer:
      "Dev Pồ là địa chỉ mua iPhone Lock uy tín tại TP. Hồ Chí Minh, máy zin nguyên bản, ghép sim ổn định, hỗ trợ fix lỗi và bảo hành lỗi sim ghép trọn đời.",
  },
  {
    question: "iPhone Lock có bị lỗi sim ghép không?",
    answer:
      "iPhone Lock có thể gặp lỗi sim ghép sau khi cập nhật iOS. Tại Dev Pồ, khách hàng được hỗ trợ fix lỗi sim ghép miễn phí và bảo hành trọn đời.",
  },
];

const REASONS = [
  "iPhone Lock giá rẻ hơn bản Quốc tế 20-40% với cùng cấu hình, máy zin nguyên bản.",
  "Ghép sim ổn định, sóng khỏe, hỗ trợ fix lỗi sim ghép miễn phí sau khi cập nhật iOS.",
  "Bảo hành lỗi sim ghép trọn đời, đổi trả rõ ràng, minh bạch.",
  "Cửa hàng iPhone Lock uy tín tại TP. Hồ Chí Minh, tư vấn tận tâm trước và sau khi mua.",
];

export default function IphoneLockPage() {
  return (
    <>
      {/* Hero SEO — chứa H1 nhắm từ khóa chính "iPhone Lock" */}
      <Section tone="surface" containerClassName="max-w-3xl text-center">
        <h1 className="text-h1 text-balance text-foreground">
          iPhone Lock giá tốt, uy tín tại TP. Hồ Chí Minh
        </h1>
        <p className="text-lead mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
          Dev Pồ chuyên cung cấp{" "}
          <strong className="font-semibold text-foreground">iPhone Lock</strong>{" "}
          (Nhật, Mỹ) zin nguyên bản, giá rẻ hơn bản Quốc tế mà cấu hình vẫn cao
          cấp. Ghép sim ổn định, hỗ trợ fix lỗi và bảo hành lỗi sim ghép trọn đời
          tại{" "}
          <strong className="font-semibold text-foreground">
            TP. Hồ Chí Minh
          </strong>
          .
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/products">Xem iPhone Lock đang bán</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#quiz">Làm trắc nghiệm tư vấn</Link>
          </Button>
        </div>
      </Section>

      {/* Trắc nghiệm tư vấn chọn máy */}
      <IphoneLockQuiz />

      {/* Nội dung SEO — vì sao chọn iPhone Lock tại Dev Pồ */}
      <Section tone="plain" containerClassName="max-w-3xl">
        <h2 className="text-h2 text-foreground">
          Vì sao nên mua iPhone Lock tại Dev Pồ?
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {REASONS.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check
                className="mt-0.5 size-5 shrink-0 text-success"
                aria-hidden="true"
              />
              <span className="text-lead text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection
        items={IPHONE_LOCK_FAQS}
        title="Câu hỏi thường gặp về iPhone Lock"
        subtitle="Những điều khách hỏi nhiều nhất trước khi chọn một chiếc iPhone Lock"
      />
    </>
  );
}
