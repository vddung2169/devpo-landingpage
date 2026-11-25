import { NextRequest, NextResponse } from "next/server";
import { buildTelegramMessage, cleanPayload, validatePayload } from "@/lib/thu-may";

/**
 * Nhận form /thu-may và đẩy vào topic "CHECK MÁY KHÁCH" trong nhóm Telegram.
 *
 * Mặc định: chuyển tiếp sang app quản lý (quan-ly-devpo), nơi đang giữ bot
 * Telegram nhóm DEV PỒ và topic CHECK MÁY KHÁCH (gõ /checkmay trong topic để chọn).
 * Web này không cần giữ token bot.
 *
 * Tuỳ chọn (gửi thẳng Telegram, bỏ qua app quản lý) khi đặt đủ 3 biến:
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHECK_MAY_CHAT_ID, TELEGRAM_CHECK_MAY_THREAD_ID
 * Đổi địa chỉ chuyển tiếp: THU_MAY_FORWARD_URL
 *
 * Form công khai, không đăng nhập: chặn bot bằng ô bẫy + giới hạn số lần gửi
 * theo IP (bộ nhớ của từng instance, đủ để chặn spam thô).
 */
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHECK_MAY_CHAT_ID;
  const threadId = process.env.TELEGRAM_CHECK_MAY_THREAD_ID;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Dữ liệu gửi lên không hợp lệ.", 400);
  }

  const payload = cleanPayload(body);
  // Bot điền ô bẫy: giả vờ thành công, không gửi gì.
  if (payload.website) return NextResponse.json({ ok: true });

  const invalid = validatePayload(payload);
  if (invalid) return fail(invalid, 400);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return fail("Bạn gửi quá nhiều lần, vui lòng thử lại sau ít phút.", 429);
  }

  if (!token || !chatId || !threadId) return forward(payload, ip);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      ...(threadId ? { message_thread_id: Number(threadId) } : {}),
      text: buildTelegramMessage(payload),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    const detail = res ? await res.text().catch(() => "") : "network error";
    console.error("[thu-may] Telegram sendMessage failed", res?.status, detail);
    return fail("Chưa gửi được thông tin, vui lòng thử lại.", 502);
  }

  return NextResponse.json({ ok: true });
}

const FORWARD_URL =
  process.env.THU_MAY_FORWARD_URL || "https://quan-ly-devpo.vercel.app/api/public/bao-thu-may";

/** Chuyển form sang app quản lý; app đó gửi vào topic CHECK MÁY KHÁCH. */
async function forward(payload: ReturnType<typeof cleanPayload>, ip: string) {
  const res = await fetch(FORWARD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-thu-may-client-ip": ip },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  const data = res ? ((await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }) : {};
  if (!res || !res.ok || !data.ok) {
    console.error("[thu-may] forward failed", res?.status, data);
    return fail(data.error || "Chưa gửi được thông tin, vui lòng thử lại.", res?.status === 429 ? 429 : 502);
  }
  return NextResponse.json({ ok: true });
}
