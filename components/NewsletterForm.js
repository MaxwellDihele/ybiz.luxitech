"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);
  return (
    <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <input type="email" required placeholder="Your email address" aria-label="Your email address" />
      <button type="submit" aria-label="Subscribe"><ArrowRight /></button>
      <small>{done ? "Thanks for your interest. Newsletter signup is not connected yet." : "Newsletter signup is not connected yet."}</small>
    </form>
  );
}
