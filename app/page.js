import Home from "../components/Home";
import { getCategories, searchProducts } from "../lib/catalogue";

export const revalidate = 60; // the admin app also triggers instant revalidation

export default async function HomePage() {
  const [categories, { products }] = await Promise.all([getCategories(), searchProducts({ limit: 6 })]);
  return <Home products={products} categories={categories} />;
}
