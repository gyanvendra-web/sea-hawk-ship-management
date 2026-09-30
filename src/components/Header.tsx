"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState("");
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
          <div className="utility-date">{currentDate || "Monday 28th September 2026"}</div>
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
              <span className="contact-icon">📞</span>
              <div className="contact-info">
                <span className="contact-label">Call Us</span>
                <span className="contact-value">{site.phone}</span>
              </div>
            </a>
            <div className="contact-divider" />
            <a href={`mailto:${site.email}`} className="contact-item">
              <span className="contact-icon">✉</span>
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
                      {n.label.toUpperCase()}
                    </Link>
                    {n.children && (
                      <button
                        type="button"
                        className="dropdown-arrow"
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${n.label} menu`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenDropdown(isOpen ? null : n.href);
                        }}
                      >
                        ▾
                      </button>
                    )}
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






