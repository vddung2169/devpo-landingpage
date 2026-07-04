"use client";

import { ChevronDown, MessageCircle } from "lucide-react";
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

export function QuoteCTA() {
  return (
    <div className="relative group inline-flex w-full sm:w-auto">
      {/* Hiệu ứng Glow nhịp thở */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 via-primary to-purple-600 opacity-70 blur-md animate-pulse transition duration-500 group-hover:opacity-100 group-hover:blur-lg" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group/btn relative h-14 w-full sm:w-auto sm:px-8 overflow-hidden rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-95">
            {/* Shimmer Sweep */}
            <span className="absolute left-[-100%] top-0 z-10 h-full w-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[250%]" />

            <span className="relative z-20 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-lg font-bold md:text-xl">Nhận báo giá Sale ngay</span>
              <ChevronDown className="h-5 w-5 opacity-80 transition-transform duration-200 group-data-[state=open]/btn:rotate-180" />
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="w-[min(20rem,calc(100vw-2rem))] rounded-xl p-2"
        >
          <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
            Chọn kênh chat để nhận báo giá
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5">
            <a href={MESSENGER_LINK} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mess.jpg"
                alt="Messenger"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <span className="flex flex-col">
                <span className="font-semibold text-foreground">Nhắn qua Messenger</span>
                <span className="text-xs text-muted-foreground">Vào nhóm chat Messenger</span>
              </span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-2.5">
            <a href={ZALO_GROUP_LINK} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zalo.jpg"
                alt="Zalo"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <span className="flex flex-col">
                <span className="font-semibold text-foreground">Nhắn qua Zalo</span>
                <span className="text-xs text-muted-foreground">Vào nhóm chat Zalo</span>
              </span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
