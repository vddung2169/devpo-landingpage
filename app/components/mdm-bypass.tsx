"use client";

import { useState } from "react";
import {
  Download,
  ShieldCheck,
  ImageOff,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ZALO_LINK } from "@/data/products";

// =============================================================================
// Mục "Bypass MDM": nút tải tool (Google Drive) + hướng dẫn skip bằng hình ảnh.
// =============================================================================

// Link tải tool. Dùng dạng direct-download của Google Drive (bấm là tải luôn).
// Đổi link: thay FILE_ID trong URL, hoặc để "#" nếu chưa cấu hình.
const DRIVE_LINK: string =
  "https://www.dropbox.com/scl/fo/sed30z0qncabuljsg6clz/ALrPSvmXCjxZuMlOb9ApYzE?rlkey=0oo2otuzezcy2wxp5rhu3yd6q&st=s0p1f3f0&dl=0";

// Các bước hướng dẫn. Ảnh đặt trong /public/bypass-mdm/ theo tên đã khai báo.
// Ảnh chưa có sẽ hiện ô placeholder, không làm vỡ layout.
const STEPS: { title: string; desc: string; image: string }[] = [
  {
    title: "Tải và giải nén tool",
    desc: "Bấm nút tải phía trên để tải file zip từ Google Drive, sau đó giải nén ra thư mục trên máy tính.",
    image: "/bypass-mdm/step-1.png",
  },
  {
    title: "Mở thư mục chứa file vừa giải nén",
    desc: "Mở thư mục có tên 4UKey",
    image: "/bypass-mdm/step-2.png",
  },
  {
    title: "Tìm và mở file 4Ukey",
    desc: "Tìm file 4UKey.exe và mở nó lên",
    image: "/bypass-mdm/step-3.png",
  },
  {
    title: "Bỏ qua bước update tool",
    desc: "Khi mở lên, tool sẽ báo có update, bạn tắt để bỏ qua.",
    image: "/bypass-mdm/step-4.png",
  },
  {
    title: "Bấm Bypass / Skip MDM",
    desc: "Nhấn nút Bypass (Skip MDM)",
    image: "/bypass-mdm/step-5.png",
  },
  {
    title: "Cắm thiết bị của bạn và bấm Start",
    desc: "Sau khi cắm máy vào, tool sẽ nhận diện thiết bị. Nhấn nút Start",
    image: "/bypass-mdm/step-6.png",
  },
];

const isDriveConfigured = DRIVE_LINK !== "#" && DRIVE_LINK.length > 0;

export function MdmBypass() {
  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      {/* Khối tải tool */}
      <div className="flex flex-col gap-5 rounded-xl bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tool Bypass MDM</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Bỏ qua màn hình khoá quản lý từ xa (Remote Management) trên iPhone/iPad
            </p>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="h-12 w-full shrink-0 font-semibold sm:w-auto aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          <a
            href={DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!isDriveConfigured}
          >
            <Download className="mr-2 h-5 w-5" />
            Tải tool MDM
          </a>
        </Button>
      </div>

      {!isDriveConfigured && (
        <p className="-mt-2 text-center text-xs text-muted-foreground sm:text-left">
          * Link tải đang được cập nhật.
        </p>
      )}

      {/* Hướng dẫn skip — accordion */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Hướng dẫn skip MDM
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {STEPS.map((step, i) => (
            <AccordionItem key={i} value={`step-${i + 1}`}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                    {i + 1}
                  </span>
                  <span className="font-medium">{step.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-10">
                  <p className="text-muted-foreground">{step.desc}</p>
                  <StepImage src={step.image} alt={`Bước ${i + 1}: ${step.title}`} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Lưu ý */}
      <div className="flex gap-3 rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
        <AlertTriangle className="h-5 w-5 shrink-0 text-foreground" />
        <p>
          Chỉ thực hiện trên thiết bị chính chủ của bạn. Nếu chưa rõ bước nào, hãy nhắn Zalo để Dev Pồ hỗ trợ trực tiếp, tránh thao tác sai gây lỗi máy.
        </p>
      </div>

      <Button asChild variant="outline" className="h-11 w-full font-semibold sm:w-auto sm:self-start">
        <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          Liên hệ hỗ trợ
        </a>
      </Button>
    </div>
  );
}

// Ảnh minh hoạ 1 bước, tự hiện placeholder khi ảnh chưa có / lỗi tải.
function StepImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-muted-foreground">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <ImageOff className="h-6 w-6" />
          <span className="text-xs">Ảnh minh hoạ đang cập nhật</span>
        </div>
      </div>
    );
  }

  return (
    // Viền + bo góc đặt trên lớp bọc có overflow-hidden để cắt sạch mép ảnh
    // (tránh sọc trắng ở cạnh). Ảnh chiếm trọn lớp bọc, không dùng object-contain.
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="block h-auto w-full object-fit"
      />
    </div>
  );
}
