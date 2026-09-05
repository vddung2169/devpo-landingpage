"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Wifi, SignalHigh, Lock } from "lucide-react";

// 3 loại iPad khách hay nhầm lẫn khi đi mua máy cũ. Đặt cạnh nhau cho dễ đối chiếu,
// dùng đúng bố cục card của khối "Ưu điểm iPhone Lock" để đồng bộ thương hiệu.
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

export function QuestionIPad() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 xl:grid-cols-2">
          <div className="flex flex-col gap-6 xl:order-2">
            <h2 className="text-balance font-sans text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl xl:text-5xl">
              iPad Lock là gì? Khác gì iPad Wi-Fi only?
            </h2>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Khác với iPhone, chuyện &ldquo;Lock&rdquo; trên iPad chỉ xảy ra ở
              bản <strong className="text-foreground">Wi-Fi + Cellular</strong> —
              tức bản có khe SIM. Khi nhà mạng nước ngoài bán máy kèm gói cước,
              họ khoá luôn khe SIM đó lại, và đó chính là{" "}
              <strong className="text-foreground">iPad Lock</strong>.
            </p>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Còn bản <strong className="text-foreground">Wi-Fi only</strong>{" "}
              vốn không có khe SIM lẫn modem, nên không bao giờ có khái niệm khoá
              mạng. Điều quan trọng cần nhớ: khoá mạng trên iPad{" "}
              <strong className="text-foreground">
                chỉ ảnh hưởng đúng phần lắp SIM
              </strong>
              . Wi-Fi, App Store, iCloud, Apple Pencil, Magic Keyboard, cập nhật
              iPadOS… vẫn chạy đủ 100% như máy quốc tế.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/ipad">
                  Xem iPad đang bán
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/guides/ipad-lock-la-gi">Đọc cẩm nang iPad</Link>
              </Button>
            </div>
          </div>

          <div className="relative xl:order-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative hidden overflow-hidden rounded-2xl bg-card md:block">
              <Image
                src="/products/ipadair5.png"
                alt="iPad Air, iPad Pro bản Wi-Fi và Wi-Fi + Cellular tại Dev Pồ"
                width={790}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PHÂN BIỆT 3 LOẠI iPAD */}
      <div className="container mx-auto mt-12 px-4 md:mt-20">
        <div className="flex w-full flex-col gap-6">
          <h2 className="text-balance font-sans text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl lg:text-3xl">
            Phân biệt nhanh 3 loại iPad khi đi mua máy
          </h2>

          <div className="mb-1 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {IPAD_TYPES.map((type) => (
              <div
                key={type.title}
                className="flex h-full flex-col items-start gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="mb-4 flex items-center justify-start gap-4">
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary/10 md:flex">
                      <type.icon className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-md font-semibold text-foreground">
                      {type.title}
                    </h3>
                  </div>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {type.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lời khuyên chọn bản — phần khách hỏi nhiều nhất */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <h3 className="text-md mb-3 font-semibold text-foreground">
              Vậy nên chọn bản nào?
            </h3>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span>
                  Dùng ở nhà, ở lớp, ở văn phòng — nơi luôn có Wi-Fi:{" "}
                  <strong className="text-foreground">chọn bản Wi-Fi only</strong>{" "}
                  để tiết kiệm 2-4 triệu, dồn tiền lên dung lượng cao hơn.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span>
                  Hay mang đi làm, đi học, đi công trình, dùng cho bán hàng /
                  giao hàng:{" "}
                  <strong className="text-foreground">
                    chọn bản Wi-Fi + Cellular
                  </strong>{" "}
                  để lắp SIM dùng 4G/5G bất cứ đâu.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span>
                  Toàn bộ iPad tại Dev Pồ đều được kiểm tra kỹ khe SIM, iCloud và
                  tình trạng khoá mạng trước khi giao — bản nào ra bản đó, ghi rõ
                  Wi-Fi hay Cellular ngay trên từng sản phẩm.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
