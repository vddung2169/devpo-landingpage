"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  NOI_BO_PIN,
  NOI_BO_COOKIE,
  NOI_BO_TOKEN,
  safeNoiBoPath,
} from "@/lib/noi-bo-auth";

export type PinState = { error?: string };

/**
 * Kiểm tra mã PIN. Đúng -> đặt cookie httpOnly rồi chuyển vào khu nội bộ.
 * Sai -> trả về thông báo lỗi (không tiết lộ PIN).
 */
export async function verifyPin(
  _prev: PinState,
  formData: FormData,
): Promise<PinState> {
  const pin = String(formData.get("pin") ?? "").trim();

  if (pin !== NOI_BO_PIN) {
    return { error: "Mã PIN không đúng. Vui lòng thử lại." };
  }

  const cookieStore = await cookies();
  cookieStore.set(NOI_BO_COOKIE, NOI_BO_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
  });

  redirect(safeNoiBoPath(String(formData.get("from") ?? "")));
}
