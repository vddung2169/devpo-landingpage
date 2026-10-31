/**
 * DEV PỒ — Event "Quay may mắn" (Apps Script Web App)
 * ---------------------------------------------------------------------------
 * Vì sao toàn bộ logic nằm ở đây chứ không ở Next.js:
 *   devpo.vn không có database. Nơi duy nhất ghi được dữ liệu bền vững là
 *   Google Sheets, mà muốn ghi an toàn (không trùng, không race) thì phải có
 *   khoá — Apps Script có LockService, còn Next.js gọi Sheets API thì không.
 *
 * MỌI quyết định quan trọng nằm ở server này:
 *   - trúng giải nào      (frontend KHÔNG được quyết)
 *   - còn bao nhiêu quà
 *   - một SĐT đã quay chưa
 *   - sinh mã ưu đãi
 * Frontend chỉ chạy animation dừng đúng ô mà server đã chốt.
 *
 * CÁCH DEPLOY: xem scripts/EVENT-WHEEL-SETUP.md
 */

/* ============================== CẤU HÌNH ============================== */

// Sheet lưu dữ liệu event (khác sheet quản lý kho).
var SPREADSHEET_ID = "1_o0P08bfSTGFRnh3g-NCsIw8_2mYUAY5XYFm0S0bvP0";

var SHEET_LUOT_QUAY = "Luot_Quay";   // mỗi lượt quay 1 dòng
var SHEET_GIAI_THUONG = "Giai_Thuong"; // cấu hình giải: tỉ lệ + số lượng
var SHEET_CONFIG = "Config";          // bật/tắt, thời gian, token

var TZ = "Asia/Ho_Chi_Minh";

/**
 * Giải thưởng mặc định — chỉ dùng để TẠO sheet lần đầu.
 * Sau khi sheet Giai_Thuong tồn tại, sửa trực tiếp trên sheet, KHÔNG sửa file này.
 *
 * `ti_le`: trọng số (%). Giải "iphone500k" được ghim đúng 5% theo yêu cầu;
 * phần 95% còn lại chia theo trọng số của các giải khác.
 */
var DEFAULT_PRIZES = [
  // id, tên hiển thị, loại, tỉ lệ %, số lượng
  // Bộ số này cộng tròn 100 nên cột "Tỉ lệ" đọc đúng là phần trăm thật.
  ["ipad300k",   "Giảm 300.000đ",          "voucher", 17, 30],
  ["ipad200k",   "Giảm 200.000đ",          "voucher", 26, 50],
  ["ipad100k",   "Giảm 100.000đ",          "voucher", 36, 100],
  ["pencil",     "Tặng Apple Pencil",      "qua",      4, 5],
  ["airpods",    "Tặng AirPods",           "qua",      2, 3],
  ["iphone500k", "Giảm 500.000đ",          "voucher",  5, 20],
  ["cuongluc",   "Dán cường lực + vệ sinh", "dichvu",  10, 500]
];

// Giải bị GHIM xác suất tuyệt đối (không bị ảnh hưởng bởi trọng số giải khác).
var FIXED_RATE_PRIZE = "iphone500k";
var FIXED_RATE_PERCENT = 5;

/* ============================== ROUTING ============================== */

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!checkToken_(p.token)) return json_({ ok: false, error: "Token không hợp lệ." });
  try {
    return json_(buildStatus_(p.phone));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, error: "Body không phải JSON." });
  }
  if (!checkToken_(data.token)) return json_({ ok: false, error: "Token không hợp lệ." });

  try {
    if (data.action === "spin") return json_(handleSpin_(data));
    return json_({ ok: false, error: "action không hợp lệ." });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ============================== TRẠNG THÁI ============================== */

function buildStatus_(phone) {
  var cfg = readConfig_();
  var prizes = readPrizes_();
  var now = new Date();

  var out = {
    ok: true,
    serverTime: now.toISOString(),
    enabled: cfg.enabled,
    startAt: cfg.startAt ? cfg.startAt.toISOString() : null,
    endAt: cfg.endAt ? cfg.endAt.toISOString() : null,
    phase: phase_(cfg, now),
    // Chỉ trả tên + số lượng còn lại. KHÔNG trả tỉ lệ ra client.
    prizes: prizes.map(function (p) {
      return {
        id: p.id,
        ten: p.ten,
        loai: p.loai,
        con_lai: Math.max(0, p.soLuong - p.daPhat),
        tong: p.soLuong,
        het: p.soLuong - p.daPhat <= 0
      };
    }),
    myResult: null
  };

  var norm = normalizePhone_(phone);
  if (norm) {
    var found = findSpinByPhone_(norm);
    if (found) {
      out.myResult = {
        prizeId: found.prizeId,
        prizeName: found.prizeName,
        code: found.code,
        at: found.at
      };
    }
  }
  return out;
}

function phase_(cfg, now) {
  if (!cfg.enabled) return "off";
  if (cfg.startAt && now < cfg.startAt) return "upcoming";
  if (cfg.endAt && now > cfg.endAt) return "ended";
  return "open";
}

/* ============================== QUAY ============================== */

function handleSpin_(data) {
  var name = String(data.name || "").trim();
  var phone = normalizePhone_(data.phone);
  var requestId = String(data.requestId || "").trim();

  if (!name) return { ok: false, error: "Vui lòng nhập họ tên." };
  if (!phone) return { ok: false, error: "Số điện thoại không hợp lệ." };

  // Khoá toàn script: chặn 2 request cùng lúc cùng lấy 1 suất quà cuối,
  // hoặc cùng 1 SĐT gửi 2 request song song để quay 2 lần.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) return { ok: false, error: "Hệ thống đang bận, thử lại sau giây lát." };

  try {
    var cfg = readConfig_();
    var now = new Date();
    var ph = phase_(cfg, now);
    if (ph === "off") return { ok: false, error: "Chương trình chưa mở." };
    if (ph === "upcoming") return { ok: false, error: "Chương trình chưa bắt đầu.", phase: ph };
    if (ph === "ended") return { ok: false, error: "Chương trình đã kết thúc.", phase: ph };

    // Idempotent: cùng requestId (khách bấm lại / mạng chập) -> trả lại kết quả cũ.
    if (requestId) {
      var dup = findSpinByRequestId_(requestId);
      if (dup) {
        return { ok: true, duplicated: true, prizeId: dup.prizeId, prizeName: dup.prizeName, code: dup.code, at: dup.at };
      }
    }

    // Một SĐT một lượt — kiểm tra ở server, không tin localStorage.
    var existed = findSpinByPhone_(phone);
    if (existed) {
      return {
        ok: false,
        already: true,
        error: "Số điện thoại này đã quay rồi.",
        prizeId: existed.prizeId,
        prizeName: existed.prizeName,
        code: existed.code,
        at: existed.at
      };
    }

    var prizes = readPrizes_();
    var available = prizes.filter(function (p) { return p.soLuong - p.daPhat > 0; });
    if (!available.length) return { ok: false, error: "Rất tiếc, quà đã được phát hết." };

    var prize = pickPrize_(available);
    var code = generateCode_(prize);
    var at = Utilities.formatDate(now, TZ, "dd/MM/yyyy HH:mm:ss");

    appendSpin_({ at: at, name: name, phone: phone, prize: prize, code: code, requestId: requestId });
    incrementDaPhat_(prize.id);

    return { ok: true, prizeId: prize.id, prizeName: prize.ten, code: code, at: at };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Chọn giải theo trọng số.
 * Giải FIXED_RATE_PRIZE được ghim đúng FIXED_RATE_PERCENT%; phần còn lại chia
 * theo trọng số của các giải khác. Khi giải ghim đã hết, phần % của nó tự động
 * trả về cho các giải còn lại (vì nó không còn trong `available`).
 */
function pickPrize_(available) {
  var fixed = null;
  var others = [];
  for (var i = 0; i < available.length; i++) {
    if (available[i].id === FIXED_RATE_PRIZE) fixed = available[i];
    else others.push(available[i]);
  }

  var r = Math.random() * 100;

  if (fixed && others.length) {
    if (r < FIXED_RATE_PERCENT) return fixed;
    return pickByWeight_(others);
  }
  // Chỉ còn mỗi giải ghim, hoặc giải ghim đã hết -> bốc trong nhóm còn lại.
  if (fixed && !others.length) return fixed;
  return pickByWeight_(others);
}

function pickByWeight_(list) {
  var total = 0;
  for (var i = 0; i < list.length; i++) total += Math.max(0, list[i].tiLe);
  if (total <= 0) return list[Math.floor(Math.random() * list.length)];

  var r = Math.random() * total;
  var acc = 0;
  for (var j = 0; j < list.length; j++) {
    acc += Math.max(0, list[j].tiLe);
    if (r < acc) return list[j];
  }
  return list[list.length - 1];
}

/** Mã ưu đãi duy nhất: DEVPO-<PREFIX>-<5 ký tự>. Có kiểm tra trùng. */
function generateCode_(prize) {
  var prefix = String(prize.id || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "QUA";
  var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhìn nhầm: I,O,0,1
  for (var attempt = 0; attempt < 20; attempt++) {
    var s = "";
    for (var i = 0; i < 5; i++) s += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    var code = "DEVPO-" + prefix + "-" + s;
    if (!findSpinByCode_(code)) return code;
  }
  // Cực hiếm: thêm timestamp để chắc chắn không trùng.
  return "DEVPO-" + prefix + "-" + String(Date.now()).slice(-6);
}

/* ============================== SHEETS ============================== */

function ss_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/** Cột: STT | Thời gian quay | Họ tên | Số điện thoại | Phần thưởng | Mã ưu đãi | (ẩn) prizeId | requestId */
function getLuotQuaySheet_() {
  var ss = ss_();
  var sheet = ss.getSheetByName(SHEET_LUOT_QUAY);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_LUOT_QUAY);
    sheet.appendRow(["STT", "Thời gian quay", "Họ tên", "Số điện thoại", "Phần thưởng", "Mã ưu đãi", "prize_id", "request_id"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readSpins_() {
  var sheet = getLuotQuaySheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, 8).getValues();
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var r = values[i];
    if (!r[3] && !r[5]) continue;
    out.push({
      row: i + 2,
      at: formatAt_(r[1]),
      name: String(r[2] || ""),
      phone: normalizePhone_(r[3]),
      prizeName: String(r[4] || ""),
      code: String(r[5] || ""),
      prizeId: String(r[6] || ""),
      requestId: String(r[7] || "")
    });
  }
  return out;
}

function findSpinByPhone_(phone) {
  var all = readSpins_();
  for (var i = 0; i < all.length; i++) if (all[i].phone && all[i].phone === phone) return all[i];
  return null;
}

function findSpinByRequestId_(id) {
  if (!id) return null;
  var all = readSpins_();
  for (var i = 0; i < all.length; i++) if (all[i].requestId === id) return all[i];
  return null;
}

function findSpinByCode_(code) {
  var all = readSpins_();
  for (var i = 0; i < all.length; i++) if (all[i].code === code) return all[i];
  return null;
}

function appendSpin_(o) {
  var sheet = getLuotQuaySheet_();
  var stt = Math.max(0, sheet.getLastRow() - 1) + 1;
  sheet.appendRow([stt, o.at, o.name, "'" + o.phone, o.prize.ten, o.code, o.prize.id, o.requestId]);
}

/** Cột: id | tên | loại | tỉ lệ (%) | số lượng | đã phát */
function getPrizeSheet_() {
  var ss = ss_();
  var sheet = ss.getSheetByName(SHEET_GIAI_THUONG);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_GIAI_THUONG);
    sheet.appendRow(["id", "Tên giải", "Loại", "Tỉ lệ (%)", "Số lượng", "Đã phát"]);
    for (var i = 0; i < DEFAULT_PRIZES.length; i++) {
      var p = DEFAULT_PRIZES[i];
      sheet.appendRow([p[0], p[1], p[2], p[3], p[4], 0]);
    }
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readPrizes_() {
  var sheet = getPrizeSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, 6).getValues();
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var r = values[i];
    var id = String(r[0] || "").trim();
    if (!id) continue;
    out.push({
      row: i + 2,
      id: id,
      ten: String(r[1] || "").trim(),
      loai: String(r[2] || "").trim(),
      tiLe: Number(r[3]) || 0,
      soLuong: Number(r[4]) || 0,
      daPhat: Number(r[5]) || 0
    });
  }
  return out;
}

function incrementDaPhat_(prizeId) {
  var sheet = getPrizeSheet_();
  var prizes = readPrizes_();
  for (var i = 0; i < prizes.length; i++) {
    if (prizes[i].id === prizeId) {
      sheet.getRange(prizes[i].row, 6).setValue(prizes[i].daPhat + 1);
      return;
    }
  }
}

/** Config dạng key | value. */
function getConfigSheet_() {
  var ss = ss_();
  var sheet = ss.getSheetByName(SHEET_CONFIG);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_CONFIG);
    sheet.appendRow(["key", "value", "ghi chú"]);
    sheet.appendRow(["enabled", "TRUE", "FALSE = tắt hẳn chương trình"]);
    sheet.appendRow(["startAt", "2026-10-31 15:00", "giờ VN, yyyy-MM-dd HH:mm"]);
    sheet.appendRow(["endAt", "2026-11-01 23:59", "giờ VN"]);
    sheet.appendRow(["token", Utilities.getUuid(), "phải khớp EVENT_WHEEL_TOKEN bên Next.js"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readConfig_() {
  var sheet = getConfigSheet_();
  var last = sheet.getLastRow();
  var map = {};
  if (last >= 2) {
    var values = sheet.getRange(2, 1, last - 1, 2).getValues();
    for (var i = 0; i < values.length; i++) {
      map[String(values[i][0] || "").trim()] = values[i][1];
    }
  }
  return {
    enabled: String(map.enabled).toUpperCase() !== "FALSE",
    startAt: parseVNDate_(map.startAt),
    endAt: parseVNDate_(map.endAt),
    token: String(map.token || "").trim()
  };
}

function checkToken_(token) {
  var cfg = readConfig_();
  if (!cfg.token) return true; // chưa đặt token -> không chặn (giai đoạn thiết lập)
  return String(token || "") === cfg.token;
}

/* ============================== TIỆN ÍCH ============================== */

function parseVNDate_(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  var s = String(v).trim();
  // "yyyy-MM-dd HH:mm" theo giờ VN -> Date
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/);
  if (m) {
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - 7, +m[5]));
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Ô "Thời gian quay" bị Google Sheets tự đổi thành kiểu Ngày, nên khi đọc lại
 * nó là object Date chứ không còn là chuỗi ta đã ghi. String(Date) cho ra
 * "Sat Oct 31 2026 ... (Giờ Đông Dương)" — không thể đưa ra cho khách xem.
 * Hàm này đưa mọi trường hợp về đúng một dạng: dd/MM/yyyy HH:mm:ss giờ VN.
 */
function formatAt_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, "dd/MM/yyyy HH:mm:ss");
  return String(v || "");
}

/** "0909 123 456" / "+84909123456" -> "0909123456". Rỗng nếu không hợp lệ. */
function normalizePhone_(v) {
  var s = String(v || "").replace(/[^\d+]/g, "");
  if (s.indexOf("+84") === 0) s = "0" + s.slice(3);
  else if (s.indexOf("84") === 0 && s.length >= 11) s = "0" + s.slice(2);
  s = s.replace(/\D/g, "");
  if (!/^0(3|5|7|8|9)\d{8}$/.test(s)) return "";
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ============================== KIỂM THỬ ============================== */

/**
 * Chạy tay trong Apps Script Editor để kiểm tra xác suất giải 500K.
 * Không ghi gì vào sheet.
 */
function testTiLe500K() {
  var prizes = readPrizes_().map(function (p) {
    return { id: p.id, ten: p.ten, tiLe: p.tiLe, soLuong: 999999, daPhat: 0 };
  });
  var n = 200000;
  var hit = 0;
  for (var i = 0; i < n; i++) {
    if (pickPrize_(prizes).id === FIXED_RATE_PRIZE) hit++;
  }
  var pct = (hit / n) * 100;
  Logger.log("Giải " + FIXED_RATE_PRIZE + ": " + pct.toFixed(3) + "% (kỳ vọng " + FIXED_RATE_PERCENT + "%)");
}
