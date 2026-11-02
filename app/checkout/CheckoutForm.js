"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { money, SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "../../lib/money";

const PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"];

export default function CheckoutForm() {
  const { items, ready, subtotal } = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const shipping = subtotal * 100 >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS / 100;

  if (!ready) return <main className="checkout section-shell" />;
  if (!items.length) {
    return <main className="checkout section-shell"><h1>Checkout</h1><p>Your bag is empty.</p><Link className="button button-dark" href="/shop">Browse products</Link></main>;
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          customer: { name: f.get("name"), email: f.get("email"), phone: f.get("phone") },
          address: { line1: f.get("line1"), line2: f.get("line2"), suburb: f.get("suburb"), city: f.get("city"), province: f.get("province"), postalCode: f.get("postalCode") }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.redirectUrl; // hosted Yoco payment page
    } catch (err) {
      setError(err.message); setBusy(false);
    }
  }

  return (
    <main className="checkout section-shell">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form onSubmit={submit} className="checkout-form">
          <h2>Contact</h2>
          <label>Full name<input name="name" required autoComplete="name" /></label>
          <div className="two"><label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label></div>
          <h2>Delivery address</h2>
          <label>Street address<input name="line1" required autoComplete="address-line1" /></label>
          <label>Apartment, complex, unit (optional)<input name="line2" autoComplete="address-line2" /></label>
          <div className="two"><label>Suburb<input name="suburb" required /></label><label>City / town<input name="city" required autoComplete="address-level2" /></label></div>
          <div className="two">
            <label>Province<select name="province" required defaultValue=""><option value="" disabled>Select…</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label>Postal code<input name="postalCode" required inputMode="numeric" pattern="\d{4}" maxLength={4} autoComplete="postal-code" /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark pay-button" disabled={busy}>{busy ? "Redirecting to secure payment…" : `Pay ${money(subtotal + shipping)} securely`}</button>
          <small>You’ll be taken to Yoco’s secure payment page. We never see or store your card details.</small>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          {items.map((i) => <div className="sum-line" key={i.id}><span>{i.quantity} × {i.name}</span><span>{money(i.price * i.quantity)}</span></div>)}
          <div className="sum-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="sum-line"><span>Delivery</span><span>{shipping ? money(shipping) : "Free"}</span></div>
          <div className="sum-line total"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
          <small>Final prices are confirmed on our server when you pay.</small>
        </aside>
      </div>
    </main>
  );
}
