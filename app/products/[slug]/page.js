import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck } from "lucide-react";
import ProductGallery from "../../../components/ProductGallery";
import AddToBag from "../../../components/AddToBag";
import { getProduct } from "../../../lib/catalogue";
import { money, SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "../../../lib/money";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() { return []; } // pages are generated on first visit, then cached

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description?.slice(0, 160) || `Buy ${p.name} at LUXITECH.`,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: p.description?.slice(0, 160), images: p.image ? [p.image] : [] }
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    image: p.gallery.filter((m) => m.kind === "image").map((m) => m.url),
    offers: {
      "@type": "Offer", url: `${site}/products/${p.slug}`, priceCurrency: "ZAR", price: p.price.toFixed(2),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="product-page section-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="breadcrumb"><Link href="/shop">Shop</Link>{p.category && <> / <Link href={`/shop?category=${p.categorySlug}`}>{p.category}</Link></>}</nav>
      <div className="product-layout">
        <ProductGallery gallery={p.gallery} name={p.name} />
        <div className="product-info">
          {p.tag && <span className="product-tag static">{p.tag}</span>}
          <h1>{p.name}</h1>
          <div className="price big">{money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}</div>
          <p className="stock-line">{p.stock <= 0 ? "Sold out" : p.stock <= 5 ? `Only ${p.stock} left in stock` : <><Check size={14} /> In stock</>}</p>
          <p className="long-description">{p.description}</p>
          <AddToBag product={{ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock }} />
          <p className="delivery-note"><Truck size={16} /> Delivery {money(SHIPPING_FLAT_CENTS / 100)} — free over {money(FREE_SHIPPING_THRESHOLD_CENTS / 100)}.</p>
        </div>
      </div>
    </main>
  );
}
