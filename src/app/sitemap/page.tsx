import type { Metadata } from "next";
import Link from "next/link";
import SubpageHero from "@/components/SubpageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "HTML Sitemap | Sea Hawk Ship Management",
  description:
    "Complete website directory and HTML sitemap for Sea Hawk Ship Management. Navigate all corporate, service, seafarer, knowledge, and legal policy pages.",
  alternates: { canonical: "/sitemap/" },
  openGraph: {
    title: "HTML Sitemap | Sea Hawk Ship Management",
    description: "Complete website navigation directory for Sea Hawk Ship Management.",
    url: "/sitemap/",
  },
};

const sitemapSections = [
  {
    category: "Corporate & Management",
    badge: "COMPANY OVERVIEW",
    icon: "⚓",
    links: [
      { href: "/", label: "Homepage" },
      { href: "/about/", label: "About Sea Hawk Ship Management" },
      { href: "/about/leadership/", label: "Leadership & Management Oversight" },
      { href: "/about/quality-safety-compliance/", label: "Quality, Safety & Compliance" },
      { href: "/contact/", label: "Contact Us & Business Enquiries" },
    ],
  },
  {
    category: "Maritime Management Services",
    badge: "CORE SERVICES",
    icon: "🚢",
    links: [
      { href: "/services/", label: "Services Overview" },
      { href: "/services/commercial-management/", label: "Commercial Ship Management" },
      { href: "/services/technical-management/", label: "Technical Ship Management" },
      { href: "/services/crew-management/", label: "Crew Management Services" },
      { href: "/services/marine-consultancy/", label: "Marine Consultancy Services" },
      { href: "/services/offshore-marine-support/", label: "Offshore & Marine Support" },
    ],
  },
  {
    category: "Ship Owners & Fleet Operators",
    badge: "B2B SOLUTIONS",
    icon: "🛠️",
    links: [
      { href: "/ship-owners/", label: "Solutions for Ship Owners" },
      { href: "/ship-owners/enquiry/", label: "Vessel Management Enquiry Form" },
    ],
  },
  {
    category: "Seafarer Hub & Career Guidance",
    badge: "CREW & CAREERS",
    icon: "👨‍✈️",
    links: [
      { href: "/seafarers/", label: "Seafarer Hub Overview" },
      { href: "/seafarers/vacancies/", label: "Current Seafarer Vacancies" },
      { href: "/seafarers/profile/", label: "Register / Update Seafarer Profile" },
      { href: "/seafarers/guidance/", label: "Training & Career Guidance" },
      { href: "/seafarers/guidance/tme-gme/", label: "TME / GME Training Guidance" },
      { href: "/seafarers/guidance/gpr/", label: "GPR Rating Training Guidance" },
      { href: "/seafarers/guidance/stcw/", label: "STCW Course Guidance" },
      { href: "/seafarers/guidance/sid-card/", label: "SID Card Application Guidance" },
      { href: "/seafarers/guidance/dns-bsc-nautical-science/", label: "DNS & B.Sc Nautical Science Guide" },
      { href: "/seafarers/guidance/coc/", label: "COC Certification Guidance" },
    ],
  },
  {
    category: "Insights & Knowledge Centre",
    badge: "RESOURCES",
    icon: "📰",
    links: [
      { href: "/insights/", label: "Maritime Insights & Articles" },
      { href: "/news/", label: "News & Operational Updates" },
      { href: "/knowledge-centre/", label: "Maritime Knowledge Centre" },
    ],
  },
  {
    category: "Legal, Compliance & Policy Pages",
    badge: "GOVERNANCE",
    icon: "⚖️",
    links: [
      { href: "/privacy-policy/", label: "Privacy Policy" },
      { href: "/terms/", label: "Terms of Use" },
      { href: "/cookie-policy/", label: "Cookie Policy & Choices" },
      { href: "/disclaimer/", label: "Website Disclaimer" },
      { href: "/recruitment-fraud-advisory/", label: "Recruitment & Fraud Advisory" },
      { href: "/accessibility/", label: "Accessibility Statement" },
      { href: "/sitemap.xml", label: "XML Search Engine Sitemap (XML)" },
    ],
  },
];

export default function SitemapPage() {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "HTML Sitemap", href: "/sitemap/" },
  ];

  return (
    <>
      <SubpageHero title="HTML Sitemap & Navigation Directory" bgImage="/images/hero-ship-1.webp" crumbs={crumbs} />

      <section className="section subpage-content-section" style={{ background: "#edf1f2" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 3rem" }}>
            <span className="script-subtitle" style={{ color: "#d49b18" }}>COMPLETE SITE DIRECTORY</span>
            <h1 style={{ color: "#0b2233", fontSize: "2.2rem", fontWeight: 800, margin: "0.5rem 0 1rem" }}>
              Explore Sea Hawk Ship Management Portal
            </h1>
            <p style={{ color: "#475569", fontSize: "1rem", lineHeight: "1.6" }}>
              Use our structured HTML sitemap to easily discover and navigate all corporate, vessel management, crewing, seafarer guidance, and compliance pages.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {sitemapSections.map((sec) => (
              <div
                key={sec.category}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "1.75rem",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{sec.icon}</span>
                  <div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#d49b18", letterSpacing: "0.06em", display: "block" }}>
                      {sec.badge}
                    </span>
                    <h3 style={{ color: "#0b2233", fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>
                      {sec.category}
                    </h3>
                  </div>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {sec.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        style={{
                          color: "#0b2233",
                          fontSize: "0.94rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        <span style={{ color: "#d49b18", fontWeight: 800 }}>»</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
