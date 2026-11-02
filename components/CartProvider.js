"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { money } from "../lib/money";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);
const KEY = "luxitech-cart-v1";

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} } }, [items, ready]);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(""), 2200); return () => clearTimeout(t); }, [notice]);

  // The cart only stores display data. The server re-prices everything from the database at checkout.
  const add = useCallback((product, quantity = 1) => {
    setItems((current) => {
      const max = product.stock ?? 20;
      const found = current.find((i) => i.id === product.id);
      if (found) return current.map((i) => i.id === product.id ? { ...i, stock: max, quantity: Math.min(i.quantity + quantity, max, 20) } : i);
      return [...current, { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, stock: max, quantity: Math.min(quantity, max, 20) }];
    });
    setNotice(`${product.name} added to your bag`);
  }, []);

  const changeQuantity = useCallback((id, change) => {
    setItems((current) => current
      .map((i) => i.id === id ? { ...i, quantity: Math.min(i.quantity + change, i.stock ?? 20, 20) } : i)
      .filter((i) => i.quantity > 0));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const value = useMemo(() => ({ items, ready, count, subtotal, add, changeQuantity, clear, open, setOpen }), [items, ready, count, subtotal, add, changeQuantity, clear, open]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {notice && <div className="toast" role="status">{notice}</div>}
      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping bag">
            <div className="drawer-header">
              <div><span className="eyebrow">YOUR SELECTION</span><h2>Your bag <span>({count})</span></h2></div>
              <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close bag"><X /></button>
            </div>
            {items.length ? (
              <>
                <div className="cart-items">
                  {items.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-thumb">{item.image && <Image src={item.image} alt="" fill sizes="90px" />}</div>
                      <div className="cart-item-info">
                        <Link href={`/products/${item.slug}`} onClick={() => setOpen(false)}><strong>{item.name}</strong></Link>
                        <span>{money(item.price)}</span>
                        <div className="quantity">
                          <button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                  <small>Delivery is calculated at checkout.</small>
                  <Link className="button button-dark checkout-button" href="/checkout" onClick={() => setOpen(false)}>Continue to checkout <ArrowRight size={17} /></Link>
                </div>
              </>
            ) : (
              <div className="cart-empty">
                <ShoppingBag size={30} /><h3>Your bag is looking light.</h3><p>Find something useful for your everyday.</p>
                <Link className="button button-dark" href="/shop" onClick={() => setOpen(false)}>Explore products <ArrowRight size={16} /></Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </CartContext.Provider>
  );
}
