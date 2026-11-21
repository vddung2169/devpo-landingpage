import { WithSideBanners } from "../components/side-banners";
import { GuidesContent } from "./guides-content";

// Nội dung trang (bộ lọc, danh sách bài, video) là Client Component trong
// guides-content.tsx; trang này là Server Component để gắn banner hai bên
// mà không đẩy dữ liệu sản phẩm xuống trình duyệt.
export default function GuidesPage() {
  return (
    <WithSideBanners currentPath="/guides">
      <GuidesContent />
    </WithSideBanners>
  );
}
