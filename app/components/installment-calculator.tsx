"use client";

import { useMemo, useState } from "react";
import { Calculator, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatVND } from "@/lib/utils";
import {
  ZALO_LINK,
  categoryLabel,
  priceToNumber,
  products,
  type ProductCategory,
} from "@/data/products";

// Các kỳ hạn trả góp 0% hỗ trợ tại Dev Pồ
const TERMS = [3, 6, 9, 12] as const;

// Gom sản phẩm theo nhóm để hiển thị trong Select (giống bộ lọc trên trang sản phẩm)
const CATEGORY_ORDER: ProductCategory[] = ["lock", "quocte", "ipad"];

export function InstallmentCalculator() {
  const [selectedSlug, setSelectedSlug] = useState(products[0].slug);
  const [downPaymentPercent, setDownPaymentPercent] = useState([30]);
  const [termMonths, setTermMonths] = useState<string>("6");

  const product = useMemo(
    () => products.find((p) => p.slug === selectedSlug) ?? products[0],
    [selectedSlug],
  );

  const principal = useMemo(() => priceToNumber(product.priceFrom), [product]);
  const downPayment = useMemo(
    () => Math.round((principal * downPaymentPercent[0]) / 100),
    [principal, downPaymentPercent],
  );
  const remaining = principal - downPayment;
  const months = Number(termMonths);
  const monthlyPayment = months > 0 ? Math.round(remaining / months) : 0;

  return (
    <div className="grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-10">
      {/* Cột trái: các lựa chọn đầu vào */}
      <div className="flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Chọn máy muốn trả góp
          </label>
          <Select value={selectedSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Chọn sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ORDER.map((cat) => (
                <SelectGroup key={cat}>
                  <SelectLabel>{categoryLabel[cat]}</SelectLabel>
                  {products
                    .filter((p) => p.category === cat)
                    .map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>
                        {p.name} · {p.storage}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-sm text-muted-foreground">
            Giá niêm yết: <span className="font-semibold text-foreground">{formatVND(principal)}</span>
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Số tiền trả trước</label>
            <span className="text-sm font-semibold text-primary">{downPaymentPercent[0]}%</span>
          </div>
          <Slider
            value={downPaymentPercent}
            onValueChange={setDownPaymentPercent}
            min={10}
            max={70}
            step={5}
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>70%</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Kỳ hạn trả góp</label>
          <ToggleGroup
            type="single"
            value={termMonths}
            onValueChange={(v) => v && setTermMonths(v)}
            variant="outline"
            className="w-full"
          >
            {TERMS.map((t) => (
              <ToggleGroupItem key={t} value={String(t)} className="h-11 font-semibold">
                {t} tháng
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {/* Cột phải: kết quả tính toán */}
      <div className="flex flex-col justify-between rounded-xl bg-secondary p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Calculator className="h-4 w-4" />
            Dự kiến trả góp — {product.name}
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Giá máy</span>
              <span className="font-medium text-foreground">{formatVND(principal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trả trước ({downPaymentPercent[0]}%)</span>
              <span className="font-medium text-foreground">{formatVND(downPayment)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Số tiền trả góp</span>
              <span className="font-medium text-foreground">{formatVND(remaining)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-background p-4 text-center">
            <div className="text-sm text-muted-foreground">Trả mỗi tháng ({months} tháng)</div>
            <div className="mt-1 text-3xl font-bold text-primary sm:text-4xl">
              {formatVND(monthlyPayment)}
              <span className="text-base font-medium text-muted-foreground">/tháng</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Lãi suất 0% qua thẻ tín dụng / app tài chính liên kết
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="mt-6 h-12 w-full font-semibold">
          <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            Đăng ký trả góp qua Zalo
          </a>
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          * Số liệu chỉ mang tính tham khảo, kết quả duyệt hồ sơ thực tế tùy đơn vị tài chính.
        </p>
      </div>
    </div>
  );
}
