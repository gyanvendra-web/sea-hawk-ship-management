import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import Pic from "@/components/Pic";
import HeroSlider from "@/components/HeroSlider";
import MediaVideoCard from "@/components/MediaVideoCard";
import HomeQuickForm from "@/components/HomeQuickForm";
import { img, type Img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Ship Management Company in India | Sea Hawk Ship Management",
  description:
    "Commercial, technical, crew and marine management support for ship owners, vessel operators and maritime businesses. Explore Sea Hawk services and speak with our team.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ship Management Company in India | Sea Hawk Ship Management",
    description:
      "Commercial, technical, crew and marine management support for ship owners, vessel operators and maritime businesses.",
    url: "/",
  },
};

const services: { href: string; t: string; d: string; i: Img; category: string }[] = [
  {
    href: "/services/commercial-management/",
    t: "Commercial Management",
    category: "CHARTERING & OPERATIONS",
    d: "Commercial support covering chartering coordination, post-fixture operations, marine accounting and performance-focused operational oversight, subject to agreed scope.",
    i: img.commercial,
  },
  {
    href: "/services/technical-management/",
    t: "Technical Management",
    category: "MAINTENANCE & COMPLIANCE",
    d: "Structured technical support for maintenance planning, inspection, repairs, equipment condition monitoring and vessel reliability.",
    i: img.technical,
  },
  {
    href: "/services/crew-management/",
    t: "Crew Management",
    category: "MANPOWER & DEPLOYMENT",
    d: "Crew sourcing and coordination, deployment support, training and development coordination, payroll administration and travel logistics, subject to applicable licensing and client requirements.",
    i: img.crew,
  },
  {
    href: "/services/marine-consultancy/",
    t: "Marine Consultancy",
    category: "OFFSHORE & ADVISORY",
    d: "Practical marine consultancy for maritime, offshore, rig and project-related operational requirements, delivered according to the expertise available within the team.",
    i: img.consultancy,
  },
];

const seafarerBenefits = [
  { label: "Guidelines for update Seafarer Profile", href: "/seafarers/profile-guidance/" },
  { label: "TME/GME Training Guidelines", href: "/seafarers/tme-gme-guidelines/" },
  { label: "GPR Training Guidelines", href: "/seafarers/gpr-guidelines/" },
  { label: "STCW Training Guidelines", href: "/seafarers/stcw-guidelines/" },
  { label: "SID Card Guidelines", href: "/seafarers/sid-guidelines/" },
  { label: "Latest Vacancy updates", href: "/seafarers/vacancies/" },
  { label: "DNS/B.Sc. Nautical Science Guidelines", href: "/seafarers/dns-nautical-science/" },
  { label: "COC Guidelines", href: "/seafarers/coc-guidelines/" },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      legalName: site.legalName,
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
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#org` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* 1. Hero Slider Section */}
      <section className="hero-section-wrapper">
        <HeroSlider />
      </section>

      {/* 2. Gateway Section (Who We Serve) */}
      <section className="gateway-section">
        <div className="wrap">
          <div className="gateway-header">
            <span className="gateway-subtext">TAILORED MARITIME PATHWAYS</span>
            <h2 className="gateway-title">Who We Serve</h2>
            <p className="gateway-desc">
              Select your operational gateway to explore specialized solutions for your vessel fleet or maritime career.
            </p>
          </div>

          <div className="gateway-grid">
            <Link href="/ship-owners/" className="gateway-card owners">
              <div
                className="gateway-card-bg"
                style={{ backgroundImage: `url(/images/hero-ship-1.webp)` }}
              />
              <div className="gateway-card-overlay" />
              <div className="gateway-card-content">
                <span className="gateway-badge gold">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                  </svg>
                  FLEET &amp; SHIP MANAGEMENT
                </span>
                <h3>For Ship Owners &amp; Vessel Operators</h3>
                <p>
                  Access integrated support across commercial, technical, crew and marine operations. Tell us about your vessel, operational priorities and service requirement, and our team will assess the right scope of support.
                </p>
                <div className="gateway-btn-wrap">
                  <span className="gateway-btn primary">
                    Solutions for Ship Owners
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/seafarers/" className="gateway-card seafarers">
              <div
                className="gateway-card-bg"
                style={{ backgroundImage: `url(/images/hero-ship-3.webp)` }}
              />
              <div className="gateway-card-overlay" />
              <div className="gateway-card-content">
                <span className="gateway-badge teal">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                  CAREERS &amp; CREW HUB
                </span>
                <h3>For Seafarers</h3>
                <p>
                  Access vacancy updates, profile registration and practical guidance on common seafarer documentation, training and career pathways. Always verify official requirements through the competent authority before acting.
                </p>
                <div className="gateway-btn-wrap">
                  <span className="gateway-btn ghost">
                    Open the Seafarer Hub
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Our Services Section */}
      <section className="services-section">
        <div className="services-bg-watermark left" />
        <div className="services-bg-watermark right" />
        <div className="wrap">
          <div className="services-header">
            <span className="services-script-badge">What we do</span>
            <h2 className="services-title">Our Services</h2>
            <div className="services-title-line" />
            <p className="services-desc">
              A genuine strategic partner is Sea Hawk Ship Management Pvt Ltd. You can get the full range of end-to-end solutions you need to run your business effectively and efficiently through our global network.
            </p>
          </div>

          <div className="services-grid">
            {services.map((s) => (
              <article className="service-card" key={s.href}>
                <div className="service-card-image-wrap">
                  <Link href={s.href} tabIndex={-1} aria-hidden="true">
                    <Pic i={s.i} sizes="(max-width: 700px) 100vw, 360px" />
                  </Link>
                </div>
                <div className="service-card-body">
                  <h3 className="service-card-title">
                    <Link href={s.href}>{s.t}</Link>
                  </h3>
                  <p className="service-card-desc">{s.d}</p>
                  <div className="service-btn-wrap">
                    <Link href={s.href} className="service-read-more-btn">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Media & Watch Our Video Section */}
      <section className="media-video-section">
        <div className="wrap">
          <div className="media-grid">
            <div className="media-text-content">
              <span className="script-subtitle">Media</span>
              <h2 className="media-title">Watch our video</h2>
              <div className="title-underline" />
              <p className="media-desc">
                We are headed by a team of senior shipping professionals with vast experience, knowledge and skills gathered through many years of service in the shipping industry.
              </p>
              <Link href="/about/" className="primary-gold-btn">
                View gallery
              </Link>
            </div>

            <MediaVideoCard />
          </div>
        </div>
      </section>

      {/* 5. CTA Banner Section (Find Amazing Shipping Services - Overlapping Banner) */}
      <section className="cta-banner-section">
        <div className="wrap">
          <div className="cta-banner-card">
            <div
              className="cta-banner-bg"
              style={{ backgroundImage: `url(/images/cta-banner-bg.webp)` }}
            />
            <div className="cta-banner-overlay" />
            <div className="cta-banner-text">
              <span className="script-subtitle light">Get an unique feeling</span>
              <h2 className="cta-banner-title">Find amazing Shipping Services</h2>
            </div>
            <p className="cta-banner-desc">
              We are headed by a team of senior shipping professionals with vast experience, knowledge and skills gathered through many years of service in the shipping industry.
            </p>
            <div className="cta-banner-btn-wrap">
              <Link href="/contact/" className="primary-gold-btn">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Benefits / Seafarers What You Get Section */}
      <section className="benefits-section">
        <div className="wrap">
          <div className="benefits-grid">
            <div className="benefits-left">
              <span className="script-subtitle">Benefits</span>
              <h2 className="section-serif-title">What you get</h2>
              <div className="title-underline" />

              <div className="checklist-grid">
                {seafarerBenefits.map((item) => (
                  <Link key={item.label} href={item.href} className="checklist-item">
                    <span className="double-arrow">»</span>
                    <span className="checklist-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="benefits-right">
              <div className="hierarchy-chart-card">
                <div className="chart-header">
                  <h3>SEA HAWK CREW RANK STRUCTURE</h3>
                  <span className="sub">DG SHIPPING &amp; STCW COMPLIANT</span>
                </div>
                <div className="rank-tree">
                  <div className="rank-node captain">CAPTAIN / MASTER</div>
                  <div className="rank-row split">
                    <div className="rank-node">CHIEF ENGINEER</div>
                    <div className="rank-node">CHIEF OFFICER</div>
                  </div>
                  <div className="rank-row split">
                    <div className="rank-node">2ND ENGINEER</div>
                    <div className="rank-node">2ND OFFICER</div>
                  </div>
                  <div className="rank-row split">
                    <div className="rank-node">3RD / 4TH ENGINEER</div>
                    <div className="rank-node">3RD OFFICER / BOSUN</div>
                  </div>
                  <div className="rank-row split">
                    <div className="rank-node">ENGINE CADET / OILER</div>
                    <div className="rank-node">DECK CADET / ABLE SEAMAN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us & Quick Contact Form Section */}
      <section className="why-contact-section">
        <div
          className="why-bg-overlay"
          style={{ backgroundImage: `url(/images/hero-ship-1.webp)` }}
        />
        <div className="why-dark-tint" />
        <div className="wrap why-contact-wrap">
          <div className="why-contact-grid">
            {/* Why Choose Us Left Column */}
            <div className="why-choose-left">
              <h2 className="why-title">Why Choose Us</h2>
              <div className="title-underline left" />

              <div className="feature-block">
                <div className="feature-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b2233" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Transformation</h3>
                  <p>Modify &amp; Alter our management system on a day to day basis with the progress in industry standards for effectiveness of global clients.</p>
                </div>
              </div>

              <div className="feature-block">
                <div className="feature-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b2233" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Sustainability</h3>
                  <p>To avoid the depletion of our resources to maintain a balance in operation of our management services we pursue to maintain a global level of economic growth.</p>
                </div>
              </div>

              <div className="feature-block">
                <div className="feature-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b2233" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>People &amp; Safety</h3>
                  <p>Priority is given on a special note for selection of personnel &amp; Special steps are insured for safety of these personnel working onboard our global clients team.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Form Right Column */}
            <HomeQuickForm />
          </div>
        </div>
      </section>

      {/* 8. Newsletter & Social Bar */}
      <section className="newsletter-bar-section">
        <div className="wrap">
          <div className="newsletter-grid">
            <div className="newsletter-input-wrap">
              <input type="email" placeholder="Your email ..." className="newsletter-input" />
              <button type="button" className="primary-gold-btn">
                Subscribe
              </button>
            </div>
            <div className="social-links-wrap">
              <span className="follow-label">Follow us:</span>
              <a href="https://facebook.com/seahawkshipmanagement" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">f</a>
              <a href="https://twitter.com/seahawkgroup" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">t</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon">y</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">i</a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Regulatory Compliance Verification Banner */}
      {/* <section className="section compliance-notice-section">
        <div className="wrap">
          <div className="notice-banner">
            <h3>Safety, Quality &amp; Responsible Operations</h3>
            <p>
              Safe and reliable vessel operations depend on disciplined systems, competent people and clear accountability. Sea Hawk aims to align its management support with applicable maritime requirements, client procedures and recognised industry practices.
            </p>
            <p className="verify">
              VERIFY BEFORE PUBLISH: display licences, certifications and compliance credentials here only after verification. See{" "}
              <Link href="/about/quality-safety-compliance/">Quality, Safety &amp; Compliance</Link>.
            </p>
          </div>
        </div>
      </section> */}
    </>
  );
}
