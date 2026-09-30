import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SubpageHero from "@/components/SubpageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Sea Hawk Ship Management | Noida, India",
  description:
    "Contact Sea Hawk Ship Management in Noida for ship management, crew, technical, commercial, consultancy and seafarer enquiries.",
  alternates: { canonical: "/contact/" },
  openGraph: { title: "Contact Sea Hawk Ship Management | Noida, India", url: "/contact/" },
};

export default function Contact() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit No. S-28, Eighth Floor, URBTECH NPX, Sector 153",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN",
    },
  };

  return (
    <>
      <SubpageHero
        title="Contact Us"
        bgImage="/images/hero-ship-2.webp"
        crumbs={[{ name: "Contact", href: "/contact/" }]}
      />

      <section className="section contact-page-section">
        <div className="wrap">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

          {/* Contact Header Intro */}
          <div className="contact-page-header">
            <span className="script-subtitle">GET IN TOUCH</span>
            <h2 className="contact-main-h2">Let’s Discuss Your Requirement</h2>
            <div className="title-underline left" />
            <p className="contact-lead-desc">
              For ship-management and commercial business enquiries, please share the service required and relevant vessel specifications. Seafarers should use the{" "}
              <Link href="/seafarers/">Seafarer Hub</Link> for candidate profile registration.
            </p>
          </div>

          {/* 2-Column Main Contact Layout */}
          <div className="contact-main-grid">
            {/* Left: Animated Form Card with Ship Image Header */}
            <div className="contact-left-col">
              <ContactForm />
            </div>

            {/* Right: Contact Detail Cards & Info */}
            <div className="contact-right-col">
              <div className="contact-info-card office-card">
                <div className="card-icon-badge">🏢</div>
                <div className="card-info-content">
                  <h3>Headquarters & Office</h3>
                  <p className="company-name"><strong>{site.legalName}</strong></p>
                  <p className="address-text">{site.address}</p>
                  <a
                    href="https://maps.google.com/?q=URBTECH+NPX+Sector+153+Noida"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-link"
                  >
                    📍 Get Directions on Google Maps →
                  </a>
                </div>
              </div>

              <div className="contact-info-card comm-card">
                <div className="card-icon-badge">📞</div>
                <div className="card-info-content">
                  <h3>Direct Phone & Support</h3>
                  <p className="contact-line">
                    <span>Mobile / WhatsApp:</span>
                    <a href={site.phoneHref}><strong>{site.phone}</strong></a>
                  </p>
                  <p className="contact-line">
                    <span>Landline Office:</span>
                    <a href={site.landlineHref}>{site.landline}</a>
                  </p>
                  <div className="sla-badge">
                    <span className="pulse-dot" /> 24/7 Operations Desk
                  </div>
                </div>
              </div>

              <div className="contact-info-card email-card">
                <div className="card-icon-badge">✉️</div>
                <div className="card-info-content">
                  <h3>Official Communications</h3>
                  <p className="contact-line">
                    <span>General & Business:</span>
                    <a href={`mailto:${site.email}`}><strong>{site.email}</strong></a>
                  </p>
                  <p className="subtext">
                    Response time: Within 24 business hours for chartering, technical & management enquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}



