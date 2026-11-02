import { supabase } from "./supabase";
import { products as sample } from "../data/products";

const MEDIA = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "").replace(/\/$/, "");
export const PAGE_SIZE = 12;

const COLUMNS = "id,slug,name,description,price_cents,compare_at_cents,badge,stock_quantity,media:product_media(kind,storage_key,position)";

function mapProduct(p) {
  const media = [...(p.media || [])].sort((a, b) => a.position - b.position)
    .map((m) => ({ kind: m.kind, url: `${MEDIA}/${m.storage_key}` }));
  return {
    id: p.id, slug: p.slug, name: p.name, description: p.description || "",
    category: p.category?.name || "", categorySlug: p.category?.slug || "",
    price: p.price_cents / 100, oldPrice: p.compare_at_cents ? p.compare_at_cents / 100 : null,
    tag: p.badge || "", stock: p.stock_quantity, gallery: media,
    image: media.find((m) => m.kind === "image")?.url || null,
    video: media.find((m) => m.kind === "video")?.url || null
  };
}

// ── Local-dev fallback when Supabase isn't configured ──
const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");
const sampleProducts = () => sample.map((p) => ({
  id: p.id, slug: p.id, name: p.name, description: p.description, category: p.category, categorySlug: slug(p.category),
  price: p.price, oldPrice: p.oldPrice, tag: p.tag, stock: 99, gallery: [{ kind: "image", url: p.image }], image: p.image, video: null
}));

export async function getCategories() {
  const db = supabase();
  if (!db) return [...new Set(sample.map((p) => p.category))].map((name) => ({ id: name, name, slug: slug(name), tagline: "", image_url: null }));
  const { data, error } = await db.from("categories").select("id,name,slug,tagline,image_url").order("position");
  if (error) throw error;
  return data;
}

export async function searchProducts({ q = "", category = "", sort = "newest", page = 1, limit = PAGE_SIZE } = {}) {
  const db = supabase();
  const term = q.replace(/[%,()*\\]/g, " ").trim().slice(0, 80);

  if (!db) {
    let list = sampleProducts().filter((p) =>
      (!category || p.categorySlug === category) && (!term || `${p.name} ${p.description}`.toLowerCase().includes(term.toLowerCase())));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return { products: list.slice((page - 1) * limit, page * limit), total: list.length };
  }

  const select = category
    ? `${COLUMNS},category:categories!inner(name,slug)`
    : `${COLUMNS},category:categories(name,slug)`;
  let query = db.from("products").select(select, { count: "exact" }).eq("status", "active");
  if (category) query = query.eq("category.slug", category);
  if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);

  const order = {
    "price-asc": ["price_cents", true], "price-desc": ["price_cents", false],
    name: ["name", true], newest: ["created_at", false]
  }[sort] || ["created_at", false];
  query = query.order(order[0], { ascending: order[1] }).order("id").range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data.map(mapProduct), total: count ?? 0 };
}

export async function getProduct(productSlug) {
  const db = supabase();
  if (!db) return sampleProducts().find((p) => p.slug === productSlug) || null;
  const { data, error } = await db.from("products")
    .select(`${COLUMNS},category:categories(name,slug)`).eq("slug", productSlug).eq("status", "active").maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function getSlugs() {
  const db = supabase();
  if (!db) return sampleProducts().map((p) => ({ slug: p.slug, updated: new Date() }));
  const { data, error } = await db.from("products").select("slug,updated_at").eq("status", "active").limit(5000);
  if (error) throw error;
  return data.map((p) => ({ slug: p.slug, updated: new Date(p.updated_at) }));
}
