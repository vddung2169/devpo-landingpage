"use client";

import { useMemo, useState } from "react";
import { Info, MessageCircle, Percent, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatVND } from "@/lib/utils";
import { ZALO_LINK } from "@/data/products";
import {
  bankCreditCardOptions,
  calcHdSaisonMirae,
  calcICloud,
  DEFAULT_LOAN_AMOUNT,
  hdSaisonMiraeRates,
  icloudTerms,
  TRA_GOP_DISCLAIMER,
  type TraGopMethod,
} from "@/lib/tra-gop-data";

// Giới hạn slider số tiền cần trả góp
const MIN_LOAN = 2_000_000;
const MAX_LOAN = 40_000_000;
const STEP_LOAN = 500_000;

export function TraGopSection() {
  const [method, setMethod] = useState<TraGopMethod>("hd-mirae");
  const [loanAmount, setLoanAmount] = useState(DEFAULT_LOAN_AMOUNT);

  // Kỳ hạn được lưu riêng theo từng hình thức có tính toán
  const [hdMonths, setHdMonths] = useState<string>("12");
  const [icloudMonths, setIcloudMonths] = useState<string>("3");

  const clampLoan = (value: number) =>
    Math.min(MAX_LOAN, Math.max(MIN_LOAN, Math.round(value)));

  return (
    <section id="tra-gop" className="scroll-mt-24">
      {/* Disclaimer chung */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{TRA_GOP_DISCLAIMER}</span>
      </div>

      <div className="mt-6">
        <Tabs value={method} onValueChange={(v) => setMethod(v as TraGopMethod)}>
          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
            <TabsTrigger value="hd-mirae" className="cursor-pointer py-2">
              HD Saison / Mirae Asset
            </TabsTrigger>
            <TabsTrigger value="icloud" className="cursor-pointer py-2">
              Qua iCloud
            </TabsTrigger>
            <TabsTrigger value="the-tin-dung" className="cursor-pointer py-2">
              Thẻ tín dụng
            </TabsTrigger>
          </TabsList>

          {/* --- Hình thức 1 & 2 dùng chung khung nhập số tiền --- */}
          <TabsContent value="hd-mirae" className="mt-6">
            <CalculatorCard
              loanAmount={loanAmount}
              onLoanChange={(v) => setLoanAmount(clampLoan(v))}
              clampLoan={clampLoan}
            >
              <TermSelect
                label="Kỳ hạn"
                value={hdMonths}
                onChange={setHdMonths}
                options={hdSaisonMiraeRates.map((r) => ({
                  value: String(r.months),
                  label: `${r.months} tháng · lãi ${(r.rate * 100).toLocaleString("vi-VN")}%`,
                }))}
              />
              <ResultPanel
                note={`Lãi tính một lần trên tổng khoản vay theo kỳ hạn ${hdMonths} tháng.`}
                result={calcHdSaisonMirae(loanAmount, Number(hdMonths))}
              />
            </CalculatorCard>
          </TabsContent>

          <TabsContent value="icloud" className="mt-6">
            <CalculatorCard
              loanAmount={loanAmount}
              onLoanChange={(v) => setLoanAmount(clampLoan(v))}
              clampLoan={clampLoan}
            >
              <TermSelect
                label="Kỳ hạn (1–6 tháng)"
                value={icloudMonths}
                onChange={setIcloudMonths}
                options={icloudTerms.map((m) => ({
                  value: String(m),
                  label: `${m} tháng`,
                }))}
              />
              <ResultPanel
                note={`Lãi 8%/tháng trên nợ gốc × ${icloudMonths} tháng.`}
                result={calcICloud(loanAmount, Number(icloudMonths))}
              />
            </CalculatorCard>
          </TabsContent>

          {/* --- Hình thức 3: bảng tham khảo tĩnh --- */}
          <TabsContent value="the-tin-dung" className="mt-6">
            <CreditCardTable />
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Zalo */}
      <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/40 p-5 text-center">
        <p className="text-sm text-muted-foreground">
          Cần tư vấn hồ sơ trả góp cụ thể? Nhắn Dev Pồ để được hỗ trợ nhanh.
        </p>
        <Button asChild size="lg" className="h-11 font-semibold">
          <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            Tư vấn trả góp qua Zalo
          </a>
        </Button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Khung nhập số tiền + cột kết quả (dùng cho hình thức 1 & 2)                  */
/* -------------------------------------------------------------------------- */

function CalculatorCard({
  loanAmount,
  onLoanChange,
  clampLoan,
  children,
}: {
  loanAmount: number;
  onLoanChange: (value: number) => void;
  clampLoan: (value: number) => number;
  children: React.ReactNode;
}) {
  // Tách children: phần tử đầu là TermSelect (cột trái), phần tử sau là ResultPanel (cột phải)
  const [term, result] = Array.isArray(children) ? children : [children, null];

  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-10">
      {/* Cột trái: đầu vào */}
      <div className="flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Số tiền cần trả góp
          </label>
          <div className="relative">
            <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              inputMode="numeric"
              className="h-11 pl-9 font-semibold"
              value={loanAmount.toLocaleString("vi-VN")}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                onLoanChange(digits ? clampLoan(Number(digits)) : 0);
              }}
              aria-label="Số tiền cần trả góp"
            />
          </div>
          <div className="mt-4">
            <Slider
              value={[loanAmount]}
              onValueChange={(v) => onLoanChange(v[0])}
              min={MIN_LOAN}
              max={MAX_LOAN}
              step={STEP_LOAN}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{formatVND(MIN_LOAN)}</span>
              <span>{formatVND(MAX_LOAN)}</span>
            </div>
          </div>
        </div>

        {term}
      </div>

      {/* Cột phải: kết quả */}
      {result}
    </div>
  );
}

function TermSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full">
          <SelectValue placeholder="Chọn kỳ hạn" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResultPanel({
  result,
  note,
}: {
  result: { interest: number; total: number; monthly: number };
  note: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-secondary p-5 sm:p-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Percent className="h-4 w-4" />
          Ước tính khoản trả góp
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Card className="gap-0 border-border/70 py-0 shadow-none">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Tiền lãi ước tính</div>
              <div className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                {formatVND(result.interest)}
              </div>
            </CardContent>
          </Card>
          <Card className="gap-0 border-primary/30 bg-background py-0 shadow-none">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Tổng tiền phải trả</div>
              <div className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                {formatVND(result.total)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 rounded-lg bg-background p-3 text-center">
          <span className="text-sm text-muted-foreground">Tương đương khoảng </span>
          <span className="text-sm font-semibold text-foreground">
            {formatVND(result.monthly)}/tháng
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">* {note}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hình thức 3: bảng tham khảo tĩnh                                             */
/* -------------------------------------------------------------------------- */

function CreditCardTable() {
  const rows = useMemo(() => bankCreditCardOptions, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Bảng tham khảo</Badge>
        <span className="text-sm text-muted-foreground">
          Trả góp 0% qua thẻ tín dụng — chọn theo ngân hàng phát hành thẻ của bạn.
        </span>
      </div>

      {/* Bảng cho màn hình lớn */}
      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Ngân hàng</TableHead>
              <TableHead>Mô hình</TableHead>
              <TableHead>Phí/lãi ước tính</TableHead>
              <TableHead className="whitespace-nowrap">Kỳ hạn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.bank}>
                <TableCell className="font-semibold text-foreground">{row.bank}</TableCell>
                <TableCell className="text-muted-foreground">{row.model}</TableCell>
                <TableCell className="text-muted-foreground">{row.fee}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {row.term}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Danh sách card cho mobile */}
      <div className="grid gap-3 sm:hidden">
        {rows.map((row) => (
          <Card key={row.bank} className="gap-0 py-0">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">{row.bank}</CardTitle>
              <CardDescription>{row.model}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 p-4 pt-0 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Phí/lãi</span>
                <span className="text-right font-medium text-foreground">{row.fee}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Kỳ hạn</span>
                <span className="text-right font-medium text-foreground">{row.term}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Ưu đãi thay đổi theo thời gian và chính sách từng ngân hàng/đối tác, khách vui lòng
        xác nhận lại tại quầy hoặc với ngân hàng phát hành thẻ.
      </p>
    </div>
  );
}
