"use client";

import Image from "next/image";
import { ChevronDown, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Link 2 kênh chat. Thay bằng link nhóm tương ứng nếu cần.
const MESSENGER_LINK = "https://www.messenger.com/channel/61576332353912";
// ZALO_LINK lấy từ data/products (đang là link Zalo liên hệ). Nếu bạn có link
// NHÓM Zalo riêng thì đổi hằng số dưới đây.
const ZALO_GROUP_LINK = "https://zalo.me/g/5unozsp2e9ij0s5b37pe";

const CHANNELS = [
  {
    href: MESSENGER_LINK,
    image: "/mess.jpg",
    title: "Nhắn qua Messenger",
    desc: "Vào nhóm chat Messenger",
  },
  {
    href: ZALO_GROUP_LINK,
    image: "/zalo.jpg",
    title: "Nhắn qua Zalo",
    desc: "Vào nhóm chat Zalo",
  },
];

/**
 * Nút CTA chính "Nhận báo giá" — mở danh sách kênh chat.
 *
 * Bản cũ có viền glow gradient xanh→tím nhấp nháy liên tục và hiệu ứng shimmer
 * quét ngang. Giao diện mới bỏ hẳn: nút đặc màu primary, chỉ đổi độ đậm khi rê
 * chuột. Ánh nhìn dồn vào ảnh sản phẩm và giá, đúng tinh thần tối giản.
 */
export function QuoteCTA({ className }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="xl"
          className={cn("group/btn w-full", className)}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Nhận báo giá ngay
          <ChevronDown
            className="size-4 opacity-70 transition-transform duration-200 group-data-[state=open]/btn:rotate-180"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-xl p-2 shadow-e3"
      >
        <DropdownMenuLabel className="px-2 text-caption font-medium text-muted-foreground">
          Chọn kênh chat để nhận báo giá
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {CHANNELS.map((channel) => (
          <DropdownMenuItem
            key={channel.href}
            asChild
            className="cursor-pointer rounded-lg p-2.5"
          >
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Image
                src={channel.image}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <span className="flex flex-col">
                <span className="text-body font-semibold text-foreground">
                  {channel.title}
                </span>
                <span className="text-caption text-muted-foreground">
                  {channel.desc}
                </span>
              </span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
