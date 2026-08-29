import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { FloatingContacts } from "./components/floating-contacts";
// import { PromoBanner } from "./components/promo-banner"; // popup quảng cáo — đang tắt
import {
  ConditionalTicker,
  ConditionalFooter,
} from "./components/conditional-chrome";
import { ThemeProvider } from "./components/theme-provider";
import { JsonLd, storeSchema, websiteSchema } from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/next";

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

// viewportFit "cover" cho phép nền tràn ra vùng tai thỏ khi xoay ngang; phần
// padding an toàn (env(safe-area-inset-*)) được xử lý ở body trong globals.css.
// KHÔNG đặt maximumScale/userScalable: khoá zoom là lỗi trợ năng, người dùng
// vẫn phải phóng to được. Chống zoom khi focus input đã xử lý bằng font 16px.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devpo.vn"),
  title: {
    default: "Dev Pồ - Chuyên iPhone Lock, Quốc tế giá tốt",
    template: "%s | Dev Pồ",
  },
  description:
    "Mua iPhone Lock, iPhone Quốc tế và iPad giá tốt tại TP.HCM. Dev Pồ bán máy zin, hỗ trợ fix lỗi sim ghép và bảo hành tận tâm.",
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
      "Mua iPhone Lock, iPhone Quốc tế và iPad giá tốt tại TP.HCM. Máy zin, hỗ trợ fix lỗi sim ghép, bảo hành tận tâm tại Dev Pồ.",
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
      "Mua iPhone Lock, iPhone Quốc tế và iPad giá tốt tại TP.HCM. Máy zin, hỗ trợ fix lỗi sim ghép, bảo hành tận tâm.",
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
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <ConditionalTicker />

          <main className="h-full">{children}</main>

          <ConditionalFooter />
          <FloatingContacts />
          {/* Popup quảng cáo — đang TẮT; bỏ comment dòng dưới (và import ở đầu file) để bật lại */}
          {/* <PromoBanner /> */}
        </ThemeProvider>
        {/* JSON-LD site-wide: ElectronicsStore (local SEO) + WebSite.
            Đặt cuối body để không chen vào phần render nội dung. */}
        <JsonLd data={[storeSchema, websiteSchema]} />
        {/* Vercel Web Analytics — đo lượt truy cập & trang được xem nhiều nhất */}
        <Analytics />
      </body>
    </html>
  );
}
