# Sea Hawk Ship Management website
Next.js 15 App Router + TypeScript. Built from the Sea Hawk redesign/SEO developer handoff.

## Run
    npm install
    cp .env.example .env.local     # fill SESSION_SECRET and ADMIN_USERS
    node scripts/hash-password.mjs "a strong password"   # paste result into ADMIN_USERS
    npm run dev

## What is included
- All 35 routes from the handoff (see src/lib/content.ts + src/app/*), unique title/meta/canonical per page, sitemap.ts, robots.ts, Organization/WebSite/Service/BreadcrumbList JSON-LD, JobPosting only for open vacancies (src/lib/vacancies.ts).
- Forms: Contact, Vessel Enquiry, Seafarer Profile. Server-side validation, honeypot, rate limit, consent record (time + IP), secure upload (extension allowlist, magic-byte check, 5 MB, random names, stored outside /public).
- Staff login (/admin): signed httpOnly session cookie, scrypt passwords, roles (admin = everything, recruiter = seafarer profiles only), access log for logins, dashboard views and file downloads.
- Security headers (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy), consent manager (Reject = Accept), consent-aware GA4 + click-to-call/email events.
- 301 redirects from old WordPress URLs (next.config.ts). Set NEXT_PUBLIC_NOINDEX=1 on staging.

## Before launch (cannot be filled by the developer)
Every "VERIFY BEFORE PUBLISH" box and "[INSERT DATE]" must be resolved by management: RPSL/licences, CIN/GSTIN, leadership profiles, privacy/grievance email, retention periods, jurisdiction, cookie register. Nothing was invented.

## Known limits to address in deployment
- Storage is file based (.data/). Fine for one server with an encrypted, backed-up volume. On serverless hosting swap src/lib/store.ts for a database + private object storage.
- Rate limits are in-memory (per instance). Use a shared limiter for multiple instances.
- Add malware scanning at the marked hook in src/lib/store.ts; add old-URL inventory from Search Console to the redirect map; run the Launch QA checklist (Lighthouse, screen reader, dependency audit).
- Fonts (Archivo, Public Sans) are fetched at build time by next/font; the build needs internet access.

## Images
All images are original placeholders in public/images (SVG). Replace them with your real photos: drop the file in public/images, then change `src` (and the `alt` text) in src/lib/images.ts. Use JPG/WebP ~1600x900 for hero/service images; replace public/images/og.png (1200x630 PNG) and logo. Do not use stock photos for the Leadership page (real headshots only, per the handoff).
