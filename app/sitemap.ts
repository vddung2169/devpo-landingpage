import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { guides } from "@/data/guides";
import { newsArticles } from "@/lib/data";

// Trùng với metadataBase trong app/layout.tsx (canonical = www)
const BASE_URL = "https://www.devpo.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Các trang tĩnh
  const staticPages: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/featured-products", priority: 0.8, changeFrequency: "daily" },
    { path: "/iphonelock", priority: 0.7, changeFrequency: "weekly" },
    { path: "/cong-cu-mua-iphone", priority: 0.7, changeFrequency: "weekly" },
    { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
    { path: "/imsi-codes", priority: 0.7, changeFrequency: "monthly" },
    { path: "/news", priority: 0.6, changeFrequency: "weekly" },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  // Trang chi tiết từng sản phẩm
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Trang chi tiết từng bài cẩm nang / blog
  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Trang chi tiết từng bài viết
  const newsRoutes: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...guideRoutes, ...newsRoutes];
}
