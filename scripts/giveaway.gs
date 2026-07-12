/**
 * Backend Giveaway cho devpo.vn — Google Apps Script Web App.
 * Đọc/ghi Google Sheet, trả JSON đúng hợp đồng mà web (app/api/give-away) đang gọi.
 *
 * CÁCH DÙNG: xem scripts/GIVEAWAY-SETUP.md
 *
 * Cấu trúc Sheet:
 *  - Tab "DangKy" (hoặc tab đầu tiên): A=Thời gian | B=Số vé | C=Họ tên | D=Số điện thoại
 *  - Tab "Config" (key–value, 2 cột A|B): id, title, prize, openAt, closeAt, drawAt, endAt, winnerTicket
 *  - Tab "History" (tùy chọn): A=id B=title C=prize D=endAt E=totalEntries F=winnerName G=winnerPhone
 *
 * Mã quản trị (quay thưởng) lưu ở Script Properties key "ADMIN_KEY" — KHÔNG để trong Sheet/code.
 */

var TZ = "GMT+7";
var ENTRIES_NAMES = ["DangKy", "Đăng ký", "Registrations"];
var CONFIG_NAME = "Config";
var HISTORY_NAME = "History";

/* ============================== ENTRY POINTS ============================== */

function doGet(e) {
  try {
    var phone = e && e.parameter ? e.parameter.phone : null;
    return json_(buildState_(phone));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = e && e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(body || "{}");
    if (data.action === "draw") return json_(handleDraw_(data));
    return json_(handleRegister_(data));
  } catch (err) {
    return json_({ ok: false, error: "Dữ liệu gửi lên không hợp lệ." });
  }
}

/* ================================ READ (GET) ============================= */

function buildState_(phone) {
  var cfg = readConfig_();
  var entries = readEntries_();
  var now = new Date();

  var active = null;
  if (cfg.id && (!cfg.endAt || now <= cfg.endAt)) {
    var winner = null;
    var status;
    if (cfg.openAt && now < cfg.openAt) {
      status = "upcoming";
    } else if (cfg.winnerTicket) {
      status = "announced";
      var w = findEntryByTicket_(entries, cfg.winnerTicket);
      if (w) winner = { name: w.name, phone: maskPhone_(w.phone) };
    } else if (cfg.closeAt && now >= cfg.closeAt) {
      status = "closed";
    } else {
      status = "open";
    }
    active = {
      id: cfg.id,
      title: cfg.title,
      prize: cfg.prize,
      openAt: iso_(cfg.openAt),
      closeAt: iso_(cfg.closeAt),
      drawAt: iso_(cfg.drawAt),
      endAt: iso_(cfg.endAt),
      status: status,
      totalEntries: entries.length,
      winner: winner,
    };
  }

  var myTicket = null;
  if (phone) {
    var mine = findEntryByPhone_(entries, normalizePhone_(phone));
    if (mine) {
      myTicket = {
        ticket: mine.ticket,
        name: mine.name,
        phone: mine.phone, // vé của chính khách -> trả số đầy đủ
        giveawayId: cfg.id,
      };
    }
  }

  return {
    ok: true,
    serverTime: iso_(new Date()),
    active: active,
    history: readHistory_(),
    myTicket: myTicket,
  };
}

/* ============================= ĐĂNG KÝ (POST) =========================== */

function handleRegister_(data) {
  var name = String(data.name || "").trim();
  var phone = normalizePhone_(data.phone || "");

  if (name.length < 2) return { ok: false, error: "Vui lòng nhập họ tên." };
  if (!/^0\d{9}$/.test(phone))
    return { ok: false, error: "Số điện thoại chưa đúng." };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // tránh 2 người đăng ký cùng lúc trùng số vé
  try {
    var cfg = readConfig_();
    var now = new Date();

    if (!cfg.id) return { ok: false, error: "Hiện chưa có giveaway nào." };
    if (cfg.openAt && now < cfg.openAt)
      return { ok: false, error: "Chưa tới giờ mở đăng ký.", status: "upcoming" };
    if (cfg.closeAt && now >= cfg.closeAt)
      return { ok: false, error: "Đã hết hạn đăng ký.", status: "closed" };

    var sheet = getEntriesSheet_();
    var entries = readEntries_();

    var dup = findEntryByPhone_(entries, phone);
    if (dup) {
      return {
        ok: false,
        error: "Số điện thoại này đã đăng ký rồi.",
        existing: { ticket: dup.ticket, name: dup.name, phone: maskPhone_(dup.phone) },
      };
    }

    var seq = pad_(entries.length + 1, 4);
    var ticket = cfg.id + "-" + seq;
    // Cột: Thời gian | Số vé | Họ tên | Số điện thoại
    // Đặt SĐT dạng text (thêm dấu ') để Sheet không cắt số 0 ở đầu.
    sheet.appendRow([now, ticket, name, "'" + phone]);

    return { ok: true, entry: { ticket: ticket, name: name, phone: phone } };
  } finally {
    lock.releaseLock();
  }
}

/* ============================ QUAY THƯỞNG (POST) ======================== */

function handleDraw_(data) {
  var adminKey = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  if (!adminKey) return { ok: false, error: "Server chưa cấu hình ADMIN_KEY." };
  if (String(data.key || "") !== adminKey)
    return { ok: false, error: "Sai mã quản trị." };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var cfg = readConfig_();
    if (!cfg.id) return { ok: false, error: "Không có giveaway để quay." };
    if (cfg.winnerTicket) {
      var already = findEntryByTicket_(readEntries_(), cfg.winnerTicket);
      return {
        ok: true,
        giveawayId: cfg.id,
        winner: already
          ? { name: already.name, phone: maskPhone_(already.phone), ticket: already.ticket }
          : null,
      };
    }

    var entries = readEntries_();
    if (!entries.length) return { ok: false, error: "Chưa có ai tham gia." };

    var pick = entries[Math.floor(Math.random() * entries.length)];
    setConfigValue_("winnerTicket", pick.ticket);

    return {
      ok: true,
      giveawayId: cfg.id,
      winner: { name: pick.name, phone: maskPhone_(pick.phone), ticket: pick.ticket },
    };
  } finally {
    lock.releaseLock();
  }
}

/* ================================ SHEETS ================================ */

function getEntriesSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i = 0; i < ENTRIES_NAMES.length; i++) {
    var s = ss.getSheetByName(ENTRIES_NAMES[i]);
    if (s) return s;
  }
  return ss.getSheets()[0]; // fallback: tab đầu tiên
}

/** Đọc toàn bộ vé đã đăng ký (bỏ hàng tiêu đề). */
function readEntries_() {
  var sheet = getEntriesSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var rows = sheet.getRange(2, 1, last - 1, 4).getValues();
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var ticket = String(r[1] || "").trim();
    var phone = normalizePhone_(r[3]);
    if (!ticket && !phone) continue;
    out.push({ time: r[0], ticket: ticket, name: String(r[2] || "").trim(), phone: phone });
  }
  return out;
}

/** Config dạng key–value (cột A = key, cột B = value). */
function readConfig_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_NAME);
  var cfg = { id: "", title: "", prize: "", openAt: null, closeAt: null, drawAt: null, endAt: null, winnerTicket: "" };
  if (!sheet) return cfg;
  var last = sheet.getLastRow();
  if (last < 1) return cfg;
  var rows = sheet.getRange(1, 1, last, 2).getValues();
  for (var i = 0; i < rows.length; i++) {
    var key = String(rows[i][0] || "").trim();
    var val = rows[i][1];
    if (!key) continue;
    if (key === "openAt" || key === "closeAt" || key === "drawAt" || key === "endAt") {
      cfg[key] = parseDate_(val);
    } else {
      cfg[key] = String(val == null ? "" : val).trim();
    }
  }
  return cfg;
}

function setConfigValue_(key, value) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_NAME);
  if (!sheet) return;
  var last = sheet.getLastRow();
  var rows = last >= 1 ? sheet.getRange(1, 1, last, 1).getValues() : [];
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || "").trim() === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]); // chưa có -> thêm mới
}

/** Lịch sử các đợt đã kết thúc (tùy chọn). Mới nhất lên đầu. */
function readHistory_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(HISTORY_NAME);
  if (!sheet) return [];
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var rows = sheet.getRange(2, 1, last - 1, 7).getValues();
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    out.push({
      id: String(r[0]).trim(),
      title: String(r[1] || "").trim(),
      prize: String(r[2] || "").trim(),
      endAt: iso_(parseDate_(r[3])),
      status: "ended",
      totalEntries: Number(r[4]) || 0,
      winner: r[5] ? { name: String(r[5]).trim(), phone: maskPhone_(r[6]) } : null,
    });
  }
  return out.reverse(); // mới nhất lên đầu
}

/* ================================ HELPERS =============================== */

function findEntryByPhone_(entries, phone) {
  for (var i = 0; i < entries.length; i++) if (entries[i].phone === phone) return entries[i];
  return null;
}

function findEntryByTicket_(entries, ticket) {
  for (var i = 0; i < entries.length; i++) if (entries[i].ticket === ticket) return entries[i];
  return null;
}

function normalizePhone_(v) {
  return String(v == null ? "" : v).replace(/[^0-9]/g, "");
}

function maskPhone_(v) {
  var p = normalizePhone_(v);
  if (p.length < 7) return p;
  return p.substring(0, 3) + "****" + p.substring(p.length - 3);
}

function pad_(n, len) {
  var s = String(n);
  while (s.length < len) s = "0" + s;
  return s;
}

function parseDate_(v) {
  if (v instanceof Date) return v;
  if (!v) return null;
  var s = String(v).trim().replace(" ", "T");
  if (s.indexOf("+") < 0 && s.indexOf("Z") < 0) s += "+07:00";
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function iso_(date) {
  if (!date) return null;
  return Utilities.formatDate(date, TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
