import type { MetadataRoute } from "next";

// Trùng với BASE_URL trong app/sitemap.ts và metadataBase trong app/layout.tsx (canonical = www)
const BASE_URL = "https://www.devpo.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Chặn các route nội bộ không cần index
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
