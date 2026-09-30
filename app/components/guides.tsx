"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/ds/section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGduqTg8w/" }],
    badge: "Mới nhất",
  },

  {
    id: 3,
    title: "Tin mới về iPhone Lock",
    image: "/tiktok-videos/image2.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGdub1SFc/" }],
    badge: "Hot",
  },
  {
    id: 4,
    title: "Giải đáp 999 câu hỏi",
    image: "/tiktok-videos/image3.png",
    links: [{ label: "Xem video", url: "https://vt.tiktok.com/ZGduqE1jj/" }],
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

/** Nhãn trên thẻ video → tông màu ngữ nghĩa. Nhãn lạ thì về trung tính. */
const BADGE_TONE: Record<string, "sale" | "info" | "success" | "warning" | "neutral"> = {
  "Mới nhất": "info",
  Hot: "warning",
  "Thủ thuật": "success",
};

export function IphoneLockGuides({
  hideViewAll = false,
  itemsPerPage = 4,
}: {
  hideViewAll?: boolean;
  itemsPerPage?: number;
} = {}): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tiktokGuides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGuides = tiktokGuides.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    document.getElementById("guides")?.scrollIntoView({ behavior: "smooth" });
    setCurrentPage(page);
  };

  return (
    <Section id="guides" tone="surface">
      <SectionHeader
        align="center"
        eyebrow="Video hướng dẫn"
        title="Cẩm nang iPhone Lock"
        description="Tổng hợp kiến thức, cách ghép sim và hướng dẫn fix lỗi chi tiết trên iPhone Lock."
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {currentGuides.map((guide) => (
          <article key={guide.id} className="group flex flex-col">
            <div className="media-frame aspect-video w-full bg-background">
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                loading="lazy"
                sizes="(max-width: 639px) 45vw, (max-width: 1023px) 45vw, (max-width: 1279px) 30vw, 23vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              {guide.badge && (
                <Badge
                  variant={BADGE_TONE[guide.badge] ?? "neutral"}
                  tint="solid"
                  size="sm"
                  className="absolute left-3 top-3 shadow-e1"
                >
                  {guide.badge}
                </Badge>
              )}
            </div>

            <h3 className="text-h4 mt-3 line-clamp-2 text-foreground">
              {guide.title}
            </h3>

            <div className="mt-auto pt-3">
              {guide.links.length === 1 ? (
                // Một video: nút là thẻ <a> thật — bản cũ bọc thẻ <p> nên không
                // bấm được bằng bàn phím và trình đọc màn hình không hiểu là link.
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a
                    href={guide.links[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {guide.links[0].label}
                    <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
                  </a>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group/btn w-full"
                    >
                      Danh sách phần ({guide.links.length})
                      <ChevronDown
                        className="size-3.5 opacity-70 transition-transform group-data-[state=open]/btn:rotate-180"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  {/* Ép dropdown rộng bằng đúng nút trigger */}
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
                          className="flex w-full items-center justify-between"
                        >
                          {link.label}
                          <ExternalLink
                            className="size-3.5 opacity-50"
                            aria-hidden="true"
                          />
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-block">
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

      {!hideViewAll && (
        <div className="mt-block flex justify-center">
          <Button asChild size="lg">
            <Link href="/guides">Xem tất cả cẩm nang</Link>
          </Button>
        </div>
      )}
    </Section>
  );
}
