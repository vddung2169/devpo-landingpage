"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Info, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatVND } from "@/lib/utils";
import {
  calcHdSaisonMirae,
  calcICloud,
  HD_MIRAE_MIN_DOWN_PAYMENT,
  hdSaisonMiraeTerms,
  ICLOUD_MIN_DOWN_PAYMENT,
  ICLOUD_MONTHLY_RATE,
  icloudTerms,
  TRA_GOP_DISCLAIMER,
} from "@/lib/tra-gop-data";

// Mục "Tính trả góp" ở trang chi tiết từng máy.
// Quy tắc (theo chủ shop):
//   - HD Saison / Mirae Asset: áp dụng cho TẤT CẢ máy.
//   - MDM / iCloud: CHỈ iPhone (ẩn với iPad).
//   - Quẹt thẻ tín dụng: áp dụng cho tất cả máy, biểu phí theo ngân hàng phát hành thẻ.
// Lãi suất / kỳ hạn dùng chung lib/tra-gop-data.ts với công cụ /cong-cu-mua-iphone/tra-gop.

type Method = "hd-mirae" | "mdm-icloud" | "the-tin-dung";

const SHOP_PHONE = "0909097177";
const SHOP_PHONE_LABEL = "0909 097 177";

/** Các mức trả trước cho khách chọn nhanh, bắt đầu từ mức tối thiểu. */
function downPaymentSteps(min: number): number[] {
  const steps: number[] = [];
  for (let p = Math.round(min * 100); p <= 70; p += 10) steps.push(p);
  return steps;
}

/** Làm tròn trả trước lên hàng trăm nghìn cho dễ đọc. */
function roundUp100k(value: number) {
  return Math.ceil(value / 100_000) * 100_000;
}

export function ProductInstallment({
  price,
  isIphone,
  productName,
  zaloLink,
}: {
  /** Giá bán (số), lấy từ priceFrom. 0 = "Liên hệ". */
  price: number;
  /** true với iPhone Lock / Quốc tế, false với iPad. */
  isIphone: boolean;
  productName: string;
  zaloLink: string;
}) {
  const [method, setMethod] = useState<Method>("hd-mirae");

  const tabs: { value: Method; label: string }[] = [
    { value: "hd-mirae", label: "Mirae / HD Saison" },
    ...(isIphone
      ? [{ value: "mdm-icloud" as const, label: "Góp MDM / iCloud" }]
      : []),
    { value: "the-tin-dung", label: "Quẹt thẻ tín dụng" },
  ];

  return (
    <section id="tra-gop" className="mt-section scroll-mt-24">
      <div className="mb-block flex flex-col gap-2">
        <h2 className="text-h2 text-foreground">Tính trả góp</h2>
        <p className="text-body text-muted-foreground">
          Chọn hình thức, mức trả trước và kỳ hạn để xem số tiền góp mỗi tháng
          cho {productName}.
        </p>
      </div>

      <div className="rounded-media bg-surface p-5 sm:p-8">
        <Tabs value={method} onValueChange={(v) => setMethod(v as Method)}>
          <TabsList
            className={cn(
              "grid h-auto w-full gap-1",
              tabs.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2",
            )}
          >
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="cursor-pointer py-2 whitespace-normal"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="hd-mirae" className="mt-6">
            {price > 0 ? (
              <LoanCalculator
                price={price}
                minDown={HD_MIRAE_MIN_DOWN_PAYMENT}
                terms={hdSaisonMiraeTerms.map((t) => t.months)}
                defaultTerm={12}
                calc={calcHdSaisonMirae}
                notes={[
                  "Áp dụng cho tất cả máy tại Dev Pồ.",
                  `Trả trước tối thiểu ${HD_MIRAE_MIN_DOWN_PAYMENT * 100}% giá máy. Góp/tháng theo bảng lãi Mirae Asset / HD Saison (dư nợ giảm dần).`,
                ]}
              />
            ) : (
              <ContactForPrice />
            )}
          </TabsContent>

          {isIphone && (
            <TabsContent value="mdm-icloud" className="mt-6">
              {price > 0 ? (
                <LoanCalculator
                  price={price}
                  minDown={ICLOUD_MIN_DOWN_PAYMENT}
                  terms={icloudTerms}
                  defaultTerm={3}
                  calc={calcICloud}
                  notes={[
                    "Chỉ áp dụng cho iPhone.",
                    `Trả trước tối thiểu ${ICLOUD_MIN_DOWN_PAYMENT * 100}% giá máy. Lãi ${ICLOUD_MONTHLY_RATE * 100}%/tháng trên số tiền góp, kỳ hạn ${icloudTerms[0]}–${icloudTerms[icloudTerms.length - 1]} tháng.`,
                  ]}
                />
              ) : (
                <ContactForPrice />
              )}
            </TabsContent>
          )}

          <TabsContent value="the-tin-dung" className="mt-6">
            <CreditCardInfo price={price} />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-start gap-2 text-caption text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{TRA_GOP_DISCLAIMER}.</span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <a href={zaloLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" aria-hidden="true" />
              Nhắn Zalo làm hồ sơ trả góp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1">
            <a href={`tel:${SHOP_PHONE}`}>
              <Phone className="size-5" aria-hidden="true" />
              Gọi {SHOP_PHONE_LABEL}
            </a>
          </Button>
        </div>
        <p className="mt-3 text-center text-caption text-muted-foreground">
          Muốn tính với số tiền khác?{" "}
          <Link
            href="/cong-cu-mua-iphone/tra-gop"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Mở công cụ tính trả góp
          </Link>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Bộ tính chung cho Mirae/HD và MDM/iCloud                                    */
/* -------------------------------------------------------------------------- */

function LoanCalculator({
  price,
  minDown,
  terms,
  defaultTerm,
  calc,
  notes,
}: {
  price: number;
  minDown: number;
  terms: number[];
  defaultTerm: number;
  calc: (loan: number, months: number) => {
    interest: number;
    total: number;
    monthly: number;
  };
  notes: string[];
}) {
  const steps = downPaymentSteps(minDown);
  const [downPct, setDownPct] = useState(steps[0]);
  const [months, setMonths] = useState(
    terms.includes(defaultTerm) ? defaultTerm : terms[0],
  );

  const downPayment = Math.min(price, roundUp100k((price * downPct) / 100));
  const loan = price - downPayment;
  const result = calc(loan, months);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
      {/* Đầu vào */}
      <div className="flex flex-col gap-6">
        <ChipGroup
          label="Trả trước"
          options={steps.map((p) => ({ value: p, label: `${p}%` }))}
          value={downPct}
          onChange={setDownPct}
        />
        <ChipGroup
          label="Kỳ hạn"
          options={terms.map((m) => ({ value: m, label: `${m} tháng` }))}
          value={months}
          onChange={setMonths}
        />
        <ul className="flex flex-col gap-1.5 text-caption text-muted-foreground">
          {notes.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      </div>

      {/* Kết quả */}
      <div className="flex flex-col gap-4 rounded-xl bg-background p-5 sm:p-6">
        <div>
          <p className="text-caption text-muted-foreground">Góp mỗi tháng</p>
          <p className="text-h1 font-bold text-primary">
            {formatVND(result.monthly)}
          </p>
          <p className="text-caption text-muted-foreground">
            trong {months} tháng
          </p>
        </div>
        <dl className="divide-y divide-border text-body">
          <Row label="Giá máy" value={formatVND(price)} />
          <Row label={`Trả trước (${downPct}%)`} value={formatVND(downPayment)} />
          <Row label="Số tiền góp" value={formatVND(loan)} />
          <Row label="Tiền lãi ước tính" value={formatVND(result.interest)} />
          <Row
            label="Tổng tiền phải trả"
            value={formatVND(downPayment + result.total)}
            strong
          />
        </dl>
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: number; label: string }[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-right font-medium text-foreground",
          strong && "font-bold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quẹt thẻ tín dụng                                                           */
/* -------------------------------------------------------------------------- */

function CreditCardInfo({ price }: { price: number }) {
  const rows = [
    ...(price > 0 ? [{ label: "Giá máy", value: formatVND(price) }] : []),
    { label: "Áp dụng", value: "Tất cả máy tại Dev Pồ" },
    { label: "Biểu phí", value: "Áp dụng theo ngân hàng phát hành thẻ" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-h4 text-foreground">
          <CreditCard className="size-5" aria-hidden="true" />
          Trả góp qua thẻ tín dụng
        </div>
        <p className="text-body text-muted-foreground">
          Quẹt thẻ tín dụng tại cửa hàng rồi chuyển đổi trả góp theo chương
          trình của ngân hàng phát hành thẻ.
        </p>
      </div>
      <dl className="divide-y divide-border rounded-xl bg-background px-5 text-body">
        {rows.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} />
        ))}
      </dl>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ContactForPrice() {
  return (
    <p className="rounded-xl bg-background p-5 text-body text-muted-foreground">
      Máy này đang báo giá theo từng lúc. Nhắn Zalo để Dev Pồ báo giá và tính
      góp chính xác cho bạn.
    </p>
  );
}
