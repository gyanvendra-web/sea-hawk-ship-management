# 🚢 Sea Hawk Ship Management — Project Architecture & Developer Guide

This document clearly outlines the **Frontend (UI/Client)** and **Backend (API/Database)** separation within this unified Next.js Full-Stack project.

---

## 🎨 FRONTEND (UI, Pages, Components)
All user-facing interfaces, forms, buttons, styles, and interactive React components are located here:

```text
src/
├── app/                           🎨 FRONTEND PAGES (URL Routes)
│   ├── page.tsx                   -> Home Page (http://localhost:3000/)
│   ├── contact/page.tsx           -> Contact Us Page (http://localhost:3000/contact/)
│   ├── about/page.tsx             -> About Us Page
│   ├── services/page.tsx          -> Services Overview
│   └── admin/
│       ├── login/page.tsx         -> Staff Login & Signup Page (http://localhost:3000/admin/login/)
│       └── page.tsx               -> Staff Admin Dashboard Page (http://localhost:3000/admin/)
│
├── components/                    🎨 FRONTEND REACT COMPONENTS (Reusable UI)
│   ├── StaffLoginClient.tsx       -> Split-Screen Login & Registration Form UI
│   ├── HomeQuickForm.tsx          -> Home Page Quick Enquiry Form UI + Modal Popup
│   ├── ContactForm.tsx            -> Main Contact Form UI + Modal Popup
│   ├── GenericForm.tsx            -> Profile & Service Form UI + Modal Popup
│   ├── Header.tsx                 -> Top Navigation Bar & Executive Header
│   ├── Footer.tsx                 -> Executive Footer & Quick Links
│   ├── HeroSlider.tsx             -> Main Homepage Image Slider
│   └── Breadcrumbs.tsx            -> Page Breadcrumb Navigation
│
└── app/globals.css                🎨 FRONTEND STYLESHEET (CSS & UI Layouts)
```

---

## ⚙️ BACKEND (Server API, Database, Security, File Uploads)
All server-side code, MongoDB cloud connections, database schemas, authentication cookies, and API endpoints are located here:

```text
src/
├── app/api/                       ⚙️ BACKEND API ROUTES (Server Endpoints)
│   ├── admin/
│   │   ├── login/route.ts         -> POST /api/admin/login (Scrypt password check & cookie creation)
│   │   ├── signup/route.ts        -> POST /api/admin/signup (Saves staff to MongoDB & issues cookie)
│   │   └── logout/route.ts        -> POST /api/admin/logout (Deletes session cookie)
│   ├── contact/route.ts           -> POST /api/contact (Saves enquiries to MongoDB ContactForm)
│   └── submit/route.ts            -> POST /api/submit (Saves seafarer resumes & applications to MongoDB)
│
└── lib/                           ⚙️ BACKEND CORE SERVICES & DATABASE
    ├── mongodb.ts                 -> MongoDB Atlas Cloud connection helper (with auto-fallback)
    ├── auth.ts                    -> WebCrypto HMAC-SHA256 session token generator & verification
    ├── store.ts                   -> Magic-byte file upload validator (PDF/DOCX) & local backup
    └── models/                    ⚙️ MONGOOSE DATABASE SCHEMAS (Collections)
        ├── StaffUser.ts           -> Collection: `staffusers` (Staff account details)
        ├── AccessLog.ts            -> Collection: `accesslogs` (Login & audit activity logs)
        ├── ContactForm.ts         -> Collection: `contactforms` (Website lead submissions)
        └── Application.ts         -> Collection: `applications` (Seafarer profile submissions)
```

---

## ⚡ PERFORMANCE & ASSETS (Image Optimization & Caching)
All static visual media, modern WebP image assets, and caching configurations:

```text
public/
└── images/                        ⚡ HIGH-PERFORMANCE WEBP ASSETS (Compressed ~80-150KB)
    ├── hero-ship-1.webp           -> LCP Hero Image (Preloaded in Root Head)
    ├── hero-ship-2.webp           -> Portal & Contact Hero Media
    ├── hero-ship-3.webp           -> Seafarer Hub Media
    ├── hero-ship-4.webp           -> Offshore Services Media
    ├── service-commercial.webp    -> Commercial Management Card
    ├── service-technical.webp     -> Technical Management Card
    ├── service-crew.webp          -> Crew Management Card
    ├── service-consultancy.webp   -> Marine Consultancy Card
    └── cta-banner-bg.webp         -> CTA Section Background Banner
```

---

## 🛠️ Summary Cheat Sheet for Developers

| Task | Where to look? | Path |
| :--- | :--- | :--- |
| **Change Page UI / Design** | 🎨 Frontend | `src/app/` or `src/components/` |
| **Edit CSS / Mobile Responsive Rules** | 🎨 Frontend | `src/app/globals.css` (`@media (max-width: 64rem)` & `@media (max-width: 768px)`) |
| **Add / Change Form Fields** | 🎨 Frontend | `src/components/ContactForm.tsx` or `HomeQuickForm.tsx` |
| **Optimize Image Assets & Mobile PageSpeed** | ⚡ Performance | `public/images/`, `src/components/HeroSlider.tsx` & `src/lib/images.ts` |
| **Configure Cache, JS Chunks & Next.js** | ⚙️ Backend / Config | `next.config.ts` |
| **MongoDB Schemas & Connection Pool** | ⚙️ Backend | `src/lib/mongodb.ts` & `src/lib/models/` |
| **API Endpoints / Staff Auth Speed** | ⚙️ Backend | `src/app/api/admin/login/route.ts` |
| **Database URI / Credentials** | ⚙️ Backend | `.env.local` (`MONGODB_URI`) |
