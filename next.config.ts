import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false, // ẩn header X-Powered-By

  images: {
    // Ưu tiên AVIF > WebP, fallback JPEG/PNG cho trình duyệt cũ
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Chuẩn hóa domain: redirect non-www -> www (tránh duplicate content)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "devpo.vn" }],
        destination: "https://www.devpo.vn/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
