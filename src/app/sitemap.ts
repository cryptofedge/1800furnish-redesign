import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/catalog";
import { SECURITY_CATEGORIES } from "@/lib/nooksguard/categories";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.flatMap((category) =>
      category.products.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    ),
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${SITE_URL}/security`, changeFrequency: "monthly", priority: 0.8 },
    // Only list security categories with real product pages, not "coming soon" stubs.
    ...SECURITY_CATEGORIES.filter((category) => category.status === "live").map((category) => ({
      url: `${SITE_URL}/security/${category.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
