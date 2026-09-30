import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site">
      <div className="nautical-rope-divider" aria-hidden="true" />
      <div className="wrap">
        <div className="cols footer-cols">
          {/* Column 1: Company Profile, Description & Social Media */}
          <div className="footer-col brand-col">
            <h2 className="footer-heading">{site.name}</h2>
            <p className="footer-desc">
              Commercial, technical, crew and marine advisory support for global ship owners, vessel operators and seafarers.
            </p>
            <p className="footer-warning-note">
              Sea Hawk does not authorise unofficial agents to guarantee jobs. Verify recruitment messages through our official channels before sharing documents or making any payment.
            </p>
            <div className="footer-social-wrap">
              <span className="social-heading">Follow us:</span>
              <div className="social-icons-row">
                <a href="#" aria-label="Facebook" className="footer-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="footer-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="footer-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                  </svg>
                </a>
                <a href="https://youtu.be/92UTmMx3P1c" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="footer-col">
            <h2 className="footer-heading">Services</h2>
            <ul className="footer-links">
              <li><Link href="/services/commercial-management/">Commercial Management</Link></li>
              <li><Link href="/services/technical-management/">Technical Management</Link></li>
              <li><Link href="/services/crew-management/">Crew Management</Link></li>
              <li><Link href="/services/marine-consultancy/">Marine Consultancy</Link></li>
              <li><Link href="/services/offshore-marine-support/">Offshore &amp; Marine Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Seafarers & Company */}
          <div className="footer-col">
            <h2 className="footer-heading">Seafarers &amp; Company</h2>
            <ul className="footer-links">
              <li><Link href="/seafarers/vacancies/">Current Vacancies</Link></li>
              <li><Link href="/seafarers/profile/">Register / Update Profile</Link></li>
              <li><Link href="/seafarers/guidance/">Training &amp; Guidance</Link></li>
              <li><Link href="/recruitment-fraud-advisory/">Recruitment Fraud Advisory</Link></li>
              <li><Link href="/about/">About Us</Link></li>
              <li><Link href="/about/leadership/">Leadership</Link></li>
              <li><Link href="/about/quality-safety-compliance/">Quality &amp; Compliance</Link></li>
              <li><Link href="/admin/login/">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Address (Moved to 4th column as requested) */}
          <div className="footer-col address-col">
            <h2 className="footer-heading">Contact &amp; Location</h2>
            <p className="footer-company-legal">{site.legalName}</p>
            <address className="footer-address">
              Unit No. S-28, Eighth Floor, URBTECH NPX, Sector 153, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301, India
            </address>
            <div className="footer-contact-details">
              <p><strong>Phone:</strong> <a href={site.phoneHref}>{site.phone}</a> | <a href={site.landlineHref}>{site.landline}</a></p>
              <p><strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a></p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Fine Bar */}
        <div className="fine footer-fine">
          <ul className="footer-legal-links">
            <li><Link href="/privacy-policy/">Privacy Policy</Link></li>
            <li><Link href="/terms/">Terms of Use</Link></li>
            <li><Link href="/disclaimer/">Disclaimer</Link></li>
            <li><Link href="/accessibility/">Accessibility</Link></li>
          </ul>
          <p className="footer-copyright">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
