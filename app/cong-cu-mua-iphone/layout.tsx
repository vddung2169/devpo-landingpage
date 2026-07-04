import type { Metadata } from "next";

// Trang này là Client Component (do dùng useState cho calculator/quiz) nên
// đặt metadata ở layout của segment, giống pattern app/guides/layout.tsx.
export const metadata: Metadata = {
  title: "Công cụ mua iPhone thông minh — Trả góp, Quiz chọn máy & Bypass MDM",
  description:
    "Máy tính trả góp iPhone 0% lãi suất, Quiz chọn máy 3 câu hỏi và tool Bypass MDM (skip khoá quản lý từ xa) kèm hướng dẫn bằng hình ảnh tại Dev Pồ.",
  alternates: { canonical: "/cong-cu-mua-iphone" },
};

export default function CongCuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
