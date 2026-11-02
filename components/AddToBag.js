"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export default function AddToBag({ product }) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const max = Math.min(product.stock, 20);
  if (product.stock <= 0) return <button className="button button-dark" disabled>Sold out</button>;
  return (
    <div className="add-row">
      <div className="quantity">
        <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
        <span>{qty}</span>
        <button onClick={() => setQty(Math.min(max, qty + 1))} aria-label="Increase quantity">+</button>
      </div>
      <button className="button button-dark" onClick={() => { add(product, qty); setOpen(true); }}><ShoppingBag size={17} /> Add to bag</button>
    </div>
  );
}
