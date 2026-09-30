import Image from "next/image";
import Link from "next/link";
import { Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuoteCTA } from "./quote-cta";

const STATS = [
  { value: "30+", label: "Mẫu máy sẵn kho" },
  { value: "2.800+", label: "Khách đã mua" },
  { value: "9.9", label: "Điểm đánh giá" },
];

/**
 * Hero trang chủ — hai cột từ lg, xếp dọc ở mobile.
 *
 * Bản cũ phải nhờ ~50 dòng CSS riêng (.hero-tablet-landscape-*) để chữa layout
 * ở dải 1024–1279px, cộng một thẻ <br> ẩn/hiện theo breakpoint. Bản này bỏ hết:
 * tiêu đề dùng cỡ chữ clamp nên tự co, lưới chuyển 1→2 cột đúng một lần ở lg,
 * và cụm nút dùng flex-wrap nên không bao giờ tràn.
 */
export function Hero() {
  return (
    <section className="w-full overflow-hidden bg-surface">
      {/* Từ 1280px cột chữ được nới rộng hơn cột ảnh (1.15fr / 0.85fr): hai nút
          CTA đặt cạnh nhau cần 633px, mà chia đôi đều thì cột chữ chỉ được 584px
          — thiếu 49px. Với tỉ lệ này cột chữ đạt 672px, dư 39px. */}
      {/* Từ 1280px hero cao bằng phần màn hình còn lại, nên khối "Sản phẩm nổi
          bật" nằm hẳn dưới nếp gấp chứ không ló lên như trước.
          Phần khung dính trên đầu trang cao 109px (header 72px + viền 1px +
          ticker 36px); trừ 6.5rem = 104px, tức để hero DƯ ~5px — thà hero thò
          xuống vài pixel còn hơn khối sau ló lên.
          dvh (không phải vh) để trên trình duyệt di động có thanh công cụ thu
          vào/trượt ra thì chiều cao vẫn tính đúng.
          items-center căn nội dung vào giữa chiều cao đó. */}
      <div className="container-page grid items-center gap-10 py-section lg:grid-cols-2 lg:gap-16 xl:min-h-[calc(100dvh-6.5rem)] xl:grid-cols-[1.15fr_0.85fr]">
        {/* --- Cột chữ --- */}
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-caption font-medium text-foreground">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Sẵn hàng đủ mã
          </p>

          <h1 className="text-display max-w-[14ch] text-balance text-foreground">
            iPhone Lock, Quốc tế &amp; iPad
          </h1>

          <p className="text-lead max-w-lg text-pretty text-muted-foreground">
            Khám phá bộ sưu tập iPhone iPad chất lượng cao, giá cả phải chăng nhất thị trường hiện nay.
          </p>

          {/* Hai nút CTA luôn xếp dọc và RỘNG BẰNG NHAU.
              Đo bằng chính file font: "Nhận báo giá ngay" rộng 294px, "Tính trả
              góp & chọn máy" rộng 323px (ở 1280px) -> đặt cạnh nhau cần 629px,
              trong khi cột chữ của hero rộng nhất cũng chỉ 584px. Tức là chúng
              không bao giờ vừa một hàng, kể cả trên desktop — bản cũ dùng
              sm:flex-row nên luôn bị xuống dòng và hai nút lệch nhau 30px.

              grid-cols-[max-content] + w-fit: cột grid co đúng bằng nút DÀI
              NHẤT, hai nút cùng giãn ra bằng cột đó. Nhờ vậy chúng bằng nhau mà
              vẫn ôm sát nội dung, không cần đặt bề rộng cố định bằng tay.

              Từ 1280px (xl) mới đủ chỗ xếp ngang: grid-cols-2 trong khung w-fit
              cho hai cột 1fr, và dưới ràng buộc max-content thì cả hai track đều
              nhận bề rộng của nút dài nhất -> vẫn bằng nhau, chỉ khác là nằm
              cùng một hàng. */}
          <div className="grid w-full grid-cols-1 gap-3 sm:w-fit sm:grid-cols-[max-content] xl:grid-cols-2">
            <QuoteCTA className="w-full" />

            <Button asChild variant="outline" size="xl" className="w-full">
              <Link href="/cong-cu-mua-iphone">
                <Calculator className="size-5" aria-hidden="true" />
                Tính trả góp &amp; chọn máy
              </Link>
            </Button>
          </div>

          {/* Thống kê — dl/dt/dd để trình đọc màn hình hiểu đây là cặp số–nhãn */}
          <dl className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-2 lg:justify-start">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-h2 text-foreground">
                    {stat.value}
                  </span>
                  <span className="block text-caption text-muted-foreground">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* --- Cột ảnh ---
            Tới 1279px: khung theo tỉ lệ cố định như cũ.
            Từ 1280px: ảnh kéo cao bằng hero để lấp khoảng trống dọc mới sinh ra,
            chặn trên 44rem để trên màn rất cao ảnh không thành dải dọc hẹp.
            Lớp bọc flex + items-center giữ ảnh ở giữa khi đã chạm trần đó. */}
        <div className="w-full xl:flex xl:h-full xl:items-center xl:self-stretch">
          <div className="media-frame aspect-[4/3] w-full bg-background lg:aspect-square xl:aspect-auto xl:h-full xl:max-h-[44rem] xl:min-h-[26rem]">
            <Image
              src="/background-2.jpg"
              alt="iPhone Lock và iPhone Quốc tế chính hãng trưng bày tại cửa hàng Dev Pồ"
              fill
              priority
              sizes="(max-width: 1023px) 92vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
