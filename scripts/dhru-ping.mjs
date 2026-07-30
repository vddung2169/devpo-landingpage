// scripts/dhru-ping.mjs
// -----------------------------------------------------------------------------
// Chẩn đoán kết nối DHRU API (taoden.vn) — tương đương bin/ping.php + bin/list-services.php.
//
// Cách dùng (tại thư mục gốc dự án):
//   node scripts/dhru-ping.mjs              -> kiểm tra kết nối + số dư
//   node scripts/dhru-ping.mjs services     -> in bảng SERVICEID + tên + giá
//   node scripts/dhru-ping.mjs order 973686 -> tra 1 đơn theo mã tham chiếu
//
// Đọc cấu hình từ .env (DHRU_API_URL, DHRU_USERNAME, DHRU_API_KEY).
//
// Lỗi hay gặp và cách xử lý:
//   "Invalid IP Request. (x.x.x.x)" -> key đang bật IP whitelist. Nhờ taoden.vn
//     whitelist đúng IP đó, hoặc tắt giới hạn IP cho key. IP nhà mạng dân dụng
//     hay đổi, và Vercel thì đổi IP liên tục — xem README/ghi chú khi deploy.
//   "Insufficient credit."          -> hết số dư, nạp thêm.
//   "System error..."               -> lỗi phía taoden.vn, không sửa được ở đây.
//
// Yêu cầu: Node 18+ (có sẵn fetch). Không cần cài thêm gì.
// -----------------------------------------------------------------------------

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Đọc .env đơn giản: KEY=VALUE, bỏ dòng trống và dòng chú thích. */
async function loadEnv() {
  const out = {};
  for (const file of [".env", ".env.local"]) {
    let text;
    try {
      text = await readFile(join(ROOT, file), "utf8");
    } catch {
      continue;
    }
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const at = trimmed.indexOf("=");
      if (at < 1) continue;
      out[trimmed.slice(0, at).trim()] = trimmed.slice(at + 1).trim();
    }
  }
  return out;
}

const env = await loadEnv();
const API_URL = env.DHRU_API_URL;
const USERNAME = env.DHRU_USERNAME;
const API_KEY = env.DHRU_API_KEY;

if (!API_URL || !USERNAME || !API_KEY) {
  console.error("✗ Thiếu DHRU_API_URL / DHRU_USERNAME / DHRU_API_KEY trong .env");
  process.exit(1);
}

async function call(action, parameters) {
  const body = new URLSearchParams({
    username: USERNAME,
    apiaccesskey: API_KEY,
    action,
    format: "json",
  });
  if (parameters) {
    body.set(
      "parameters",
      Buffer.from(JSON.stringify(parameters), "utf8").toString("base64"),
    );
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Phản hồi không phải JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }

  const errors = Array.isArray(json.ERROR) ? json.ERROR : [];
  if (errors.length) {
    throw new Error(errors.map((e) => e?.MESSAGE ?? e).join(" · "));
  }
  const success = Array.isArray(json.SUCCESS) ? json.SUCCESS : [];
  if (!success.length) throw new Error("Máy chủ không trả về kết quả.");
  return success[0];
}

const [mode = "ping", arg] = process.argv.slice(2);

try {
  if (mode === "ping") {
    const row = await call("accountinfo");
    const info = row.AccountInfo ?? row.AccoutInfo ?? {};
    console.log("✓ Kết nối OK");
    console.log(`  Tài khoản : ${info.name ?? "-"} <${info.email ?? info.mail ?? "-"}>`);
    console.log(`  Số dư     : ${info.credit ?? "?"} ${info.currency ?? ""}`);
    console.log(`  Service ID: ${env.DHRU_SERVICE_ID ?? "(chưa đặt)"}`);
  } else if (mode === "services") {
    const row = await call("imeiservicelist");
    const groups = row.LIST ?? {};
    let count = 0;
    for (const group of Object.values(groups)) {
      const services = group?.SERVICES ?? {};
      for (const svc of Object.values(services)) {
        console.log(
          `${String(svc.SERVICEID).padStart(5)} | ${String(svc.CREDIT).padStart(12)} | ${svc.TIME ?? ""} | ${svc.SERVICENAME ?? ""}`,
        );
        count++;
      }
    }
    console.log(`\n${count} dịch vụ. Chọn 1 SERVICEID rồi ghi vào .env: DHRU_SERVICE_ID=<id>`);
  } else if (mode === "order") {
    if (!arg) throw new Error("Thiếu mã đơn. Ví dụ: node scripts/dhru-ping.mjs order 973686");
    const row = await call("getimeiorder", { ID: arg });
    const labels = { 0: "Mới", 1: "Đang xử lý", 3: "Bị từ chối (hoàn tiền)", 4: "Hoàn thành" };
    console.log(`Đơn #${arg} — trạng thái ${row.STATUS} (${labels[row.STATUS] ?? "?"})`);
    if (row.CODE) console.log(`\n${row.CODE}`);
  } else {
    console.error(`Chế độ không hợp lệ: ${mode}. Dùng: ping | services | order <id>`);
    process.exit(1);
  }
} catch (err) {
  console.error(`✗ ${err.message}`);
  if (/Invalid IP Request/.test(err.message)) {
    console.error(
      "\n  → Key đang bật IP whitelist. Nhờ taoden.vn whitelist IP ở trên,\n" +
        "    hoặc tắt giới hạn IP cho key. Lưu ý IP dân dụng và IP Vercel đều hay đổi.",
    );
  }
  process.exit(1);
}
