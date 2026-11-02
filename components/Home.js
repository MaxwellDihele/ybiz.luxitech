import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Headphones, ShieldCheck, Truck, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import NewsletterForm from "./NewsletterForm";

const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";

const DEFAULT_HERO = "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1500&q=90";
const DEFAULT_FEATURE = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=90";

export default function Home({ products, categories, settings = {} }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> TECHNOLOGY FOR EVERYONE</div>
          <h1>Make room<br />for <em>better</em> tech.</h1>
          <p>Thoughtful tech essentials. Everyday upgrades. Prices that make sense.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/shop">Explore the collection <ArrowUpRight size={17} /></Link>
            <Link className="text-link" href="/#about">Discover LuxiTech <ArrowRight size={16} /></Link>
          </div>
          <div className="hero-note"><span className="note-icon"><Check size={14} /></span> Curated for everyday life</div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrap">
            <Image src={settings.hero_image || DEFAULT_HERO} alt="A curated collection of modern technology devices" fill priority sizes="(max-width: 800px) 100vw, 55vw" className="hero-image" />
            <div className="image-caption"><span>THE EVERYDAY EDIT</span><span>01 / 04</span></div>
          </div>
          <div className="floating-label"><Zap size={15} /><span>Small upgrades.<br /><strong>Big difference.</strong></span></div>
        </div>
      </section>

      <section className="trust-strip" id="about">
        <div><Truck /><span><strong>Delivery across SA</strong><small>Clear delivery estimates</small></span></div>
        <div><ShieldCheck /><span><strong>Secure checkout</strong><small>Payments by Yoco</small></span></div>
        <div><Headphones /><span><strong>Here to help</strong><small>Friendly customer support</small></span></div>
        <div><Check /><span><strong>Curated essentials</strong><small>Useful tech, chosen well</small></span></div>
      </section>

      {categories.length > 0 && (
        <section className="category-section section-shell" id="categories">
          <div className="section-heading">
            <div><div className="eyebrow">FIND YOUR NEXT FAVOURITE</div><h2>Shop by <em>category.</em></h2></div>
            <Link className="text-link" href="/shop">View all products <ArrowRight size={16} /></Link>
          </div>
          <div className="category-grid">
            {categories.map((item, index) => (
              <Link className="category-card" key={item.id} href={`/shop?category=${item.slug}`}>
                <Image src={item.image_url || FALLBACK_CATEGORY_IMAGE} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
                <span className="category-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="category-info"><strong>{item.name}</strong><small>{item.tagline}</small></span>
                <span className="category-arrow"><ArrowUpRight size={18} /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="products-section section-shell">
        <div className="section-heading product-heading">
          <div><div className="eyebrow">THE LUXITECH SELECTION</div><h2>Good tech. <em>Good value.</em></h2><p className="section-intro">Useful upgrades for work, play and everything in between.</p></div>
          <Link className="text-link" href="/shop">Shop everything <ArrowRight size={16} /></Link>
        </div>
        {products.length ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="empty-state">New products are on the way.</div>}
      </section>

      <section className="feature-banner">
        <div className="feature-image"><Image src={settings.feature_image || DEFAULT_FEATURE} alt="Minimal laptop and workspace" fill sizes="50vw" /></div>
        <div className="feature-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR SPACE, UPGRADED</div>
          <h2>Better setups<br />start with <em>small things.</em></h2>
          <p>Discover practical accessories that bring a little more ease to your everyday routine.</p>
          <Link className="button button-light" href="/shop?category=workspace">Shop workspace essentials <ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section className="newsletter section-shell">
        <div><div className="eyebrow">THE GOOD TECH EDIT</div><h2>Stay in the <em>know.</em></h2><p>New finds, useful upgrades and occasional offers. No noise.</p></div>
        <NewsletterForm />
      </section>
    </main>
  );
}
