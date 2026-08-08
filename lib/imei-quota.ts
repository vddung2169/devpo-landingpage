import { createHmac, timingSafeEqual } from "crypto";
import type { ResultLine } from "@/lib/iunlock";

/**
 * Quản lý "1 lượt check miễn phí / 24h" bằng cookie httpOnly có chữ ký HMAC.
 *
 * Vì sao là cookie ký chứ không phải localStorage:
 *  - localStorage do JS client sửa được, không dùng để chặn tốn tiền API.
 *  - Cookie httpOnly thì trang không đọc/ghi được, chỉ máy chủ cấp.
 *  - Chữ ký khiến client không tự chế được vé để đọc lại kết quả đã trả tiền.
 *
 * Cookie còn mang luôn kết quả lần tra gần nhất (nếu đủ nhỏ). iUnlock API là
 * đồng bộ và KHÔNG có action tra lại đơn cũ, nên nếu không giữ ở đây thì tải
 * lại trang là mất kết quả đã trả tiền.
 *
 * Giới hạn đã biết: xoá cookie / dùng ẩn danh là qua được. Đây là hàng rào
 * chống lạm dụng vô tình, không phải chống gian lận có chủ đích — muốn chặt
 * hơn phải đếm theo IP ở một kho dùng chung (Redis).
 */

export const QUOTA_COOKIE = "devpo_imei_quota";
export const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Trần kích thước phần payload trước khi ký. Cookie tối đa ~4096 byte, base64
 * nở 4/3 và chữ ký chiếm thêm 44 byte — 2400 byte JSON là mức an toàn.
 */
const MAX_PAYLOAD_BYTES = 2400;

export type QuotaTicket = {
  /** Giá trị đã tra: IMEI hoặc Serial. */
  q: string;
  /** Mã dịch vụ đã dùng. */
  sid: string;
  /** Thời điểm tra (ms). Hết 24h kể từ mốc này là được check tiếp. */
  ts: number;
  /** Mã đơn bên iUnlock — hiển thị lại để khách gửi cho bên hỗ trợ khi cần. */
  o?: string;
  /**
   * Kết quả rút gọn dạng [nhãn, giá trị, sắc thái?] với sắc thái "g"|"b".
   * Vắng mặt khi kết quả quá dài để nhét vừa cookie.
   */
  r?: PackedLine[];
};

type PackedLine = [string, string] | [string, string, "g" | "b"];

/**
 * Khoá ký. Ưu tiên biến riêng; nếu không có thì dẫn xuất từ API key — vốn đã
 * là bí mật phía server và luôn tồn tại khi tính năng bật.
 */
function secret(): string {
  const explicit = process.env.IMEI_QUOTA_SECRET;
  if (explicit) return explicit;
  const derived = process.env.IUNLOCK_API_KEY;
  if (!derived) throw new Error("Thiếu IMEI_QUOTA_SECRET hoặc IUNLOCK_API_KEY.");
  return `imei-quota:${derived}`;
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

export function encodeTicket(ticket: QuotaTicket): string {
  let json = JSON.stringify(ticket);

  // Kết quả dài quá thì bỏ hẳn phần kết quả, giữ lại vé hạn mức — thà mất tiện
  // lợi xem lại còn hơn cookie bị trình duyệt vứt và mất luôn hàng rào hạn mức.
  if (Buffer.byteLength(json, "utf8") > MAX_PAYLOAD_BYTES) {
    json = JSON.stringify({
      q: ticket.q,
      sid: ticket.sid,
      ts: ticket.ts,
      o: ticket.o,
    });
  }

  const payload = b64url(Buffer.from(json, "utf8"));
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

  if (!ticket?.q || typeof ticket.ts !== "number") return null;
  if (Date.now() - ticket.ts >= QUOTA_WINDOW_MS) return null;

  return ticket;
}

/** Mốc thời gian được check lại (ms epoch). */
export function resetAt(ticket: QuotaTicket): number {
  return ticket.ts + QUOTA_WINDOW_MS;
}

/** Nén kết quả về dạng mảng ngắn để cookie gọn hơn. */
export function packLines(lines: ResultLine[]): PackedLine[] {
  return lines.map((l) =>
    l.tone
      ? [l.label, l.value, l.tone === "good" ? "g" : "b"]
      : [l.label, l.value],
  );
}

export function unpackLines(packed: PackedLine[] | undefined): ResultLine[] {
  return (packed ?? []).map(([label, value, tone]) => ({
    label,
    value,
    ...(tone ? { tone: tone === "g" ? ("good" as const) : ("bad" as const) } : {}),
  }));
}
