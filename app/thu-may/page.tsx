import type { Metadata } from "next";
import { WithSideBanners } from "../components/side-banners";
import { ThuMayForm } from "./thu-may-form";

export const metadata: Metadata = {
  title: "Báo thu máy — Dev Pồ",
  description: "Điền thông tin máy cần thu để Dev Pồ báo giá.",
  alternates: { canonical: "/thu-may" },
  // Form dùng tại quầy / gửi link cho khách, không cần lên Google.
  robots: { index: false, follow: false },
};

export default function ThuMayPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Banner hai bên chỉ hiện ở màn ≥1440px; tắt cửa sổ quảng cáo ở màn nhỏ để không che form */}
      <WithSideBanners currentPath="/thu-may" popup={false}>
        <div className="container-page max-w-2xl py-section-sm">
          <div className="mb-block">
            <h1 className="text-h2 text-foreground">Báo thu máy</h1>
            <p className="mt-2 text-body text-muted-foreground">
              Điền thông tin máy cần thu, Dev Pồ sẽ kiểm tra và báo giá. Chỉ cần
              tên máy và dung lượng, các mục khác điền được bao nhiêu thì điền.
            </p>
          </div>
          <ThuMayForm />
        </div>
      </WithSideBanners>
    </main>
  );
}
