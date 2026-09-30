"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const get = () => document.cookie.split("; ").find((c) => c.startsWith("sh_consent="))?.split("=")[1];
const set = (v: string) => { document.cookie = `sh_consent=${v}; max-age=15552000; path=/; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`; };

function loadGA() {
  if (!GA || document.getElementById("ga4")) return;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || []; w.gtag = function () { w.dataLayer.push(arguments); };
  const s = document.createElement("script"); s.id = "ga4"; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`; document.head.appendChild(s);
  w.gtag("js", new Date()); w.gtag("config", GA, { anonymize_ip: true });
  document.addEventListener("click", (e) => { // click-to-call / click-to-email events
    const a = (e.target as HTMLElement).closest("a"); const h = a?.getAttribute("href") ?? "";
    if (h.startsWith("tel:")) w.gtag("event", "click_to_call"); else if (h.startsWith("mailto:")) w.gtag("event", "click_to_email");
  });
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const c = get(); if (c === "accepted") loadGA(); if (!c && GA) setOpen(true); }, []);
  if (!open) return null;
  const choose = (v: string) => { set(v); setOpen(false); if (v === "accepted") loadGA(); };
  return (
    <div role="dialog" aria-labelledby="cookie-dialog-title" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#ffffff", borderTop: "3px solid #0b2233", padding: "1rem 1.5rem", zIndex: 9000, boxShadow: "0 -10px 30px rgba(0,0,0,0.15)" }}>
      <h2 id="cookie-dialog-title" className="sr-only">Cookie Preferences</h2>
      <p style={{ maxWidth: "70ch", color: "#334155", fontSize: "0.9rem", lineHeight: "1.5" }}>We use essential cookies to operate our website. With your consent, we also use analytics to improve user experience. See our <Link href="/privacy-policy/" style={{ color: "#0b2233", fontWeight: 700, textDecoration: "underline" }}>Privacy Policy</Link>.</p>
      <div className="btns" style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem" }}>
        <button type="button" className="btn ghost" style={{ minHeight: "44px", color: "#0b2233", borderColor: "#0b2233" }} onClick={() => choose("rejected")}>Reject all</button>
        <button type="button" className="btn" style={{ minHeight: "44px", background: "#0b2233", color: "#ffffff", borderColor: "#0b2233" }} onClick={() => choose("accepted")}>Accept all</button>
      </div>
    </div>);
}
export function CookieSettings() {
  return <button className="btn ghost" style={{ color: "#fff", borderColor: "#fff", padding: ".4rem .9rem", minHeight: 44 }} onClick={() => { document.cookie = "sh_consent=; max-age=0; path=/"; location.reload(); }}>Cookie settings</button>;
}
