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
    <div role="dialog" aria-label="Cookie choices" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "3px solid var(--ink)", padding: "1rem var(--pad)", zIndex: 90 }}>
      <p style={{ maxWidth: "70ch" }}>We use essential cookies. With your consent we also use analytics to understand how the site is used. See the <Link href="/cookie-policy/">Cookie Policy</Link>.</p>
      <div className="btns" style={{ marginTop: 0 }}>
        <button className="btn ghost" onClick={() => choose("rejected")}>Reject all</button>
        <button className="btn ghost" onClick={() => choose("accepted")}>Accept all</button>
      </div>
    </div>);
}
export function CookieSettings() {
  return <button className="btn ghost" style={{ color: "#fff", borderColor: "#fff", padding: ".4rem .9rem", minHeight: 44 }} onClick={() => { document.cookie = "sh_consent=; max-age=0; path=/"; location.reload(); }}>Cookie settings</button>;
}
