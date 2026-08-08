"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  Lock,
  Save,
  Search,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

/**
 * Dịch vụ check CỐ ĐỊNH — chỉ để hiển thị. Server tự quyết định dịch vụ thật
 * qua IUNLOCK_SERVICE_ID, client không gửi và không chọn được.
 */
const SERVICE_LABEL = "Model · Nhà mạng · SIM Lock · Ngày kích hoạt";
const SERVICE_TIME = "vài giây";

/** `tone` do chính upstream gán qua màu chữ trong HTML kết quả. */
type ResultLine = { label: string; value: string; tone?: "good" | "bad" };

/**
 * Trạng thái lượt check của thiết bị, do máy chủ quyết định.
 *  idle — chưa dùng lượt nào
 *  done — đã tra xong, có kết quả
 *  used — đã dùng lượt nhưng kết quả không còn (cookie không chứa nổi)
 */
type Snapshot = {
  state: "idle" | "done" | "used";
  /** IMEI hoặc Serial đã tra. */
  input?: string;
  serviceId?: string;
  /** Mã đơn bên iUnlock — gửi cho bên hỗ trợ khi cần đối chiếu. */
  orderId?: string;
  resetAt?: number;
  result?: ResultLine[];
};

/** Một kết quả đã lưu trên thiết bị, khoá theo IMEI/Serial. */
type CacheEntry = {
  input: string;
  serviceId?: string;
  orderId?: string;
  result: ResultLine[];
  savedAt: number;
};

type CacheMap = Record<string, CacheEntry>;

const CACHE_KEY = "devpo:check-imei:v3";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/* Bộ nhớ kết quả trên thiết bị                                                */
/* -------------------------------------------------------------------------- */

/**
 * Kết quả check được giữ 24h ngay trên máy người dùng, khoá theo IMEI/Serial.
 * Nhập lại đúng giá trị đã check thì lấy từ đây, không gọi API và không tốn lượt.
 *
 * Đây chỉ là bộ đệm tiện lợi, KHÔNG phải hàng rào hạn mức — hạn mức nằm ở
 * cookie đã ký phía máy chủ (xem lib/imei-quota.ts).
 */
function readCache(): CacheMap {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheMap;
    if (!parsed || typeof parsed !== "object") return {};

    // Dọn các mục đã quá 24h ngay khi đọc.
    const now = Date.now();
    const fresh: CacheMap = {};
    for (const [key, entry] of Object.entries(parsed)) {
      if (entry?.savedAt && now - entry.savedAt < CACHE_TTL_MS) {
        fresh[key] = entry;
      }
    }
    return fresh;
  } catch {
    return {};
  }
}

function writeCache(map: CacheMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    // Chế độ ẩn danh hoặc hết dung lượng: bỏ qua, chỉ mất tiện lợi.
  }
}

/** Mục được lưu gần nhất — dùng để hiện lại ngay khi mở trang. */
function latestEntry(map: CacheMap): CacheEntry | undefined {
  return Object.values(map).sort((a, b) => b.savedAt - a.savedAt)[0];
}

/* -------------------------------------------------------------------------- */
/* Kiểm tra đầu vào (bản rút gọn của lib/iunlock.ts, chạy phía client)          */
/* -------------------------------------------------------------------------- */

function luhnOk(imei: string): boolean {
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = Number(imei[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Trả về giá trị đã chuẩn hoá để gửi lên server, hoặc null nếu chưa hợp lệ. */
function normalize(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!/[A-Za-z]/.test(trimmed)) {
    const digits = trimmed.replace(/\D/g, "");
    return digits.length === 15 && luhnOk(digits) ? digits : null;
  }

  const serial = trimmed.replace(/[\s-]/g, "").toUpperCase();
  return /^[A-Z0-9]{8,12}$/.test(serial) && /[A-Z]/.test(serial) ? serial : null;
}

/* -------------------------------------------------------------------------- */

const formatClock = (ms: number) =>
  new Date(ms).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const TONE_GOOD = "text-green-600 dark:text-green-500";
const TONE_BAD = "text-red-600 dark:text-red-500";

/**
 * Tô màu ngữ nghĩa cho giá trị kết quả: tin tốt xanh lá, tin xấu đỏ.
 *
 * Ưu tiên `tone` mà upstream đã gán sẵn (họ tự bọc `<span style='color:red'>`
 * quanh giá trị xấu); chỉ đoán theo từ khoá khi họ không gán, và chỉ với những
 * trường đã biết rõ nghĩa.
 */
function valueTone(line: ResultLine): string {
  if (line.tone) return line.tone === "good" ? TONE_GOOD : TONE_BAD;

  const { label, value } = line;
  const l = label.toLowerCase();
  const v = value.trim().toLowerCase();

  // SIM Lock: Unlocked (quốc tế) là tốt, Locked là xấu. Xét "unlock" trước
  // vì "unlocked" cũng chứa chuỗi "lock".
  if (l.includes("sim lock") || l.includes("simlock") || l.includes("sim-lock")) {
    if (v.includes("unlock")) return TONE_GOOD;
    if (v.includes("lock")) return TONE_BAD;
  }

  // Nhà mạng: "Unlock"/"Unlocked" là máy quốc tế.
  if (l.includes("carrier")) {
    if (v.includes("unlock")) return TONE_GOOD;
    if (v.includes("locked policy") || v.includes("locked")) return TONE_BAD;
  }

  // Find My iPhone / iCloud Lock: OFF là tốt, ON là xấu.
  if (l.includes("find my") || l.includes("fmi") || l.includes("icloud lock")) {
    if (v === "off") return TONE_GOOD;
    if (v === "on") return TONE_BAD;
  }

  // iCloud Status: CLEAN tốt, LOST (báo mất) xấu.
  if (l.includes("icloud status")) {
    if (v.includes("clean")) return TONE_GOOD;
    if (v.includes("lost")) return TONE_BAD;
  }

  // Blacklist: Clean là tốt, Blocked/Blacklisted là xấu.
  if (l.includes("blacklist")) {
    if (v.includes("clean")) return TONE_GOOD;
    if (v.includes("block") || v.includes("lost")) return TONE_BAD;
  }

  return "";
}

/** "5 giờ 12 phút" — đếm ngược tới lúc được check tiếp. */
function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 60000));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 1) return `${minutes} phút`;
  return "dưới 1 phút";
}

export function CheckImeiForm() {
  const [query, setQuery] = useState("");

  const [cache, setCache] = useState<CacheMap>({});
  const [snapshot, setSnapshot] = useState<Snapshot>({ state: "idle" });
  const [restoring, setRestoring] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  /** Lưu kết quả vào bộ đệm thiết bị. */
  const remember = useCallback((next: Snapshot) => {
    if (!next.input || !next.result?.length) return;
    const key = next.input;
    setCache((current) => {
      const updated: CacheMap = {
        ...current,
        [key]: {
          input: key,
          serviceId: next.serviceId,
          orderId: next.orderId,
          result: next.result!,
          savedAt: Date.now(),
        },
      };
      writeCache(updated);
      return updated;
    });
  }, []);

  const apply = useCallback(
    (next: Snapshot) => {
      setSnapshot(next);
      setNow(Date.now());
      if (next.state === "done") remember(next);
    },
    [remember],
  );

  // Nạp bộ đệm thiết bị trước tiên — có gì hiện ngay, không chờ mạng.
  useEffect(() => {
    const map = readCache();
    setCache(map);
    writeCache(map); // ghi lại bản đã dọn hạn

    const last = latestEntry(map);
    if (last) {
      setQuery(last.input);
      setSnapshot({
        state: "done",
        input: last.input,
        serviceId: last.serviceId,
        orderId: last.orderId,
        result: last.result,
      });
    }
  }, []);

  // Đối chiếu hạn mức với máy chủ: cookie mới là nguồn sự thật, và nó cũng giữ
  // kết quả lần trước phòng khi người dùng đổi máy/xoá localStorage.
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/check-imei?action=status", {
          signal: ac.signal,
          cache: "no-store",
        });
        const data = (await res.json()) as Snapshot & { ok: boolean };
        if (!data.ok || data.state === "idle") return;

        apply(data);
        if (data.input) setQuery(data.input);
      } catch {
        // Mất mạng lúc khôi phục: giữ nguyên bộ đệm đang hiện.
      } finally {
        setRestoring(false);
      }
    })();
    return () => ac.abort();
  }, [apply]);

  // Nhịp 30s để đồng hồ đếm ngược tự cập nhật.
  useEffect(() => {
    if (!snapshot.resetAt) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [snapshot.resetAt]);

  const normalized = normalize(query);
  const digits = query.replace(/\D/g, "");
  const looksLikeSerial = /[A-Za-z]/.test(query.trim());

  /** Giá trị đang nhập đã có kết quả lưu sẵn -> khỏi gọi API. */
  const cached = normalized ? cache[normalized] : undefined;

  const quotaUsed = snapshot.state === "done" || snapshot.state === "used";
  const remainingMs = snapshot.resetAt ? snapshot.resetAt - now : 0;
  const canSubmit = !cached && !quotaUsed && !restoring && !submitting && !!normalized;

  async function submit() {
    // Đã có trong bộ đệm thì không gọi API, không tốn lượt.
    if (!normalized || cached) return;

    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/check-imei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Chỉ gửi IMEI/Serial — dịch vụ do máy chủ cố định, client không chọn được.
        body: JSON.stringify({ imei: normalized }),
      });
      const data = (await res.json()) as Snapshot & {
        ok: boolean;
        error?: string;
      };

      if (data.state) apply(data);
      if (!data.ok && data.error) setFormError(data.error);
    } catch {
      setFormError("Không gửi được yêu cầu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Desktop: form trái, kết quả phải — cả trang nằm gọn trong một màn hình,
    // hai cột kéo giãn bằng nhau (mặc định của grid là stretch).
    // Mobile: xếp chồng như cũ.
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-6">
      <Card className="gap-4 py-5 lg:h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="h-4 w-4" /> Nhập thông tin
          </CardTitle>
          <CardDescription>
            Bấm *#06# trên máy để lấy IMEI. Miễn phí 1 lần / 24 giờ — kết quả
            được lưu 24 giờ, xem lại không tốn lượt.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cột trái hẹp nên các ô nhập xếp dọc, không chia đôi. */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="imei">IMEI (15 số) hoặc Serial</Label>
                <span
                  className={`text-xs tabular-nums ${
                    normalized
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {looksLikeSerial ? "Serial" : `${digits.length}/15`}
                </span>
              </div>
              {/* Luôn cho sửa, kể cả khi đã hết lượt: người dùng cần nhập lại
                  IMEI cũ để lấy kết quả đã lưu. */}
              <Input
                id="imei"
                autoComplete="off"
                autoCapitalize="characters"
                placeholder="356789012345678"
                value={query}
                maxLength={19}
                className="font-mono tracking-wider"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) submit();
                }}
              />
            </div>

            {/* Dịch vụ cố định — chỉ hiển thị, không cho chọn. */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Dịch vụ</span>
              <span className="font-medium text-foreground">
                {SERVICE_LABEL}
              </span>
              <span className="w-full text-xs text-muted-foreground">
                ⏱ Kết quả sau {SERVICE_TIME}
              </span>
            </div>
          </div>

          {formError && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {cached ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
              <Save className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Đã kiểm tra lúc {formatClock(cached.savedAt)}. Kết quả lưu sẵn
                bên dưới, xem lại không tốn lượt.
              </span>
            </div>
          ) : quotaUsed ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Bạn đã dùng lượt kiểm tra miễn phí.{" "}
                {remainingMs > 0
                  ? `Có thể kiểm tra máy khác sau ${formatRemaining(remainingMs)}.`
                  : restoring
                    ? "Đang cập nhật hạn mức…"
                    : "Tải lại trang để kiểm tra tiếp."}
              </span>
            </div>
          ) : (
            <Button
              className="w-full sm:w-auto"
              disabled={!canSubmit}
              onClick={() => submit()}
            >
              {submitting ? (
                <>
                  <Spinner /> Đang tra cứu…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" /> Kiểm tra IMEI
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Cột phải: ưu tiên kết quả đã lưu khớp giá trị đang nhập. */}
      <div className="min-w-0 lg:h-full">
        {cached ? (
          <ResultCard
            input={cached.input}
            orderId={cached.orderId}
            result={cached.result}
            savedAt={cached.savedAt}
          />
        ) : submitting ? (
          <PendingCard />
        ) : snapshot.state === "done" && snapshot.result?.length ? (
          <ResultCard
            input={snapshot.input}
            orderId={snapshot.orderId}
            result={snapshot.result}
          />
        ) : (
          // Chỗ đứng của kết quả trên desktop, giữ bố cục 2 cột không bị lệch.
          // Mobile ẩn đi cho gọn.
          <div className="hidden min-h-56 items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground lg:flex lg:h-full">
            {snapshot.state === "used"
              ? "Lượt kiểm tra đã dùng nhưng kết quả không còn lưu trên thiết bị này."
              : "Kết quả tra cứu sẽ hiện ở đây"}
          </div>
        )}
      </div>
    </div>
  );
}

function PendingCard() {
  return (
    <Card className="gap-4 py-5 lg:h-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
          <Spinner /> Đang tra cứu
        </CardTitle>
        <CardDescription>
          Máy chủ đang lấy thông tin từ Apple. Thường mất vài giây — vui lòng
          không đóng tab.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function ResultCard({
  input,
  orderId,
  result,
  savedAt,
}: {
  input?: string;
  orderId?: string;
  result: ResultLine[];
  savedAt?: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        result
          .map((l) => (l.label ? `${l.label}: ${l.value}` : l.value))
          .join("\n"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt chặn clipboard: bỏ qua.
    }
  }

  return (
    <Card className="gap-4 py-5 lg:h-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
          Kết quả
          <Badge className="border-transparent bg-green-600 text-white">
            Thành công
          </Badge>
        </CardTitle>
        {input && (
          <CardDescription className="flex flex-wrap gap-x-3 gap-y-0.5">
            <span className="font-mono">{input}</span>
            {orderId && <span>Mã đơn {orderId}</span>}
            {savedAt && <span>Đã lưu lúc {formatClock(savedAt)}</span>}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {result.map((line, i) =>
            line.label ? (
              // Nhãn trái, giá trị phải: hai đầu bám mép nên hàng nào cũng
              // cân, không còn khoảng trống lớn ở giữa như bố cục cột cố định.
              <div
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 px-4 py-2.5 text-sm even:bg-secondary/30"
              >
                <dt className="shrink-0 text-muted-foreground">{line.label}</dt>
                <dd
                  className={`min-w-0 text-right font-medium break-all ${
                    valueTone(line) || "text-foreground"
                  } ${/^[\d\s-]+$/.test(line.value) ? "font-mono" : ""}`}
                >
                  {line.value}
                </dd>
              </div>
            ) : (
              <div
                key={i}
                className="px-4 py-2.5 text-sm text-foreground even:bg-secondary/30"
              >
                <dd>{line.value}</dd>
              </div>
            ),
          )}
        </dl>

        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={copy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" /> Đã sao chép
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Sao chép kết quả
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
