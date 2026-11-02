import { supabaseService } from "../../../../lib/supabase-admin";
import { verifyYocoWebhook } from "../../../../lib/yoco";

// Yoco calls this when a payment succeeds. This (not the success redirect) is what marks an order paid.
export async function POST(request) {
  const raw = await request.text(); // must be the untouched body for signature verification
  if (!verifyYocoWebhook(raw, request.headers)) return new Response("Invalid signature", { status: 401 });

  let event;
  try { event = JSON.parse(raw); } catch { return new Response("Bad payload", { status: 400 }); }

  if (event.type === "payment.succeeded") {
    const payment = event.payload || {};
    const checkoutId = payment.metadata?.checkoutId;
    if (checkoutId && payment.currency === "ZAR") {
      const { data, error } = await supabaseService().rpc("mark_order_paid", {
        p_checkout_id: checkoutId, p_payment_ref: payment.id, p_amount_cents: payment.amount
      });
      if (error) { console.error("mark_order_paid failed", error); return new Response("Error", { status: 500 }); } // Yoco will retry
      if (data?.result === "amount_mismatch") console.error("Yoco amount mismatch for checkout", checkoutId);
    }
  }
  return new Response("ok", { status: 200 });
}
