"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZALO_LINK } from "@/data/products";
import {
  MODELS,
  formatVnd,
  type PhoneModel,
  type StorageOption,
} from "./preorder-data";

function VariantCard({
  model,
  storage,
}: {
  model: PhoneModel;
  storage: StorageOption;
}) {
  const zaloText = encodeURIComponent(
    `Mình muốn đặt cọc ${model.name} ${storage.size}.`,
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-5">
      {/* Ảnh sản phẩm — hiện là placeholder, điền `image` trong preorder-data.ts để thay */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-white">
        {storage.image ? (
          <Image
            src={storage.image}
            alt={`${model.name} ${storage.size} chính hãng tại Dev Pồ`}
            fill
            loading="lazy"
            sizes="(max-width: 1023px) 50vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
            style={{
              background: `linear-gradient(145deg, ${model.accent} 0%, ${model.accent}cc 55%, ${model.accent}99 100%)`,
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <ImageIcon className="h-5 w-5 text-white/90" />
            </div>
            <p className="px-3 text-xs font-semibold text-white drop-shadow">
              {model.name} {storage.size}
            </p>
            <p className="px-3 text-[11px] text-white/75 drop-shadow">
              Ảnh đang cập nhật
            </p>
          </div>
        )}
      </div>

      <h3 className="text-center text-body font-bold leading-snug text-foreground">
        {model.name} {storage.size} | Chính Hãng
      </h3>
      <p className="mt-2 text-center text-caption text-muted-foreground">
        Giá niêm yết
      </p>
      <p className="text-center text-h3 font-bold text-price">
        {formatVnd(storage.listPrice)}
      </p>

      {/* CTA — mt-auto giữ đáy các card thẳng hàng nhau */}
      <div className="mt-auto pt-3">
        <Button asChild size="sm" className="w-full font-semibold">
          <Link
            href={`${ZALO_LINK}?text=${zaloText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Đăng ký ngay
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function PriceTable() {
  const [activeId, setActiveId] = useState(MODELS[0].id);
  const active = MODELS.find((m) => m.id === activeId) ?? MODELS[0];

  return (
    <section
      className="w-full bg-surface px-gutter py-section"
      id="bang-gia"
    >
      <div className="container-page">
        <h2 className="text-h2 text-balance text-center text-foreground">
          Bảng giá iPhone 18 Pro | iPhone 18 Pro Max | iPhone Duo
        </h2>

        {/* Tab chọn dòng máy */}
        <div
          role="tablist"
          aria-label="Chọn dòng máy để xem bảng giá"
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {MODELS.map((model) => {
            const isActive = model.id === active.id;
            return (
              <button
                key={model.id}
                type="button"
                role="tab"
                id={`tab-${model.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${model.id}`}
                onClick={() => setActiveId(model.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-body font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {model.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Lưới 4 phiên bản dung lượng của dòng đang chọn */}
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          {active.storages.map((storage) => (
            <VariantCard
              key={`${active.id}-${storage.size}`}
              model={active}
              storage={storage}
            />
          ))}
        </div>

        
      </div>
    </section>
  );
}
