"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyPin, type PinState } from "@/app/noi-bo/actions";

export function PinForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState<PinState, FormData>(
    verifyPin,
    {},
  );
  const [pin, setPin] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  // Nhớ giá trị vừa gửi để không tự submit lặp lại cùng một mã
  const submittedRef = useRef("");

  // Nhập đủ 4 số -> tự động gửi
  useEffect(() => {
    if (pin.length === 4 && !pending && submittedRef.current !== pin) {
      submittedRef.current = pin;
      formRef.current?.requestSubmit();
    }
  }, [pin, pending]);

  // Sai PIN -> xoá để nhập lại
  useEffect(() => {
    if (state.error) {
      setPin("");
      submittedRef.current = "";
    }
  }, [state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col items-center gap-5">
      <input type="hidden" name="pin" value={pin} />
      <input type="hidden" name="from" value={from} />

      <InputOTP
        maxLength={4}
        value={pin}
        onChange={setPin}
        disabled={pending}
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Mã PIN nội bộ"
        autoFocus
      >
        <InputOTPGroup className="gap-2">
          {[0, 1, 2, 3].map((i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="h-14 w-12 rounded-md border-l text-2xl font-semibold sm:w-14"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {state.error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {state.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nhập mã PIN 4 số để vào khu vực nội bộ.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full font-semibold"
        disabled={pending || pin.length < 4}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang kiểm tra…
          </>
        ) : (
          <>
            <Unlock className="mr-2 h-5 w-5" />
            Mở khoá
          </>
        )}
      </Button>
    </form>
  );
}
