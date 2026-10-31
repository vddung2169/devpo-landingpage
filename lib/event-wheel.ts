// Kiểu dữ liệu & helper dùng chung cho Event "Quay may mắn".
// An toàn để import ở CẢ client lẫn server: file này không chứa secret, không
// chứa tỉ lệ trúng thưởng (tỉ lệ nằm ở Apps Script — xem scripts/event-wheel.gs).

/** Giai đoạn chương trình — do server quyết định, client chỉ hiển thị. */
export type EventPhase = "off" | "upcoming" | "open" | "ended";

/** Một giải thưởng như client được biết: tên + số lượng còn lại, KHÔNG có tỉ lệ. */
export interface PrizePublic {
  id: string;
  ten: string;
  loai: string;
  con_lai: number;
  tong: number;
  het: boolean;
}

/** Kết quả quay của chính khách (tra theo SĐT). */
export interface MyResult {
  prizeId: string;
  prizeName: string;
  code: string;
  at: string;
}

/** Phản hồi GET /api/event-wheel. */
export interface EventStatus {
  ok: boolean;
  serverTime: string;
  enabled: boolean;
  startAt: string | null;
  endAt: string | null;
  phase: EventPhase;
  prizes: PrizePublic[];
  myResult: MyResult | null;
  error?: string;
}

/** Phản hồi POST /api/event-wheel (quay thưởng). */
export interface SpinResult {
  ok: boolean;
  /** true khi server trả lại kết quả cũ của cùng requestId (bấm lại/mạng chập). */
  duplicated?: boolean;
  /** true khi SĐT này đã quay trước đó -> kèm luôn giải đã trúng. */
  already?: boolean;
  prizeId?: string;
  prizeName?: string;
  code?: string;
  at?: string;
  phase?: EventPhase;
  error?: string;
}

/* ============================ VALIDATE FORM ============================ */

/** Bỏ mọi ký tự không phải số. */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * SĐT di động Việt Nam hợp lệ: 0 + đầu số nhà mạng + 7 số = 10 số.
 * Đầu số thực tế đang dùng: 03x, 05x, 07x, 08x, 09x (đã gồm 2 đầu số 05 cũ).
 */
export function isValidPhone(raw: string): boolean {
  return /^0(3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/.test(
    normalizePhone(raw),
  );
}

/** Họ tên hợp lệ: ít nhất 2 ký tự chữ, không phải một chuỗi số. */
export function isValidName(raw: string): boolean {
  const name = raw.trim();
  return name.length >= 2 && /\p{L}/u.test(name);
}

/* ============================ LƯU TRẠNG THÁI ============================ */

// localStorage chỉ để KHÔNG làm phiền khách (nhớ đã đóng modal, nhớ SĐT để tra
// lại kết quả). Việc "được quay hay không" luôn do server quyết — khách xoá
// localStorage cũng không quay thêm được.
export const WHEEL_PHONE_KEY = "devpo_wheel_phone";
export const WHEEL_DISMISSED_KEY = "devpo_wheel_dismissed";
export const WHEEL_REQUEST_KEY = "devpo_wheel_request_id";
export const WHEEL_SOUND_KEY = "devpo_wheel_sound";

/** Đọc an toàn: Safari chế độ riêng tư có thể ném lỗi khi truy cập storage. */
export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* hết quota hoặc bị chặn — bỏ qua, tính năng vẫn chạy */
  }
}

/* ============================ HIỂN THỊ GIẢI ============================ */

/**
 * Phần mô tả & điều kiện dùng cho từng giải.
 * Màu ô vòng quay: chỉ dùng thang xanh dương + xám trung tính theo nhận diện
 * DEV PỒ (đen/trắng/xanh). KHÔNG dùng đỏ — đỏ chỉ dành cho giá bán.
 */
export interface PrizeMeta {
  /** Nhãn ngắn in trong ô vòng quay (phải ngắn để không tràn). */
  short: string;
  /** Mô tả điều kiện áp dụng, hiện ở màn kết quả + thể lệ. */
  dieuKien: string;
  /** Hướng dẫn sử dụng phần thưởng. */
  huongDan: string;
  /** Emoji minh hoạ — nhẹ hơn là tải thêm ảnh. */
  icon: string;
  /** Màu nền ô trên vòng quay. */
  mau: string;
  /** Màu chữ trong ô. */
  chu: string;
}

export const PRIZE_META: Record<string, PrizeMeta> = {
  ipad300k: {
    short: "300K",
    dieuKien: "Áp dụng khi mua iPad có giá trị trên 10.000.000đ.",
    huongDan:
      "Đọc mã này cho nhân viên DEV PỒ khi chốt đơn iPad trên 10 triệu để được trừ trực tiếp 300.000đ.",
    icon: "🏷️",
    mau: "#0b1f3a",
    chu: "#ffffff",
  },
  ipad200k: {
    short: "200K",
    dieuKien: "Áp dụng khi mua iPad có giá trị trên 5.000.000đ.",
    huongDan:
      "Đọc mã này cho nhân viên DEV PỒ khi chốt đơn iPad trên 5 triệu để được trừ trực tiếp 200.000đ.",
    icon: "🏷️",
    mau: "#12356b",
    chu: "#ffffff",
  },
  ipad100k: {
    short: "100K",
    dieuKien: "Áp dụng khi mua iPad có giá trị dưới 5.000.000đ.",
    huongDan:
      "Đọc mã này cho nhân viên DEV PỒ khi chốt đơn iPad dưới 5 triệu để được trừ trực tiếp 100.000đ.",
    icon: "🏷️",
    mau: "#1d4f9c",
    chu: "#ffffff",
  },
  pencil: {
    short: "Pencil",
    dieuKien: "Áp dụng khi mua iPad (mọi mức giá).",
    huongDan:
      "Đọc mã này khi nhận máy, DEV PỒ tặng kèm Apple Pencil theo tình trạng hàng hoá thực tế.",
    icon: "✏️",
    mau: "#2f6fd0",
    chu: "#ffffff",
  },
  airpods: {
    short: "AirPods",
    dieuKien: "Áp dụng khi mua iPhone hoặc iPad.",
    huongDan:
      "Đọc mã này khi nhận máy, DEV PỒ tặng kèm AirPods theo tình trạng hàng hoá thực tế.",
    icon: "🎧",
    mau: "#4f8de0",
    chu: "#0b1f3a",
  },
  iphone500k: {
    short: "500K",
    dieuKien: "Áp dụng khi mua iPhone từ 15.000.000đ trở lên.",
    huongDan:
      "Giải đặc biệt. Đọc mã này cho nhân viên DEV PỒ khi chốt đơn iPhone từ 15 triệu để được trừ trực tiếp 500.000đ.",
    icon: "🎉",
    mau: "#06142b",
    chu: "#ffffff",
  },
  cuongluc: {
    short: "Cường lực",
    dieuKien: "Áp dụng cho bất kỳ máy nào mua tại DEV PỒ.",
    huongDan:
      "Đọc mã này tại cửa hàng để được dán cường lực và vệ sinh máy miễn phí.",
    icon: "🛡️",
    mau: "#7fb0e8",
    chu: "#06142b",
  },
};

/** Meta dự phòng cho id lạ (admin thêm giải mới trên sheet mà chưa khai ở đây). */
export const FALLBACK_META: PrizeMeta = {
  short: "Quà",
  dieuKien: "Áp dụng khi mua hàng tại DEV PỒ.",
  huongDan: "Đọc mã này cho nhân viên DEV PỒ khi chốt đơn.",
  icon: "🎁",
  mau: "#345b8c",
  chu: "#ffffff",
};

export function prizeMeta(id: string): PrizeMeta {
  return PRIZE_META[id] ?? FALLBACK_META;
}

/** Thể lệ chương trình — hiện trong modal, dùng chung một nguồn. */
export const THE_LE: string[] = [
  "Mỗi số điện thoại được tham gia một lượt quay duy nhất trong toàn bộ chương trình.",
  "Phần thưởng chỉ áp dụng khi mua hàng tại DEV PỒ.",
  "Mã giảm giá không quy đổi thành tiền mặt.",
  "Không cộng dồn với các chương trình khuyến mãi khác, trừ khi DEV PỒ có thông báo riêng.",
  "Mỗi mã ưu đãi chỉ được sử dụng một lần.",
  "Quà tặng phụ thuộc vào tình trạng hàng hoá thực tế tại thời điểm nhận.",
  "Thời hạn sử dụng ưu đãi theo thời gian chương trình và chính sách xác nhận của DEV PỒ.",
];

/**
 * Chuẩn hoá "Thời gian quay" về dd/MM/yyyy HH:mm:ss (giờ VN).
 *
 * Vì sao cần: ô thời gian trong Google Sheets bị tự nhận là kiểu Ngày, nên tuỳ
 * đường đi mà server trả về "31/10/2026 16:12:40" (lúc vừa quay) hoặc
 * "Sat Oct 31 2026 16:12:40 GMT+0700 (Giờ Đông Dương)" (lúc đọc lại từ sheet).
 * Hàm này nhận cả hai và luôn cho ra một dạng duy nhất, nên dù backend chưa
 * được deploy lại thì khách vẫn thấy đúng.
 */
export function formatSpinTime(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";

  // Đã đúng dạng rồi thì giữ nguyên.
  if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(s)) return s;

  // Bỏ phần "(Giờ Đông Dương)" ở cuối — có máy không parse được chú thích này.
  const parsed = Date.parse(s.replace(/\s*\([^)]*\)\s*$/, ""));
  if (Number.isNaN(parsed)) return s; // không hiểu thì thà trả nguyên văn còn hơn hiện rỗng

  const parts = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(parsed));
  const get = (type: string) => parts.find((x) => x.type === type)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
