"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Facebook,
  Youtube,
  Instagram,
  Smartphone,
} from "lucide-react";

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="bg-[#0b0f19] py-12 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {/* Cột 1: Logo và Mô tả */}
          <div className="flex flex-col gap-4">
            <div className="flex cursor-pointer">
              <img
                src="/devpo_logo_white.png"
                alt="App Logo Light"
                className="h-12 dark:hidden"
              />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Chuyên cung cấp các dòng iPhone Lock, Quốc tế chính hãng. Uy tín,
              chất lượng, giá tốt nhất thị trường kèm dịch vụ hỗ trợ trọn đời.
            </p>

            {/* Icons Mạng xã hội */}
            <div className="mt-4 flex gap-5">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Cột 2: Thông tin liên hệ */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-white">
              Thông tin liên hệ
            </h3>
            <ul className="flex flex-col gap-4 text-sm mt-2 text-slate-400">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:0399208037"
                    className="transition-colors hover:text-white"
                  >
                    0399 208 037
                  </a>
                  <a
                    href="tel:0909097177"
                    className="transition-colors hover:text-white"
                  >
                    09 09 09 7177
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                <span className="leading-relaxed transition-colors hover:text-white">
                  Địa chỉ: 3/39A Bình Giã, P.Tân Bình, <br /> TP. Hồ Chí Minh
                </span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chính sách & Hỗ trợ */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-white">
              Chính sách & Hỗ trợ
            </h3>
            <ul className="flex flex-col gap-3 text-sm mt-2 text-slate-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Hướng dẫn mua trả góp
                </a>
              </li>
              <li>
                <a
                  href="#guides"
                  className="transition-colors hover:text-white"
                >
                  Cẩm nang iPhone Lock
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
