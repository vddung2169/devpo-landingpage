import type { Metadata } from "next";
import { News } from "../components/news";

// Khai báo SEO riêng cho trang Tin tức
export const metadata: Metadata = {
  title: "Tin Tức & Thủ Thuật iPhone Lock - Dev Pồ",
  description:
    "Tổng hợp mã ICCID mới nhất, hướng dẫn ghép sim, fix lỗi và mẹo hay sử dụng iPhone Lock từ chuyên gia, iphone lock, iphone lock mới nhất, iphone lock 2026, mã iccid iphone lock, sim ghép iphone lock, thủ thuật iphone lock",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen pt-8">
      <News />
    </main>
  );
}
