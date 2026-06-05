import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Ticker } from "./components/ticker";
import { FloatingContacts } from "./components/floating-contacts";
import { SiteFooter } from "./components/footer";
import { JsonLd } from "@/components/seo/JsonLd";
import Script from "next/script";

// LocalBusiness Schema — giúp Google hiển thị thông tin cửa hàng (địa chỉ, giờ mở cửa, đánh giá)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Dev Pồ - DevpoStore",
  url: "https://www.devpo.vn",
  logo: "https://www.devpo.vn/devpo_logo.jpg",
  description:
    "Chuyên cung cấp iPhone Lock và iPhone Quốc tế chính hãng, giá tốt tại TP. Hồ Chí Minh",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3/39A Bình Giã, P.Tân Bình",
    addressLocality: "TP. Hồ Chí Minh",
    addressCountry: "VN",
  },
  telephone: "+840399208037",
  openingHours: "Mo-Su 08:00-21:00",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.799541789350657,
    longitude: 106.64109797609562,
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61576332353912",
    "https://www.tiktok.com/@devpo_iphone",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "9.9",
    bestRating: "10",
    ratingCount: "1800",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // tránh FOIT / layout shift; next/font tự preload + self-host
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devpo.vn"),
  title: {
    default: "Dev Pồ - Chuyên iPhone Lock, Quốc tế giá tốt",
    template: "%s | Dev Pồ",
  },
  description:
    "Chuyên cung cấp iPhone Lock và iPhone Quốc tế chính hãng, giá tốt tại TP. Hồ Chí Minh. Dev Pồ là địa chỉ mua bán iPhone uy tín, chuyên fix lỗi, ghép sim iPhone Lock chuyên nghiệp.",
  keywords: [
    "iPhone Lock",
    "iPhone Quốc tế",
    "mua iPhone HCM",
    "iPhone giá rẻ",
    "ghép sim iPhone Lock",
    "DevpoStore",
    "Dev Pồ",
    "fix lỗi iphone lock",
    "iphone tp hồ chí minh",
    "iphone uy tín",
  ],
  authors: [{ name: "Dev Pồ", url: "https://www.devpo.vn" }],
  creator: "Dev Pồ",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://www.devpo.vn",
    siteName: "Dev Pồ - DevpoStore",
    title: "Dev Pồ - Chuyên iPhone Lock, Quốc tế giá tốt tại HCM",
    description:
      "Mua iPhone Lock & Quốc tế chính hãng, giá tốt tại TP.HCM. Bảo hành trọn đời lỗi sim ghép, fix lỗi chuyên nghiệp tại Dev Pồ.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dev Pồ - Chuyên iPhone Lock tại TP.HCM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Pồ - Chuyên iPhone Lock, Quốc tế",
    description:
      "Mua iPhone Lock & Quốc tế chính hãng, giá tốt tại TP.HCM. Bảo hành trọn đời lỗi sim ghép tại Dev Pồ.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // Lưu ý: canonical được đặt riêng ở từng trang (xem app/page.tsx, /products...)
  // KHÔNG đặt canonical mặc định ở đây, vì nó sẽ khiến mọi trang con trỏ canonical
  // về trang chủ -> Google bỏ index các trang con.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        {/* Tăng tốc kết nối tới các domain external dùng nhiều (CTA Zalo/Messenger) */}
        <link rel="preconnect" href="https://zalo.me" />
        <link rel="preconnect" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://zalo.me" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={localBusinessSchema} />
        <Header />
        <Ticker />

        <main className="h-full">{children}</main>

        <SiteFooter />
        <FloatingContacts />
      </body>
    </html>
  );
}
