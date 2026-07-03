"use client";

// FAQ accordion cho trang chi tiết cẩm nang (/guides/[slug]).
// Dữ liệu FAQ đến từ `guide.faq` trong data/guides.ts — cùng nguồn dữ liệu
// dùng để build FAQPage JSON-LD ở page.tsx (tránh lệch nội dung UI vs schema).

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuideFaqProps {
  faq: { question: string; answer: string }[];
}

export function GuideFaq({ faq }: GuideFaqProps) {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
        Câu hỏi thường gặp
      </h2>
      <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
        {faq.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-base font-semibold text-foreground">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
