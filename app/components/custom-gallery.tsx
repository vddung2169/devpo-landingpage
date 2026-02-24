"use client";

import React from "react";
import Image from "next/image"; // 1. Import component Image của Next.js

const imageFiles = [
  "IMG_2326.JPG",
  "IMG_2751.JPG",
  "IMG_2855.JPG",
  "IMG_2856.JPG",
  "IMG_2857.JPG",
  "IMG_2858.JPG",
  "IMG_2859.JPG",
  "IMG_2860.JPG",
  "IMG_2862.JPG",
  "IMG_2863.JPG",
  "IMG_2864.JPG",
  "IMG_2865.JPG",
  "IMG_2866.JPG",
  "IMG_2911.JPG",
  "IMG_2954.JPG",
  "IMG_2955.JPG",
  "IMG_2956.JPG",
  "IMG_2961.JPG",
];

// Map mảng tên file thành mảng object chứa đường dẫn đầy đủ
const customerImages = imageFiles.map((filename, i) => ({
  id: i + 1,
  src: `/feedback/${filename}`, // Ảnh cần được đặt trong thư mục: public/feedback/
  alt: `Khách hàng DEV PỒ ${i + 1}`,
}));

export function CustomerGallery(): React.ReactElement {
  // Nhân đôi mảng để tạo cảm giác cuộn vô tận không bị đứt đoạn
  const duplicatedImages = [...customerImages, ...customerImages];

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0b0f19]/50 overflow-hidden border-t border-slate-200 dark:border-slate-800/50">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Khách hàng tin tưởng <span className="text-primary">DEV PỒ</span>
        </h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Hàng ngàn khách hàng đã trải nghiệm và hài lòng với chất lượng máy tại
          shop
        </p>
      </div>

      {/* Vùng chứa Gallery */}
      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes scroll-gallery {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 0.75rem)); } 
          }
          .animate-scroll-gallery {
            animation: scroll-gallery 40s linear infinite;
          }
          .animate-scroll-gallery:hover {
            animation-play-state: paused;
          }
        `,
          }}
        />

        {/* Khối chứa cuộn ngang */}
        <div className="flex w-max gap-6 animate-scroll-gallery py-4 px-3">
          {duplicatedImages.map((img, idx) => (
            <div
              key={`${img.id}-${idx}`}
              className="relative h-60 w-44 shrink-0 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:z-10 md:h-72 md:w-56 bg-slate-200 dark:bg-slate-800"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 176px, 224px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
