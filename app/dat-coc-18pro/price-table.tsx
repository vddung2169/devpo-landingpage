"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
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
            sizes="(max-width: 1023px) 50vw, 25vw"
            className="object-cover"
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

      <h3 className="text-center text-xs font-bold leading-snug text-foreground sm:text-sm">
        {model.name} {storage.size} | Chính Hãng
      </h3>
      <p className="mt-2 text-center text-[11px] text-muted-foreground sm:text-xs">
        Giá niêm yết
      </p>
      <p className="text-center text-base font-bold text-red-500 sm:text-lg">
        {formatVnd(storage.listPrice)}
      </p>

      {/* CTA — mt-auto giữ đáy các card thẳng hàng nhau */}
      <div className="mt-auto pt-3">
        <Button asChild className="h-9 w-full text-xs font-semibold sm:h-10 sm:text-sm">
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
      className="w-full bg-slate-50 px-2 py-12 dark:bg-[#0b0f19] sm:px-4 sm:py-16"
      id="bang-gia"
    >
      <div className="container mx-auto">
        <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-red-500 sm:text-3xl md:text-4xl">
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
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2 sm:text-sm ${
                  isActive
                    ? "border-red-500 bg-red-500 text-white shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-red-500/40 hover:text-foreground"
                }`}
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
