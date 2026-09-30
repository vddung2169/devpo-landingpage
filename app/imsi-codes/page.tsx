import { Metadata } from "next";
import { CarrierTable } from "../components/carrier-table";
import { Section, SectionHeader } from "@/components/ds/section";

export const metadata: Metadata = {
  title: "Bảng mã IMSI iPhone Lock mới nhất 2026",
  alternates: { canonical: "/imsi-codes" },
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
    <>
      <CarrierTable />

      <Section tone="surface" containerClassName="max-w-4xl">
        <SectionHeader
          as="h2"
          align="center"
          title="Hướng dẫn sử dụng mã IMSI / TMSI"
          description="Hiểu đúng hai khái niệm này trước khi nhập mã vào sim ghép."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-media bg-background p-6">
            <h3 className="text-h3 mb-3 text-foreground">Mã IMSI là gì?</h3>
            <p className="text-body text-muted-foreground">
              IMSI (International Mobile Subscriber Identity) là một dãy số duy
              nhất dùng để nhận diện thuê bao di động. Đối với iPhone Lock, việc
              nhập đúng mã IMSI của nhà mạng nguyên bản giúp sim ghép giả lập
              được thẻ sim của nhà mạng đó, từ đó kích hoạt được sóng điện
              thoại.
            </p>
          </div>
          <div className="rounded-media bg-background p-6">
            <h3 className="text-h3 mb-3 text-foreground">Lưu ý khi ghép sim</h3>
            <p className="text-body text-muted-foreground">
              Hãy luôn kiểm tra xem iPhone của bạn thuộc nhà mạng nào trước khi
              thực hiện nhập mã. Một số nhà mạng yêu cầu thêm mã GID1 hoặc GID2
              (như MetroPCS hoặc Tracfone) để có thể nhận sóng ổn định nhất.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
