import type { Metadata } from "next";
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
    <main className="min-h-screen dark:bg-background">
      <div className="container mx-auto px-4 pt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Tất cả <span className="text-primary">sản phẩm</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          iPhone Lock, iPhone Quốc tế và iPad nguyên zin — giá tốt nhất tại Dev Pồ
        </p>
      </div>

      <ProductGrid />
    </main>
  );
}
