import crypto from "node:crypto";

export async function createYocoCheckout({ amountCents, orderId, orderNumber, token }) {
  const base = `${process.env.NEXT_PUBLIC_SITE_URL}/order/${orderId}?token=${token}`;
  const res = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": orderId
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: "ZAR",
      successUrl: `${base}&result=success`,
      cancelUrl: `${base}&result=cancelled`,
      failureUrl: `${base}&result=failed`,
      metadata: { orderId, orderNumber: String(orderNumber) }
    })
  });
  if (!res.ok) throw new Error(`Yoco ${res.status}: ${await res.text()}`);
  return res.json(); // { id, redirectUrl, ... }
}

// Standard Webhooks signature check, as documented by Yoco.
export function verifyYocoWebhook(rawBody, headers) {
  const secret = process.env.YOCO_WEBHOOK_SECRET;
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!secret || !id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 180) return false; // replay protection

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = Buffer.from(
    crypto.createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest("base64")
  );
  return signatures.split(" ").some((part) => {
    const [version, sig] = part.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig);
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
  });
}
