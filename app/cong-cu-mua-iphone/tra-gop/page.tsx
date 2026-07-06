import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { ToolPageLayout } from "@/components/cong-cu-mua-iphone/tool-page-layout";
import { TraGopSection } from "@/components/cong-cu-mua-iphone/tra-gop-section";

export const metadata: Metadata = {
  title: "Công cụ tính trả góp iPhone — HD Saison, iCloud & thẻ tín dụng",
  description:
    "Ước tính tiền lãi và tổng tiền phải trả khi mua iPhone trả góp qua HD Saison / Mirae Asset, iCloud hoặc thẻ tín dụng ngân hàng. Công cụ tham khảo tại Dev Pồ.",
  alternates: { canonical: "/cong-cu-mua-iphone/tra-gop" },
};

export default function TraGopPage() {
  return (
    <ToolPageLayout
      eyebrow="Trả góp"
      icon={Calculator}
      title="Ước tính trả góp khi mua iPhone"
      description="Chọn hình thức, nhập số tiền cần trả góp và kỳ hạn để xem ngay tiền lãi ước tính và tổng tiền phải trả."
    >
      <TraGopSection />
    </ToolPageLayout>
  );
}
