import Home from "../components/Home";
import { getCategories, getSiteSettings, searchProducts } from "../lib/catalogue";

export const revalidate = 60; // the admin app also triggers instant revalidation

export default async function HomePage() {
  const [categories, settings, { products }] = await Promise.all([getCategories(), getSiteSettings(), searchProducts({ limit: 6 })]);
  return <Home products={products} categories={categories} settings={settings} />;
}
