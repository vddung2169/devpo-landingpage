import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Smartphone } from "lucide-react";
import { CheckImeiForm } from "@/components/check-imei/check-imei-form";

export const metadata: Metadata = {
  title: "Check IMEI iPhone — tra cứu nhà mạng, SimLock, model",
  description:
    "Nhập IMEI hoặc Serial để tra cứu model, nhà mạng gốc, SIM Lock và ngày kích hoạt của iPhone. Công cụ kiểm tra tại Dev Pồ.",
  alternates: { canonical: "/check-imei" },
  // Trang đang trong giai đoạn thử nghiệm — chưa mở cho công cụ tìm kiếm.
  robots: { index: false, follow: false },
};

/**
 * Layout nén riêng cho trang này (không dùng ToolPageLayout): mục tiêu là cả
 * form lẫn kết quả nằm gọn trong một màn hình desktop, không phải cuộn.
 */
export default function CheckImeiPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-5 md:py-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Check IMEI</span>
        </nav>

        {/* Tiêu đề nén: một hàng, không hero */}
        <div className="mt-4 mb-5 md:mb-6">
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
            <Smartphone className="h-5 w-5 md:h-6 md:w-6" />
            Tra cứu thông tin iPhone bằng IMEI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Nhập IMEI 15 số (hoặc Serial) để xem model, nhà mạng gốc, SIM Lock
            và ngày kích hoạt của máy.
          </p>
        </div>

        <CheckImeiForm />
      </div>
    </main>
  );
}
