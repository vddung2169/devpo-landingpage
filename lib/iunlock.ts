/**
 * Client cho iUnlock JSON API (https://iunlock.io/api/iunlock).
 *
 * Khác hẳn DHRU Fusion trước đây: đây là API ĐỒNG BỘ, một request GET trả luôn
 * kết quả — không có đặt lệnh / mã đơn / hỏi lại trạng thái.
 *
 *   GET ?key=<API_KEY>&accountinfo=balance      -> số dư
 *   GET ?key=<API_KEY>&accountinfo=servicelist  -> danh sách dịch vụ
 *   GET ?key=<API_KEY>&service=<ID>&imei=<IMEI> -> tra cứu (trừ tiền)
 *
 * Phản hồi luôn cùng một khuôn:
 *   { success: boolean, error: false | string, response: string, object: any }
 * `error` là false khi thành công và là CHUỖI thông điệp khi thất bại.
 *
 * Chỉ dùng phía server: file này đọc API key từ env, không được import vào client.
 */

const API_URL = process.env.IUNLOCK_API_URL ?? "https://iunlock.io/api/iunlock";
const API_KEY = process.env.IUNLOCK_API_KEY;

/**
 * Dịch vụ mặc định. Lưu ý: mã gửi lên API là cột ID (vd "011"), KHÔNG phải số
 * hiển thị trong tên dịch vụ ("# 1011") — gửi "1011" sẽ bị trả về "Invalid Service".
 * Mặc định 011 = "# 1011 Apple Carrier+Simlock Check" ($0.035, Instant).
 */
export const DEFAULT_SERVICE_ID = process.env.IUNLOCK_SERVICE_ID ?? "011";

export class IUnlockError extends Error {
  /** Thông điệp gốc của upstream — để log phía server, không đưa ra cho khách. */
  readonly raw?: string;
  /** Lỗi hạ tầng cần admin xử lý (hết tiền, sai key, sai cấu hình dịch vụ). */
  readonly adminAction: boolean;
  /** Thử lại có cơ hội thành công. */
  readonly retryable: boolean;
  /** Lỗi do dữ liệu người dùng nhập, không phải sự cố máy chủ. */
  readonly userInput: boolean;

  constructor(
    message: string,
    options: {
      raw?: string;
      adminAction?: boolean;
      retryable?: boolean;
      userInput?: boolean;
    } = {},
  ) {
    super(message);
    this.raw = options.raw;
    this.adminAction = options.adminAction ?? false;
    this.retryable = options.retryable ?? false;
    this.userInput = options.userInput ?? false;
  }
}

/* -------------------------------------------------------------------------- */
/* Việt hoá lỗi                                                                */
/* -------------------------------------------------------------------------- */

type Friendly = {
  message: string;
  adminAction: boolean;
  retryable: boolean;
  userInput?: boolean;
};

/**
 * Đổi thông điệp thô của iUnlock sang câu tiếng Việt cho người dùng cuối.
 * Thông điệp gốc vẫn giữ ở IUnlockError.raw để log.
 */
function friendly(raw: string): Friendly {
  const table: Record<string, Friendly> = {
    "Insufficient Balance": {
      message: "Tài khoản check đã hết số dư. Vui lòng liên hệ quản trị.",
      adminAction: true,
      retryable: false,
    },
    "Authentication Failed": {
      message: "Xác thực API thất bại. Vui lòng liên hệ quản trị.",
      adminAction: true,
      retryable: false,
    },
    "Invalid Service": {
      message: "Dịch vụ check chưa được cấu hình đúng hoặc đã tắt.",
      adminAction: true,
      retryable: false,
    },
    "Invalid input format for this service.": {
      message:
        "IMEI hoặc Serial không đúng định dạng dịch vụ này chấp nhận. Vui lòng kiểm tra lại.",
      adminAction: false,
      retryable: false,
      userInput: true,
    },
    // Upstream gộp hai tình huống vào một câu; thực tế gặp nhiều nhất là IMEI
    // đúng checksum Luhn nhưng không phải máy Apple có thật. Không bị trừ tiền.
    "Invalid device or Server busy, please try again later.": {
      message:
        "Không tìm thấy máy với IMEI/Serial này (hoặc máy chủ Apple đang bận). Kiểm tra lại số rồi thử lại.",
      adminAction: false,
      retryable: false,
      userInput: true,
    },
  };

  if (table[raw]) return table[raw];

  if (/^Invalid (device|imei|serial)/i.test(raw)) {
    return {
      message: "IMEI/Serial không hợp lệ với dịch vụ này. Vui lòng kiểm tra lại.",
      adminAction: false,
      retryable: false,
      userInput: true,
    };
  }

  // "Invalid request. Send accountinfo=... | service+imei." — lỗi lập trình,
  // người dùng không sửa được.
  if (raw.startsWith("Invalid request")) {
    return {
      message: "Yêu cầu gửi lên máy chủ check không hợp lệ.",
      adminAction: true,
      retryable: false,
    };
  }

  // Không để lộ chi tiết kỹ thuật (SQL, stack trace) ra ngoài.
  if (/SQLSTATE|PDOException|stack trace|Fatal error|System error/i.test(raw)) {
    return {
      message: "Máy chủ check đang gặp sự cố. Vui lòng thử lại sau.",
      adminAction: false,
      retryable: true,
    };
  }

  return { message: raw, adminAction: false, retryable: false };
}

/* -------------------------------------------------------------------------- */
/* Gọi API                                                                     */
/* -------------------------------------------------------------------------- */

/** Cấu hình đã đủ để gọi API thật hay chưa. */
export function isConfigured() {
  return Boolean(API_URL && API_KEY);
}

type Envelope = {
  success?: boolean;
  /** false khi thành công, chuỗi thông điệp khi thất bại. */
  error?: boolean | string;
  response?: string;
  object?: unknown;
};

/** Một lần gọi HTTP, không retry. */
async function requestOnce(
  params: Record<string, string>,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<Envelope> {
  const url = new URL(API_URL);
  url.searchParams.set("key", API_KEY!);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  // Ghép hạn chờ riêng với signal của caller: bên nào tới trước thì huỷ request.
  const timeout = AbortSignal.timeout(timeoutMs);
  const abort = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: abort,
    });
  } catch {
    // Mơ hồ: request có thể đã tới máy chủ và đã trừ tiền. Lớp retry trong
    // call() chỉ thử lại các action chỉ đọc (xem RETRYABLE_PARAMS).
    throw new IUnlockError("Không kết nối được máy chủ check.", {
      raw: "network error",
      retryable: true,
    });
  }

  const text = await res.text();
  if (!res.ok) {
    throw new IUnlockError(
      "Máy chủ check đang gặp sự cố. Vui lòng thử lại sau.",
      { raw: `HTTP ${res.status}: ${text.slice(0, 120)}`, retryable: res.status >= 500 },
    );
  }

  let body: Envelope;
  try {
    body = JSON.parse(text);
  } catch {
    throw new IUnlockError("Máy chủ check trả về dữ liệu không hợp lệ.", {
      raw: text.slice(0, 200),
    });
  }

  // `error` là chuỗi khi thất bại; `success: false` mà không có thông điệp thì
  // vẫn coi là lỗi để không trả kết quả rỗng cho người dùng.
  const upstream =
    typeof body.error === "string" && body.error.trim()
      ? body.error.trim()
      : body.success === false
        ? "Máy chủ check trả về lỗi không rõ nguyên nhân."
        : null;

  if (upstream) {
    const { message, adminAction, retryable, userInput } = friendly(upstream);
    throw new IUnlockError(message, {
      raw: upstream,
      adminAction,
      retryable,
      userInput,
    });
  }

  return body;
}

/**
 * Tra cứu KHÔNG idempotent: lỗi mơ hồ (mất mạng, 5xx) có thể xảy ra SAU khi
 * upstream đã xử lý và trừ tiền, thử lại là trả tiền hai lần. Chỉ những action
 * chỉ đọc mới được thử lại.
 */
const RETRYABLE_PARAMS = new Set(["accountinfo"]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function call(
  params: Record<string, string>,
  { timeoutMs = 30_000, signal }: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<Envelope> {
  if (!isConfigured()) {
    throw new IUnlockError("Tính năng check IMEI chưa được cấu hình.", {
      raw: "missing IUNLOCK_API_KEY",
      adminAction: true,
    });
  }

  const canRetry = Object.keys(params).every((k) => RETRYABLE_PARAMS.has(k));
  const retries = canRetry ? 2 : 0;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestOnce(params, timeoutMs, signal);
    } catch (err) {
      lastError = err;
      const retryable = err instanceof IUnlockError && err.retryable;
      if (signal?.aborted || attempt === retries || !retryable) break;
      await sleep(400 * (attempt + 1));
    }
  }

  if (lastError instanceof IUnlockError) {
    // Chi tiết gốc chỉ vào log server, không ra client.
    console.error(
      `[iunlock] ${JSON.stringify(params)} thất bại: ${lastError.raw ?? lastError.message}`,
    );
  }
  throw lastError;
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export type Balance = {
  credit: string;
  currency: string;
  email: string;
  /** Số dư dạng số, để so sánh với giá dịch vụ. */
  amount: number;
};

export async function balance(signal?: AbortSignal): Promise<Balance> {
  const body = await call({ accountinfo: "balance" }, { signal, timeoutMs: 15_000 });
  const info = (body.object ?? {}) as Record<string, unknown>;
  return {
    credit: String(info.credit ?? info.balance ?? "0"),
    currency: String(info.currency ?? ""),
    email: String(info.mail ?? info.email ?? ""),
    amount: Number(info.account_balance ?? info.credit ?? 0) || 0,
  };
}

export type Service = {
  /** Mã gửi lên API (cột ID, vd "011"). */
  id: string;
  /** Tên hiển thị, thường mở đầu bằng "# 1011". */
  name: string;
  price: string;
  time: string;
  /** Mẫu kết quả do nhà cung cấp mô tả. */
  description: string;
  /** Dịch vụ nhận cả Serial Number chứ không chỉ IMEI. */
  snSupport: boolean;
};

export async function serviceList(signal?: AbortSignal): Promise<Service[]> {
  const body = await call(
    { accountinfo: "servicelist" },
    { signal, timeoutMs: 20_000 },
  );
  const list = Array.isArray(body.object)
    ? (body.object as Record<string, unknown>[])
    : [];

  return list
    .map((s) => ({
      id: String(s.service ?? s.SERVICEID ?? ""),
      name: String(s.name ?? s.SERVICENAME ?? ""),
      price: String(s.price ?? s.CREDIT ?? ""),
      time: String(s.time ?? "Instant"),
      description: String(s.description ?? ""),
      snSupport: Boolean(s.snSupport),
    }))
    .filter((s) => s.id);
}

/** Sắc thái do chính upstream gán qua màu chữ: xanh = tốt, đỏ = xấu. */
export type Tone = "good" | "bad";

export type ResultLine = { label: string; value: string; tone?: Tone };

export type CheckResult = {
  serviceId: string;
  /** Giá trị đã gửi lên (IMEI hoặc Serial). */
  input: string;
  /** Kết quả đã tách thành từng dòng "Nhãn: giá trị". */
  lines: ResultLine[];
  /** Mã đơn bên iUnlock (object.orderid) — để đối chiếu khi cần hỗ trợ. */
  orderId?: string;
  /** Kết quả thô để hỗ trợ / sao chép khi cần. */
  raw: string;
};

/**
 * Tra cứu một IMEI/Serial. MỘT LẦN GỌI = MỘT LẦN TRỪ TIỀN, và cố ý không thử
 * lại khi lỗi mơ hồ (xem RETRYABLE_PARAMS).
 *
 * Lưu ý về khuôn phản hồi: `object` CHỈ chứa siêu dữ liệu đơn hàng
 * ({ status, id, orderid, service, imei }) — dữ liệu máy nằm trong `response`
 * dạng HTML. Đừng đọc kết quả từ `object`.
 */
export async function check(
  serviceId: string,
  input: string,
  signal?: AbortSignal,
): Promise<CheckResult> {
  // Dịch vụ "Instant" nhưng vẫn có thể chậm vài chục giây khi nguồn bận.
  const body = await call(
    { service: serviceId, imei: input },
    { signal, timeoutMs: 90_000 },
  );

  const html = String(body.response ?? "");
  const lines = parseResultLines(html);
  if (!lines.length) {
    throw new IUnlockError("Máy chủ check không trả về kết quả.", {
      raw: `empty result for service ${serviceId}`,
    });
  }

  const meta = (body.object ?? {}) as Record<string, unknown>;
  return {
    serviceId,
    input,
    lines,
    orderId: meta.orderid ? String(meta.orderid) : undefined,
    raw: htmlToText(html).trim(),
  };
}

/* -------------------------------------------------------------------------- */
/* Chuẩn hoá kết quả                                                           */
/* -------------------------------------------------------------------------- */

/** Kết quả là HTML tự do — bỏ thẻ, giải mã entity, giữ ngắt dòng. */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h\d)>/gi, "\n")
    .replace(/<\/t[dh]>/gi, ": ")
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
 * Upstream tự đánh giá tin tốt/xấu bằng màu chữ, vd
 * `Sim-Lock: <span style='color:red;'>Locked</span>`. Lấy đúng đánh giá đó
 * thay vì đoán theo từ khoá — chuẩn hơn và tự đúng với cả dịch vụ khác.
 */
function toneOf(htmlChunk: string): Tone | undefined {
  if (/color\s*:\s*(green|lime|#0{2}[0-9a-f]{2}0{2}\b)/i.test(htmlChunk)) {
    return "good";
  }
  if (/color\s*:\s*(red|#f{2}0{4}\b|#f00\b)/i.test(htmlChunk)) return "bad";
  return undefined;
}

/**
 * Tách kết quả HTML thành các dòng "Nhãn: giá trị" để client hiển thị dạng
 * bảng, đồng thời giữ lại các dòng không có nhãn và sắc thái màu của upstream.
 */
export function parseResultLines(code: string): ResultLine[] {
  // Cắt theo ngắt dòng TRƯỚC khi bỏ thẻ, để giữ được màu riêng của từng dòng.
  return code
    .split(/<br\s*\/?>|<\/(?:p|div|tr|li|h\d)>/i)
    .flatMap((chunk) => {
      const tone = toneOf(chunk);
      return htmlToText(chunk)
        .split("\n")
        .map((line) => line.replace(/\s*:\s*$/, "").trim())
        .filter(Boolean)
        .map((line): ResultLine => {
          const at = line.indexOf(":");
          const parsed =
            at > 0 && at < 60
              ? {
                  label: line.slice(0, at).trim(),
                  value: line.slice(at + 1).trim(),
                }
              : { label: "", value: line };
          return tone ? { ...parsed, tone } : parsed;
        });
    })
    .filter((l) => l.label || l.value);
}

/* -------------------------------------------------------------------------- */
/* Kiểm tra đầu vào                                                            */
/* -------------------------------------------------------------------------- */

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

/**
 * Serial Apple: chữ và số, 8–12 ký tự, không có dấu phân cách. Dịch vụ nào khai
 * snSupport thì nhận cả dạng này thay cho IMEI.
 */
export function isValidSerial(sn: string): boolean {
  return /^[A-Z0-9]{8,12}$/.test(sn) && /[A-Z]/.test(sn);
}

/**
 * Chuẩn hoá đầu vào của người dùng thành thứ gửi lên API được, hoặc null nếu
 * không nhận dạng được. IMEI bỏ mọi ký tự không phải số; Serial in hoa.
 */
export function normalizeInput(
  value: string,
): { kind: "imei" | "serial"; value: string } | null {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  // Chuỗi toàn số (kể cả khi người dùng gõ dấu cách/gạch) -> coi là IMEI.
  if (digits.length >= 14 && !/[A-Za-z]/.test(trimmed)) {
    return isValidImei(digits) ? { kind: "imei", value: digits } : null;
  }

  const serial = trimmed.replace(/[\s-]/g, "").toUpperCase();
  return isValidSerial(serial) ? { kind: "serial", value: serial } : null;
}
