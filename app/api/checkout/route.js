import { supabaseService } from "../../../lib/supabase-admin";
import { createYocoCheckout } from "../../../lib/yoco";
import { SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "../../../lib/money";

const PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SAFE_ERRORS = /^(Empty cart|Invalid quantity|Product unavailable|Insufficient stock)/;
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (message, status = 400) => Response.json({ error: message }, { status });

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return fail("Invalid request"); }

  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length || items.length > 30) return fail("Your bag is empty.");
  for (const i of items) {
    if (!UUID.test(i?.id || "") || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 20) return fail("Invalid bag contents.");
  }

  const c = body.customer || {}, a = body.address || {};
  const customer = { name: str(c.name, 100), email: str(c.email, 150).toLowerCase(), phone: str(c.phone, 20) };
  const address = {
    line1: str(a.line1, 150), line2: str(a.line2, 150), suburb: str(a.suburb, 100),
    city: str(a.city, 100), province: str(a.province, 40), postalCode: str(a.postalCode, 4)
  };
  if (customer.name.length < 2) return fail("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return fail("Please enter a valid email address.");
  if (!/^[0-9+\s()-]{7,20}$/.test(customer.phone)) return fail("Please enter a valid phone number.");
  if (!address.line1 || !address.suburb || !address.city) return fail("Please complete your delivery address.");
  if (!PROVINCES.includes(address.province)) return fail("Please choose a province.");
  if (!/^\d{4}$/.test(address.postalCode)) return fail("Postal code must be 4 digits.");

  const db = supabaseService();
  const { data: order, error } = await db.rpc("create_order", {
    p_email: customer.email, p_name: customer.name, p_phone: customer.phone, p_address: address,
    p_items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
    p_shipping_flat_cents: SHIPPING_FLAT_CENTS, p_free_shipping_threshold_cents: FREE_SHIPPING_THRESHOLD_CENTS
  });
  if (error) {
    if (SAFE_ERRORS.test(error.message)) return fail(error.message, 409);
    console.error("create_order failed", error);
    return fail("We couldn't create your order. Please try again.", 500);
  }

  try {
    const checkout = await createYocoCheckout({
      amountCents: order.total_cents, orderId: order.id, orderNumber: order.number, token: order.access_token
    });
    await db.from("orders").update({ checkout_id: checkout.id }).eq("id", order.id);
    return Response.json({ redirectUrl: checkout.redirectUrl });
  } catch (err) {
    console.error("Yoco checkout failed", err);
    // Cancelling releases the reserved stock via the database trigger.
    await db.from("orders").update({ status: "cancelled", notes: "Payment checkout could not be created" }).eq("id", order.id);
    return fail("Payments are temporarily unavailable. Please try again shortly.", 502);
  }
}
