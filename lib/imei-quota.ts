import { createHmac, timingSafeEqual } from "crypto";

/**
 * Quản lý "1 lượt check miễn phí / 24h" bằng cookie httpOnly có chữ ký HMAC.
 *
 * Vì sao là cookie ký chứ không phải localStorage:
 *  - localStorage do JS client sửa được, không dùng để chặn tốn tiền API.
 *  - Cookie httpOnly thì trang không đọc/ghi được, chỉ máy chủ cấp.
 *  - Chữ ký khiến client không thể tự chế referenceId để đọc kết quả đơn của
 *    người khác trên cùng tài khoản Dhru (mã đơn chỉ là số tăng dần).
 *
 * Giới hạn đã biết: xoá cookie / dùng ẩn danh là qua được. Đây là hàng rào
 * chống lạm dụng vô tình, không phải chống gian lận có chủ đích — muốn chặt
 * hơn phải đếm theo IP ở một kho dùng chung (Redis).
 */

export const QUOTA_COOKIE = "devpo_imei_quota";
export const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;

export type QuotaTicket = {
  /** Mã đơn Dhru đã đặt cho thiết bị này. */
  ref: string;
  /** Service ID đã dùng. */
  sid: string;
  /** IMEI đã check (để hiển thị lại khi quay lại trang). */
  imei: string;
  /** Thời điểm đặt lệnh (ms). Hết 24h kể từ mốc này là được check tiếp. */
  ts: number;
};

/**
 * Khoá ký. Ưu tiên biến riêng; nếu không có thì dẫn xuất từ API key — vốn đã
 * là bí mật phía server và luôn tồn tại khi tính năng bật.
 */
function secret(): string {
  const explicit = process.env.DHRU_QUOTA_SECRET;
  if (explicit) return explicit;
  const derived = process.env.DHRU_API_KEY;
  if (!derived) throw new Error("Thiếu DHRU_QUOTA_SECRET hoặc DHRU_API_KEY.");
  return `imei-quota:${derived}`;
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

export function encodeTicket(ticket: QuotaTicket): string {
  const payload = b64url(Buffer.from(JSON.stringify(ticket), "utf8"));
  return `${payload}.${sign(payload)}`;
}

/** Trả null nếu cookie thiếu, sai chữ ký, hỏng định dạng hoặc đã quá 24h. */
export function decodeTicket(raw: string | undefined): QuotaTicket | null {
  if (!raw) return null;

  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;

  const payload = raw.slice(0, dot);
  const provided = Buffer.from(raw.slice(dot + 1));
  const expected = Buffer.from(sign(payload));
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  let ticket: QuotaTicket;
  try {
    ticket = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (!ticket?.ref || typeof ticket.ts !== "number") return null;
  if (Date.now() - ticket.ts >= QUOTA_WINDOW_MS) return null;

  return ticket;
}

/** Mốc thời gian được check lại (ms epoch). */
export function resetAt(ticket: QuotaTicket): number {
  return ticket.ts + QUOTA_WINDOW_MS;
}
