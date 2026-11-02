import "./globals.css";
import CartProvider from "../components/CartProvider";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(site),
  title: { default: "LUXITECH | Technology for Everyone", template: "%s | LUXITECH" },
  description: "Discover smarter technology for everyday life. Shop affordable tech accessories at LUXITECH.",
  openGraph: { siteName: "LUXITECH", locale: "en_ZA", type: "website" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-ZA">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
