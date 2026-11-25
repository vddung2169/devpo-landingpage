"use client";

import { useState, type ReactNode } from "react";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DUNG_LUONG,
  EMPTY_THU_MAY,
  HINH_THUC,
  KIEU_THU,
  LOAI_MAY,
  type ThuMayPayload,
} from "@/lib/thu-may";

type Status = "idle" | "sending" | "done" | "error";

export function ThuMayForm() {
  const [form, setForm] = useState<ThuMayPayload>(EMPTY_THU_MAY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = <K extends keyof ThuMayPayload>(key: K, value: ThuMayPayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tenMay.trim()) return fail("Vui lòng nhập tên máy.");
    if (!form.dungLuong) return fail("Vui lòng chọn dung lượng.");

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/thu-may", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) return fail(data.error || "Chưa gửi được, vui lòng thử lại.");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      fail("Mất kết nối, vui lòng thử lại.");
    }
  }

  function fail(message: string) {
    setError(message);
    setStatus("error");
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-media bg-surface p-8 text-center sm:p-12">
        <CheckCircle2 className="size-10 text-foreground" aria-hidden="true" />
        <div>
          <h2 className="text-h3 text-foreground">Đã gửi thông tin máy</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Dev Pồ đã nhận thông tin và sẽ báo giá thu sớm nhất.
            {form.sdt ? " Shop sẽ liên hệ qua số bạn để lại." : ""}
          </p>
        </div>
        <PhotoNote />
        <Button
          variant="outline"
          onClick={() => {
            setForm(EMPTY_THU_MAY);
            setStatus("idle");
          }}
        >
          Gửi máy khác
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-section-sm" noValidate>
      {/* Ô bẫy bot: ẩn khỏi người dùng và trình đọc màn hình */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
      />

      <Section title="Thông tin máy">
        <Field label="Tên máy" required>
          <Input
            placeholder="VD: iPhone 15 Pro Max"
            value={form.tenMay}
            onChange={(e) => set("tenMay", e.target.value)}
            className="h-11"
          />
        </Field>
        <Field label="Dung lượng" required>
          <Chips
            options={DUNG_LUONG}
            value={form.dungLuong}
            onChange={(v) => set("dungLuong", v)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Màu">
            <Input
              placeholder="VD: Titan tự nhiên"
              value={form.mau}
              onChange={(e) => set("mau", e.target.value)}
              className="h-11"
            />
          </Field>
          <Field label="Pin (%)">
            <Input
              inputMode="numeric"
              placeholder="VD: 89"
              value={form.pin}
              onChange={(e) => set("pin", e.target.value)}
              className="h-11"
            />
          </Field>
        </div>
        <Field label="QT / LOCK">
          <Chips
            options={LOAI_MAY}
            value={form.loaiMay}
            onChange={(v) => set("loaiMay", v)}
          />
          {form.loaiMay === "Khác" && (
            <Input
              placeholder="Ghi rõ loại máy"
              value={form.loaiMayKhac}
              onChange={(e) => set("loaiMayKhac", e.target.value)}
              className="mt-3 h-11"
            />
          )}
        </Field>
      </Section>

      <Section title="Tình trạng">
        <Field label="Hình thức">
          <Chips
            options={HINH_THUC}
            value={form.hinhThuc}
            onChange={(v) => set("hinhThuc", v)}
          />
          <Textarea
            placeholder="Mô tả lỗi, cấn, trầy (nếu có)"
            value={form.moTaLoi}
            onChange={(e) => set("moTaLoi", e.target.value)}
            className="mt-3 min-h-20"
          />
        </Field>
        <Field label="Sửa chữa / thay linh kiện">
          <Chips
            options={["Không", "Có"] as const}
            value={form.suaChua}
            onChange={(v) => set("suaChua", v)}
          />
          {form.suaChua === "Có" && (
            <Textarea
              placeholder="Chi tiết: thay màn, thay pin, sửa main…"
              value={form.suaChuaChiTiet}
              onChange={(e) => set("suaChuaChiTiet", e.target.value)}
              className="mt-3 min-h-20"
            />
          )}
        </Field>
        <Field label="Thu lên đời / Thu thẳng">
          <Chips
            options={KIEU_THU}
            value={form.kieuThu}
            onChange={(v) => set("kieuThu", v)}
          />
        </Field>
      </Section>

      <Section title="Lịch sử mua tại shop">
        <Field label="Máy đã mua tại Dev Pồ?">
          <Chips
            options={["Không", "Có"] as const}
            value={form.daMuaTaiShop}
            onChange={(v) => set("daMuaTaiShop", v)}
          />
        </Field>
        {form.daMuaTaiShop === "Có" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Giá mua">
              <Input
                placeholder="VD: 25.500.000"
                value={form.giaMua}
                onChange={(e) => set("giaMua", e.target.value)}
                className="h-11"
              />
            </Field>
            <Field label="Tình trạng lúc mua">
              <Input
                placeholder="VD: 99%, pin 95"
                value={form.tinhTrangLucMua}
                onChange={(e) => set("tinhTrangLucMua", e.target.value)}
                className="h-11"
              />
            </Field>
          </div>
        )}
      </Section>

      <Section title="Liên hệ">
        <Field label="Số điện thoại" hint="Không bắt buộc">
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Để trống nếu nhân viên điền"
            value={form.sdt}
            onChange={(e) => set("sdt", e.target.value)}
            className="h-11"
          />
        </Field>
      </Section>

      <PhotoNote />

      <div className="flex flex-col gap-3">
        {status === "error" && error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" && <Loader2 className="size-4 animate-spin" />}
          {status === "sending" ? "Đang gửi…" : "Gửi thông tin máy"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-h4 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
        {hint && <span className="font-normal text-muted-foreground"> · {hint}</span>}
      </p>
      {children}
    </div>
  );
}

function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: string;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o)}
            className={cn(
              "h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:border-foreground/40",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function PhotoNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-surface p-4 text-left text-sm text-muted-foreground">
      <Camera className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        Ảnh máy (mặt trước, mặt sau, 4 cạnh, pin, IMEI, lỗi nếu có): nhân viên
        chụp tại shop hoặc bạn gửi qua{" "}
        <a
          href="https://zalo.me/4289073059490896771"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Zalo Dev Pồ
        </a>
        .
      </span>
    </div>
  );
}
