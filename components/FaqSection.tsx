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

  // ----- Nhóm câu hỏi về iPad -----
  {
    question: "iPad Lock là gì? Có khác iPad Wi-Fi only không?",
    answer:
      "iPad Lock là iPad bản Wi-Fi + Cellular được nhà mạng nước ngoài (AT&T, Verizon, Softbank...) bán kèm hợp đồng nên khe SIM bị khoá mạng. Bản Wi-Fi only không có khe SIM lẫn modem nên không bao giờ dính khoá mạng. Khoá mạng trên iPad chỉ ảnh hưởng phần lắp SIM, còn Wi-Fi, App Store, iCloud, Apple Pencil và cập nhật iPadOS vẫn dùng bình thường.",
  },
  {
    question: "Nên mua iPad bản Wi-Fi hay bản Wi-Fi + Cellular?",
    answer:
      "Nếu bạn chủ yếu dùng máy ở nhà, ở lớp hoặc ở văn phòng nơi luôn có Wi-Fi thì bản Wi-Fi only là lựa chọn hợp lý, rẻ hơn khoảng 2-4 triệu để dồn tiền lên dung lượng cao hơn. Nếu hay mang máy ra ngoài, đi học, đi làm, bán hàng hay giao hàng thì nên chọn bản Cellular để lắp SIM 4G/5G dùng ở bất cứ đâu mà không cần phát Wi-Fi từ điện thoại.",
  },
  {
    question: "Mua iPad cũ nên chọn dung lượng bao nhiêu?",
    answer:
      "iPad không có khe thẻ nhớ nên dung lượng mua sao dùng vậy. Học tập, xem phim, lướt web và ghi chú cơ bản thì 64GB là đủ. Nếu vẽ Procreate nhiều lớp, tải phim offline, cài nhiều game nặng hoặc dựng video thì nên chọn từ 128GB đến 256GB. Riêng bản 32GB chỉ phù hợp nhu cầu rất nhẹ nhàng.",
  },
  {
    question: "iPad tại Dev Pồ có dùng được Apple Pencil không?",
    answer:
      "Có, nhưng mỗi dòng dùng một đời bút khác nhau: iPad Gen 7 dùng Apple Pencil 1, còn iPad Air 4, Air 5 và iPad Pro 2020 dùng Apple Pencil 2 sạc nam châm. Thông tin đời bút tương thích được ghi rõ trên từng sản phẩm. Bút là phụ kiện mua thêm, không mặc định đi kèm máy, trừ khi có ghi chú tặng kèm trong chương trình khuyến mãi.",
  },
  {
    question: "Làm sao biết iPad cũ có dính iCloud ẩn hay Activation Lock?",
    answer:
      "Cách chắc chắn nhất là khôi phục cài đặt gốc ngay tại chỗ (Cài đặt > Cài đặt chung > Chuyển hoặc Đặt lại iPad > Xoá tất cả nội dung và cài đặt) rồi thiết lập lại như máy mới; nếu máy không hỏi Apple ID của chủ cũ thì máy sạch. Ngoài ra cần kiểm tra mục Cài đặt > tên tài khoản trên cùng phải trống và không có hồ sơ MDM lạ trong Cài đặt > Cài đặt chung > VPN & Quản lý thiết bị. Mọi iPad tại Dev Pồ đều được kiểm tra iCloud, Activation Lock và MDM trước khi giao.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  /** Bộ câu hỏi hiển thị — mặc định là FAQ trang chủ ở trên */
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
}

// FAQPage JSON-LD sinh từ chính mảng câu hỏi đang hiển thị (single source of
// truth) — Google yêu cầu text trong structured data khớp với text trên trang.
function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function FaqSection({
  items = faqs,
  title = "Câu hỏi thường gặp",
  subtitle = "Giải đáp nhanh các thắc mắc khi mua iPhone Lock, iPhone Quốc tế và iPad tại Dev Pồ",
}: FaqSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0b0f19]">
      <JsonLd data={buildFaqSchema(items)} />
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="space-y-3">
          {items.map((faq, index) => {
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
