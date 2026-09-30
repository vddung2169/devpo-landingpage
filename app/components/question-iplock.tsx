import Image from "next/image";
import { ArrowRight, BadgeCheck, PiggyBank, ShieldCheck, SignalHigh } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ds/section";
import { FeatureCard } from "@/components/ds/feature-card";

const ADVANTAGES = [
  {
    icon: PiggyBank,
    title: "Giá mềm hơn hẳn",
    desc: "Rẻ hơn iPhone Quốc tế từ 3–10 triệu ở cùng một đời máy, cùng dung lượng.",
  },
  {
    icon: SignalHigh,
    title: "Sóng ổn định",
    desc: "Không cần sim ghép, sóng khoẻ như máy quốc tế, dùng được 2 SIM 2 sóng.",
  },
  {
    icon: BadgeCheck,
    title: "Phần cứng giống 100%",
    desc: "Cùng dây chuyền Apple: cấu hình, chip, camera, màn hình không khác gì bản quốc tế.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành trọn đời",
    desc: "Dev Pồ bao lỗi khoá máy trọn đời, hỗ trợ kỹ thuật 24/7.",
  },
];

export function QuestionIPLock() {
  return (
    <Section tone="plain">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="media-frame aspect-[4/3] w-full">
          <Image
            src="/iplock.png"
            alt="iPhone Lock và iPhone Quốc tế chính hãng trưng bày tại Dev Pồ"
            fill
            loading="lazy"
            sizes="(max-width: 1023px) 92vw, 46vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-h1 text-balance text-foreground">
            iPhone Lock là gì?
          </h2>

          <p className="text-lead text-pretty text-muted-foreground">
            iPhone Lock (iPhone khoá mạng) là máy được Apple sản xuất riêng cho
            một nhà mạng như AT&amp;T, Verizon hay Softbank. Ban đầu máy chỉ nhận
            SIM của đúng nhà mạng đó.
          </p>

          <p className="text-lead text-pretty text-muted-foreground">
            Hiện nay máy đã mở khoá được để dùng SIM Việt Nam bình thường. Mọi
            tính năng và phần cứng giống iPhone Quốc tế 100% vì cùng do Apple
            sản xuất — chỉ khác ở giá, rẻ hơn từ 3 đến 10 triệu.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a
                href="https://vt.tiktok.com/ZGdaQh1eN/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Video test iPhone Lock
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href="https://vt.tiktok.com/ZGdax3QBC/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cẩm nang iPhone Lock
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* --- Ưu điểm --- */}
      <div className="mt-section">
        <SectionHeader as="h3" title="Ưu điểm iPhone Lock" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ADVANTAGES.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.desc}
            </FeatureCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
