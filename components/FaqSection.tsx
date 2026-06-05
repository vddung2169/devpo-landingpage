"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

// Nguồn dữ liệu FAQ duy nhất — dùng chung cho cả UI accordion và FAQPage JSON-LD,
// tránh lệch nội dung giữa phần hiển thị và structured data.
const faqs: { question: string; answer: string }[] = [
  {
    question: "iPhone Lock là gì? Có dùng được ở Việt Nam không?",
    answer:
      "iPhone Lock là máy được nhà mạng nước ngoài (Mỹ, Nhật, Canada...) bán ra kèm hợp đồng nên bị khóa mạng. Tại Việt Nam, máy hoàn toàn dùng được bình thường bằng cách ghép sim: nghe gọi, nhắn tin, 4G/5G như iPhone Quốc tế. Phần cứng giống hệt bản quốc tế nhưng giá rẻ hơn đáng kể.",
  },
  {
    question: "iPhone Lock và iPhone Quốc tế khác nhau như thế nào?",
    answer:
      "Hai loại có chất lượng phần cứng và tính năng tương đương nhau. Khác biệt chính là iPhone Lock bị khóa mạng nên cần ghép sim để dùng tại Việt Nam, đổi lại giá rẻ hơn iPhone Quốc tế từ 2 đến 5 triệu đồng tùy dòng máy. iPhone Quốc tế dùng sim trực tiếp, không cần ghép, giá cao hơn.",
  },
  {
    question: "Mua iPhone Lock tại Dev Pồ có bảo hành không?",
    answer:
      "Có. Tất cả iPhone Lock mua tại Dev Pồ được bảo hành phần cứng và bao khóa (fix lỗi sim ghép) trọn đời. Đội ngũ kỹ thuật hỗ trợ 24/7, khi máy gặp lỗi sim hoặc sau khi cập nhật iOS đều được xử lý miễn phí.",
  },
  {
    question: "iPhone Lock có 2 sim không?",
    answer:
      "Có. Sau khi ghép sim, iPhone Lock sử dụng được 2 sim 2 sóng (1 sim vật lý và 1 eSim, hoặc theo cấu hình từng dòng máy) hoạt động ổn định như iPhone Quốc tế.",
  },
  {
    question: "Dev Pồ có ship hàng toàn quốc không?",
    answer:
      "Có. Dev Pồ giao hàng toàn quốc và miễn phí ship. Khách ở xa được hỗ trợ gửi hàng tận nơi, kiểm tra máy trước khi thanh toán tùy theo đơn vị vận chuyển.",
  },
  {
    question: "Có hỗ trợ trả góp không?",
    answer:
      "Có. Dev Pồ hỗ trợ trả góp 0% qua thẻ tín dụng và các app tài chính, thủ tục nhanh gọn. Vui lòng liên hệ Zalo hoặc Messenger để được tư vấn gói trả góp phù hợp.",
  },
  {
    question: "Làm sao kiểm tra iPhone Lock chính hãng?",
    answer:
      "Bạn có thể kiểm tra số IMEI của máy (Cài đặt > Cài đặt chung > Giới thiệu, hoặc bấm *#06#) để tra cứu thông tin nguồn gốc. Dev Pồ có hướng dẫn kiểm tra IMEI chi tiết trên website và sẵn sàng kiểm tra trực tiếp cùng khách trước khi nhận máy.",
  },
  {
    question: "Dev Pồ ở đâu tại TP.HCM?",
    answer:
      "Dev Pồ có địa chỉ tại 3/39A Bình Giã, Phường Tân Bình, TP. Hồ Chí Minh. Quý khách có thể ghé trực tiếp cửa hàng để xem máy hoặc liên hệ Zalo/Messenger để được tư vấn từ xa.",
  },
];

// FAQPage JSON-LD sinh từ chính mảng faqs ở trên (single source of truth).
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0b0f19]">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Giải đáp nhanh các thắc mắc khi mua iPhone Lock, iPhone Quốc tế tại
            Dev Pồ
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/40"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
