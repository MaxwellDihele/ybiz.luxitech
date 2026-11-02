import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { getCategories, searchProducts, PAGE_SIZE } from "../../lib/catalogue";

export const metadata = { title: "Shop", description: "Browse all LUXITECH technology products." };

const SORTS = [["newest", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["name", "Name A–Z"]];

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const sort = SORTS.some(([v]) => v === sp.sort) ? sp.sort : "newest";
  const page = Math.max(1, parseInt(sp.page, 10) || 1);

  const [categories, { products, total }] = await Promise.all([getCategories(), searchProducts({ q, category, sort, page })]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (overrides) => {
    const params = new URLSearchParams();
    const next = { q, category, sort, page: 1, ...overrides };
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.sort !== "newest") params.set("sort", next.sort);
    if (next.page > 1) params.set("page", String(next.page));
    const s = params.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <main className="products-section section-shell shop-page">
      <div className="section-heading product-heading">
        <div><div className="eyebrow">THE LUXITECH SELECTION</div><h2>{q ? <>Results for <em>“{q}”</em></> : <>All <em>products.</em></>}</h2></div>
        <span className="product-count">{total} PRODUCTS</span>
      </div>

      <form className="shop-search" action="/shop">
        <Search size={17} />
        <input name="q" defaultValue={q} placeholder="Search products" aria-label="Search products" />
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
        <button className="button button-dark" type="submit">Search</button>
      </form>

      <div className="filter-row">
        <div className="filter-tabs" role="group" aria-label="Filter products by category">
          <Link className={!category ? "filter-tab active" : "filter-tab"} href={href({ category: "" })}>All products</Link>
          {categories.map((c) => <Link key={c.id} className={category === c.slug ? "filter-tab active" : "filter-tab"} href={href({ category: c.slug })}>{c.name}</Link>)}
        </div>
      </div>
      <div className="sort-row">
        <span>Sort:</span>
        {SORTS.map(([value, label]) => <Link key={value} className={sort === value ? "sort-link active" : "sort-link"} href={href({ sort: value })}>{label}</Link>)}
      </div>

      {products.length ? (
        <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="empty-state">No products match your search. <Link className="text-link" href="/shop">Clear filters <ArrowRight size={14} /></Link></div>
      )}

      {pages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          {page > 1 ? <Link href={href({ page: page - 1 })}>← Previous</Link> : <span />}
          <span>Page {page} of {pages}</span>
          {page < pages ? <Link href={href({ page: page + 1 })}>Next →</Link> : <span />}
        </nav>
      )}
    </main>
  );
}
