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
  title: { default: "Ship Management Company in India | Sea Hawk Ship Management", template: "%s | Sea Hawk Ship Management" },
  description: "Sea Hawk Ship Management is a premier ship management company in India, offering commercial management, technical management, crew management, and marine consultancy services globally.",
  keywords: ["Ship Management Company India", "Technical Ship Management", "Crew Management India", "Commercial Ship Management", "Marine Consultancy", "Offshore Support", "Maritime Recruitment"],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  icons: {
    icon: "/images/logo.svg",
    shortcut: "/images/logo.svg",
    apple: "/images/logo.svg",
  },
  openGraph: {
    title: "Ship Management Company in India | Sea Hawk Ship Management",
    description: "Premier ship management company in India providing commercial management, technical management, crew management, and marine consultancy services.",
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_IN",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Sea Hawk Ship Management" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ship Management Company in India | Sea Hawk Ship Management",
    description: "Premier ship management company in India providing commercial, technical, crew management & marine consultancy.",
    images: [ogImage],
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Noida",
    "geo.position": "28.4800;77.5100",
    "ICBM": "28.4800, 77.5100",
  },
  robots: process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Corporation",
      "@id": `${site.url}/#corporation`,
      "name": site.legalName,
      "alternateName": site.name,
      "url": site.url,
      "logo": `${site.url}/images/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": site.phone,
        "contactType": "customer service",
        "email": site.email,
        "areaServed": "Global",
        "availableLanguage": ["English", "Hindi"]
      }
    },
    {
      "@type": "LocalBusiness",
      "@id": `${site.url}/#localbusiness`,
      "name": site.name,
      "image": ogImage.startsWith("http") ? ogImage : `${site.url}${ogImage}`,
      "url": site.url,
      "telephone": site.phone,
      "email": site.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Unit No. S-28, Eighth Floor, URBTECH NPX, Sector 153",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201301",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.4800,
        "longitude": 77.5100
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${publicSans.variable}`}>
      <head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/hero-ship-1.webp" type="image/webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
