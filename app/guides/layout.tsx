import type { Metadata } from "next";

// Trang /guides là Client Component nên không export được metadata trực tiếp.
// Đặt metadata ở layout của segment này.
export const metadata: Metadata = {
  title: "Cẩm nang iPhone Lock & iPad - Hướng dẫn chọn máy, fix lỗi",
  description:
    "Tổng hợp cẩm nang iPhone Lock (ghép sim, fix lỗi sim ghép, cập nhật iOS an toàn) và cẩm nang iPad (chọn dòng máy, dung lượng, Apple Pencil, kiểm tra iCloud) tại Dev Pồ.",
  alternates: { canonical: "/guides" },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
