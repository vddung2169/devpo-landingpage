import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format số nguyên (VND) thành chuỗi kiểu "25.590.000đ" — dùng cho máy tính trả góp. */
export function formatVND(amount: number): string {
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`
}
