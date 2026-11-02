"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-checks the order every 3s (up to ~1 minute) until the Yoco webhook marks it paid.
export default function OrderStatusWatcher() {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { router.refresh(); if (++n >= 20) clearInterval(t); }, 3000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}
