"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "./product-card";
import { priceToNumber, products, type ProductCategory } from "@/data/products";

// ============================================================================
// Quiz 3 câu: ngân sách -> nhu cầu sử dụng -> loại máy ưu tiên
// -> chấm điểm toàn bộ sản phẩm (trừ iPad) và gợi ý 2 máy phù hợp nhất.
// ============================================================================

type BudgetKey = "under10" | "10to15" | "15to20" | "over20";
type NeedKey = "pro" | "plus" | "basic";
type CategoryPref = ProductCategory | "any";

const BUDGET_OPTIONS: { key: BudgetKey; label: string; min: number; max: number }[] = [
  { key: "under10", label: "Dưới 10 triệu", min: 0, max: 10_000_000 },
  { key: "10to15", label: "10 - 15 triệu", min: 10_000_000, max: 15_000_000 },
  { key: "15to20", label: "15 - 20 triệu", min: 15_000_000, max: 20_000_000 },
  { key: "over20", label: "Trên 20 triệu", min: 20_000_000, max: Infinity },
];

const NEED_OPTIONS: { key: NeedKey; label: string; desc: string }[] = [
  {
    key: "pro",
    label: "Chụp ảnh đẹp & hiệu năng mạnh",
    desc: "Ưu tiên dòng Pro: camera tốt, chip mạnh, chơi game/làm việc nặng mượt.",
  },
  {
    key: "plus",
    label: "Pin trâu, màn hình lớn",
    desc: "Ưu tiên dòng Plus / Pro Max: pin dùng cả ngày, màn hình rộng rãi.",
  },
  {
    key: "basic",
    label: "Cơ bản, tiết kiệm nhất",
    desc: "Nghe gọi, nhắn tin, lướt mạng — ưu tiên giá tốt nhất trong tầm tiền.",
  },
];

const CATEGORY_OPTIONS: { key: CategoryPref; label: string; desc: string }[] = [
  {
    key: "lock",
    label: "iPhone Lock — giá tốt hơn",
    desc: "Tiết kiệm 3–10 triệu, chấp nhận máy đã ghép sim.",
  },
  {
    key: "quocte",
    label: "iPhone Quốc tế — ổn định tuyệt đối",
    desc: "Cắm sim dùng ngay, không cần ghép sim.",
  },
  {
    key: "any",
    label: "Chưa chắc, gợi ý giúp tôi",
    desc: "Để Dev Pồ đề xuất loại phù hợp nhất với ngân sách của bạn.",
  },
];

function scoreProduct(
  priceFrom: string,
  category: ProductCategory,
  name: string,
  budget: (typeof BUDGET_OPTIONS)[number],
  need: NeedKey,
  categoryPref: CategoryPref,
): number {
  let score = 0;
  const price = priceToNumber(priceFrom);

  // Phù hợp ngân sách là yếu tố quan trọng nhất
  if (price >= budget.min && price <= budget.max) {
    score += 30;
  } else {
    const distance = price < budget.min ? budget.min - price : price - budget.max;
    score -= Math.min(25, distance / 400_000);
  }

  // Loại máy ưu tiên
  if (categoryPref === "any") score += 5;
  else if (category === categoryPref) score += 20;
  else score -= 15;

  // Nhu cầu sử dụng, suy ra từ tên dòng máy
  const isPro = /Pro/i.test(name);
  const isPlus = /(Plus|Pro Max)/i.test(name);
  if (need === "pro" && isPro) score += 15;
  if (need === "plus" && isPlus) score += 15;
  if (need === "basic" && !isPro && !isPlus) score += 15;

  return score;
}

export function ProductQuiz() {
  const [step, setStep] = useState(0); // 0 = intro, 1-3 = câu hỏi, 4 = kết quả
  const [budgetKey, setBudgetKey] = useState<BudgetKey | null>(null);
  const [needKey, setNeedKey] = useState<NeedKey | null>(null);
  const [categoryPref, setCategoryPref] = useState<CategoryPref | null>(null);

  const recommendations = useMemo(() => {
    if (!budgetKey || !needKey || !categoryPref) return [];
    const budget = BUDGET_OPTIONS.find((b) => b.key === budgetKey)!;
    return products
      .filter((p) => p.category !== "ipad")
      .map((p) => ({
        product: p,
        score: scoreProduct(p.priceFrom, p.category, p.name, budget, needKey, categoryPref),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((r) => r.product);
  }, [budgetKey, needKey, categoryPref]);

  function reset() {
    setStep(0);
    setBudgetKey(null);
    setNeedKey(null);
    setCategoryPref(null);
  }

  return (
    <Card className="rounded-2xl border border-border p-6 shadow-sm sm:p-8">
      {step === 0 && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-6 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-6">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Trả lời 3 câu để tìm máy hợp bạn</h3>
            <p className="text-muted-foreground">
              Dev Pồ sẽ gợi ý ngay 2 mẫu máy phù hợp nhất với ngân sách và nhu cầu của bạn.
            </p>
          </div>
          <Button size="lg" className="min-w-[200px]" onClick={() => setStep(1)}>
            Bắt đầu
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mx-auto flex max-w-2xl flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              Câu hỏi 1/3
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight">Ngân sách của bạn khoảng bao nhiêu?</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {BUDGET_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant="outline"
                className="h-auto w-full justify-start p-4 text-left text-base font-normal hover:border-primary/50 hover:bg-primary/5"
                onClick={() => {
                  setBudgetKey(opt.key);
                  setStep(2);
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mx-auto flex max-w-2xl flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              Câu hỏi 2/3
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight">Bạn ưu tiên điều gì nhất?</h3>
          </div>
          <div className="grid gap-3">
            {NEED_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 whitespace-normal p-4 text-left hover:border-primary/50 hover:bg-primary/5"
                onClick={() => {
                  setNeedKey(opt.key);
                  setStep(3);
                }}
              >
                <span className="text-base font-semibold">{opt.label}</span>
                <span className="text-sm font-normal text-muted-foreground">{opt.desc}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto flex max-w-2xl flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              Câu hỏi 3/3
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight">Bạn muốn loại máy nào?</h3>
          </div>
          <div className="grid gap-3">
            {CATEGORY_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 whitespace-normal p-4 text-left hover:border-primary/50 hover:bg-primary/5"
                onClick={() => {
                  setCategoryPref(opt.key);
                  setStep(4);
                }}
              >
                <span className="text-base font-semibold">{opt.label}</span>
                <span className="text-sm font-normal text-muted-foreground">{opt.desc}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center gap-2 text-center">
            <Badge className="bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-500/10 dark:text-green-500">
              Gợi ý dành cho bạn
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight">2 mẫu máy hợp với bạn nhất</h3>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {recommendations.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Chưa tìm được máy phù hợp, hãy thử lại với lựa chọn khác nhé.
            </p>
          )}

          <Button variant="ghost" className="mx-auto" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Làm lại quiz
          </Button>
        </div>
      )}
    </Card>
  );
}
