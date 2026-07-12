import type { Metadata } from "next";
import { GiveawayClient } from "@/components/give-away/giveaway-client";

export const metadata: Metadata = {
  title: "Giveaway Dev Pồ — Tham gia nhận quà tri ân",
  description:
    "Tham gia giveaway tri ân khách hàng của Dev Pồ: để lại họ tên và số điện thoại để nhận vé may mắn. Kết quả công bố công khai, minh bạch.",
  alternates: { canonical: "/give-away" },
  openGraph: {
    title: "GiveAway Dev Pồ — Tham gia nhận quà tri ân",
    description:
      "Để lại họ tên và số điện thoại để nhận vé may mắn. Kết quả công bố công khai tại Dev Pồ.",
    url: "/give-away",
    type: "website",
  },
};

export default function GiveAwayPage() {
  return <GiveawayClient />;
}
