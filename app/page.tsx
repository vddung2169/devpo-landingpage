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

export default function Home() {
  return (
    <main className="h-full">
      {/* <PromoModal /> */}
      <Hero />
      <QuestionIPLock />
      <FeaturedProducts limit={4} />
      <IphoneLockGuides />

      <CarrierTable />
      <CustomerGallery />

      {/* SEO Section */}
      <section className="py-12 bg-white dark:bg-[#0b0f19]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Dev Pồ - Cửa hàng bán iPhone Lock, Quốc tế, iPad uy tín hàng đầu tại TP. Hồ Chí Minh (iPhone Ho Chi Minh)
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi tự hào là đơn vị cung cấp các dòng iPhone Lock, Quốc tế, iPad với chất lượng zin nguyên bản, 
            cam kết giá tốt nhất thị trường và dịch vụ hỗ trợ fix lỗi sim ghép trọn đời tại Sài Gòn.
          </p>
        </div>
      </section>
    </main>
  );
}
