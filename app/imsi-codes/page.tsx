import { Metadata } from "next";
import { CarrierTable } from "../components/carrier-table";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title:
    "Danh sách Mã IMSI/TMSI mới nhất 2026 - Hướng dẫn ghép sim iPhone Lock",
  description:
    "Tổng hợp đầy đủ mã IMSI, TMSI, GID1, GID2 của tất cả nhà mạng trên thế giới (AT&T, T-Mobile, Verizon, JP Docomo, Softbank...). Hướng dẫn fix lỗi iPhone Lock cực nhanh.",
  keywords: [
    "imsi",
    "tmsi",
    "mã imsi",
    "iphone lock",
    "ghép sim",
    "dev po",
    "fix lỗi iphone lock",
    "hướng dẫn ghép sim",
    "sim ghép",
  ],
};

export default function ImsiCodesPage() {
  return (
    <main className="container mx-auto px-4 pt-12 pb-16 min-h-screen">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại trang chủ
        </Link>
      </div>

    <CarrierTable />
    

      <section className="mt-16 prose prose-lg dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-6">
          Hướng dẫn sử dụng mã IMSI/TMSI
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-xl font-semibold mb-3">Mã IMSI là gì?</h3>
            <p className="text-muted-foreground">
              IMSI (International Mobile Subscriber Identity) là một dãy số duy
              nhất dùng để nhận diện thuê bao di động. Đối với iPhone Lock, việc
              nhập đúng mã IMSI của nhà mạng nguyên bản giúp sim ghép "giả lập"
              được thẻ sim của nhà mạng đó, từ đó kích hoạt được sóng điện
              thoại.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-xl font-semibold mb-3">Lưu ý khi ghép Sim</h3>
            <p className="text-muted-foreground">
              Hãy luôn kiểm tra xem iPhone của bạn thuộc nhà mạng nào trước khi
              thực hiện nhập mã. Một số nhà mạng yêu cầu thêm mã GID1 hoặc GID2
              (như MetroPCS hoặc Tracfone) để có thể nhận sóng ổn định nhất.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
