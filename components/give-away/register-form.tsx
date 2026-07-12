"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isValidPhone,
  normalizePhone,
  type MyTicket,
  type RegisterResult,
} from "@/lib/giveaway";

/**
 * Form đăng ký tham gia giveaway. Validate client, chống double-submit, báo lỗi
 * ngay dưới field (không dùng alert). Gọi /api/give-away (proxy server).
 */
export function RegisterForm({
  onRegistered,
  onClosed,
}: {
  /** Đăng ký thành công -> trả vé để parent hiện & lưu localStorage. */
  onRegistered: (ticket: MyTicket) => void;
  /** Server báo đã đóng đăng ký -> parent nên refetch để đổi trạng thái. */
  onClosed: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let ok = true;
    if (name.trim().length < 2) {
      setNameErr("Vui lòng nhập họ tên (tối thiểu 2 ký tự).");
      ok = false;
    } else setNameErr(null);

    if (!isValidPhone(phone)) {
      setPhoneErr("Số điện thoại chưa đúng — cần 10 số, bắt đầu bằng 0.");
      ok = false;
    } else setPhoneErr(null);

    return ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    const cleanPhone = normalizePhone(phone);
    try {
      const res = await fetch("/api/give-away", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ name: name.trim(), phone: cleanPhone }),
      });
      const data = (await res.json()) as RegisterResult;

      if (data.ok && data.entry) {
        onRegistered({
          ticket: data.entry.ticket,
          name: data.entry.name,
          phone: cleanPhone,
        });
        return;
      }

      // Đã đóng đăng ký -> đổi trạng thái trang
      if (data.status === "closed") {
        onClosed();
        return;
      }

      // Trùng SĐT (có thể kèm vé cũ)
      if (data.existing?.ticket) {
        setPhoneErr(
          `${data.error ?? "Số điện thoại này đã đăng ký."} Mã vé của bạn: ${data.existing.ticket}`,
        );
        return;
      }

      setFormErr(data.error ?? "Đăng ký chưa thành công, vui lòng thử lại.");
    } catch {
      setFormErr(
        "Không gửi được đăng ký — có thể do mạng. Vui lòng kiểm tra kết nối và thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="ga-name"
          className="mb-1.5 block text-sm font-semibold text-foreground"
        >
          Họ tên
        </label>
        <Input
          id="ga-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          disabled={submitting}
          aria-invalid={!!nameErr}
          aria-describedby={nameErr ? "ga-name-err" : undefined}
          className="h-11"
        />
        {nameErr && (
          <p id="ga-name-err" className="mt-1.5 text-sm text-destructive">
            {nameErr}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="ga-phone"
          className="mb-1.5 block text-sm font-semibold text-foreground"
        >
          Số điện thoại
        </label>
        <Input
          id="ga-phone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0901234567"
          autoComplete="tel"
          disabled={submitting}
          aria-invalid={!!phoneErr}
          aria-describedby={phoneErr ? "ga-phone-err" : undefined}
          className="h-11"
        />
        {phoneErr && (
          <p id="ga-phone-err" className="mt-1.5 text-sm text-destructive">
            {phoneErr}
          </p>
        )}
      </div>

      {formErr && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {formErr}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-11 font-semibold"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin motion-reduce:hidden" />
            Đang gửi…
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Tham gia ngay
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Thông tin chỉ dùng để liên hệ trao thưởng, không dùng cho mục đích khác.
      </p>
    </form>
  );
}
