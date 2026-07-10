import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/categories",
  "/about",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/terms",
  "/returns",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ per_page: 100 }).catch(() => ({ data: [] })),
  ]);

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/shop?category=${category.slug}`,
    lastModified: new Date(),
  }));

  const productEntries: MetadataRoute.Sitemap = (products.data ?? []).map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
