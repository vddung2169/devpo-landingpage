import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PinForm } from "@/components/noi-bo/pin-form";

export const metadata: Metadata = {
  title: "Nội bộ — Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function NoiBoLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
            <Lock className="h-5 w-5 text-foreground" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground">
            Khu vực nội bộ · Dev Pồ
          </h1>
        </div>

        <PinForm from={from ?? ""} />
      </div>
    </main>
  );
}
