import type { Metadata } from "next";

import { CarrierTable } from "./components/carrier-table";
import { CustomerGallery } from "./components/custom-gallery";
import { FeaturedProducts } from "./components/featured-products";
import { IphoneLockGuides } from "./components/guides";
import { Hero } from "./components/hero";
import { QuestionIPLock } from "./components/question-iplock";
import { QuestionIPad } from "./components/question-ipad";
import { Reveal } from "./components/reveal";
import { FaqSection } from "@/components/FaqSection";
import { Section } from "@/components/ds/section";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />

      {/* Các khối dưới đây fade + trượt lên khi cuộn tới.
          Nền xen kẽ trắng / xám nhạt để mắt tách được từng khối mà không cần kẻ viền. */}
      <Reveal>
        <FeaturedProducts limit={8} />
      </Reveal>
      <Reveal>
        <QuestionIPLock />
      </Reveal>
      {/* Khối iPad đặt ngay sau khối iPhone Lock — song song, không thay thế */}
      <Reveal>
        <QuestionIPad />
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

      {/* Đoạn mô tả cửa hàng — phục vụ SEO, đồng thời khép lại trang */}
      <Reveal>
        <Section tone="plain" size="sm" containerClassName="max-w-4xl text-center">
          <h2 className="text-h2 text-balance text-foreground">
            Cửa hàng iPhone Lock, iPhone Quốc tế và iPad uy tín tại TP. Hồ Chí Minh
          </h2>
          <p className="text-lead mt-4 text-pretty text-muted-foreground">
            Dev Pồ cung cấp song song hai mảng: iPhone Lock &amp; iPhone Quốc tế
            zin nguyên bản kèm dịch vụ fix lỗi sim ghép trọn đời, và iPad cũ
            (iPad Pro, iPad Air, iPad Mini, iPad Gen) Cam kết giá tốt nhất thị trường, bảo hành tận tâm tại
            TP. Hồ Chí Minh.
          </p>
        </Section>
      </Reveal>

      {/* FAQ — đặt sau đánh giá khách hàng, trước footer (footer render trong layout) */}
      <Reveal>
        <FaqSection />
      </Reveal>
    </>
  );
}
