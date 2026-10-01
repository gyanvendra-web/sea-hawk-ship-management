"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const GA = process.env.NEXT_PUBLIC_GA_ID;

const getConsent = () => {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find((c) => c.startsWith("sh_consent="))?.split("=")[1];
};

const setConsent = (v: string) => {
  document.cookie = `sh_consent=${v}; max-age=15552000; path=/; samesite=lax${
    location.protocol === "https:" ? "; secure" : ""
  }`;
};

function loadGA() {
  if (!GA || typeof document === "undefined" || document.getElementById("ga4")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    w.dataLayer.push(arguments);
  };
  const s = document.createElement("script");
  s.id = "ga4";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
  document.head.appendChild(s);
  w.gtag("js", new Date());
  w.gtag("config", GA, { anonymize_ip: true });
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = getConsent();
    if (c === "accepted") {
      loadGA();
    } else if (!c) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const choose = (v: string) => {
    setConsent(v);
    setOpen(false);
    if (v === "accepted") loadGA();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-dialog-title"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        left: "20px",
        maxWidth: "520px",
        marginLeft: "auto",
        background: "#0b2233",
        color: "#ffffff",
        borderLeft: "4px solid #d49b18",
        padding: "1.25rem 1.5rem",
        borderRadius: "8px",
        zIndex: 99999,
        boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{ fontSize: "1.2rem" }}>🍪</span>
        <h3 id="cookie-dialog-title" style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" }}>
          Cookie &amp; Privacy Choices
        </h3>
      </div>
      <p style={{ margin: "0 0 1rem", color: "#cbd5e1", fontSize: "0.86rem", lineHeight: "1.5" }}>
        We use essential cookies to ensure site functionality. With your consent, we also collect anonymized usage analytics to improve our services. Read our{" "}
        <Link href="/cookie-policy/" style={{ color: "#d49b18", fontWeight: 700, textDecoration: "underline" }}>
          Cookie Policy
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy/" style={{ color: "#d49b18", fontWeight: 700, textDecoration: "underline" }}>
          Privacy Policy
        </Link>.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
        <button
          type="button"
          style={{
            background: "transparent",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.4)",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
          onClick={() => choose("rejected")}
        >
          Reject Optional
        </button>
        <button
          type="button"
          style={{
            background: "#d49b18",
            color: "#0b2233",
            border: "none",
            padding: "8px 20px",
            borderRadius: "4px",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
          onClick={() => choose("accepted")}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}

export function CookieSettings() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setStatus(getConsent() ?? null);
  }, []);

  const handleReset = () => {
    document.cookie = "sh_consent=; max-age=0; path=/";
    setStatus(null);
    location.reload();
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        border: "2px solid #d49b18",
        borderRadius: "8px",
        padding: "1.25rem 1.5rem",
        margin: "1.75rem 0",
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h4 style={{ margin: "0 0 6px", color: "#0b2233", fontSize: "1.08rem", fontWeight: 800 }}>
            ⚙️ Interactive Cookie Preference Control
          </h4>
          <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>
            Current Saved Consent Status:{" "}
            <strong style={{ color: status === "accepted" ? "#166534" : status === "rejected" ? "#991b1b" : "#b98a1c" }}>
              {status === "accepted" ? "🟢 Accepted All Cookies" : status === "rejected" ? "🔴 Rejected Optional Analytics" : "🟡 Default (Not Set Yet)"}
            </strong>
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          style={{
            background: "#0b2233",
            color: "#ffffff",
            border: "1.5px solid #d49b18",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          🔄 Re-open Cookie Banner &amp; Change Choices
        </button>
      </div>
    </div>
  );
}
