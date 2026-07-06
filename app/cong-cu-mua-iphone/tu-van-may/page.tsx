import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ToolPageLayout } from "@/components/cong-cu-mua-iphone/tool-page-layout";
import { ProductQuiz } from "@/app/components/product-quiz";

export const metadata: Metadata = {
  title: "Tư vấn chọn iPhone — Quiz 3 câu hỏi tìm đúng máy hợp bạn",
  description:
    "Trả lời 3 câu hỏi nhanh để Dev Pồ gợi ý chiếc iPhone phù hợp nhất với nhu cầu và ngân sách của bạn. Công cụ tư vấn chọn máy miễn phí.",
  alternates: { canonical: "/cong-cu-mua-iphone/tu-van-may" },
};

export default function TuVanMayPage() {
  return (
    <ToolPageLayout
      eyebrow="Tư vấn máy"
      icon={Sparkles}
      title="Chưa biết chọn máy nào?"
      description="Trả lời 3 câu hỏi nhanh, Dev Pồ sẽ gợi ý ngay chiếc iPhone hợp với bạn nhất."
    >
      <ProductQuiz />
    </ToolPageLayout>
  );
}
