import type { Metadata } from "next";
import { FeaturedProducts } from "../components/featured-products";

// Khai báo SEO riêng cho trang Sản phẩm
export const metadata: Metadata = {
  title: "Sản phẩm iPhone Lock & Quốc tế giá tốt - Dev Pồ",
  description:
    "Cập nhật bảng giá các dòng iPhone 15, 14, 13, 12 Lock nguyên zin, pin cao, bảo hành trọn đời tại Dev Pồ.",
};

export default function ProductsPage() {
  return (
    // Thêm class pt-20 (padding-top) để khi chuyển trang không bị thanh Header che khuất phần tiêu đề
    <main className="min-h-screen dark:bg-background">
      <FeaturedProducts />
    </main>
  );
}
