"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { isValidName, isValidPhone, THE_LE } from "@/lib/event-wheel";

/**
 * Form thu thập thông tin trước khi quay.
 * Validate ở đây chỉ để khách sửa nhanh — server validate lại lần nữa
 * (app/api/event-wheel/route.ts), nên bỏ qua form phía client cũng không quay được.
 */
export function SpinForm({
  onSubmit,
  submitting,
  serverError,
}: {
  onSubmit: (name: string, phone: string) => void;
  submitting: boolean;
  serverError: string | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameOk = isValidName(name);
  const phoneOk = isValidPhone(phone);
  const ready = nameOk && phoneOk && agree;

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!ready || submitting) return;
    onSubmit(name.trim(), phone);
  };

  const fieldClass =
    "w-full rounded-xl bg-white/[0.07] px-4 py-3 text-[16px] text-white outline-none ring-1 ring-inset ring-white/15 transition placeholder:text-white/35 focus:ring-2 focus:ring-white/60";

  return (
    <form onSubmit={handle} className="flex flex-col gap-3" noValidate>
      <div>
        <label htmlFor="dw-name" className="mb-1.5 block text-[13px] text-white/70">
          Họ và tên
        </label>
        {/* text-[16px] là chủ đích: dưới 16px Safari iOS tự zoom khi focus. */}
        <input
          id="dw-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
          maxLength={80}
          className={fieldClass}
          aria-invalid={touched && !nameOk}
        />
        {touched && !nameOk && (
          <p className="mt-1.5 text-[12px] text-amber-300">Vui lòng nhập họ tên của bạn.</p>
        )}
      </div>

      <div>
        <label htmlFor="dw-phone" className="mb-1.5 block text-[13px] text-white/70">
          Số điện thoại
        </label>
        <input
          id="dw-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
          placeholder="09xx xxx xxx"
          maxLength={15}
          className={fieldClass}
          aria-invalid={touched && !phoneOk}
        />
        {touched && !phoneOk && (
          <p className="mt-1.5 text-[12px] text-amber-300">
            Số điện thoại chưa đúng. Nhập đủ 10 số, ví dụ 0901234567.
          </p>
        )}
      </div>

      <label className="mt-1 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-white/70">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-white"
        />
        <span>
          Tôi đồng ý với{" "}
          <button
            type="button"
            onClick={() => setShowTerms((v) => !v)}
            className="cursor-pointer text-white underline underline-offset-2"
          >
            thể lệ chương trình
          </button>{" "}
          và cho phép DEV PỒ dùng thông tin này để liên hệ trao thưởng.
        </span>
      </label>

      {showTerms && (
        <ol className="flex list-decimal flex-col gap-1.5 rounded-xl bg-white/[0.05] p-3.5 pl-7 text-[12px] leading-relaxed text-white/60">
          {THE_LE.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      )}

      {touched && !agree && (
        <p className="text-[12px] text-amber-300">Bạn cần đồng ý với thể lệ để tham gia.</p>
      )}

      {serverError && (
        <p className="rounded-xl bg-amber-400/10 px-3.5 py-2.5 text-[13px] text-amber-200 ring-1 ring-inset ring-amber-300/20">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-[#06142b] transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Đang xử lý…
          </>
        ) : (
          "QUAY NGAY"
        )}
      </button>

      <p className="text-center text-[11px] text-white/40">
        Mỗi số điện thoại được quay một lượt duy nhất.
      </p>
    </form>
  );
}
