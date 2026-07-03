import type { Metadata } from "next";

// Trang này là Client Component (do dùng useState cho calculator/quiz) nên
// đặt metadata ở layout của segment, giống pattern app/guides/layout.tsx.
export const metadata: Metadata = {
  title: "Công cụ mua iPhone thông minh — Máy tính trả góp & Quiz chọn máy",
  description:
    "Máy tính trả góp iPhone 0% lãi suất và Quiz chọn máy 3 câu hỏi giúp bạn chọn đúng iPhone Lock, iPhone Quốc tế phù hợp ngân sách tại Dev Pồ.",
  alternates: { canonical: "/cong-cu-mua-iphone" },
};

export default function CongCuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
