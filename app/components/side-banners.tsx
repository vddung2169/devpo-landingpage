import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, MessageCircle, Scale, ShieldCheck, Signal, Sparkles, Wrench } from "lucide-react";

import { featuredRank, priceToNumber, products, ZALO_LINK, type Product, type ProductCategory } from "@/data/products";
import { cn, formatVND } from "@/lib/utils";
import { PromoPopup, type PromoProduct } from "./promo-popup";

/**
 * Banner dọc hai bên cho các trang nội dung hẹp (fix lỗi, công cụ...).
 * Chỉ hiện khi màn hình đủ rộng để hai lề trống (≥1440px), nên không
 * chiếm chỗ của nội dung chính trên laptop nhỏ, tablet hay điện thoại.
 */

/** Máy nổi bật nhất có giá rõ ràng trong một nhóm. */
function topProducts(category: ProductCategory, count: number): Product[] {
  return products
    .filter((p) => p.category === category && priceToNumber(p.priceFrom) > 0)
    .sort((a, b) => featuredRank(a) - featuredRank(b) || priceToNumber(b.priceFrom) - priceToNumber(a.priceFrom))
    .slice(0, count);
}

function saving(p: Product) {
  const now = priceToNumber(p.priceFrom);
  const was = p.priceOriginal ? priceToNumber(p.priceOriginal) : 0;
  return was > now && now > 0 ? was - now : 0;
}

/** Banner trái: máy đang bán, dẫn khách sang xem máy. */
/**
 * Máy đang chạy quảng cáo (banner trái + cửa sổ trên màn nhỏ), theo thứ tự hiển thị.
 * Máy đầu tiên là thẻ lớn. Đổi máy quảng cáo chỉ cần sửa danh sách này.
 */
const PROMO_SLUGS = [
  "iphone-18-pro-max-lock",
  "iphone-17-pro-max-lock",
  "iphone-16-pro-max-quoc-te",
];

/** Máy quảng cáo còn trong data (slug bị xoá thì tự bỏ qua); thiếu hết thì lấy máy Lock nổi bật. */
function promoProducts(): Product[] {
  const list = PROMO_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is Product => Boolean(p),
  );
  return list.length ? list : topProducts("lock", 3);
}

export function ProductRail() {
  const [hero, ...rest] = promoProducts();
  const ipad = topProducts("ipad", 1)[0];
  const compact = ipad ? [...rest, ipad] : rest;
  if (!hero) return null;
  const heroSave = saving(hero);

  return (
    <aside aria-label="Máy đang bán tại Dev Pồ" className="flex flex-col gap-3">
      <Link
        href={`/products/${hero.slug}`}
        className="group block overflow-hidden rounded-media bg-foreground text-background shadow-e3"
      >
        <div className="px-4 pt-4">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-background/60">
            {hero.badge ?? "Đang có sẵn"}
          </p>
          <p className="mt-1 text-base font-semibold leading-snug tracking-tight">{hero.name}</p>
        </div>
        <div className="relative mx-auto mt-2 aspect-square w-[85%] overflow-hidden rounded-2xl">
          <Image
            src={hero.image}
            alt={hero.name}
            fill
            sizes="200px"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
        <div className="px-4 pb-4">
          <p className="font-mono text-lg font-semibold tracking-tight">{hero.priceFrom}</p>
          {heroSave >= 500000 && (
            <p className="mt-0.5 text-[0.75rem] font-semibold text-background/70">Rẻ hơn {formatVND(heroSave)}</p>
          )}
          <span className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-background py-2 text-sm font-semibold text-foreground transition-colors group-hover:bg-background/90">
            Xem máy <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      {compact.map((p, i) => (
        <Link
          key={p.slug}
          href={`/products/${p.slug}`}
          className={cn(
            "group flex items-center gap-3 rounded-media bg-surface p-2.5 transition-colors hover:bg-secondary",
            // Màn thấp: bớt thẻ cuối để banner không dài quá chiều cao màn hình
            i === compact.length - 1 && i > 0 && "[@media(max-height:860px)]:hidden",
          )}
        >
          <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-background">
            <Image src={p.image} alt="" fill sizes="56px" className="object-contain p-1" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">{p.name}</span>
            <span className="block font-mono text-[0.8125rem] font-semibold text-price">{p.priceFrom}</span>
          </span>
        </Link>
      ))}

      <div className="grid grid-cols-2 gap-2 text-center text-[0.8125rem] font-semibold">
        <Link href="/featured-products" className="rounded-full border border-border py-2 transition-colors hover:border-foreground/40">
          iPhone
        </Link>
        <Link href="/ipad" className="rounded-full border border-border py-2 transition-colors hover:border-foreground/40">
          iPad
        </Link>
      </div>
    </aside>
  );
}

const EXPLORE_LINKS = [
  { href: "/cong-cu-mua-iphone/tra-gop", label: "Tính trả góp 0%", icon: Calculator },
  { href: "/cong-cu-mua-iphone/tu-van-may", label: "Tư vấn chọn máy", icon: Sparkles },
  { href: "/#lock", label: "Lock hay Quốc tế?", icon: Scale },
  { href: "/fix-loi", label: "Fix lỗi iPhone Lock", icon: Wrench },
  { href: "/cong-cu-mua-iphone/bypass-mdm", label: "Bypass MDM", icon: ShieldCheck },
  { href: "/imsi-codes", label: "Bảng mã IMSI", icon: Signal },
  { href: "/guides", label: "Cẩm nang iPhone", icon: BookOpen },
];

/** Lời mời nhắn Zalo ở cuối banner phải, theo nhu cầu của khách trên từng trang. */
const ZALO_PITCH: Record<string, { title: string; body: string }> = {
  "/fix-loi": {
    title: "Làm mãi chưa được?",
    body: "Gửi ảnh Cài đặt → Di động, kỹ thuật Dev Pồ hướng dẫn tiếp miễn phí.",
  },
  "/imsi-codes": {
    title: "Không chắc mã nào?",
    body: "Gửi tên nhà mạng của máy, kỹ thuật Dev Pồ chỉ mã đúng miễn phí.",
  },
  "/cong-cu-mua-iphone/tra-gop": {
    title: "Cần gói trả góp chính xác?",
    body: "Nhắn Dev Pồ đời máy muốn mua, shop tính gói phù hợp cho bạn.",
  },
};
const DEFAULT_PITCH = {
  title: "Cần tư vấn thêm?",
  body: "Nhắn Dev Pồ để được báo giá, tư vấn chọn máy hoặc hỗ trợ kỹ thuật miễn phí.",
};

/** Banner phải: các trang khác của web + nút nhắn kỹ thuật. */
export function ExploreRail({ currentPath }: { currentPath?: string }) {
  const links = EXPLORE_LINKS.filter((l) => l.href !== currentPath);
  const pitch = (currentPath && ZALO_PITCH[currentPath]) || DEFAULT_PITCH;

  return (
    <aside aria-label="Khám phá thêm" className="flex flex-col gap-3">
      <nav className="rounded-media bg-surface p-2">
        <p className="px-2.5 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Khám phá thêm
        </p>
        <ul>
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">{label}</span>
                <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <a
        href={ZALO_LINK}
        target="_blank"
        rel="noopener noreferrer"
        // Màn hình thấp: ẩn thẻ này để không đè lên nút chat nổi góc phải (vốn đã có Zalo)
        className="group block rounded-media border border-border p-4 transition-colors hover:border-foreground/40 [@media(max-height:820px)]:hidden"
      >
        <MessageCircle className="size-5 text-foreground" />
        <p className="mt-2 text-sm font-semibold leading-snug text-foreground">{pitch.title}</p>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{pitch.body}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
          Nhắn Zalo <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </a>
    </aside>
  );
}

/** Máy đưa lên cửa sổ quảng cáo ở màn nhỏ — cùng danh sách với banner trái. */
function promoPopupProducts(): PromoProduct[] {
  return promoProducts().map((p) => {
    const save = saving(p);
    return {
      slug: p.slug,
      name: p.name,
      image: p.image,
      priceFrom: p.priceFrom,
      badge: p.badge,
      savingText: save >= 500000 ? `Rẻ hơn ${formatVND(save)}` : undefined,
    };
  });
}

/**
 * Khung 3 cột: banner trái · nội dung · banner phải.
 * Dưới 1440px chỉ còn cột nội dung (max-w-5xl như cũ) và một cửa sổ quảng cáo có nút X.
 */
export function WithSideBanners({
  children,
  currentPath,
  className,
  popup = true,
}: {
  children: React.ReactNode;
  currentPath?: string;
  className?: string;
  /** Tắt cửa sổ quảng cáo ở màn nhỏ (vd. trang form, tránh che khi khách đang điền). */
  popup?: boolean;
}) {
  const promo = popup ? promoPopupProducts() : [];
  return (
    <div
      className={cn(
        // 1440–1679px: nội dung thu còn 60rem để hai banner đủ rộng;
        // từ 1680px: nội dung 64rem như cũ và chừa lề phải cho nút chat nổi.
        "min-[1440px]:grid min-[1440px]:grid-cols-[minmax(0,1fr)_minmax(0,60rem)_minmax(0,1fr)] min-[1440px]:gap-6 min-[1440px]:px-4",
        "min-[1680px]:grid-cols-[minmax(0,1fr)_minmax(0,64rem)_minmax(0,1fr)] min-[1680px]:gap-10 min-[1680px]:px-20",
        className,
      )}
    >
      <div className="hidden min-[1440px]:block">
        <div className="sticky top-24 ml-auto w-full max-w-[220px] pt-8">
          <ProductRail />
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl min-w-0">{children}</div>
      <div className="hidden min-[1440px]:block">
        <div className="sticky top-24 mr-auto w-full max-w-[220px] pt-8">
          <ExploreRail currentPath={currentPath} />
        </div>
      </div>
      {/* Màn dưới 1440px không có banner hai bên → hiện cửa sổ quảng cáo thay thế */}
      {promo.length > 0 && <PromoPopup products={promo} />}
    </div>
  );
}
