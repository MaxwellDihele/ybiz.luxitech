export const money = (amount) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(amount);

// Shipping settings are not secret; the same values are used for display and by the checkout API.
export const SHIPPING_FLAT_CENTS = parseInt(process.env.NEXT_PUBLIC_SHIPPING_FLAT_CENTS || "9900", 10);
export const FREE_SHIPPING_THRESHOLD_CENTS = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD_CENTS || "100000", 10);
