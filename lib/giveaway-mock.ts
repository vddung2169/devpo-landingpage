// Dữ liệu giả cho Giveaway — CHỈ chạy phía server (trong route /api/give-away).
// Dùng khi chưa cấu hình GIVEAWAY_API, hoặc khi test 4 trạng thái ở môi trường dev
// qua tham số ?mock=open|closed|announced|empty.
//
// Nhờ mock này mà trang /give-away chạy được ngay cả khi backend Apps Script chưa
// được nối, và có thể xem trước cả 4 trạng thái.

import type {
  Giveaway,
  GiveawayResponse,
  RegisterResult,
} from "@/lib/giveaway";
import { maskPhone, normalizePhone } from "@/lib/giveaway";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

function mockHistory(now: number): Giveaway[] {
  return [
    {
      id: "GA-2026-06",
      title: "Giveaway tháng 6 — Lì xì đầu hè",
      prize: "200.000đ tiền mặt",
      endAt: iso(now - 11 * DAY),
      status: "ended",
      totalEntries: 88,
      winner: { name: "Nguyễn Văn A", phone: "090****567" },
    },
    {
      id: "GA-2026-05",
      title: "Giveaway tháng 5 — Tri ân khách quen",
      prize: "Sạc nhanh 20W chính hãng",
      endAt: iso(now - 41 * DAY),
      status: "ended",
      totalEntries: 120,
      winner: { name: "Trần Thị B", phone: "098****321" },
    },
  ];
}

/** Tạo phản hồi GET giả theo trạng thái yêu cầu. */
export function mockGiveaway(
  state: string,
  phone: string | null,
): GiveawayResponse {
  const now = Date.now();
  const history = mockHistory(now);

  const myTicket =
    phone && normalizePhone(phone).length === 10
      ? {
          ticket: "GA-2026-07-0007",
          name: "Khách Devpo",
          phone: normalizePhone(phone), // vé của chính khách -> hiện số của họ
          giveawayId: "GA-2026-07",
        }
      : null;

  const base = {
    ok: true,
    serverTime: iso(now),
    history,
    myTicket,
  };

  switch (state) {
    case "empty":
      return { ...base, active: null };

    case "upcoming":
      return {
        ...base,
        active: {
          id: "GA-2026-07",
          title: "Giveaway tháng 7 — Tri ân khách hàng Devpo",
          prize: "200.000đ tiền mặt",
          openAt: iso(now + 90 * 60 * 1000),
          closeAt: iso(now + 7 * HOUR),
          drawAt: iso(now + 7 * HOUR),
          endAt: iso(now + 13 * HOUR),
          status: "upcoming",
          totalEntries: 0,
          winner: null,
        },
      };

    case "closed":
      return {
        ...base,
        active: {
          id: "GA-2026-07",
          title: "Giveaway tháng 7 — Tri ân khách hàng Devpo",
          prize: "200.000đ tiền mặt",
          openAt: iso(now - 4 * HOUR),
          closeAt: iso(now - 30 * 60 * 1000),
          drawAt: iso(now + 20 * 60 * 1000),
          endAt: iso(now + 6 * HOUR),
          status: "closed",
          totalEntries: 57,
          winner: null,
        },
      };

    case "announced":
      return {
        ...base,
        active: {
          id: "GA-2026-07",
          title: "Giveaway tháng 7 — Tri ân khách hàng Devpo",
          prize: "200.000đ tiền mặt",
          closeAt: iso(now - 2 * HOUR),
          drawAt: iso(now - 1 * HOUR),
          endAt: iso(now + 4 * HOUR),
          status: "announced",
          totalEntries: 57,
          winner: { name: "Lê Văn C", phone: "091****842" },
        },
      };

    case "open":
    default:
      return {
        ...base,
        active: {
          id: "GA-2026-07",
          title: "Giveaway tháng 7 — Tri ân khách hàng Devpo",
          prize: "200.000đ tiền mặt",
          closeAt: iso(now + 2 * HOUR),
          drawAt: iso(now + 3 * HOUR),
          endAt: iso(now + 6 * HOUR),
          status: "open",
          totalEntries: 42,
          winner: null,
        },
      };
  }
}

/**
 * Đăng ký giả. Quy ước để test:
 *  - SĐT kết thúc "0000" -> trùng (đã đăng ký)
 *  - SĐT kết thúc "9999" -> đã đóng đăng ký
 *  - còn lại -> thành công, cấp mã vé ngẫu nhiên theo SĐT
 */
export function mockRegister(bodyText: string): RegisterResult {
  let name = "";
  let phone = "";
  try {
    const parsed = JSON.parse(bodyText) as { name?: string; phone?: string };
    name = parsed.name ?? "";
    phone = normalizePhone(parsed.phone ?? "");
  } catch {
    return { ok: false, error: "Dữ liệu gửi lên không hợp lệ." };
  }

  if (phone.endsWith("9999")) {
    return { ok: false, error: "Đã hết hạn đăng ký.", status: "closed" };
  }
  if (phone.endsWith("0000")) {
    return {
      ok: false,
      error: "Số điện thoại này đã đăng ký rồi.",
      existing: { ticket: "GA-2026-07-0012", name, phone: maskPhone(phone) },
    };
  }

  const seq = String((Number(phone.slice(-4)) % 900) + 100).padStart(4, "0");
  return {
    ok: true,
    entry: { ticket: `GA-2026-07-${seq}`, name, phone },
  };
}

/** Quay thưởng giả (admin) — trả về người trúng ngẫu nhiên. */
export function mockDraw(giveawayId: string): {
  ok: true;
  winner: { name: string; phone: string; ticket: string };
  giveawayId: string;
} {
  return {
    ok: true,
    giveawayId,
    winner: {
      name: "Phạm Thị D",
      phone: "093****715",
      ticket: `${giveawayId}-0031`,
    },
  };
}
