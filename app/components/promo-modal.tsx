"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra xem session này khách đã thấy quảng cáo chưa
    // Nếu chưa thấy thì mới cho hiện, để tránh làm phiền khách khi họ F5 liên tục
    const hasSeenPromo = sessionStorage.getItem("hasSeenPromo");

    if (!hasSeenPromo) {
      // Đặt độ trễ 1.5 giây sau khi web load xong mới bật quảng cáo lên
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenPromo", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    // onOpenChange giúp xử lý sự kiện khi khách bấm ra ngoài nền đen hoặc bấm nút X mặc định của shadcn
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 border-none shadow-2xl">
        {/* Phần ảnh bìa / Header của quảng cáo */}
        <div className="relative flex h-40 flex-col items-center justify-center bg-primary">
          <Gift className="h-16 w-16 text-white animate-bounce drop-shadow-md" />
          {/* Nút X đóng mặc định của DialogContent sẽ tự động có ở góc trên bên phải, màu đen. Mình có thể đè style bằng CSS hoặc để nguyên. */}
        </div>

        {/* Phần nội dung */}
        <div className="flex flex-col gap-4 p-6 bg-background text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🎉 Ưu đãi chớp nhoáng!
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Giảm ngay{" "}
              <span className="font-bold text-destructive text-lg">
                200.000đ
              </span>{" "}
              cho khách hàng lần đầu tham gia kênh báo giá Sale of DEV PỒ
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              size="lg"
              className="w-full font-semibold text-md animate-pulse hover:cursor-pointer bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]"
              onClick={() => {
                // Xử lý logic khi bấm nhận ưu đãi (Vd: copy mã hoặc chuyển tới phần sản phẩm)
                window.open(
                  "https://www.messenger.com/channel/61576332353912",
                  "_blank",
                  "noopener,noreferrer",
                );
                setIsOpen(false);
              }}
            >
              Lấy mã giảm giá ngay
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:cursor-pointer"
            >
              Bỏ qua ưu đãi này
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
