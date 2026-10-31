import type { Metadata } from "next";
import { EventWheelPage } from "@/app/components/event-wheel/event-wheel-page";

export const metadata: Metadata = {
  title: "Quay may mắn tháng 10 — Nhận quà & mã giảm đến 500.000đ",
  description:
    "DEV PỒ BIG EVENT: quay may mắn nhận mã giảm giá đến 500.000đ, Apple Pencil, AirPods và nhiều ưu đãi khi mua iPhone/iPad tại DEV PỒ. Mỗi số điện thoại một lượt quay.",
  alternates: { canonical: "/event-thang10" },
  openGraph: {
    title: "DEV PỒ — Quay may mắn, nhận quà cực đã!",
    description:
      "Quay để nhận mã giảm đến 500.000đ, Apple Pencil, AirPods khi mua iPhone/iPad tại DEV PỒ.",
    url: "/event-thang10",
    type: "website",
  },
};

export default function EventThang10Page() {
  return <EventWheelPage />;
}
