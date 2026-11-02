import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseService } from "../../../lib/supabase-admin";
import { money } from "../../../lib/money";
import OrderStatusWatcher from "./OrderStatusWatcher";
import ClearCart from "./ClearCart";

export const metadata = { title: "Your order", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function OrderPage({ params, searchParams }) {
  const { id } = await params;
  const { token, result } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(token || "")) notFound();

  const { data: order } = await supabaseService().from("orders")
    .select("id,number,status,total_cents,shipping_cents,email,tracking_ref,access_token,items:order_items(name,quantity,unit_price_cents)")
    .eq("id", id).maybeSingle();
  if (!order || order.access_token !== token) notFound();

  const paid = ["paid", "processing", "shipped", "delivered"].includes(order.status);
  const waiting = order.status === "pending" && result === "success"; // webhook may take a few seconds

  return (
    <main className="checkout section-shell">
      <h1>Order #{order.number}</h1>
      {paid && <p className="notice ok">Payment received — thank you! A confirmation will be sent to {order.email}.</p>}
      {waiting && <><p className="notice">Confirming your payment…</p><OrderStatusWatcher /></>}
      {order.status === "pending" && !waiting && <p className="notice warn">Payment was not completed. Your items are held for 30 minutes. <Link className="text-link" href="/checkout">Try again</Link></p>}
      {order.status === "cancelled" && <p className="notice warn">This order was cancelled. <Link className="text-link" href="/shop">Continue shopping</Link></p>}
      <p>Status: <strong>{order.status}</strong>{order.tracking_ref && <> · Tracking: <strong>{order.tracking_ref}</strong></>}</p>
      <div className="checkout-summary">
        {order.items.map((i, n) => <div className="sum-line" key={n}><span>{i.quantity} × {i.name}</span><span>{money(i.unit_price_cents * i.quantity / 100)}</span></div>)}
        <div className="sum-line"><span>Delivery</span><span>{order.shipping_cents ? money(order.shipping_cents / 100) : "Free"}</span></div>
        <div className="sum-line total"><span>Total</span><span>{money(order.total_cents / 100)}</span></div>
      </div>
      {paid && <ClearCart />}
    </main>
  );
}
