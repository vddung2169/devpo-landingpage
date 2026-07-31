import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_SERVICE_ID,
  DhruError,
  accountInfo,
  diagnose,
  getImeiOrder,
  isDhruConfigured,
  isValidImei,
  parseResultLines,
  placeImeiOrder,
} from "@/lib/dhru";
import { NOI_BO_COOKIE, NOI_BO_TOKEN } from "@/lib/noi-bo-auth";
import {
  QUOTA_COOKIE,
  QUOTA_WINDOW_MS,
  decodeTicket,
  encodeTicket,
  resetAt,
  type QuotaTicket,
} from "@/lib/imei-quota";

/**
 * Proxy giữa trang /check-imei và DHRU Fusion API.
 *
 * Chạy phía server để API key không lộ ra bundle client và không dính CORS.
 * Mỗi thiết bị được 1 lượt check miễn phí / 24h (xem lib/imei-quota.ts).
 *
 * Cố ý KHÔNG chờ kết quả trong một request dài: có dịch vụ (vd #16) mất vài
 * phút, giữ kết nối lâu sẽ chạm giới hạn function và mất trắng nếu client
 * đóng tab. Thay vào đó POST đặt lệnh rồi trả ngay mã đơn, client hỏi lại qua
 * GET ?action=status — nhờ vậy thoát ra rồi quay lại vẫn nhận đúng kết quả.
 */
export const dynamic = "force-dynamic";

function fail(message: string, status = 502) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Xoá cookie hạn mức (dùng khi đơn bị từ chối và đã hoàn tiền). */
function clearTicket(res: NextResponse) {
  res.cookies.set(QUOTA_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
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

/**
 * Tra kết quả của đơn trong ticket. Mã đơn lấy từ cookie đã ký, KHÔNG lấy từ
 * client — nếu không ai cũng dò được mã đơn của khách khác trên cùng tài khoản.
 */
async function statusFromTicket(ticket: QuotaTicket) {
  const base = {
    ok: true as const,
    referenceId: ticket.ref,
    imei: ticket.imei,
    serviceId: ticket.sid,
    resetAt: resetAt(ticket),
  };

  let order;
  try {
    order = await getImeiOrder(ticket.ref);
  } catch (err) {
    // Máy chủ tra cứu lỗi tạm thời: KHÔNG báo lỗi cứng, vì lệnh đã đặt và đã
    // trừ tiền. Giữ nguyên trạng thái "đang xử lý" để client tự hỏi lại và
    // nhận kết quả khi bên kia hồi phục.
    return {
      body: {
        ...base,
        state: "pending" as const,
        warning:
          err instanceof DhruError
            ? `${err.message} Trang sẽ tự thử lại.`
            : "Máy chủ tra cứu đang bận. Trang sẽ tự thử lại.",
      },
      rejected: false,
    };
  }

  if (order.status === "available") {
    return {
      body: {
        ...base,
        state: "done" as const,
        result: parseResultLines(order.code),
        raw: order.code,
      },
      rejected: false,
    };
  }

  if (order.status === "rejected") {
    // Đơn bị từ chối thì Dhru hoàn tiền, nên trả lại lượt check cho người dùng.
    return {
      body: {
        ...base,
        state: "rejected" as const,
        error: "Đơn bị từ chối và đã hoàn tiền. Bạn có thể kiểm tra lại.",
        result: parseResultLines(order.code),
      },
      rejected: true,
    };
  }

  return { body: { ...base, state: "pending" as const }, rejected: false };
}

/**
 * GET ?action=account — thông tin tài khoản / số dư (chỉ phiên nội bộ)
 * GET ?action=status  — trạng thái lượt check của thiết bị hiện tại
 */
export async function GET(req: NextRequest) {
  if (!isDhruConfigured()) {
    return fail("Chưa cấu hình biến môi trường DHRU_* trên máy chủ.", 500);
  }

  const action = new URL(req.url).searchParams.get("action") ?? "status";

  try {
    if (action === "account") {
      // Số dư và email tài khoản Dhru là thông tin nội bộ — trang public không
      // được thấy. Chỉ mở cho phiên đã mở khoá qua /noi-bo.
      if (req.cookies.get(NOI_BO_COOKIE)?.value !== NOI_BO_TOKEN) {
        return fail("Không có quyền xem thông tin tài khoản.", 403);
      }
      return NextResponse.json({ ok: true, account: await accountInfo() });
    }

    if (action === "diag") {
      // Chẩn đoán thô (IP đi ra + phản hồi nguyên trạng của upstream) — chứa
      // thông tin hạ tầng nên khoá sau cổng nội bộ y như "account".
      if (req.cookies.get(NOI_BO_COOKIE)?.value !== NOI_BO_TOKEN) {
        return fail("Không có quyền chạy chẩn đoán.", 403);
      }
      return NextResponse.json({ ok: true, diag: await diagnose() });
    }

    if (action === "status") {
      const ticket = decodeTicket(req.cookies.get(QUOTA_COOKIE)?.value);
      if (!ticket) {
        return NextResponse.json({ ok: true, state: "idle" });
      }

      const { body, rejected } = await statusFromTicket(ticket);
      const res = NextResponse.json(body);
      return rejected ? clearTicket(res) : res;
    }

    return fail("Tham số action không hợp lệ.", 400);
  } catch (err) {
    if (err instanceof DhruError) return fail(err.message);
    return fail("Lỗi không xác định khi gọi máy chủ IMEI.");
  }
}

/**
 * POST { imei } — đặt lệnh check và trả ngay mã đơn.
 * Nếu thiết bị đã dùng lượt trong 24h qua thì trả 429 kèm trạng thái đơn cũ.
 *
 * Dịch vụ được CỐ ĐỊNH ở server (DHRU_SERVICE_ID) — không nhận từ client, để
 * không ai gọi thẳng API mà đặt được dịch vụ đắt tiền trên tài khoản Dhru.
 */
export async function POST(req: NextRequest) {
  if (!isDhruConfigured()) {
    return fail("Chưa cấu hình biến môi trường DHRU_* trên máy chủ.", 500);
  }

  let payload: { imei?: unknown };
  try {
    payload = await req.json();
  } catch {
    return fail("Body không phải JSON hợp lệ.", 400);
  }

  try {
    // Đã có lượt trong 24h qua -> không đặt lệnh mới, chỉ trả trạng thái đơn cũ.
    const existing = decodeTicket(req.cookies.get(QUOTA_COOKIE)?.value);
    if (existing) {
      const { body, rejected } = await statusFromTicket(existing);
      if (!rejected) {
        return NextResponse.json(
          {
            ...body,
            ok: false,
            error:
              "Mỗi thiết bị chỉ được kiểm tra miễn phí 1 lần trong 24 giờ. Kết quả lần trước vẫn xem lại được bên dưới.",
          },
          { status: 429 },
        );
      }
      // Đơn cũ bị từ chối (đã hoàn tiền) -> cho đặt lệnh mới.
    }

    const imei = String(payload.imei ?? "").replace(/\D/g, "");
    if (!isValidImei(imei)) {
      return NextResponse.json(
        { ok: false, error: "IMEI phải gồm 15 chữ số và đúng checksum Luhn." },
        { status: 400 },
      );
    }

    const ref = await placeImeiOrder(DEFAULT_SERVICE_ID, imei);
    const ticket: QuotaTicket = {
      ref,
      sid: DEFAULT_SERVICE_ID,
      imei,
      ts: Date.now(),
    };

    // Trả ngay, không chờ kết quả — client sẽ hỏi lại qua ?action=status.
    const res = NextResponse.json({
      ok: true,
      state: "pending",
      referenceId: ref,
      imei,
      resetAt: resetAt(ticket),
    });
    return attachTicket(res, ticket);
  } catch (err) {
    if (err instanceof DhruError) return fail(err.message);
    return fail("Lỗi không xác định khi gọi máy chủ IMEI.");
  }
}
