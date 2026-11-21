import Image from "next/image";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT, TOP_FAQS } from "./home-data";
import { ArrowLink } from "./arrow-link";
import { Placeholder } from "./placeholder";

// FAQPage cho Google — sinh từ đúng các câu đang hiển thị, bỏ qua câu còn là chỗ trống.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TOP_FAQS.filter((item) => !("placeholder" in item)).map(
    (item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }),
  ),
};

/** 6 câu hỏi hay gặp + thẻ cửa hàng (ảnh thật, địa chỉ, giờ, số điện thoại). */
export function FaqStore() {
  return (
    <section
      id="cua-hang"
      aria-labelledby="faq-title"
      className="scroll-mt-20 py-section"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-18">
        <div>
          <h2 id="faq-title" className="text-h2 text-foreground">
            Câu hỏi khách hay nhắn
          </h2>
          <div className="mb-3 mt-6 border-t border-border-strong">
            {TOP_FAQS.map((item) => (
              <details key={item.q} className="group border-b border-border">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    className="ml-auto size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-2xl pb-4 text-muted-foreground">
                  {"placeholder" in item && item.placeholder ? (
                    <Placeholder>{item.a}</Placeholder>
                  ) : (
                    item.a
                  )}
                </p>
              </details>
            ))}
          </div>
          <ArrowLink href="/guides">Xem thêm câu hỏi trong Cẩm nang</ArrowLink>
        </div>

        <aside
          aria-label="Thông tin cửa hàng"
          className="overflow-hidden rounded-media bg-surface lg:sticky lg:top-24"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src="/background-2.jpg"
              alt="Bên trong cửa hàng Dev Pồ ở Bình Giã, Tân Bình"
              fill
              sizes="(max-width: 1023px) 92vw, 36vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 p-5 pb-6">
            <h3 className="text-h3 text-foreground">Ghé Dev Pồ</h3>
            <p className="text-muted-foreground">{CONTACT.address}</p>
            <p className="text-muted-foreground">
              Mở cửa:{" "}
              <Placeholder hint="giờ mở cửa">[9:00 – 21:00]</Placeholder>
            </p>
            <p className="text-muted-foreground">
              Hotline:{" "}
              <a
                href={CONTACT.tel}
                className="font-mono font-semibold text-foreground"
              >
                {CONTACT.phone}
              </a>
            </p>
            <Button asChild className="mt-2 self-start">
              <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">
                Chỉ đường Google Maps
              </a>
            </Button>
          </div>
        </aside>
      </div>
      <JsonLd data={faqSchema} />
    </section>
  );
}
