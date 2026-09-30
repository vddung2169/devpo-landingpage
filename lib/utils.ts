import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge không tự biết các token riêng khai báo trong `@theme` của
 * app/globals.css. Với một class lạ như `text-lead`, nó đoán theo tên: thấy
 * tiền tố `text-` mà phần đuôi không phải cỡ chữ chuẩn (xs/sm/base/lg/xl...)
 * nên xếp nhầm vào nhóm MÀU CHỮ — rồi loại bỏ class màu đứng trước nó.
 *
 * Hậu quả thực tế đã gặp:
 *   cn("bg-primary text-primary-foreground", "text-lead")
 *     -> "bg-primary text-lead"   (mất màu chữ -> nút đen chữ đen, biến mất)
 *   cn("text-caption", "text-sale-ink")
 *     -> "text-sale-ink"          (mất cỡ chữ -> badge phình to)
 *
 * Khai báo dưới đây dạy cho tailwind-merge biết token nào thuộc nhóm nào.
 * MỖI KHI thêm token mới vào `@theme` trong globals.css, nhớ thêm vào đây.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // --- Thang cỡ chữ (globals.css: --text-*) ---
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "lead",
            "body",
            "caption",
            "overline",
          ],
        },
      ],
      // --- Bo góc (--radius-card, --radius-media) ---
      rounded: [{ rounded: ["card", "media"] }],
      // --- Bóng đổ (--shadow-e1/e2/e3) ---
      "shadow": [{ shadow: ["e1", "e2", "e3"] }],
      // --- Khoảng cách (--spacing-section, --spacing-block, --spacing-gutter) ---
      p: [{ p: ["section", "section-sm", "block", "gutter"] }],
      px: [{ px: ["section", "section-sm", "block", "gutter"] }],
      py: [{ py: ["section", "section-sm", "block", "gutter"] }],
      pt: [{ pt: ["section", "section-sm", "block", "gutter"] }],
      pr: [{ pr: ["section", "section-sm", "block", "gutter"] }],
      pb: [{ pb: ["section", "section-sm", "block", "gutter"] }],
      pl: [{ pl: ["section", "section-sm", "block", "gutter"] }],
      m: [{ m: ["section", "section-sm", "block", "gutter"] }],
      mx: [{ mx: ["section", "section-sm", "block", "gutter"] }],
      my: [{ my: ["section", "section-sm", "block", "gutter"] }],
      mt: [{ mt: ["section", "section-sm", "block", "gutter"] }],
      mr: [{ mr: ["section", "section-sm", "block", "gutter"] }],
      mb: [{ mb: ["section", "section-sm", "block", "gutter"] }],
      ml: [{ ml: ["section", "section-sm", "block", "gutter"] }],
      gap: [{ gap: ["section", "section-sm", "block", "gutter"] }],
      // --- Bề rộng khung (--container-page, --container-prose) ---
      "max-w": [{ "max-w": ["page", "prose"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format số nguyên (VND) thành chuỗi kiểu "25.590.000đ" — dùng cho máy tính trả góp. */
export function formatVND(amount: number): string {
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`
}
