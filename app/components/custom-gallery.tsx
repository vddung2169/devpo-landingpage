"use client";

import React from "react";
import Image from "next/image"; // 1. Import component Image của Next.js

const imageFiles = [
  "IMG_3592.JPG",
  "IMG_3593.JPG",
  "IMG_3594.JPG",
  "IMG_3595.JPG",
  "IMG_3596.JPG",
  "IMG_3597.JPG",
  "IMG_3598.JPG",
  "IMG_3599.JPG",
  "IMG_3600.JPG",
  "IMG_3601.JPG",
  "IMG_3602.JPG",
  "IMG_3603.JPG",
  "IMG_3604.JPG",
  "IMG_3605.JPG",
  "IMG_3606.JPG",
  "IMG_3607.JPG",
  "IMG_3608.JPG",
  "IMG_3609.JPG",
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

// Alt text mô tả + chứa từ khóa SEO cho từng ảnh feedback (18 ảnh, mỗi alt một ý nghĩa)
const altTexts = [
  "Khách hàng mua iPhone Lock tại Dev Pồ HCM",
  "Feedback mua iPhone 16 Pro Max Lock Dev Pồ",
  "Khách nhận iPhone 15 Pro Max Lock tại Dev Pồ TP.HCM",
  "Đánh giá iPhone Lock giá tốt tại Dev Pồ",
  "Khách hàng tin tưởng mua iPhone Lock Dev Pồ",
  "Feedback iPhone 14 Pro Max Lock chính hãng Dev Pồ",
  "Khách mua iPhone Quốc tế tại Dev Pồ HCM",
  "Trải nghiệm mua iPhone Lock uy tín tại Dev Pồ",
  "Khách hàng hài lòng iPhone 13 Pro Max Lock Dev Pồ",
  "Feedback giao iPhone Lock tận nơi TP.HCM Dev Pồ",
  "Khách nhận iPhone 16 Lock fullbox tại Dev Pồ",
  "Đánh giá dịch vụ mua iPhone Lock Dev Pồ HCM",
  "Khách hàng mua iPhone 15 Lock giá rẻ Dev Pồ",
  "Feedback iPhone Pro Max Lock pin 100% tại Dev Pồ",
  "Khách tin chọn iPhone Lock chính hãng Dev Pồ",
  "Khách hàng mua iPhone 12 Pro Max Lock tại Dev Pồ",
  "Feedback mua iPhone Lock trả góp Dev Pồ TP.HCM",
  "Khách hàng thân thiết Dev Pồ iPhone Lock HCM",
];

// Blur placeholder dùng chung cho ảnh feedback (src dạng string runtime nên cần blurDataURL thủ công).
// 1x1 px xám nhạt — Next sẽ scale-up + blur trong lúc ảnh thật đang tải.
const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// Map mảng tên file thành mảng object chứa đường dẫn đầy đủ
const customerImages = imageFiles.map((filename, i) => ({
  id: i + 1,
  src: `/feedback/${filename}`, // Ảnh cần được đặt trong thư mục: public/feedback/
  alt: altTexts[i] ?? `Khách hàng mua iPhone Lock tại Dev Pồ HCM ${i + 1}`,
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
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
