import { CarrierTable } from "./components/carrier-table";
import { CustomerGallery } from "./components/custom-gallery";
import { IphoneLockGuides } from "./components/guides";

import { Features } from "./components/features";
import { FloatingContacts } from "./components/floating-contacts";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { News } from "./components/news";
import { Newsletter } from "./components/newsletter";
import { PromoModal } from "./components/promo-modal";
import { QuestionIPLock } from "./components/question-iplock";
import { Ticker } from "./components/ticker";
import { Videos } from "./components/video";
import { FeaturedProducts } from "./components/featured-products";
import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { Reveal } from "./components/reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="h-full">
      {/* <PromoModal /> */}
      <Hero />

      {/* Các section dưới đây fade + trượt lên khi cuộn tới */}
      <Reveal>
        <FeaturedProducts limit={4} />
      </Reveal>
      <Reveal>
        <QuestionIPLock />
      </Reveal>
      <Reveal>
        <IphoneLockGuides />
      </Reveal>
      <Reveal>
        <CarrierTable />
      </Reveal>
      <Reveal>
        <CustomerGallery />
      </Reveal>

      {/* SEO Section */}
      <Reveal>
        <section className="py-12 bg-white dark:bg-[#0b0f19]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Dev Pồ - Cửa hàng bán iPhone Lock, Quốc tế, iPad uy tín hàng đầu tại TP. Hồ Chí Minh
            </h2>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
              Chúng tôi tự hào là đơn vị cung cấp các dòng iPhone Lock, Quốc tế, iPad với chất lượng zin nguyên bản,
              cam kết giá tốt nhất thị trường và dịch vụ hỗ trợ fix lỗi sim ghép trọn đời tại TP. Hồ Chí Minh.
            </p>
          </div>
        </section>
      </Reveal>

      {/* FAQ — đặt sau đánh giá khách hàng, trước footer (footer render trong layout) */}
      <Reveal>
        <FaqSection />
      </Reveal>
    </main>
  );
}
