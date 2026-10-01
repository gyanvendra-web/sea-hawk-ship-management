"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState("Monday 28th September 2026");
  const pathname = usePathname();

  useEffect(() => {
    const d = new Date();
    const formatted = d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  return (
    <header className="site-header-group">
      {/* 1. TOP UTILITY BAR (GOLD) */}
      <div className="top-utility-bar">
        <div className="wrap utility-wrap">
          <div className="utility-date" suppressHydrationWarning>
            {currentDate}
          </div>
          <div className="utility-right">
            <Link href="/admin/login/" className="utility-staff-btn">
              <span>🔒 Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE BRAND & CONTACT BAR (WHITE) */}
      <div className="middle-brand-bar">
        <div className="wrap brand-wrap">
          <Link href="/" className="brand" aria-label="Sea Hawk Ship Management">
            <img
              src="/images/seahawk-logo-full.webp"
              alt="Sea Hawk Ship Management Pvt Ltd"
              className="brand-logo-img"
            />
          </Link>

          <div className="header-contact-items">
            <a href={site.phoneHref} className="contact-item">
              <span className="contact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div className="contact-info">
                <span className="contact-label">Call Us</span>
                <span className="contact-value">{site.phone}</span>
              </div>
            </a>
            <div className="contact-divider" />
            <a href={`mailto:${site.email}`} className="contact-item">
              <span className="contact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <div className="contact-info">
                <span className="contact-label">Email ID</span>
                <span className="contact-value">{site.email}</span>
              </div>
            </a>
          </div>

          <button
            type="button"
            className="mobile-toggle"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕ Close" : "☰ Menu"}
          </button>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (NAVY BLUE) */}
      <nav className={`main-nav-bar ${mobileOpen ? "open" : ""}`} aria-label="Primary">
        <div className="wrap nav-wrap">
          <ul className="nav-list">
            <li className={`nav-item ${pathname === "/" ? "active" : ""}`}>
              <Link href="/" onClick={() => setMobileOpen(false)}>
                HOME
              </Link>
            </li>
            {nav.map((n) => {
              const isOpen = openDropdown === n.href;
              const isActive = pathname.startsWith(n.href);
              return (
                <li
                  key={n.href}
                  className={`nav-item ${n.children ? "has-dropdown" : ""} ${isOpen ? "is-open" : ""} ${isActive ? "active" : ""}`}
                >
                  <div className="nav-item-header">
                    <Link href={n.href} onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}>
                      <span>{n.label.toUpperCase()}</span>
                      {n.children && <span className="nav-arrow-symbol" aria-hidden="true"> ▾</span>}
                    </Link>
                  </div>
                  {n.children && (
                    <ul className="dropdown-menu">
                      {n.children.map((c) => (
                        <li key={c.href} className="dropdown-item">
                          <Link
                            href={c.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}






