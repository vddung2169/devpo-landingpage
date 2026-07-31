/**
 * Client cho DHRU Fusion API v6.1 (chuẩn dhru-com/dhru-fusion-api-standards).
 *
 * Giao thức: POST application/x-www-form-urlencoded tới 1 endpoint duy nhất với
 *   username        — email tài khoản
 *   apiaccesskey    — API key
 *   action          — accountinfo | imeiservicelist | placeimeiorder | getimeiorder
 *   format          — json
 *   parameters      — base64(JSON) của tham số riêng từng action
 *
 * Phản hồi luôn có dạng { SUCCESS: [...], ERROR: [...], apiversion: "6.1" }.
 * Chỉ dùng ở phía server: file này đọc API key từ env, không được import vào client.
 */

const API_URL = process.env.DHRU_API_URL;
const USERNAME = process.env.DHRU_USERNAME;
const API_KEY = process.env.DHRU_API_KEY;

/** Service mặc định khi client không chỉ định (xem imeiservicelist để lấy ID). */
export const DEFAULT_SERVICE_ID = process.env.DHRU_SERVICE_ID ?? "554";

export class DhruError extends Error {
  /** Thông điệp gốc của Dhru — để log phía server, không đưa ra cho khách. */
  readonly raw?: string;
  /** Lỗi hạ tầng cần admin xử lý (whitelist IP, sai key, hết tiền). */
  readonly adminAction: boolean;
  /**
   * Thử lại có cơ hội thành công. Độc lập với adminAction: lỗi IP whitelist
   * vừa cần admin xử lý, vừa đáng thử lại — máy có nhiều đường ra Internet nên
   * kết nối sau có thể đi bằng IP đã được cho phép.
   */
  readonly retryable: boolean;

  constructor(
    message: string,
    options: { raw?: string; adminAction?: boolean; retryable?: boolean } = {},
  ) {
    super(message);
    this.raw = options.raw;
    this.adminAction = options.adminAction ?? false;
    this.retryable = options.retryable ?? false;
  }
}

/**
 * Đổi thông điệp thô của Dhru sang câu tiếng Việt cho người dùng cuối.
 * Thông điệp gốc vẫn được giữ trong DhruError.raw để log.
 */
type Friendly = { message: string; adminAction: boolean; retryable: boolean };

function friendly(raw: string): Friendly {
  const table: Record<string, Friendly> = {
    "Insufficient credit.": {
      message: "Tài khoản check đã hết số dư. Vui lòng liên hệ quản trị.",
      adminAction: true,
      retryable: false,
    },
    "Authentication Failed": {
      message: "Xác thực API thất bại. Vui lòng liên hệ quản trị.",
      adminAction: true,
      retryable: false,
    },
    "Invalid or inactive service ID.": {
      message: "Dịch vụ check chưa được cấu hình hoặc đã tắt.",
      adminAction: true,
      retryable: false,
    },
    "Missing ID (service) or IMEI.": {
      message: "Thiếu IMEI hoặc mã dịch vụ.",
      adminAction: false,
      retryable: false,
    },
    "Duplicate order for this identifier.": {
      message: "IMEI này đang có đơn check chưa xong. Vui lòng đợi.",
      adminAction: false,
      retryable: false,
    },
    "Order not found.": {
      message: "Không tìm thấy đơn check.",
      adminAction: false,
      retryable: false,
    },
    "Could not place order.": {
      message: "Không đặt được đơn check. Vui lòng thử lại.",
      adminAction: false,
      retryable: false,
    },
  };

  if (table[raw]) return table[raw];

  // "Invalid IP Request. (1.2.3.4)" — IP gọi API chưa được Dhru cho phép.
  // Đáng thử lại: máy nhiều đường ra Internet, kết nối sau có thể đi bằng IP
  // đã được phép. Request bị chặn ngay cửa nên chắc chắn chưa tạo đơn nào.
  if (raw.startsWith("Invalid IP Request")) {
    return {
      message:
        "Máy chủ chưa được cấp quyền gọi API check (chưa whitelist IP). Vui lòng liên hệ quản trị.",
      adminAction: true,
      retryable: true,
    };
  }

  if (raw.includes("System error")) {
    return {
      message: "Máy chủ check đang gặp sự cố. Vui lòng thử lại sau.",
      adminAction: false,
      retryable: true,
    };
  }

  // Không để lộ chi tiết kỹ thuật (SQL, stack trace) ra ngoài.
  if (/SQLSTATE|PDOException|stack trace|Fatal error/i.test(raw)) {
    return {
      message: "Máy chủ check đang gặp sự cố. Vui lòng thử lại sau.",
      adminAction: false,
      retryable: true,
    };
  }

  return { message: raw, adminAction: false, retryable: false };
}

/** Cấu hình đã đủ để gọi API thật hay chưa. */
export function isDhruConfigured() {
  return Boolean(API_URL && USERNAME && API_KEY);
}

type DhruAction =
  | "accountinfo"
  | "imeiservicelist"
  | "placeimeiorder"
  | "getimeiorder";

type DhruRaw = {
  SUCCESS?: unknown;
  ERROR?: unknown;
  apiversion?: string;
};

/** Dhru trả SUCCESS/ERROR khi thì mảng, khi thì object — chuẩn hoá về mảng. */
function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>) as Record<
      string,
      unknown
    >[];
  }
  return [];
}

function errorMessage(raw: DhruRaw): string | null {
  const errors = toArray(raw.ERROR);
  if (!errors.length) return null;
  const messages = errors
    .map((e) => String(e?.MESSAGE ?? e?.message ?? "").trim())
    .filter(Boolean);
  return messages.join(" · ") || "Máy chủ IMEI trả về lỗi không rõ nguyên nhân.";
}

/** Một lần gọi HTTP, không retry. */
async function requestOnce(
  action: DhruAction,
  parameters?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<Record<string, unknown>> {
  const body = new URLSearchParams({
    username: USERNAME!,
    apiaccesskey: API_KEY!,
    action,
    format: "json",
  });
  if (parameters) {
    // Tham số riêng của action bọc base64(JSON) theo chuẩn Fusion v6.1. Máy chủ
    // cũng nhận JSON thô như bộ kit PHP 2.0, cả hai đều được chấp nhận.
    body.set(
      "parameters",
      Buffer.from(JSON.stringify(parameters), "utf8").toString("base64"),
    );
  }

  let res: Response;
  try {
    res = await fetch(API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal,
    });
  } catch {
    // Mơ hồ: request có thể đã tới máy chủ. isRetryable() sẽ chặn thử lại với
    // action đặt lệnh để không tạo đơn trùng.
    throw new DhruError("Không kết nối được máy chủ check.", {
      raw: "network error",
      retryable: true,
    });
  }

  const text = await res.text();
  if (!res.ok) {
    throw new DhruError("Máy chủ check đang gặp sự cố. Vui lòng thử lại sau.", {
      raw: `HTTP ${res.status}`,
      retryable: res.status >= 500,
    });
  }

  let raw: DhruRaw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new DhruError("Máy chủ check trả về dữ liệu không hợp lệ.", {
      raw: text.slice(0, 200),
    });
  }

  const upstream = errorMessage(raw);
  if (upstream) {
    const { message, adminAction, retryable } = friendly(upstream);
    throw new DhruError(message, { raw: upstream, adminAction, retryable });
  }

  const success = toArray(raw.SUCCESS);
  if (!success.length) {
    throw new DhruError("Máy chủ check không trả về kết quả.", {
      raw: "empty SUCCESS",
    });
  }
  return success[0];
}

/**
 * Chỉ những action đọc dữ liệu mới được thử lại tự do. `placeimeiorder` KHÔNG
 * idempotent: lỗi mơ hồ (mất mạng, System error) có thể xảy ra SAU khi đơn đã
 * được tạo, thử lại là đặt đơn thứ hai và trừ tiền hai lần.
 */
const READ_ONLY_ACTIONS = new Set<DhruAction>([
  "accountinfo",
  "imeiservicelist",
  "getimeiorder",
]);

function isRetryable(err: unknown, action: DhruAction): boolean {
  if (!(err instanceof DhruError) || !err.retryable) return false;
  if (READ_ONLY_ACTIONS.has(action)) return true;

  // Với đặt lệnh: chỉ thử lại khi chắc chắn request bị chặn TRƯỚC khi xử lý,
  // tức chưa thể có đơn nào được tạo.
  return err.raw?.startsWith("Invalid IP Request") ?? false;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Gọi 1 action của Dhru, tự thử lại với lỗi thoáng qua.
 * Ném DhruError với thông điệp đã Việt hoá; chi tiết gốc nằm ở `.raw`.
 */
async function call(
  action: DhruAction,
  parameters?: Record<string, unknown>,
  signal?: AbortSignal,
  // 4 lần thử: với tỉ lệ lỗi IP ~12% mỗi request, xác suất thất bại cả 4 lần
  // là ~0,02%. Backoff cộng dồn tối đa ~2,4s nên vẫn nằm trong ngưỡng chờ.
  retries = 3,
): Promise<Record<string, unknown>> {
  if (!isDhruConfigured()) {
    throw new DhruError("Tính năng check IMEI chưa được cấu hình.", {
      raw: "missing DHRU_* env",
      adminAction: true,
    });
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestOnce(action, parameters, signal);
    } catch (err) {
      lastError = err;
      if (signal?.aborted || attempt === retries || !isRetryable(err, action)) {
        break;
      }
      await sleep(400 * (attempt + 1));
    }
  }

  if (lastError instanceof DhruError) {
    // Chi tiết gốc chỉ vào log server, không ra client.
    console.error(
      `[dhru] ${action} thất bại: ${lastError.raw ?? lastError.message}`,
    );
  }
  throw lastError;
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export type AccountInfo = {
  credit: string;
  currency: string;
  email: string;
  name?: string;
};

export async function accountInfo(signal?: AbortSignal): Promise<AccountInfo> {
  const data = await call("accountinfo", undefined, signal);
  // Bản gốc của Dhru gõ nhầm là "AccoutInfo"; server thật trả cả hai key.
  const info = (data.AccountInfo ?? data.AccoutInfo ?? {}) as Record<
    string,
    unknown
  >;
  return {
    credit: String(info.credit ?? "0"),
    currency: String(info.currency ?? ""),
    email: String(info.email ?? info.mail ?? ""),
    name: info.name ? String(info.name) : undefined,
  };
}

export type ImeiService = {
  id: string;
  name: string;
  credit: string;
  time: string;
  group: string;
  info: string;
};

export async function imeiServiceList(
  signal?: AbortSignal,
): Promise<ImeiService[]> {
  const data = await call("imeiservicelist", undefined, signal);
  const groups = (data.LIST ?? {}) as Record<string, Record<string, unknown>>;
  const out: ImeiService[] = [];

  for (const group of Object.values(groups)) {
    const groupName = String(group?.GROUPNAME ?? "");
    for (const svc of toArray(group?.SERVICES)) {
      out.push({
        id: String(svc.SERVICEID ?? ""),
        name: String(svc.SERVICENAME ?? ""),
        credit: String(svc.CREDIT ?? ""),
        time: String(svc.TIME ?? ""),
        group: groupName,
        info: htmlToText(String(svc.INFO ?? "")).replace(/\n+/g, " "),
      });
    }
  }
  return out.filter((s) => s.id);
}

/** Trạng thái đơn theo chuẩn Fusion. */
export const ORDER_STATUS = {
  0: "new",
  1: "processing",
  3: "rejected",
  4: "available",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export async function placeImeiOrder(
  serviceId: string,
  imei: string,
  signal?: AbortSignal,
): Promise<string> {
  const data = await call("placeimeiorder", { ID: serviceId, IMEI: imei }, signal);
  const ref = data.REFERENCEID ?? data.REFERENCE ?? data.ORDERID;
  if (!ref) throw new DhruError("Đặt lệnh thành công nhưng thiếu mã tham chiếu.");
  return String(ref);
}

export type OrderResult = {
  status: OrderStatus;
  statusCode: number;
  /** Kết quả trả về, thường là HTML nhiều dòng. */
  code: string;
  /** IMEI theo ghi nhận của máy chủ (đối chiếu với IMEI đã gửi). */
  imei: string;
  /** Số tiền đã trừ cho đơn này. */
  credit: string;
};

export async function getImeiOrder(
  referenceId: string,
  signal?: AbortSignal,
): Promise<OrderResult> {
  const data = await call("getimeiorder", { ID: referenceId }, signal);
  const statusCode = Number(data.STATUS ?? 0);
  return {
    statusCode,
    status:
      ORDER_STATUS[statusCode as keyof typeof ORDER_STATUS] ?? "processing",
    code: String(data.CODE ?? ""),
    imei: String(data.IMEI ?? ""),
    credit: String(data.CREDIT ?? ""),
  };
}

/* -------------------------------------------------------------------------- */
/* Tiện ích                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Chẩn đoán thô cho admin (?action=diag): gọi accountinfo KHÔNG qua lớp
 * Việt hoá/retry, trả về nguyên trạng những gì upstream đáp — kèm IP đi ra
 * của server tại thời điểm gọi. Dùng để gửi cho bên vận hành API khi có sự cố.
 */
export async function diagnose(): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {
    at: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "local",
    apiUrl: API_URL,
    username: USERNAME,
  };

  // IP đi ra của function này (Vercel không có IP tĩnh — mỗi lần gọi có thể khác).
  try {
    const res = await fetch("https://api.ipify.org", { cache: "no-store" });
    out.egressIp = (await res.text()).trim();
  } catch {
    out.egressIp = "(không lấy được)";
  }

  try {
    const body = new URLSearchParams({
      username: USERNAME ?? "",
      apiaccesskey: API_KEY ?? "",
      action: "accountinfo",
      format: "json",
    });
    const res = await fetch(API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    out.upstream = {
      httpStatus: res.status,
      contentType: res.headers.get("content-type"),
      server: res.headers.get("server"),
      cfRay: res.headers.get("cf-ray"),
      bodyFirst300: text.slice(0, 300),
    };
  } catch (err) {
    out.upstream = { fetchError: String(err) };
  }

  return out;
}

/** IMEI 15 số hợp lệ theo thuật toán Luhn. */
export function isValidImei(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = Number(imei[i]);
    // Nhân đôi các vị trí chẵn (index lẻ) tính từ trái sang.
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Dhru trả về HTML tự do — bỏ thẻ, giải mã entity, giữ ngắt dòng. */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    // Giải &amp; sau cùng để "&amp;lt;" không bị biến thành "<".
    .replace(/&amp;/gi, "&")
    .replace(/ /g, " ");
}

/**
 * Tách kết quả thành các dòng "Nhãn: giá trị" để client hiển thị dạng bảng,
 * đồng thời giữ lại các dòng không có nhãn.
 */
export function parseResultLines(
  code: string,
): { label: string; value: string }[] {
  return htmlToText(code)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.indexOf(":");
      if (at > 0 && at < 60) {
        return {
          label: line.slice(0, at).trim(),
          value: line.slice(at + 1).trim(),
        };
      }
      return { label: "", value: line };
    });
}
