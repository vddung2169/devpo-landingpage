"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy } from "lucide-react";
import type { MyResult } from "@/lib/event-wheel";
import { formatSpinTime, prizeMeta } from "@/lib/event-wheel";
import { Confetti } from "./confetti";

/** Màn kết quả: quà lớn, mã ưu đãi, hướng dẫn dùng, nút copy. */
export function SpinResult({
  result,
  /** true khi đây là kết quả cũ (khách quay rồi, vào lại) — không bắn confetti. */
  replay,
}: {
  result: MyResult;
  replay: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const meta = prizeMeta(result.prizeId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Safari cũ / http: không có clipboard API — chọn sẵn text để khách tự copy.
      const el = document.getElementById("dw-code");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  return (
    // lg: trải ngang hai cột cho vừa màn hình desktop, không phải cuộn.
    <div className="relative flex flex-col items-center gap-4 text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-8">
      <Confetti fire={!replay} />

      <div className="flex w-full flex-col items-center gap-4 lg:col-start-1">
        <div className="flex flex-col items-center gap-1">
          <p className="text-[19px] font-bold uppercase tracking-[0.06em] text-white sm:text-[21px]">
            {replay ? "Phần quà của bạn" : "Chúc mừng bạn!"}
          </p>
          <p className="text-[13px] text-white/60">Bạn đã nhận được</p>
        </div>

        {/* Phần thưởng — nhân vật chính của màn này */}
        <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white px-5 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <span aria-hidden className="text-4xl leading-none">
            {meta.icon}
          </span>
          <p className="text-balance text-[22px] font-bold leading-tight text-[#06142b] sm:text-[26px]">
            {result.prizeName}
          </p>
          <p className="text-[12.5px] leading-snug text-[#06142b]/65">
            {meta.dieuKien}
          </p>
          {/* Vạch màu mỏng giữ lại nhận diện riêng của từng giải */}
          <span
            aria-hidden
            className="mt-1 h-1 w-12 rounded-full"
            style={{ backgroundColor: meta.mau }}
          />
        </div>
      </div>

      {/* Cột phải (desktop): mã ưu đãi + hướng dẫn + nút đóng */}
      <div className="flex w-full flex-col items-center gap-4 lg:col-start-2">
        {/* Mã ưu đãi */}
        <div className="w-full rounded-2xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
            Mã nhận thưởng của bạn
          </p>
          <p
            id="dw-code"
            className="mt-2 select-all font-mono text-[19px] font-semibold tracking-wider text-white sm:text-[21px]"
          >
            {result.code}
          </p>
          <button
            type="button"
            onClick={copy}
            className="mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white/10 text-[14px] font-medium text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                Đã copy mã
              </>
            ) : (
              <>
                <Copy className="size-4" />
                COPY MÃ ƯU ĐÃI
              </>
            )}
          </button>
        </div>

        <div className="w-full rounded-2xl bg-white/[0.04] p-4 text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
            Cách sử dụng
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
            {meta.huongDan}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-white/45">
            Mã dùng một lần, không quy đổi thành tiền mặt, không cộng dồn với
            khuyến mãi khác. DEV PỒ đã lưu thông tin của bạn — nhân viên sẽ đối
            chiếu khi bạn đến mua hàng.
          </p>
        </div>

        <p className="font-mono text-[11px] text-white/35">
          Thời gian quay: {formatSpinTime(result.at)}
        </p>

        <Link
          href="/"
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-[#06142b] transition hover:bg-white/90 active:scale-[0.99]"
        >
          <ArrowLeft className="size-4" />
          VỀ TRANG CHỦ DEV PỒ
        </Link>
      </div>
    </div>
  );
}
