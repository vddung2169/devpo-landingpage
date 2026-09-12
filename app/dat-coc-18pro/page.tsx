import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Check, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { ZALO_LINK } from "@/data/products";
import { PriceTable } from "./price-table";
import {
  HIGHLIGHT_SPECS,
  MODELS,
  PROMOS,
  TIMELINE,
  TOTAL_PROMO,
  campaignPriceRange,
  formatVnd,
} from "./preorder-data";

const SITE_URL = "https://www.devpo.vn";
const { low: lowPrice } = campaignPriceRange();

/** "iPhone 18 Pro, iPhone 18 Pro Max và iPhone Duo" */
const modelNames = MODELS.map((m) => m.name);
const modelList = `${modelNames.slice(0, -1).join(", ")} và ${modelNames.at(-1)}`;

export const metadata: Metadata = {
  title: `Đặt cọc iPhone 18 Pro, 18 Pro Max & iPhone Duo - Giá từ ${formatVnd(lowPrice)}`,
  description: `Đặt cọc ${modelList} chính hãng tại Dev Pồ TP.HCM. Bảng giá đầy đủ 4 phiên bản 256GB - 2TB từng dòng, giá niêm yết từ ${formatVnd(lowPrice)}. Giữ suất nhận máy đợt đầu từ 18.09, trả góp 0%, giao hàng toàn quốc.`,
  keywords: [
    "đặt cọc iPhone 18 Pro Max",
    "đặt cọc iPhone 18 Pro",
    "đặt cọc iPhone Duo",
    "bảng giá iPhone 18 Pro Max",
    "giá iPhone Duo",
    "iPhone 18 Pro Max giá bao nhiêu",
    "mua iPhone 18 Pro Max TPHCM",
    "Dev Pồ",
  ],
  alternates: { canonical: "/dat-coc-18pro" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: `${SITE_URL}/dat-coc-18pro`,
    siteName: "Dev Pồ - DevpoStore",
    title: `Đặt cọc iPhone 18 Pro, 18 Pro Max & iPhone Duo tại Dev Pồ`,
    description: `Bảng giá đầy đủ ${modelList}. Giá niêm yết từ ${formatVnd(lowPrice)}, trả góp 0%, giao máy từ 18.09.`,
    images: [
      {
        url: "/products/18coc-ngang.JPEG",
        width: 3000,
        height: 928,
        alt: "Đặt cọc iPhone 18 Pro series tại Dev Pồ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt cọc iPhone 18 Pro, 18 Pro Max & iPhone Duo tại Dev Pồ",
    description: `Bảng giá đầy đủ 3 dòng máy mới, giá niêm yết từ ${formatVnd(lowPrice)}. Giao máy từ 18.09.`,
    images: ["/products/18coc-ngang.JPEG"],
  },
};

// Mỗi dòng máy một Product schema riêng, giá gom thành AggregateOffer theo dung lượng
const productSchemas = MODELS.map((model) => {
  const prices = model.storages.map((s) => s.listPrice);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/dat-coc-18pro/#${model.id}`,
    name: `${model.name} chính hãng`,
    // Ưu tiên ảnh sản phẩm thật; chưa có thì lùi về banner chiến dịch
    image: [
      `${SITE_URL}${model.storages.find((s) => s.image)?.image ?? "/products/18coc-ngang.JPEG"}`,
    ],
    description: `${model.name} chính hãng, nhận đặt cọc giữ suất tại Dev Pồ TP.HCM. Đủ ${model.storages.length} phiên bản ${model.storages.map((s) => s.size).join(", ")}, giao máy từ 18.09.`,
    brand: { "@type": "Brand", name: "Apple" },
    category: "iPhone",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: model.storages.length,
      availability: "https://schema.org/PreOrder",
      seller: { "@id": `${SITE_URL}/#store` },
    },
  };
});

// Cam kết khi đặt cọc — điều khách hỏi nhiều nhất trước khi giữ suất
const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: "Hoàn cọc 100% nếu đổi ý",
    desc: "Chưa nhận máy mà bạn muốn huỷ, Dev Pồ hoàn lại đủ tiền cọc, không trừ bất kỳ khoản nào.",
  },
  {
    icon: CalendarClock,
    title: "Nhận máy theo đúng thứ tự cọc",
    desc: "Danh sách đặt cọc được ghi nhận theo thời gian. Cọc trước thì nhận máy trước, không chen ngang.",
  },
  {
    icon: Truck,
    title: "Giao tận nơi toàn quốc",
    desc: "Khách TP.HCM được giao trong ngày máy về. Khách tỉnh được gửi ngay đợt đầu, có video test máy.",
  },
];

const preorderFaqs = [
  {
    question: "Đặt cọc iPhone 18 tại Dev Pồ như thế nào?",
    answer:
      "Bạn chọn dòng máy và dung lượng muốn mua trong bảng giá trên trang rồi bấm Đăng ký ngay, tin nhắn Zalo sẽ tự điền sẵn phiên bản bạn chọn. Nhân viên xác nhận lại cấu hình, hướng dẫn cách giữ suất và ghi tên bạn vào danh sách nhận máy theo đúng thứ tự đăng ký.",
  },
  {
    question: "Nếu đổi ý không mua nữa thì có được hoàn tiền cọc không?",
    answer:
      "Có. Khi bạn chưa nhận máy, Dev Pồ hoàn lại 100% tiền cọc nếu bạn đổi ý, không trừ phí. Bạn chỉ cần nhắn lại qua đúng Zalo đã đặt cọc để cửa hàng xử lý.",
  },
  {
    question: "Đặt cọc rồi thì bao giờ được nhận máy?",
    answer:
      "Máy bắt đầu giao từ 18.09 theo đúng thứ tự đặt cọc. Khách đăng ký sớm nằm trong nhóm nhận máy đợt đầu. Do lượng máy đợt đầu của các bản dung lượng cao và màu mới thường về nhỏ giọt, đăng ký càng sớm thì khả năng nhận máy trong đợt đầu càng cao.",
  },
  {
    question: "Giá cuối trong bảng giá có phải ai cũng được không?",
    answer: `Không hẳn. Giá cuối là mức sau khi cộng dồn tối đa ${formatVnd(TOTAL_PROMO)} gồm ${PROMOS.map((p) => p.label.toLowerCase()).join(" và ")}. Mức giảm thực tế của bạn tuỳ hình thức thanh toán và điều kiện thành viên. Bảng giá này chưa gồm trợ giá thu cũ đổi mới, nếu bạn lên đời từ máy cũ thì nhắn Zalo kèm thông tin máy để được định giá và trừ thêm.`,
  },
  {
    question: "Bảng giá gồm những dòng nào, mỗi dòng có mấy phiên bản?",
    answer: `Trang có bảng giá đầy đủ của ${modelList}. Mỗi dòng có ${MODELS[0].storages.length} phiên bản dung lượng: ${MODELS[0].storages.map((s) => s.size).join(", ")}. Bạn bấm vào tab tên máy để xem bảng giá của dòng tương ứng.`,
  },
  {
    question: "Máy đặt cọc là hàng gì, bảo hành ra sao?",
    answer:
      "Là máy mới 100% nguyên seal, chính hãng, được bảo hành 12 tháng theo tiêu chuẩn Apple tại các trung tâm uỷ quyền. Dev Pồ hỗ trợ kiểm tra máy cùng khách khi bàn giao và hỗ trợ kỹ thuật, cài đặt trọn đời.",
  },
];

export default function DatCoc18ProPage() {
  return (
    <main className="min-h-screen dark:bg-background">
      <JsonLd
        data={[
          ...productSchemas,
          breadcrumbSchema([
            { name: "Trang chủ", url: SITE_URL },
            { name: "Đặt cọc iPhone 18", url: `${SITE_URL}/dat-coc-18pro` },
          ]),
        ]}
      />

      {/* HERO — banner nằm trên tiêu đề, thu gọn lại thay vì tràn hết chiều
          ngang màn hình: bọc trong khung max-w-3xl nên hai bên luôn có khoảng
          trắng, và giới hạn chiều cao để không chiếm trọn màn hình đầu tiên.
          <picture> để trình duyệt CHỈ tải đúng một ảnh: banner ngang từ 640px
          trở lên, banner dọc ở mobile. Nếu render hai <Image> rồi ẩn bằng CSS
          thì cả hai vẫn bị tải. width/height khai báo riêng cho từng nguồn để
          trình duyệt chừa đúng chỗ, không bị giật layout lúc ảnh tải xong. */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white px-4 pt-6 dark:from-[#0b0f19] dark:to-background sm:pt-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-sm">
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet="/products/18coc-ngang.JPEG"
              width={4000}
              height={1000}
            />
            <img
              src="/products/18coc-doc.JPEG"
              alt="iPhone 18 Pro - Dev Pồ nhận đặt cọc giữ suất"
              width={2000}
              height={3000}
              fetchPriority="high"
              className="mx-auto block h-auto max-h-[300px] w-auto max-w-full object-contain sm:max-h-none sm:w-full"
            />
          </picture>
        </div>
      </section>

      {/* Tiêu đề + chốt nhanh thông tin chiến dịch */}
      <section className="w-full bg-gradient-to-b from-white to-white px-4 pb-10 pt-8 dark:from-background dark:to-background sm:pb-14 sm:pt-10">
        <div className="mx-auto max-w-3xl text-center">
        
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Đặt cọc iPhone 18 Pro, 18 Pro Max &amp; iPhone Duo
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Bảng giá đầy đủ cả 3 dòng máy mới, giá niêm yết từ{" "}
            <strong className="text-red-500">{formatVnd(lowPrice)}</strong>. Giữ
            suất sớm để nằm trong nhóm nhận máy ngay đợt hàng đầu tiên.
          </p>

          {/* Mốc thời gian */}
          <div className="mt-7 flex flex-wrap items-stretch justify-center gap-3">
            {TIMELINE.map((item) => (
              <div
                key={item.date}
                className="flex min-w-[150px] flex-1 basis-52 flex-col items-center gap-1 rounded-xl border border-border bg-card px-4 py-3 text-center shadow-sm"
              >
                <span className="text-xl font-bold text-primary">{item.date}</span>
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="#bang-gia">Xem bảng giá &amp; đăng ký</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#thong-so">Xem thông số chi tiết</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bảng giá 3 dòng máy dạng tab */}
      <PriceTable />

      {/* Thông số kỹ thuật */}
      <section
        className="w-full bg-slate-50 px-4 py-12 dark:bg-[#0b0f19] sm:py-16"
        id="thong-so"
      >
        <div className="container mx-auto">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Thông số nổi bật iPhone 18 Pro Max
            </h2>
            <p className="mt-3 text-muted-foreground">
              Thông tin theo công bố chính thức của Apple tại sự kiện ra mắt.
              Thông số iPhone 18 Pro và iPhone Duo đang được cập nhật.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
            {HIGHLIGHT_SPECS.map((group) => (
              <div
                key={group.group}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <h3 className="border-b border-border px-4 py-3 text-sm font-bold text-foreground">
                  {group.group}
                </h3>
                <dl className="divide-y divide-border">
                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <dt className="shrink-0 text-xs text-muted-foreground sm:w-40">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-foreground">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Thông số có thể được Apple điều chỉnh. Dev Pồ cập nhật lại ngay khi
            có thay đổi chính thức.
          </p>
        </div>
      </section>


     
    </main>
  );
}
