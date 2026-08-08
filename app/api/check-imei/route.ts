import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_SERVICE_ID,
  IUnlockError,
  balance,
  check,
  isConfigured,
  normalizeInput,
  serviceList,
} from "@/lib/iunlock";
import { NOI_BO_COOKIE, NOI_BO_TOKEN } from "@/lib/noi-bo-auth";
import {
  QUOTA_COOKIE,
  QUOTA_WINDOW_MS,
  decodeTicket,
  encodeTicket,
  packLines,
  resetAt,
  unpackLines,
  type QuotaTicket,
} from "@/lib/imei-quota";

/**
 * Proxy giữa trang /check-imei và iUnlock JSON API.
 *
 * Chạy phía server để API key không lộ ra bundle client và không dính CORS.
 * Mỗi thiết bị được 1 lượt check miễn phí / 24h (xem lib/imei-quota.ts).
 *
 * iUnlock là API ĐỒNG BỘ: POST tra cứu và trả kết quả ngay trong cùng một
 * request — không còn cơ chế đặt lệnh rồi hỏi lại như DHRU trước đây. Vì API
 * không có action đọc lại đơn cũ, kết quả được nhét vào chính cookie hạn mức
 * để tải lại trang vẫn xem được thứ đã trả tiền.
 */
export const dynamic = "force-dynamic";
/** Dịch vụ khai "Instant" nhưng nguồn có thể chậm — cho hạn rộng hơn upstream. */
export const maxDuration = 120;

function fail(message: string, status = 502) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Chỉ phiên đã mở khoá qua /noi-bo mới xem được thông tin tài khoản. */
function isInternal(req: NextRequest) {
  return req.cookies.get(NOI_BO_COOKIE)?.value === NOI_BO_TOKEN;
}

function attachTicket(res: NextResponse, ticket: QuotaTicket) {
  res.cookies.set(QUOTA_COOKIE, encodeTicket(ticket), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(QUOTA_WINDOW_MS / 1000),
  });
  return res;
}

/** Trạng thái hạn mức + kết quả lần tra gần nhất, đọc hoàn toàn từ cookie. */
function snapshot(ticket: QuotaTicket) {
  const lines = unpackLines(ticket.r);
  return {
    ok: true as const,
    state: lines.length ? ("done" as const) : ("used" as const),
    input: ticket.q,
    serviceId: ticket.sid,
    orderId: ticket.o,
    resetAt: resetAt(ticket),
    result: lines,
  };
}

/**
 * GET ?action=status   — trạng thái lượt check của thiết bị hiện tại
 * GET ?action=account  — số dư tài khoản iUnlock (chỉ phiên nội bộ)
 * GET ?action=services — danh sách dịch vụ + mã ID (chỉ phiên nội bộ)
 */
export async function GET(req: NextRequest) {
  if (!isConfigured()) {
    return fail("Chưa cấu hình biến môi trường IUNLOCK_* trên máy chủ.", 500);
  }

  const action = new URL(req.url).searchParams.get("action") ?? "status";

  try {
    if (action === "status") {
      const ticket = decodeTicket(req.cookies.get(QUOTA_COOKIE)?.value);
      if (!ticket) return NextResponse.json({ ok: true, state: "idle" });
      return NextResponse.json(snapshot(ticket));
    }

    // Số dư và danh sách dịch vụ (kèm giá) là thông tin nội bộ — trang public
    // không được thấy.
    if (action === "account") {
      if (!isInternal(req)) return fail("Không có quyền xem số dư.", 403);
      return NextResponse.json({ ok: true, account: await balance() });
    }

    if (action === "services") {
      if (!isInternal(req)) return fail("Không có quyền xem dịch vụ.", 403);
      return NextResponse.json({
        ok: true,
        current: DEFAULT_SERVICE_ID,
        services: await serviceList(),
      });
    }

    return fail("Tham số action không hợp lệ.", 400);
  } catch (err) {
    if (err instanceof IUnlockError) return fail(err.message);
    return fail("Lỗi không xác định khi gọi máy chủ IMEI.");
  }
}

/**
 * POST { imei } — tra cứu và trả kết quả ngay.
 * Nếu thiết bị đã dùng lượt trong 24h qua thì trả 429 kèm kết quả lần trước.
 *
 * Dịch vụ được CỐ ĐỊNH ở server (IUNLOCK_SERVICE_ID) — không nhận từ client,
 * để không ai gọi thẳng API mà đặt được dịch vụ đắt tiền trên tài khoản.
 */
export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return fail("Chưa cấu hình biến môi trường IUNLOCK_* trên máy chủ.", 500);
  }

  let payload: { imei?: unknown };
  try {
    payload = await req.json();
  } catch {
    return fail("Body không phải JSON hợp lệ.", 400);
  }

  // Đã có lượt trong 24h qua -> không gọi API, chỉ trả lại kết quả cũ.
  const existing = decodeTicket(req.cookies.get(QUOTA_COOKIE)?.value);
  if (existing) {
    return NextResponse.json(
      {
        ...snapshot(existing),
        ok: false,
        error:
          "Mỗi thiết bị chỉ được kiểm tra miễn phí 1 lần trong 24 giờ. Kết quả lần trước vẫn xem lại được bên dưới.",
      },
      { status: 429 },
    );
  }

  const input = normalizeInput(String(payload.imei ?? ""));
  if (!input) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "IMEI phải gồm 15 chữ số và đúng checksum Luhn, hoặc nhập Serial 8–12 ký tự.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await check(DEFAULT_SERVICE_ID, input.value);
    const ticket: QuotaTicket = {
      q: input.value,
      sid: DEFAULT_SERVICE_ID,
      ts: Date.now(),
      o: result.orderId,
      r: packLines(result.lines),
    };

    const res = NextResponse.json({
      ok: true,
      state: "done",
      input: input.value,
      serviceId: result.serviceId,
      orderId: result.orderId,
      result: result.lines,
      raw: result.raw,
      resetAt: resetAt(ticket),
    });
    // Chỉ tính lượt khi đã có kết quả thật: tra hỏng thì không được trừ lượt.
    return attachTicket(res, ticket);
  } catch (err) {
    if (err instanceof IUnlockError) {
      // Lỗi do người dùng nhập sai thì trả 400 để client hiểu là lỗi đầu vào,
      // không phải sự cố máy chủ. Cả hai trường hợp đều KHÔNG cấp cookie hạn
      // mức, nên người dùng vẫn còn nguyên lượt để nhập lại.
      return fail(err.message, err.userInput ? 400 : 502);
    }
    return fail("Lỗi không xác định khi gọi máy chủ IMEI.");
  }
}
