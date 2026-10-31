import { NextRequest, NextResponse } from "next/server";
import { mockSpin, mockStatus } from "@/lib/event-wheel-mock";
import { isValidName, isValidPhone, normalizePhone } from "@/lib/event-wheel";

// Proxy giữa client và Google Apps Script Web App (scripts/event-wheel.gs).
// Lý do proxy phía server:
//  - EVENT_WHEEL_API + EVENT_WHEEL_TOKEN không lọt vào bundle client
//  - không dính CORS (server-to-server)
//  - chặn spam trước khi chạm tới Apps Script (quota 20.000 request/ngày)
//
// Route này KHÔNG quyết định khách trúng gì và KHÔNG quyết định chương trình
// đang mở hay đóng. Hai việc đó do Apps Script chốt, vì chỉ nó có khoá
// (LockService) và nguồn dữ liệu thật.
export const dynamic = "force-dynamic";

/* ============================== RATE LIMIT ============================== */

// Chống spam ở mức "gờ giảm tốc": bộ đếm nằm trong RAM của từng instance
// serverless nên không phải hàng rào tuyệt đối. Hàng rào thật là ở Apps Script:
// một SĐT một lượt + LockService. Mục đích ở đây chỉ là giữ cho Apps Script
// không bị dội request.
const WINDOW_MS = 60_000;
// Để khá thoáng là CHỦ ĐÍCH: khách DEV PỒ phần lớn vào bằng 4G, mà các nhà mạng
// VN dùng CGNAT — rất nhiều khách thật dùng chung một IP. Siết quá (vd 5/phút)
// sẽ chặn oan khách đang xếp hàng quay. Chốt "một SĐT một lượt" nằm ở Apps
// Script (LockService), nên ở đây chỉ cần đủ để Apps Script không bị dội request.
const MAX_SPIN_PER_WINDOW = 20;
// Đọc trạng thái thì thoáng hơn nhiều: mỗi lượt xem trang gọi 1-2 lần, mà rất
// nhiều khách 4G dùng chung IP qua CGNAT.
const MAX_READ_PER_WINDOW = 240;

const hits = new Map<string, number[]>();

function tooMany(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Dọn rác định kỳ để Map không phình vô hạn trên instance sống lâu.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > max;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/* ============================== HELPERS ============================== */

// Cache trạng thái CHUNG (bản không kèm SĐT) trong vài giây.
// Lý do: Apps Script có hạn mức lượt chạy mỗi ngày. Nếu mỗi lượt xem trang đều
// gọi thẳng lên đó thì một ngày đông khách là hết quota, event chết giữa chừng.
// Số quà hiển thị chậm vài giây là chấp nhận được — còn việc quay thì KHÔNG
// bao giờ đi qua cache này.
const STATUS_TTL_MS = 8_000;
let statusCache: { at: number; data: unknown } | null = null;

function apiConfig(): { api: string; token: string } | null {
  const api = process.env.EVENT_WHEEL_API;
  const token = process.env.EVENT_WHEEL_TOKEN;
  if (!api || !token) return null;
  return { api, token };
}

/** Mock chỉ được phép ngoài production — tránh phát quà giả trên web thật. */
function mockAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}

// Cảnh báo một lần cho mỗi lần chạy server: rất dễ tưởng đã nối Google Sheets
// trong khi thực ra đang quay bằng dữ liệu giả trong RAM.
let warnedMock = false;
function warnMockOnce(): void {
  if (warnedMock) return;
  warnedMock = true;
  console.warn(
    "\n[event-wheel] ĐANG CHẠY CHẾ ĐỘ MOCK (dữ liệu giả, KHÔNG ghi vào Google Sheets).\n" +
      "[event-wheel] Lý do: EVENT_WHEEL_API / EVENT_WHEEL_TOKEN đang trống trong .env\n" +
      "[event-wheel] Muốn ghi thật vào Sheets: xem scripts/EVENT-WHEEL-SETUP.md (Bước 1-4),\n" +
      "[event-wheel] điền 2 biến đó rồi KHỞI ĐỘNG LẠI dev server.\n",
  );
}

/* ============================== GET ============================== */

/** GET: trạng thái chương trình (+ tra kết quả cũ nếu có ?phone=). */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  const mock = searchParams.get("mock");
  const cfg = apiConfig();

  if (tooMany(`get:${clientIp(req)}`, MAX_READ_PER_WINDOW)) {
    return NextResponse.json(
      { ok: false, error: "Bạn tải lại quá nhanh, thử lại sau một phút." },
      { status: 429 },
    );
  }

  if (!cfg || (mock && mockAllowed())) {
    if (!cfg && !mockAllowed()) {
      // Production mà thiếu env -> coi như chương trình tắt, KHÔNG hiện modal.
      return NextResponse.json({
        ok: false,
        enabled: false,
        phase: "off",
        prizes: [],
        myResult: null,
        serverTime: new Date().toISOString(),
        startAt: null,
        endAt: null,
        error: "Chưa cấu hình EVENT_WHEEL_API / EVENT_WHEEL_TOKEN.",
      });
    }
    warnMockOnce();
    return NextResponse.json(mockStatus(mock, phone));
  }

  const hasPhone = Boolean(phone && isValidPhone(phone));

  // Chỉ cache bản KHÔNG kèm SĐT — bản có SĐT là dữ liệu riêng của từng khách,
  // cache chung sẽ lộ kết quả của người này sang người khác.
  if (!hasPhone && statusCache && Date.now() - statusCache.at < STATUS_TTL_MS) {
    return NextResponse.json(statusCache.data);
  }

  try {
    const url = new URL(cfg.api);
    url.searchParams.set("token", cfg.token);
    if (hasPhone) {
      url.searchParams.set("phone", normalizePhone(phone as string));
    }
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, phase: "off", error: `Máy chủ event trả lỗi (${res.status}).` },
        { status: 502 },
      );
    }
    const data = await res.json();
    if (!hasPhone) statusCache = { at: Date.now(), data };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { ok: false, phase: "off", error: "Không kết nối được máy chủ event." },
      { status: 502 },
    );
  }
}

/* ============================== POST ============================== */

/** POST: quay thưởng. Body {name, phone, requestId, agree}. */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mock = searchParams.get("mock");

  if (tooMany(`spin:${clientIp(req)}`, MAX_SPIN_PER_WINDOW)) {
    return NextResponse.json(
      { ok: false, error: "Quá nhiều lượt gửi. Vui lòng thử lại sau một phút." },
      { status: 429 },
    );
  }

  let body: {
    name?: string;
    phone?: string;
    requestId?: string;
    agree?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  // Validate lại ở server — không tin form phía client.
  const name = String(body.name ?? "").trim().slice(0, 80);
  const phone = normalizePhone(String(body.phone ?? ""));
  if (!isValidName(name)) {
    return NextResponse.json({ ok: false, error: "Vui lòng nhập họ tên hợp lệ." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { ok: false, error: "Số điện thoại không hợp lệ." },
      { status: 400 },
    );
  }
  if (body.agree !== true) {
    return NextResponse.json(
      { ok: false, error: "Bạn cần đồng ý với thể lệ chương trình." },
      { status: 400 },
    );
  }

  // requestId giúp idempotent: khách bấm lại hoặc mạng chập thì server trả lại
  // kết quả cũ thay vì ghi thêm một dòng mới vào sheet.
  const requestId = String(body.requestId ?? "").trim().slice(0, 64);
  const payload = JSON.stringify({ action: "spin", name, phone, requestId });

  const cfg = apiConfig();
  if (!cfg) {
    if (!mockAllowed()) {
      return NextResponse.json(
        { ok: false, error: "Chương trình tạm thời chưa sẵn sàng." },
        { status: 503 },
      );
    }
    warnMockOnce();
    return NextResponse.json(mockSpin(payload, mock));
  }
  if (mock && mockAllowed()) {
    warnMockOnce();
    return NextResponse.json(mockSpin(payload, mock));
  }

  try {
    // text/plain là chủ đích: né preflight CORS của Apps Script.
    const res = await fetch(cfg.api, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "spin", name, phone, requestId, token: cfg.token }),
      cache: "no-store",
    });
    const data = await res.json();
    // Vừa phát một suất quà -> số liệu cũ đã sai, bỏ cache để lần đọc sau lấy bản mới.
    statusCache = null;
    return NextResponse.json(data, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không gửi được lượt quay. Vui lòng thử lại." },
      { status: 502 },
    );
  }
}
