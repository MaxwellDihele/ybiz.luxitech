import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div><Link className="wordmark footer-logo" href="/">LUXITECH<span>.</span></Link><p>Technology for everyone.</p></div>
        <div className="footer-links">
          <Link href="/shop">Shop</Link><Link href="/#categories">Categories</Link><Link href="/#about">About</Link>
          <a href="mailto:hello@luxitech.co.za">Contact</a>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} LUXITECH. All rights reserved.</span><span>Designed for everyday discovery.</span></div>
    </footer>
  );
}
