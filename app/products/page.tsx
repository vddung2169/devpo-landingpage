import type { Metadata } from "next";

import { Section } from "@/components/ds/section";
import { ProductGrid } from "../components/product-grid";

// Khai báo SEO riêng cho trang Sản phẩm
export const metadata: Metadata = {
  title: "Tất cả sản phẩm iPhone",
  description:
    "Bảng giá đầy đủ các dòng iPhone Lock (17 Pro Max, 16 Pro Max, 15...), iPhone Quốc tế và iPad nguyên zin, pin cao, bảo hành trọn đời lỗi sim ghép tại Dev Pồ TP. Hồ Chí Minh.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Section tone="surface" size="sm" containerClassName="max-w-3xl text-center">
        <h1 className="text-h1 text-balance text-foreground">
          Tất cả sản phẩm
        </h1>
        <p className="text-lead mt-3 text-pretty text-muted-foreground">
          iPhone Lock, iPhone Quốc tế và iPad nguyên zin — giá tốt nhất tại Dev Pồ.
        </p>
      </Section>

      <ProductGrid />
    </>
  );
}
