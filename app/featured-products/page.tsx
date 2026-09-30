import type { Metadata } from "next";

import { FeaturedProducts } from "../components/featured-products";

// Khai báo SEO riêng cho trang Sản phẩm
export const metadata: Metadata = {
  title: "Sản phẩm iPhone Lock, Quốc tế & iPad giá tốt - Dev Pồ",
  description:
    "Cập nhật bảng giá iPhone Lock (17, 16, 15, 14...), iPhone Quốc tế và iPad Pro, iPad Air, iPad Gen nguyên zin, pin cao, bảo hành tại Dev Pồ.",
};

export default function FeaturedProductsPage() {
  return <FeaturedProducts />;
}
