"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Info,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVND } from "@/lib/utils";
import {
  calcHdSaisonMirae,
  calcICloud,
  HD_MIRAE_MIN_DOWN_PAYMENT,
  hdSaisonMiraeRates,
  ICLOUD_MIN_DOWN_PAYMENT,
  icloudTerms,
  TRA_GOP_DISCLAIMER,
  type TraGopResult,
} from "@/lib/tra-gop-data";

/* -------------------------------------------------------------------------- */
/* Cấu hình 2 hình thức có tính toán được cho nhân viên báo khách             */
/* -------------------------------------------------------------------------- */

type InternalMethod = "hd-mirae" | "icloud";

interface MethodConfig {
  label: string;
  minDown: number;
  /** Danh sách kỳ hạn hiển thị + hàm tính cho từng kỳ hạn. */
  terms: number[];
  calc: (loan: number, months: number) => TraGopResult;
  /** Nhãn phụ mô tả cách tính lãi. */
  note: string;
}

const METHODS: Record<InternalMethod, MethodConfig> = {
  "hd-mirae": {
    label: "HD Saison / Mirae Asset",
    minDown: HD_MIRAE_MIN_DOWN_PAYMENT,
    terms: hdSaisonMiraeRates.map((r) => r.months),
    calc: calcHdSaisonMirae,
    note: "Lãi tính một lần trên tổng khoản vay theo kỳ hạn.",
  },
  icloud: {
    label: "Trả góp qua iCloud",
    minDown: ICLOUD_MIN_DOWN_PAYMENT,
    terms: icloudTerms,
    calc: calcICloud,
    note: "Lãi 8%/tháng trên nợ gốc × số tháng.",
  },
};

const MAX_PRICE = 100_000_000;

const clampMoney = (value: number, max = MAX_PRICE) =>
  Math.min(max, Math.max(0, Math.round(value || 0)));

/** Parse chuỗi có dấu phân cách nhóm ("25.000.000") -> số nguyên. */
const parseDigits = (raw: string) => Number(raw.replace(/\D/g, "")) || 0;

export function TraGopBaoKhach() {
  const [price, setPrice] = useState(25_000_000);
  const [down, setDown] = useState(5_000_000);
  const [method, setMethod] = useState<InternalMethod>("hd-mirae");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const config = METHODS[method];
  const loan = Math.max(0, price - down);
  const minDownAmount = Math.round(price * config.minDown);
  const downRatio = price > 0 ? down / price : 0;
  const belowMinDown = price > 0 && down < minDownAmount;

  // Tính sẵn kết quả cho từng kỳ hạn của hình thức đang chọn
  const rows = useMemo(
    () =>
      config.terms.map((months) => ({
        months,
        ...config.calc(loan, months),
      })),
    [config, loan],
  );

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((k) => (k === key ? null : k)),
        1600,
      );
    } catch {
      /* Trình duyệt chặn clipboard — bỏ qua, nhân viên có thể copy thủ công. */
    }
  };

  /** Tin nhắn báo khách cho MỘT kỳ hạn cụ thể. */
  const messageForTerm = (months: number, r: TraGopResult) =>
    [
      `📱 BÁO GIÁ TRẢ GÓP — ${config.label}`,
      `• Giá máy: ${formatVND(price)}`,
      `• Trả trước: ${formatVND(down)} (${Math.round(downRatio * 100)}%)`,
      `• Khoản trả góp: ${formatVND(loan)}`,
      `• Kỳ hạn: ${months} tháng`,
      `➡️ Góp mỗi tháng: ${formatVND(r.monthly)}`,
      `➡️ Tổng góp (gồm lãi): ${formatVND(r.total)}`,
      ``,
      `*${TRA_GOP_DISCLAIMER}`,
    ].join("\n");

  /** Tin nhắn báo khách gồm TẤT CẢ kỳ hạn của hình thức đang chọn. */
  const messageAllTerms = [
    `📱 BÁO GIÁ TRẢ GÓP — ${config.label}`,
    `• Giá máy: ${formatVND(price)}`,
    `• Trả trước: ${formatVND(down)} (${Math.round(downRatio * 100)}%)`,
    `• Khoản trả góp: ${formatVND(loan)}`,
    ``,
    ...rows.map(
      (r) =>
        `▪️ ${r.months} tháng: góp ${formatVND(r.monthly)}/tháng · tổng ${formatVND(
          r.total,
        )}`,
    ),
    ``,
    `*${TRA_GOP_DISCLAIMER}`,
  ].join("\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-8">
      {/* ------------------------------------------------------------------ */}
      {/* Cột trái: đầu vào                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        {/* Số tiền máy */}
        <MoneyField
          label="Số tiền máy"
          icon={Smartphone}
          value={price}
          onChange={(v) => {
            const next = clampMoney(v);
            setPrice(next);
            if (down > next) setDown(next);
          }}
        />

        {/* Tiền trả trước */}
        <div>
          <MoneyField
            label="Tiền trả trước"
            icon={Wallet}
            value={down}
            onChange={(v) => setDown(clampMoney(v, price))}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[0.2, 0.3, 0.5].map((pct) => (
              <Button
                key={pct}
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-xs"
                onClick={() => setDown(clampMoney(Math.round(price * pct), price))}
              >
                {Math.round(pct * 100)}%
              </Button>
            ))}
            <span className="ml-auto self-center text-xs text-muted-foreground">
              {price > 0 ? `${Math.round(downRatio * 100)}% giá máy` : "—"}
            </span>
          </div>
        </div>

        {/* Loại trả góp */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Loại trả góp
          </label>
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as InternalMethod)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(METHODS) as InternalMethod[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {METHODS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Khoản trả góp (tính ra) */}
        <div className="rounded-xl bg-secondary p-4">
          <div className="text-xs text-muted-foreground">
            Khoản trả góp (máy − trả trước)
          </div>
          <div className="mt-1 text-2xl font-bold text-foreground">
            {formatVND(loan)}
          </div>
        </div>

        {/* Cảnh báo trả trước tối thiểu */}
        {belowMinDown && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {config.label} yêu cầu trả trước tối thiểu{" "}
              <strong>{Math.round(config.minDown * 100)}%</strong> — tức{" "}
              <strong>{formatVND(minDownAmount)}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Cột phải: bảng kết quả + báo khách                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{config.label}</Badge>
            <span className="text-sm text-muted-foreground">{config.note}</span>
          </div>

          {/* Bảng cho màn hình ≥ sm */}
          <div className="hidden overflow-x-auto sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Kỳ hạn</TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Góp/tháng
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Tiền lãi
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Tổng góp
                  </TableHead>
                  <TableHead className="text-right">Báo khách</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const key = `${method}-${r.months}`;
                  return (
                    <TableRow key={r.months}>
                      <TableCell className="font-semibold text-foreground">
                        {r.months} tháng
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {formatVND(r.monthly)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatVND(r.interest)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatVND(r.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => copy(messageForTerm(r.months, r), key)}
                          aria-label={`Copy báo giá ${r.months} tháng`}
                        >
                          {copiedKey === key ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Danh sách thẻ cho mobile */}
          <div className="grid gap-3 sm:hidden">
            {rows.map((r) => {
              const key = `${method}-${r.months}`;
              return (
                <div
                  key={r.months}
                  className="rounded-xl border border-border bg-secondary/40 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      Kỳ hạn {r.months} tháng
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 px-2.5"
                      onClick={() => copy(messageForTerm(r.months, r), key)}
                      aria-label={`Copy báo giá ${r.months} tháng`}
                    >
                      {copiedKey === key ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          Đã copy
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Báo khách
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Góp/tháng</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatVND(r.monthly)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">Tiền lãi</span>
                    <span className="font-medium text-foreground">
                      {formatVND(r.interest)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">Tổng góp</span>
                    <span className="font-medium text-foreground">
                      {formatVND(r.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            * &quot;Tổng góp&quot; là tổng các kỳ trả góp (khoản vay + lãi), chưa gồm
            tiền trả trước.
          </p>
        </div>

        {/* Nút copy toàn bộ báo giá */}
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Copy nguyên bảng báo giá (đủ mọi kỳ hạn) để gửi khách qua Zalo.
            </span>
          </div>
          <Button
            type="button"
            size="lg"
            className="h-11 shrink-0 font-semibold"
            onClick={() => copy(messageAllTerms, "all")}
          >
            {copiedKey === "all" ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Đã copy!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Copy tin nhắn báo khách
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ô nhập tiền dùng chung (có định dạng nhóm nghìn)                            */
/* -------------------------------------------------------------------------- */

function MoneyField({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          inputMode="numeric"
          className="h-11 pl-9 font-semibold"
          value={value ? value.toLocaleString("vi-VN") : ""}
          placeholder="0"
          onChange={(e) => onChange(parseDigits(e.target.value))}
          aria-label={label}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          đ
        </span>
      </div>
    </div>
  );
}
