import type { Metadata } from "next";

import { BuySteps } from "./components/home/buy-steps";
import { CategoryBand } from "./components/home/category-band";
import { Closing } from "./components/home/closing";
import { ContactDock } from "./components/home/contact-dock";
import { CustomerProof } from "./components/home/customer-proof";
import { FaqStore } from "./components/home/faq-store";
import { HomeHero } from "./components/home/home-hero";
import { LockCompare } from "./components/home/lock-compare";
import { ProductShowcase } from "./components/home/product-showcase";
import { PromiseBand } from "./components/home/promise-band";
import { ToolLinks } from "./components/home/tool-links";
import { VideoPicks } from "./components/home/video-picks";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Trang chủ — sắp theo hành trình mua máy:
 * hero + so giá → cam kết → 3 dòng máy → máy có sẵn → Lock hay Quốc tế →
 * cách mua → công cụ → khách hàng → video → hỏi đáp + cửa hàng → CTA.
 *
 * Header dùng chung toàn site (app/components/header.tsx). Trang chủ có footer và
 * thanh liên hệ riêng; footer/bong bóng chat chung được ẩn ở "/" (xem conditional-chrome.tsx).
 * Nội dung tạm cần thay nằm trong app/components/home/home-data.ts và các <Placeholder>.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <PromiseBand />
      <CategoryBand />
      <ProductShowcase />
      <LockCompare />
      <BuySteps />
      <ToolLinks />
      <CustomerProof />
      <VideoPicks />
      <FaqStore />
      <Closing />
      <ContactDock />
    </>
  );
}
