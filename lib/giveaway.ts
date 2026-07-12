// Kiểu dữ liệu & helper dùng chung cho tính năng Giveaway (/give-away).
// File này an toàn để import ở cả client lẫn server (không chứa secret).

export type GiveawayStatus =
  | "upcoming"
  | "open"
  | "closed"
  | "announced"
  | "ended";

export interface Winner {
  name: string;
  /** SĐT đã được server che sẵn (vd "090****567"). Client KHÔNG tự ghép lại. */
  phone: string;
}

export interface Giveaway {
  id: string;
  title: string;
  prize: string;
  openAt?: string; // ISO — giờ mở đăng ký (trước đó: "upcoming")
  closeAt?: string; // ISO — đóng đăng ký
  drawAt?: string; // ISO — quay thưởng
  endAt?: string; // ISO — kết thúc hiển thị
  status: GiveawayStatus;
  totalEntries: number;
  winner: Winner | null;
}

export interface MyTicket {
  ticket: string;
  name: string;
  phone: string;
  giveawayId?: string;
}

/** Phản hồi GET GIVEAWAY_API. */
export interface GiveawayResponse {
  ok: boolean;
  serverTime: string;
  active: Giveaway | null;
  history: Giveaway[];
  myTicket: MyTicket | null;
  error?: string;
}

/** Phản hồi POST đăng ký. */
export interface RegisterResult {
  ok: boolean;
  entry?: { ticket: string; name: string; phone: string };
  existing?: { ticket?: string; name?: string; phone?: string };
  error?: string;
  status?: string;
}

/** Bỏ mọi ký tự không phải số. */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** SĐT hợp lệ: bắt đầu bằng 0, đúng 10 số. */
export function isValidPhone(raw: string): boolean {
  return /^0\d{9}$/.test(normalizePhone(raw));
}

/** Khóa localStorage lưu SĐT đã đăng ký để lần sau tự tra vé. */
export const GIVEAWAY_PHONE_KEY = "devpo_giveaway_phone";

/** Che SĐT khi lỡ phải hiển thị (dự phòng — server thường đã che sẵn). */
export function maskPhone(raw: string): string {
  const p = normalizePhone(raw);
  if (p.length < 7) return p;
  return `${p.slice(0, 3)}****${p.slice(-3)}`;
}
