import type { Metadata } from "next";

// Trang /guides là Client Component nên không export được metadata trực tiếp.
// Đặt metadata ở layout của segment này.
export const metadata: Metadata = {
  title: "Cẩm nang iPhone Lock - Hướng dẫn ghép sim, fix lỗi",
  description:
    "Tổng hợp cẩm nang iPhone Lock: hướng dẫn ghép sim, fix lỗi sim ghép, cập nhật iOS an toàn và mẹo dùng iPhone Lock như máy quốc tế tại Dev Pồ.",
  alternates: { canonical: "/guides" },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
