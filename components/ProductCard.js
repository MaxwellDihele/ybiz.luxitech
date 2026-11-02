"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { money } from "../lib/money";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;
  const href = `/products/${product.slug}`;
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={href} className="product-link" aria-label={product.name}>
          {product.image ? <Image src={product.image} alt={product.name} fill sizes="(max-width: 650px) 50vw, 25vw" /> : <div className="media-placeholder">No image</div>}
          {product.video && (
            <video className="product-video" src={product.video} poster={product.image || undefined} muted loop playsInline preload="none"
              onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
          )}
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button className="quick-add" disabled={soldOut} onClick={() => add(product)} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={17} /></button>
      </div>
      <div className="product-meta"><span>{product.category}</span><span>{soldOut ? "Sold out" : product.stock <= 5 ? `Only ${product.stock} left` : ""}</span></div>
      <h3><Link href={href}>{product.name}</Link></h3>
      <p className="product-description">{product.description}</p>
      <div className="product-bottom">
        <div className="price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
        <button disabled={soldOut} onClick={() => add(product)}>Add to bag <ArrowUpRight size={15} /></button>
      </div>
    </article>
  );
}
