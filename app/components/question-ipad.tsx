import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Lock, SignalHigh, Wifi } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ds/section";
import { FeatureCard } from "@/components/ds/feature-card";

// 3 loại iPad khách hay nhầm lẫn khi đi mua máy cũ. Đặt cạnh nhau cho dễ đối chiếu.
const IPAD_TYPES = [
  {
    icon: Wifi,
    title: "iPad Wi-Fi only",
    desc: "Không có khe SIM và không có modem, nên vĩnh viễn không dính khoá mạng. Muốn dùng 4G/5G phải phát Wi-Fi từ điện thoại. Giá rẻ nhất trong cùng một đời máy.",
  },
  {
    icon: SignalHigh,
    title: "iPad Wi-Fi + Cellular (Quốc tế)",
    desc: "Có khe SIM hoặc eSIM, lắp SIM Viettel/Mobifone/VinaPhone là chạy ngay. Không cần sim ghép, không cần can thiệp gì. Giá cao hơn bản Wi-Fi khoảng 2-4 triệu.",
  },
  {
    icon: Lock,
    title: "iPad Lock (khoá nhà mạng)",
    desc: "Là bản Cellular nhưng bán kèm hợp đồng của nhà mạng nước ngoài (AT&T, Verizon, Softbank...) nên khe SIM bị khoá. Giá mềm hơn, nhưng phần SIM cần được xử lý mới dùng được ở Việt Nam.",
  },
];

const ADVICE = [
  <>
    Dùng ở nhà, ở lớp, ở văn phòng — nơi luôn có Wi-Fi:{" "}
    <strong className="font-semibold text-foreground">chọn bản Wi-Fi only</strong>{" "}
    để tiết kiệm 2-4 triệu, dồn tiền lên dung lượng cao hơn.
  </>,
  <>
    Hay mang đi làm, đi học, đi công trình, dùng cho bán hàng / giao hàng:{" "}
    <strong className="font-semibold text-foreground">
      chọn bản Wi-Fi + Cellular
    </strong>{" "}
    để lắp SIM dùng 4G/5G bất cứ đâu.
  </>,
  <>
    Toàn bộ iPad tại Dev Pồ đều được kiểm tra kỹ khe SIM, iCloud và tình trạng
    khoá mạng trước khi giao — bản nào ra bản đó, ghi rõ Wi-Fi hay Cellular ngay
    trên từng sản phẩm.
  </>,
];

export function QuestionIPad() {
  return (
    <Section tone="surface">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-5 lg:order-2">
          <h2 className="text-h1 text-balance text-foreground">
            iPad Lock là gì? Khác gì iPad Wi-Fi only?
          </h2>

          <p className="text-lead text-pretty text-muted-foreground">
            Khác với iPhone, chuyện &ldquo;Lock&rdquo; trên iPad chỉ xảy ra ở bản{" "}
            <strong className="font-semibold text-foreground">
              Wi-Fi + Cellular
            </strong>{" "}
            — tức bản có khe SIM. Khi nhà mạng nước ngoài bán máy kèm gói cước,
            họ khoá luôn khe SIM đó lại, và đó chính là{" "}
            <strong className="font-semibold text-foreground">iPad Lock</strong>.
          </p>

          <p className="text-lead text-pretty text-muted-foreground">
            Còn bản{" "}
            <strong className="font-semibold text-foreground">Wi-Fi only</strong>{" "}
            vốn không có khe SIM lẫn modem nên không bao giờ có khái niệm khoá
            mạng. Quan trọng nhất: khoá mạng trên iPad{" "}
            <strong className="font-semibold text-foreground">
              chỉ ảnh hưởng đúng phần lắp SIM
            </strong>
            . Wi-Fi, App Store, iCloud, Apple Pencil, Magic Keyboard, cập nhật
            iPadOS… vẫn chạy đủ 100% như máy quốc tế.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/ipad">
                Xem iPad đang bán
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/guides/ipad-lock-la-gi">Đọc cẩm nang iPad</Link>
            </Button>
          </div>
        </div>

        <div className="media-frame aspect-[4/3] w-full bg-background lg:order-1">
          <Image
            src="/products/ipadair5.png"
            alt="iPad Air và iPad Pro bản Wi-Fi và Wi-Fi + Cellular tại Dev Pồ"
            fill
            loading="lazy"
            sizes="(max-width: 1023px) 92vw, 46vw"
            className="object-contain p-6"
          />
        </div>
      </div>

      {/* --- Phân biệt 3 loại iPad --- */}
      <div className="mt-section">
        <SectionHeader
          as="h3"
          title="Phân biệt nhanh 3 loại iPad khi đi mua máy"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {IPAD_TYPES.map((type) => (
            <FeatureCard
              key={type.title}
              icon={type.icon}
              title={type.title}
              tone="plain"
            >
              {type.desc}
            </FeatureCard>
          ))}
        </div>

        {/* Lời khuyên chọn bản — phần khách hỏi nhiều nhất */}
        <div className="mt-4 rounded-media bg-background p-5 sm:p-6">
          <h4 className="text-h4 mb-3 text-foreground">Vậy nên chọn bản nào?</h4>
          <ul className="flex flex-col gap-2.5 text-body text-muted-foreground">
            {ADVICE.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
