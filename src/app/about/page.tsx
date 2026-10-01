import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubpageHero from "@/components/SubpageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Sea Hawk Ship Management | Maritime Management Team",
  description:
    "Learn about Sea Hawk Ship Management Pvt Ltd, our maritime service approach, mission, vision and commitment to safe, practical and client-focused vessel operations.",
  alternates: { canonical: "/about/" },
  openGraph: { title: "About Sea Hawk Ship Management", url: "/about/" },
};

const stats = [
  { value: "20+", label: "Years Combined Maritime Leadership", sub: "Master Mariners & Chief Engineers" },
  { value: "100%", label: "DG Shipping & STCW Compliant", sub: "Statutory & Regulatory Alignment" },
  { value: "24/7", label: "Shore-Side Operational Support", sub: "Continuous Emergency Response" },
  { value: "0", label: "Compromise Safety Policy", sub: "Zero Spill & Incident Commitment" },
];

const capabilities = [
  {
    title: "Commercial Management",
    desc: "Chartering coordination, post-fixture voyage execution, laytime calculation, and performance oversight.",
    link: "/services/commercial-management/",
    badge: "CHARTERING & VOYAGE",
  },
  {
    title: "Technical Management",
    desc: "Planned maintenance systems, condition monitoring, dry-docking management, and class surveys.",
    link: "/services/technical-management/",
    badge: "MAINTENANCE & CLASS",
  },
  {
    title: "Crew Management",
    desc: "Crew sourcing, qualification screening, STCW licensing, payroll, deployment, and travel logistics.",
    link: "/services/crew-management/",
    badge: "MANPOWER & DEPLOYMENT",
  },
  {
    title: "Marine Consultancy",
    desc: "Offshore project advisory, vessel condition inspections, pre-purchase surveys, and maritime audit support.",
    link: "/services/marine-consultancy/",
    badge: "OFFSHORE & ADVISORY",
  },
];

const values = [
  {
    title: "Safety First",
    desc: "We place the safety of crew, vessels, and cargoes at the core of all operating decisions.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Uncompromising Integrity",
    desc: "We communicate transparently with ship owners, seafarers, and regulatory authorities.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: "Technical Competence",
    desc: "We value deep seafaring expertise, continuous learning, and practical problem-solving capability.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: "Operational Responsiveness",
    desc: "Shipping operations are 24/7. We provide rapid escalation, clear ownership, and swift action.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Strategic Partnership",
    desc: "We tailor our management systems to each client's fleet model rather than forcing template solutions.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Requirement Assessment", desc: "Evaluate vessel specifications, trading routes, owner priorities, or seafarer qualifications." },
  { num: "02", title: "Scope & SLA Definition", desc: "Establish clear management protocols, budget targets, statutory compliance parameters, and SLAs." },
  { num: "03", title: "Resource Allocation", desc: "Deploy experienced superintendents, specialized operating manuals, and certified crew." },
  { num: "04", title: "Structured Execution", desc: "Execute voyage plans, technical maintenance, budget control, and transparent 24/7 reporting." },
  { num: "05", title: "Continuous Optimization", desc: "Audit performance metrics regularly to enhance safety, fuel efficiency, and asset longevity." },
];

export default function About() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
  };

  return (
    <>
      <SubpageHero
        title="About Us"
        bgImage="/images/hero-ship-1.webp"
        crumbs={[{ name: "About Us", href: "/about/" }]}
      />

      <section className="section about-page-section">
        <div className="wrap">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />

          {/* 1. Side-by-Side Overview Grid */}
          <div className="about-overview-grid">
            <div className="about-overview-text">
              <span className="script-subtitle">Who We Are</span>
              <h1 className="about-main-title">About Sea Hawk Ship Management Pvt Ltd</h1>
              <div className="title-underline left" />
              <p className="about-lead-para">
                Sea Hawk Ship Management Pvt Ltd is a leading maritime services company providing end-to-end commercial, technical, crew management, and marine advisory support to global vessel owners and operators.
              </p>
              <p>
                Founded and managed by senior shipping professionals—including Master Mariners and Chief Engineers—Sea Hawk brings decades of ocean-going command and shore-side superintendency experience to every vessel under our care.
              </p>
              <p>
                We believe effective ship management requires disciplined operating procedures, experienced maritime judgement, transparent reporting, and an uncompromising focus on crew safety and asset protection.
              </p>
            </div>

            <div className="about-overview-image-wrap">
              <div
                className="about-image-card"
                style={{ backgroundImage: `url(/images/hero-ship-1.webp)` }}
              />
              <div className="about-image-badge">
                ★ EXCELLENCE IN SHIP MANAGEMENT
              </div>
            </div>
          </div>

          {/* 2. Executive Key Metrics Bar */}
          <div className="about-stats-banner">
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat-card" key={s.label}>
                  <span className="stat-number">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-sub">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Executive Quote & Leadership Callout Box */}
          <div className="about-executive-quote-box">
            <div className="quote-mark">“</div>
            <p className="quote-text">
              We are headed by a team of senior shipping professionals with vast experience, knowledge and skills gathered through many years of service in the global shipping industry.
            </p>
            <div className="quote-author">
              <span className="author-name">Sea Hawk Executive Directorate</span>
              <span className="author-title">Senior Captains &amp; Chief Engineers</span>
            </div>
          </div>

          {/* 4. Core Capabilities Showcase */}
          <div className="about-capabilities-section">
            <div className="section-header-center">
              <span className="script-subtitle">What We Do</span>
              <h2 className="section-serif-title">Integrated Maritime Capabilities</h2>
              <div className="title-underline" />
            </div>

            <div className="capabilities-grid">
              {capabilities.map((c) => (
                <div className="capability-card" key={c.title}>
                  <span className="capability-badge">{c.badge}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <Link href={c.link} className="capability-link">
                    Explore Details &raquo;
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Mission & Vision Cards Section */}
          <div className="about-mission-vision-section">
            <div className="mission-vision-grid">
              <div className="mv-card mission">
                <div className="mv-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <h2>Our Mission</h2>
                <p>
                  To be a dependable maritime partner by delivering practical, responsible, and professionally managed services that support safe, efficient, and sustainable vessel operations across global trade lanes.
                </p>
              </div>

              <div className="mv-card vision">
                <div className="mv-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d49b18" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h2>Our Vision</h2>
                <p>
                  To build a world-class maritime management organization capable of supporting the evolving operational, technical, environmental, and human resource requirements of modern commercial shipping.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Core Values Section (3 + 2 Balanced Grid Layout) */}
          <div className="about-values-section">
            <div className="section-header-center">
              <span className="script-subtitle">Our Principles</span>
              <h2 className="section-serif-title">Our Core Operating Values</h2>
              <div className="title-underline" />
            </div>

            {/* Row 1: 3 Cards */}
            <div className="values-grid row-top-3">
              {values.slice(0, 3).map((v) => (
                <div className="value-card" key={v.title}>
                  <div className="value-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>

            {/* Row 2: 2 Cards (Centered) */}
            <div className="values-grid row-bottom-2">
              {values.slice(3, 5).map((v) => (
                <div className="value-card" key={v.title}>
                  <div className="value-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. 5-Step Operating Model Section */}
          <div className="about-approach-section">
            <div className="section-header-center">
              <span className="script-subtitle">How We Work</span>
              <h2 className="section-serif-title">Our 5-Step Operating Model</h2>
              <div className="title-underline" />
            </div>

            <div className="steps-process-grid">
              {steps.map((s) => (
                <div className="step-process-card" key={s.num}>
                  <div className="step-badge">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Subpage Quick Links CTA Strip */}
          <div className="about-subpages-cta-strip">
            <div className="cta-strip-content">
              <h3>Partner with Sea Hawk Ship Management</h3>
              <p>Explore our leadership team, quality &amp; safety policies, or contact our team for a tailored proposal.</p>
            </div>
            <div className="cta-strip-btns-single-line">
              <Link href="/about/leadership/" className="primary-gold-btn">
                Leadership Team
              </Link>
              <Link href="/about/quality-safety-compliance/" className="primary-gold-btn outline">
                Quality &amp; Safety
              </Link>
              <Link href="/contact/" className="primary-gold-btn">
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
