import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { guides } from "@/data/guides";
import { ipadProducts } from "@/data/products";
import { IpadGrid } from "./ipad-grid";

export const metadata: Metadata = {
  title: "iPad cũ giá tốt TP.HCM - iPad Pro, Air, Mini, Gen nguyên zin",
  description:
    "Mua iPad cũ giá tốt tại TP.HCM: iPad Pro, iPad Air, iPad Mini và iPad Gen nguyên zin. Lọc nhanh theo dòng máy, bản Wi-Fi hay Wi-Fi + Cellular, dung lượng và tình trạng máy. Kiểm tra iCloud, bảo hành tại cửa hàng, trả góp 0% tại Dev Pồ.",
  keywords: [
    "ipad cũ",
    "ipad cũ giá rẻ",
    "mua ipad tphcm",
    "ipad air cũ",
    "ipad pro cũ",
    "ipad gen cũ",
    "ipad wifi cellular",
    "ipad lock là gì",
    "Dev Pồ",
  ],
  alternates: { canonical: "/ipad" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://www.devpo.vn/ipad",
    siteName: "Dev Pồ - DevpoStore",
    title: "iPad cũ giá tốt TP.HCM - iPad Pro, Air, Mini, Gen | Dev Pồ",
    description:
      "iPad cũ nguyên zin tại Dev Pồ: lọc theo dòng máy, Wi-Fi / Cellular, dung lượng và tình trạng. Kiểm tra iCloud kỹ, bảo hành tại cửa hàng, trả góp 0%.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "iPad cũ giá tốt tại Dev Pồ" }],
  },
};

const SITE_URL = "https://www.devpo.vn";

// FAQ riêng cho trang danh mục iPad — cố ý khác bộ câu hỏi ở trang chủ để hai
// trang không trùng nội dung structured data.
const ipadFaqs = [
  {
    question: "Mua iPad cũ ở TP.HCM có đáng không?",
    answer:
      "Rất đáng, vì iPad giữ giá trị sử dụng lâu hơn điện thoại: một chiếc iPad Air 4 hay iPad Pro 2020 đến nay vẫn chạy mượt iPadOS mới, vẽ Procreate và học online tốt, trong khi giá chỉ còn khoảng một nửa so với máy mới cùng cấu hình. Điều quan trọng là chọn nơi kiểm tra kỹ màn hình, cảm ứng, pin, khe SIM và tình trạng iCloud trước khi giao máy.",
  },
  {
    question: "iPad tại Dev Pồ là hàng gì, có phải máy dựng không?",
    answer:
      "Toàn bộ iPad tại Dev Pồ là máy nguyên zin nguyên bản, không phải máy dựng hay thay vỏ. Mỗi máy đều được test màn hình, cảm ứng đa điểm, camera, loa, Wi-Fi, Bluetooth, cổng sạc, nút nguồn, Touch ID/Face ID và độ chai pin trước khi lên kệ. Hình thức thực tế được ghi rõ trên từng sản phẩm.",
  },
  {
    question: "iPad bản Cellular tại cửa hàng có bị khoá mạng không?",
    answer:
      "Tình trạng khoá mạng được ghi rõ trên từng máy. Với bản Cellular quốc tế, bạn lắp SIM Viettel/Mobifone/VinaPhone là dùng 4G/5G ngay, không cần sim ghép. Nếu là máy còn khoá mạng nhà mạng nước ngoài, nhân viên sẽ nói rõ trước khi bạn chốt, kèm hướng xử lý phần SIM.",
  },
  {
    question: "Mua iPad tại Dev Pồ được bảo hành thế nào?",
    answer:
      "iPad được bảo hành phần cứng tại cửa hàng theo chính sách ghi trên hoá đơn, kèm hỗ trợ kỹ thuật và cài đặt trọn đời. Trong thời gian đầu sử dụng, nếu máy phát sinh lỗi từ nhà sản xuất hoặc lỗi không do người dùng gây ra, Dev Pồ đổi hoặc sửa miễn phí.",
  },
  {
    question: "Có mua iPad kèm Apple Pencil và bàn phím không?",
    answer:
      "Có. Dev Pồ bán kèm Apple Pencil 1, Apple Pencil 2, Smart Keyboard và Magic Keyboard tuỳ theo dòng máy bạn chọn. Trên mỗi sản phẩm đều ghi rõ máy dùng được đời bút nào, vì Apple Pencil 1 và 2 không dùng lẫn cho nhau được.",
  },
  {
    question: "Dev Pồ có giao iPad đi tỉnh không?",
    answer:
      "Có. Dev Pồ giao hàng toàn quốc, hỗ trợ quay video quá trình đóng gói và test máy trước khi gửi. Khách ở TP.HCM có thể ghé trực tiếp 3/39A Bình Giã, Phường Tân Bình để xem máy và test tại chỗ.",
  },
];

// Các bài cẩm nang về iPad — lọc theo tag để tự cập nhật khi viết thêm bài mới
const ipadGuides = guides
  .filter((g) => g.tags.some((t) => t.toLowerCase().includes("ipad")))
  .slice(0, 6);

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/ipad`,
  url: `${SITE_URL}/ipad`,
  name: "iPad cũ giá tốt tại Dev Pồ",
  description:
    "Danh mục iPad Pro, iPad Air, iPad Mini và iPad Gen cũ nguyên zin tại TP.HCM, lọc theo dòng máy, kết nối Wi-Fi / Cellular, dung lượng và tình trạng máy.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: ipadProducts.length,
    itemListElement: ipadProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/products/${p.slug}`,
    })),
  },
};

// Gợi ý chọn máy theo nhu cầu — nội dung SEO riêng của trang danh mục
const USE_CASES = [
  {
    title: "Học sinh, sinh viên",
    pick: "iPad Gen hoặc iPad Air đời cũ",
    desc: "Ghi chú bằng Apple Pencil, đọc giáo trình PDF, học online và xem phim. Ưu tiên máy màn hình từ 10.2 inch trở lên, dung lượng 64GB, có thể chọn bản Wi-Fi để tiết kiệm.",
  },
  {
    title: "Vẽ, thiết kế, dựng video",
    pick: "iPad Pro hoặc iPad Air 5",
    desc: "Cần màn hình ép kính, chip mạnh và hỗ trợ Apple Pencil 2. iPad Pro có thêm ProMotion 120Hz cho nét vẽ bám tay; iPad Air 5 chạy chip M1 xử lý tốt Procreate nhiều lớp.",
  },
  {
    title: "Làm việc, họp online",
    pick: "iPad Air 4 / Air 5 bản Cellular",
    desc: "Camera trước có Center Stage bám theo người khi họp, ghép Magic Keyboard là thành laptop nhẹ. Bản Cellular giúp bạn online ngay cả khi đang di chuyển.",
  },
  {
    title: "Giải trí, cho bé học",
    pick: "iPad Gen dung lượng vừa",
    desc: "Xem YouTube, Netflix, học tiếng Anh và chơi game nhẹ. Ưu tiên máy pin còn tốt, hình thức đẹp và giá mềm để không tiếc khi bé dùng hằng ngày.",
  },
];

export default function IpadPage() {
  return (
    <main className="min-h-screen dark:bg-background">
      <JsonLd
        data={[
          collectionSchema,
          breadcrumbSchema([
            { name: "Trang chủ", url: SITE_URL },
            { name: "iPad", url: `${SITE_URL}/ipad` },
          ]),
        ]}
      />

      {/* Hero danh mục — H1 nhắm từ khoá "iPad cũ" */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white px-4 py-12 dark:from-[#0b0f19] dark:to-background sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            iPad cũ giá tốt{" "}
            <span className="text-primary">TP. Hồ Chí Minh</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            iPad Pro, iPad Air, iPad Mini và iPad Gen đã qua kiểm tra kỹ màn hình,
            cảm ứng, pin, khe SIM và tình trạng iCloud. Lọc nhanh theo dòng máy,
            bản Wi-Fi hay Wi-Fi + Cellular, dung lượng và tình trạng máy để tìm
            đúng chiếc hợp với bạn.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="#danh-sach-ipad">Xem iPad đang bán</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/guides/chon-dong-ipad-phu-hop">
                Chưa biết chọn dòng nào?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bộ lọc + lưới sản phẩm */}
      <IpadGrid />

      {/* Gợi ý chọn iPad theo nhu cầu */}
      <section className="w-full px-4 py-12 sm:py-16">
        <div className="container mx-auto">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Chọn iPad theo nhu cầu, không chọn theo tên đời máy
            </h2>
            <p className="mt-3 text-muted-foreground">
              Đời máy cao chưa chắc là lựa chọn đúng. Điều quyết định là bạn dùng
              iPad để làm gì, và cần bản Wi-Fi hay bản lắp được SIM.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {USE_CASES.map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md sm:p-5"
              >
                <h3 className="text-md font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="flex items-start gap-2 text-sm font-medium text-primary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item.pick}</span>
                </p>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cẩm nang iPad */}
      {ipadGuides.length > 0 && (
        <section className="w-full bg-slate-50 px-4 py-12 dark:bg-[#0b0f19] sm:py-16">
          <div className="container mx-auto">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Cẩm nang mua iPad
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Đọc trước khi xuống tiền: chọn dòng máy, chọn dung lượng, chọn
                  bút và cách kiểm tra iCloud ẩn trên máy cũ.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/guides">
                  Tất cả cẩm nang <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {ipadGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={guide.imageUrl}
                      alt={guide.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {guide.title}
                    </h3>
                    <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {guide.excerpt}
                    </p>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {guide.readingTime} phút đọc
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nội dung SEO — vì sao mua iPad tại Dev Pồ */}
      <section className="w-full px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Mua iPad cũ tại Dev Pồ có gì khác?
          </h2>
          <div className="mt-5 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Dev Pồ được biết đến nhiều nhất với mảng{" "}
              <Link href="/iphonelock" className="text-primary hover:underline">
                iPhone Lock
              </Link>{" "}
              và iPhone Quốc tế, nhưng quy trình kiểm máy khắt khe của mảng đó
              cũng chính là thứ chúng tôi áp dụng cho iPad. Mỗi chiếc iPad về
              kho đều đi qua cùng một danh sách kiểm tra: màn hình có ám/hở sáng
              không, cảm ứng đa điểm có điểm chết không, độ chai pin bao nhiêu,
              loa - mic - camera - cổng sạc có zin không, khe SIM còn nhận sóng
              không, và quan trọng nhất là máy có sạch iCloud, sạch Activation
              Lock, sạch hồ sơ MDM hay không.
            </p>
            <p>
              Trên website, mỗi sản phẩm iPad đều ghi rõ ba thứ khách hay hỏi
              nhất mà nhiều nơi bỏ trống: máy là bản{" "}
              <strong className="text-foreground">Wi-Fi hay Wi-Fi + Cellular</strong>
              , đang có những{" "}
              <strong className="text-foreground">mức dung lượng</strong> nào, và
              máy dùng được{" "}
              <strong className="text-foreground">Apple Pencil đời mấy</strong>.
              Nhờ vậy bạn không cần nhắn tin hỏi lại từng máy mới biết có hợp nhu
              cầu hay không.
            </p>
            <p>
              Giá iPad cũ dao động theo tình trạng máy và dung lượng, nên bảng
              giá trên trang là mức khởi điểm. Nhắn Zalo để được báo giá chính
              xác theo đúng cấu hình bạn cần, kèm tư vấn nên lấy bản Wi-Fi hay
              Cellular. Cửa hàng hỗ trợ trả góp 0%, giao hàng toàn quốc và bảo
              hành tại cửa hàng.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link
                href="https://zalo.me/4289073059490896771"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nhắn Zalo báo giá iPad
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/products">Xem toàn bộ sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>

      <FaqSection
        items={ipadFaqs}
        title="Câu hỏi thường gặp khi mua iPad"
        subtitle="Những điều khách hỏi nhiều nhất trước khi chốt một chiếc iPad cũ tại Dev Pồ"
      />
    </main>
  );
}
