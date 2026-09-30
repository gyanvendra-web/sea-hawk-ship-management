import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ConsentBanner } from "@/components/Consent";
import { site } from "@/lib/site";
import { ogImage } from "@/lib/images";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Ship Management Company in India | Sea Hawk Ship Management", template: "%s" },
  openGraph: { siteName: site.name, type: "website", locale: "en_IN", images: [{ url: ogImage, width: 1200, height: 630, alt: "Sea Hawk Ship Management" }] },
  robots: process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${archivo.variable} ${publicSans.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to main content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
