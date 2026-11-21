import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProductBySlug, priceToNumber } from "@/data/products";
import { COMPARE_MODELS, CONTACT } from "./home-data";
import { Placeholder } from "./placeholder";
import { PriceReceipt, type ReceiptModel } from "./price-receipt";

/** Ghép giá Quốc tế với giá Lock cùng đời, đều lấy từ data/products.ts */
function buildReceiptModels(): ReceiptModel[] {
  return COMPARE_MODELS.flatMap((model) => {
    const product = getProductBySlug(model.slug);
    const international = getProductBySlug(model.internationalSlug);
    if (!product || !international) return [];
    const lockPrice = priceToNumber(product.priceFrom);
    const internationalPrice = priceToNumber(international.priceFrom);
    // Bỏ qua đời máy thiếu giá hoặc Lock không rẻ hơn, tránh hiện "giữ lại" âm
    if (!lockPrice || internationalPrice <= lockPrice) return [];
    return [
      {
        slug: model.slug,
        label: model.label,
        image: product.image,
        lockPrice,
        internationalPrice,
        spec: `${product.storage} · ${product.battery} · ${product.condition}`,
      },
    ];
  });
}

/** Hero: giới thiệu đủ 3 dòng máy + phiếu so giá Lock / Quốc tế (chuyển động chính của trang). */
export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="overflow-hidden bg-surface py-[clamp(2.5rem,1.5rem+4vw,5.5rem)]"
    >
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 text-caption font-medium text-muted-foreground">
            <span
              className="size-2 rounded-full bg-success ring-4 ring-success/20"
              aria-hidden="true"
            />
            iPhone Lock · iPhone Quốc tế · iPad, tại Tân Bình, TP.Hồ Chí Minh
          </p>
          <h1
            id="hero-title"
            className="mt-5 text-[clamp(2.25rem,1.5rem+3vw,4.25rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-balance text-foreground"
          >
            iPhone Lock, Quốc tế và iPad.
            <br />
            <span className="text-muted-foreground">Máy zin, giá rõ ràng.</span>
          </h1>
          <p className="text-lead mt-6 max-w-xl text-pretty text-muted-foreground">
            Dev Pồ bán song song ba dòng máy: iPhone Lock giá mềm, iPhone Quốc
            tế, và iPad cũ đủ đời. Máy nào cũng được kiểm tra cùng bạn trước khi
            nhận, máy Lock fix lỗi sim sóng trọn đời.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer">
                Nhắn Zalo báo giá
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href="#may">
                Xem máy đang có
                <ArrowDown className="size-5" aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p className="mt-5 text-caption text-muted-foreground">
            Phản hồi trong giờ mở cửa{" "}
            <Placeholder hint="thời gian phản hồi trung bình">
              ~5 phút?
            </Placeholder>{" "}
            · Ship toàn quốc · Trả góp 0%
          </p>
        </div>

        <PriceReceipt models={buildReceiptModels()} />
      </div>
    </section>
  );
}
