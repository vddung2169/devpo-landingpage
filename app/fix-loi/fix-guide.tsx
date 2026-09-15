"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Cpu,
  MessageCircle,
  Phone,
  RotateCcw,
  SignalHigh,
  SmartphoneNfc,
  TriangleAlert,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deviceTypes, type DeviceType, type Symptom } from "./fix-data";

// Map khoá icon trong fix-data (file .ts thuần) sang component lucide
const ICONS = {
  sim: SmartphoneNfc,
  cpu: Cpu,
  wifi: Wifi,
} as const;

/**
 * Trình chẩn đoán 2 bước: chọn loại máy → chọn lỗi đang gặp → hiện danh sách
 * cách xử lý theo đúng thứ tự ưu tiên, tick từng cách đã thử để không bị rối.
 */
export function FixGuide() {
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [done, setDone] = useState<number[]>([]);

  const progress = useMemo(() => {
    if (!symptom) return 0;
    return Math.round((done.length / symptom.steps.length) * 100);
  }, [done, symptom]);

  function pickDevice(d: DeviceType) {
    setDevice(d);
    setSymptom(null);
    setDone([]);
  }

  function pickSymptom(s: Symptom) {
    setSymptom(s);
    setDone([]);
  }

  function toggleStep(i: number) {
    setDone((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  function reset() {
    setDevice(null);
    setSymptom(null);
    setDone([]);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
      {/* Thanh trạng thái: cho biết đang ở bước nào, bấm để quay lại */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-foreground">Chẩn đoán nhanh</span>
        {device && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <button
              type="button"
              onClick={() => pickDevice(device)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {device.short}
            </button>
          </>
        )}
        {symptom && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{symptom.label}</span>
          </>
        )}
        {device && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Làm lại
          </button>
        )}
      </div>

      {/* BƯỚC 1 — loại máy */}
      <div className="mt-6">
        <h2 className="text-base font-semibold text-foreground md:text-lg">
          Bước 1 · Máy bạn thuộc loại nào?
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {deviceTypes.map((d) => {
            const Icon = ICONS[d.icon];
            const active = device?.id === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickDevice(d)}
                aria-pressed={active}
                className={cn(
                  "flex h-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                  active
                    ? "border-foreground bg-secondary shadow-sm"
                    : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/50",
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {d.label}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {d.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BƯỚC 2 — lỗi đang gặp */}
      {device && (
        <div className="mt-8">
          <h2 className="text-base font-semibold text-foreground md:text-lg">
            Bước 2 · Máy đang báo lỗi gì?
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {device.symptoms.map((s) => {
              const active = symptom?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pickSymptom(s)}
                  aria-pressed={active}
                  className={cn(
                    "flex h-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-foreground bg-secondary shadow-sm"
                      : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/50",
                  )}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SignalHigh className="h-4 w-4" />
                    {s.label}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {s.hint}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {s.aliases.map((a) => (
                      <span
                        key={a}
                        className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* BƯỚC 3 — các cách xử lý */}
      {device && symptom && (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-foreground md:text-lg">
              Bước 3 · Làm lần lượt từ trên xuống
            </h2>
            <span className="text-xs text-muted-foreground">
              Đã thử {done.length}/{symptom.steps.length} cách
            </span>
          </div>

          {/* Thanh tiến độ các cách đã thử */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="mt-5 space-y-3">
            {symptom.steps.map((step, i) => {
              const checked = done.includes(i);
              return (
                <li key={step.text}>
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    aria-pressed={checked}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      step.warning
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-border bg-background hover:border-foreground/30",
                      checked && "opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                        checked
                          ? "border-foreground bg-foreground text-background"
                          : step.warning
                            ? "border-amber-500/60 text-amber-600 dark:text-amber-400"
                            : "border-border text-muted-foreground",
                      )}
                    >
                      {checked ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : step.warning ? (
                        <TriangleAlert className="h-3.5 w-3.5" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-sm font-medium text-foreground",
                          checked && "line-through",
                        )}
                      >
                        {step.text}
                      </span>
                      {step.note && (
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {step.note}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Vẫn chưa được → nhắn Dev Pồ */}
          <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-5">
            <p className="text-sm font-semibold text-foreground">
              Đã thử hết nhưng máy vẫn lỗi?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nhắn cho Dev Pồ kèm ảnh chụp màn hình Cài đặt → Di động, shop kiểm
              tra và hỗ trợ fix miễn phí cho khách đã mua máy tại shop.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a
                  href="https://zalo.me/4289073059490896771"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> Chat Zalo
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="tel:0399208037">
                  <Phone className="h-4 w-4" /> 0399 208 037
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
