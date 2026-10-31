// Dữ liệu giả cho Event "Quay may mắn" — CHỈ chạy phía server (route /api/event-wheel).
// Dùng khi chưa cấu hình EVENT_WHEEL_API, hoặc khi test các giai đoạn ở dev qua
// ?mock=upcoming|open|ended|empty.
//
// Mock mô phỏng ĐÚNG luật của backend thật (scripts/event-wheel.gs): ghim 5% cho
// giải iphone500k, trừ tồn kho, một SĐT một lượt. Nhờ vậy test được toàn bộ luồng
// trước khi có URL Apps Script. Dữ liệu chỉ nằm trong RAM nên restart là mất —
// đó là lý do mock không bao giờ được bật ở production.

import type { EventPhase, EventStatus, SpinResult } from "@/lib/event-wheel";
import { normalizePhone } from "@/lib/event-wheel";

/** Giờ mặc định của chương trình (GMT+7) — trùng với tab Config của sheet. */
const START_AT = "2026-10-31T15:00:00+07:00";
const END_AT = "2026-11-01T23:59:59+07:00";

const FIXED_RATE_PRIZE = "iphone500k";
const FIXED_RATE_PERCENT = 5;

interface MockPrize {
  id: string;
  ten: string;
  loai: string;
  tiLe: number;
  soLuong: number;
  daPhat: number;
}

/** Kho giải trong RAM — reset mỗi lần restart server dev. */
const prizes: MockPrize[] = [
  { id: "ipad300k", ten: "Giảm 300.000đ", loai: "voucher", tiLe: 12, soLuong: 30, daPhat: 22 },
  { id: "ipad200k", ten: "Giảm 200.000đ", loai: "voucher", tiLe: 18, soLuong: 50, daPhat: 31 },
  { id: "ipad100k", ten: "Giảm 100.000đ", loai: "voucher", tiLe: 25, soLuong: 100, daPhat: 58 },
  { id: "pencil", ten: "Tặng Apple Pencil", loai: "qua", tiLe: 3, soLuong: 5, daPhat: 3 },
  { id: "airpods", ten: "Tặng AirPods", loai: "qua", tiLe: 2, soLuong: 3, daPhat: 2 },
  { id: "iphone500k", ten: "Giảm 500.000đ", loai: "voucher", tiLe: 5, soLuong: 20, daPhat: 14 },
  { id: "cuongluc", ten: "Dán cường lực + vệ sinh", loai: "dichvu", tiLe: 35, soLuong: 500, daPhat: 211 },
];

/** Lượt quay đã ghi, khoá theo SĐT (mô phỏng sheet Luot_Quay). */
const spins = new Map<string, { prizeId: string; prizeName: string; code: string; at: string }>();
/** Khoá theo requestId để trả lại kết quả cũ khi khách bấm lại. */
const byRequest = new Map<string, SpinResult>();

function phaseNow(forced: string | null): EventPhase {
  if (forced === "upcoming" || forced === "open" || forced === "ended" || forced === "off") {
    return forced;
  }
  // "empty" = đang mở nhưng hết sạch quà. Phải tự coi là "open", nếu không nó
  // rơi về giờ thật và ta test nhầm sang nhánh "chưa bắt đầu".
  if (forced === "empty") return "open";
  const now = Date.now();
  if (now < Date.parse(START_AT)) return "upcoming";
  if (now > Date.parse(END_AT)) return "ended";
  return "open";
}

function publicPrizes(empty: boolean) {
  return prizes.map((p) => {
    const conLai = empty ? 0 : Math.max(0, p.soLuong - p.daPhat);
    return {
      id: p.id,
      ten: p.ten,
      loai: p.loai,
      con_lai: conLai,
      tong: p.soLuong,
      het: conLai <= 0,
    };
  });
}

function formatVn(d: Date): string {
  // dd/MM/yyyy HH:mm:ss theo GMT+7, khớp định dạng Apps Script ghi vào sheet.
  const parts = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

/** GET giả. */
export function mockStatus(mock: string | null, phone: string | null): EventStatus {
  const phase = phaseNow(mock);
  const empty = mock === "empty";
  const norm = phone ? normalizePhone(phone) : "";
  const mine = norm ? spins.get(norm) : undefined;

  return {
    ok: true,
    serverTime: new Date().toISOString(),
    enabled: phase !== "off",
    startAt: new Date(START_AT).toISOString(),
    endAt: new Date(END_AT).toISOString(),
    phase,
    prizes: publicPrizes(empty),
    myResult: mine ? { ...mine } : null,
  };
}

function pickByWeight(list: MockPrize[]): MockPrize {
  const total = list.reduce((s, p) => s + Math.max(0, p.tiLe), 0);
  if (total <= 0) return list[Math.floor(Math.random() * list.length)];
  let r = Math.random() * total;
  for (const p of list) {
    r -= Math.max(0, p.tiLe);
    if (r < 0) return p;
  }
  return list[list.length - 1];
}

/** Ghim đúng 5% cho giải đặc biệt, 95% còn lại chia theo trọng số. */
function pickPrize(available: MockPrize[]): MockPrize {
  const fixed = available.find((p) => p.id === FIXED_RATE_PRIZE) ?? null;
  const others = available.filter((p) => p.id !== FIXED_RATE_PRIZE);
  if (fixed && others.length) {
    return Math.random() * 100 < FIXED_RATE_PERCENT ? fixed : pickByWeight(others);
  }
  if (fixed) return fixed;
  return pickByWeight(others);
}

function makeCode(prizeId: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DEVPO-${prizeId.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)}-${s}`;
}

/** POST giả — body giống hệt backend thật. */
export function mockSpin(raw: string, mock: string | null): SpinResult {
  let data: { name?: string; phone?: string; requestId?: string } = {};
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Body không phải JSON." };
  }

  const phase = phaseNow(mock);
  if (phase === "off") return { ok: false, error: "Chương trình chưa mở.", phase };
  if (phase === "upcoming") return { ok: false, error: "Chương trình chưa bắt đầu.", phase };
  if (phase === "ended") return { ok: false, error: "Chương trình đã kết thúc.", phase };

  const name = (data.name ?? "").trim();
  const phone = normalizePhone(data.phone ?? "");
  const requestId = (data.requestId ?? "").trim();
  if (!name) return { ok: false, error: "Vui lòng nhập họ tên." };
  if (!phone) return { ok: false, error: "Số điện thoại không hợp lệ." };

  if (requestId && byRequest.has(requestId)) {
    return { ...byRequest.get(requestId)!, duplicated: true };
  }

  const existed = spins.get(phone);
  if (existed) {
    return { ok: false, already: true, error: "Số điện thoại này đã quay rồi.", ...existed };
  }

  const available =
    mock === "empty" ? [] : prizes.filter((p) => p.soLuong - p.daPhat > 0);
  if (!available.length) return { ok: false, error: "Rất tiếc, quà đã được phát hết." };

  const prize = pickPrize(available);
  prize.daPhat += 1;

  const result = {
    prizeId: prize.id,
    prizeName: prize.ten,
    code: makeCode(prize.id),
    at: formatVn(new Date()),
  };
  spins.set(phone, result);

  const out: SpinResult = { ok: true, ...result };
  if (requestId) byRequest.set(requestId, out);
  return out;
}
