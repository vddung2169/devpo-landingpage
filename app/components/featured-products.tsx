"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  ExternalLink,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho từng đường link
interface GuideLink {
  label: string;
  url: string;
}

// Định nghĩa kiểu dữ liệu cho mỗi thẻ cẩm nang
interface TikTokGuide {
  id: number;
  title: string;
  image: string;
  links: GuideLink[];
  badge?: string;
}

const tiktokGuides: TikTokGuide[] = [
  {
    id: 1,
    title: "Thông tin về iPhone Lock năm 2026",
    image: "/tiktok-videos/image1.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdmpfqtc/" }],
    badge: "Mới nhất",
  },

  {
    id: 3,
    title: "Tin mới về iPhone Lock",
    image: "/tiktok-videos/image2.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdag3vH1/" }],
    badge: "Hot",
  },
  {
    id: 4,
    title: "Giải đáp 999 câu hỏi",
    image: "/tiktok-videos/image3.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdacdk2v/" }],
  },
  {
    id: 5,
    title: "Fix lỗi iPhone Lock EID mới",
    image: "/tiktok-videos/image4.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdasxNv2/" }],
    badge: "Thủ thuật",
  },
  {
    id: 6,
    title: "Fix lỗi KHÔNG UPDATE IOS được",
    image: "/tiktok-videos/image5.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdaEsA6V/" }],
  },
  {
    id: 7,
    title: "Thiết bị MDM là gì",
    image: "/tiktok-videos/image6.png",
    links: [
      { label: "Phần 1", url: "https://vt.tiktok.com/ZGHG2EArnrJCM-nmfMq/" },
      { label: "Phần 2", url: "https://vt.tiktok.com/ZGdarcKm8/" },
    ],
  },
  {
    id: 8,
    title: "Quốc tế nửa mùa là gì?",
    image: "/tiktok-videos/image7.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGda7hWTw/" }],
  },
  {
    id: 9,
    title: "Fix lỗi danh bạ ghép sim TMSI/QPE",
    image: "/tiktok-videos/image8.png",
    links: [
      { label: "Xem video", url: "https://vt.tiktok.com/ZGHGj1exrQmnG-9LxD9/" },
    ],
  },
  {
    id: 10,
    title: "Fix lỗi điểm truy cập cá nhân",
    image: "/tiktok-videos/image9.png",
    links: [
      { label: "Xem video", url: "https://vt.tiktok.com/ZGHGj1eXuxoBP-lIIel/" },
    ],
  },
  {
    id: 11,
    title: "Thông tin, kiến thức về iPhone Lock",
    image: "/tiktok-videos/image10.png",
    links: [
      { label: "Phần 1", url: "https://vt.tiktok.com/ZGdarKKf8/" },
      { label: "Phần 2", url: "https://vt.tiktok.com/ZGHGj1RNJC14K-HCqB5/" },
      { label: "Phần 3", url: "https://vt.tiktok.com/ZGHGj1RNJC1qo-KPg62/" },
      { label: "Phần 4", url: "https://vt.tiktok.com/ZGdarcEmK/" },
      { label: "Phần 5", url: "https://vt.tiktok.com/ZGdahrfgt/" },
    ],
  },
  {
    id: 12,
    title: "Cách lắp sim EID 1 sim",
    image: "/tiktok-videos/image11.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdarohGf/" }],
  },
  {
    id: 13,
    title: "Cách lắp sim EID 2 sim",
    image: "/tiktok-videos/image12.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdahFSgG/" }],
  },
  {
    id: 14,
    title: "Cách lắp sim ghép 2 mảnh đúng cách",
    image: "/tiktok-videos/image13.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdarTtWT/" }],
  },
  {
    id: 15,
    title: "Tái sử dụng sim ghép khi hỏng 1 mặt",
    image: "/tiktok-videos/image14.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdaroWe3/" }],
  },
  {
    id: 16,
    title: "Respring iOS 26",
    image: "/tiktok-videos/image15.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdaxrPNP/" }],
  },
];

const ITEMS_PER_PAGE = 4;

export function IphoneLockGuides(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tiktokGuides.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGuides = tiktokGuides.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    document.getElementById("guides")?.scrollIntoView({ behavior: "smooth" });
    setCurrentPage(page);
  };

  return (
    <section
      className="py-10 md:py-16 bg-slate-50 dark:bg-slate-900"
      id="guides"
    >
      <div className="container mx-auto px-4">
        {/* Header section giữ nguyên */}
        <div className="mb-12 flex flex-col gap-4 text-center">
          <h2 className="text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            CẨM NANG iPHONE LOCK
          </h2>
          <p className="text-pretty text-lg text-muted-foreground max-w-4xl mx-auto">
            Tổng hợp toàn bộ kiến thức, cách ghép sim, và hướng dẫn fix lỗi chi
            tiết trên iPhone Lock cập nhật mới nhất.
          </p>
        </div>

        {/* Lưới danh sách video */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {currentGuides.map((guide) => (
            <Card
              key={guide.id}
              className="group relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg"
            >
              {/* Badge nằm đè lên ảnh */}
              {guide.badge && (
                <div className="absolute left-2 top-2 z-20 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm backdrop-blur-sm">
                  {guide.badge}
                </div>
              )}

              {/* Vùng chứa ảnh tràn viền - Nằm trực tiếp trong Card */}
              <div className="relative w-full aspect-video overflow-hidden bg-secondary rounded-t-xl">
                {/* <img
                  src={guide.image}
                  alt={guide.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                /> */}
                <Image
                  src={guide.image} // Lưu ý: Nếu dùng link ảnh ngoài (https://...), bạn phải cấu hình trong next.config.ts nhé
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Lớp phủ khi hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" /> */}
                </div>
              </div>

              <CardTitle className="px-4 line-clamp-2 text-lg leading-snug">
                {guide.title}
              </CardTitle>

              <CardContent className="flex flex-col gap-2 pt-2 pb-4 px-4 mt-auto">
                {guide.links.length === 1 ? (
                  // Nếu chỉ có 1 link: Hiển thị 1 nút bình thường
                  <Button
                    className="w-full flex items-center justify-between group/btn"
                    asChild
                  >
                    <a
                      href={guide.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {guide.links[0].label}
                      <ExternalLink className="h-4 w-4 ml-2 opacity-70 transition-transform group-hover/btn:scale-110" />
                    </a>
                  </Button>
                ) : (
                  // Nếu có nhiều link: Hiển thị Dropdown Menu
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full flex items-center justify-between group/btn">
                        <span>Danh sách phần ({guide.links.length})</span>
                        <ChevronDown className="h-4 w-4 ml-2 opacity-70 transition-transform group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>

                    {/* align="end" giúp menu căn lề phải, w-[--radix-dropdown-menu-trigger-width] ép dropdown rộng bằng đúng nút trigger */}
                    <DropdownMenuContent
                      align="end"
                      className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      {guide.links.map((link, index) => (
                        <DropdownMenuItem
                          key={index}
                          asChild
                          className="cursor-pointer"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full"
                          >
                            {link.label}
                            <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination giữ nguyên */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
}
