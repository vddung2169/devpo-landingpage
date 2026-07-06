import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ToolPageLayout } from "@/components/cong-cu-mua-iphone/tool-page-layout";
import { MdmBypass } from "@/app/components/mdm-bypass";

export const metadata: Metadata = {
  title: "Bypass MDM iPhone/iPad — Tải tool & hướng dẫn skip khoá quản lý",
  description:
    "Tải tool Bypass MDM và làm theo hướng dẫn bằng hình ảnh để skip màn hình Remote Management (khoá quản lý từ xa) trên iPhone/iPad tại Dev Pồ.",
  alternates: { canonical: "/cong-cu-mua-iphone/bypass-mdm" },
};

export default function BypassMdmPage() {
  return (
    <ToolPageLayout
      eyebrow="Bypass MDM"
      icon={ShieldCheck}
      title="Bỏ qua khoá quản lý MDM"
      description="Tải tool về máy tính và làm theo hướng dẫn bằng hình ảnh để skip màn hình Remote Management trên iPhone/iPad."
    >
      <MdmBypass />
    </ToolPageLayout>
  );
}
