import { getCategories, getSlugs } from "../lib/catalogue";

export const revalidate = 3600;

export default async function sitemap() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const [slugs, categories] = await Promise.all([getSlugs(), getCategories()]);
  return [
    { url: site, changeFrequency: "daily", priority: 1 },
    { url: `${site}/shop`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: `${site}/shop?category=${c.slug}`, changeFrequency: "daily", priority: 0.7 })),
    ...slugs.map((p) => ({ url: `${site}/products/${p.slug}`, lastModified: p.updated, changeFrequency: "weekly", priority: 0.8 }))
  ];
}
