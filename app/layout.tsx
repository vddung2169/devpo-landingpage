import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/header";
import { Ticker } from "./components/ticker";
import { Footer } from "react-day-picker";
import { FloatingContacts } from "./components/floating-contacts";
import { SiteFooter } from "./components/footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Pồ (DevpoStore) - Chuyên iPhone Lock, Quốc tế giá tốt",
  description:
    "Cửa hàng điện thoại Dev Pồ. Chuyên cung cấp các dòng iPhone Lock, Quốc tế chính hãng, uy tín. Hướng dẫn fix lỗi, ghép sim iPhone Lock chi tiết nhất.",
  keywords: [
    "Dev Pồ",
    "devpo",
    "devpostore",
    "iphone lock",
    "ghép sim iphone",
    "fix lỗi iphone lock",
    "hướng dẫn iphone lock",
    "iphone giá rẻ",
    "iphone quốc tế",
    "iphone chính hãng",
    "hỗ trợ iphone lock",
    "iphone tp hồ chí minh",
    "iphone hà nội",
    "iphone giá tốt",
    "iphone uy tín",
    "iphone chất lượng",
    "iphone bảo hành trọn đời",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Header />
        <Ticker />

        <main className="min-h-screen">{children}</main>

        <SiteFooter />
        <FloatingContacts />
        <Script
          src="https://app.preny.ai/embed-global.js"
          strategy="lazyOnload"
          data-name-bot="bot-devpo"
          data-button-style="width:200px;height:200px;"
          data-language="vi"
          data-preny-bot-id="699c17a7ba152736d058318e"
        />
      </body>
    </html>
  );
}
