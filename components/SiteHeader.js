"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "./CartProvider";

export default function SiteHeader() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const close = () => setMenu(false);
  return (
    <>
      <div className="announcement">
        <span>SMARTER FINDS. BETTER EVERYDAY.</span>
        <span className="announcement-right">South African online store <span className="announcement-dot">●</span></span>
      </div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="LuxiTech home">LUXITECH<span>.</span></Link>
        <nav className={`main-nav ${menu ? "nav-open" : ""}`}>
          <Link href="/shop" onClick={close}>Shop</Link>
          <Link href="/#categories" onClick={close}>Categories</Link>
          <Link href="/#about" onClick={close}>Why LuxiTech</Link>
        </nav>
        <div className="header-actions">
          <form className="header-search" action="/shop" role="search">
            <Search size={17} />
            <input name="q" placeholder="Search products" aria-label="Search products" />
          </form>
          <button className="bag-button" onClick={() => setOpen(true)} aria-label={`Open shopping bag, ${count} items`}>
            <ShoppingBag size={19} /><span>Bag</span><b>{count}</b>
          </button>
          <button className="mobile-menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
        </div>
      </header>
    </>
  );
}
