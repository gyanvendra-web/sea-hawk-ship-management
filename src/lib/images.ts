export type Img = { src: string; w: number; h: number; alt: string };

export const img = {
  logo: { src: "/images/logo.svg", w: 64, h: 64, alt: "" },
  hero: { src: "/images/hero-ship-1.jpg", w: 1600, h: 900, alt: "Container ship at sea under clear sky" },
  commercial: { src: "/images/service-commercial.jpg", w: 1600, h: 900, alt: "Commercial Container Cargo Ship at Ocean" },
  technical: { src: "/images/service-technical.jpg", w: 1600, h: 900, alt: "Technical Operations and Vessel Maintenance in Engine Room" },
  crew: { src: "/images/service-crew.jpg", w: 1600, h: 900, alt: "Ship Crew and Seafarers Team in Safety Gear" },
  consultancy: { src: "/images/service-consultancy.jpg", w: 1600, h: 900, alt: "Marine Consultancy and Navigation Bridge Team" },
  offshore: { src: "/images/hero-ship-4.jpg", w: 1600, h: 900, alt: "Offshore platform and tug support vessel" },
  seafarers: { src: "/images/service-crew.jpg", w: 1600, h: 900, alt: "Seafarers Training and Career Development" },
} satisfies Record<string, Img>;

export const pageImage: Record<string, Img> = {
  "/about/": { src: "/images/hero-ship-1.jpg", w: 1600, h: 900, alt: "Sea Hawk Ship Management Corporate Operations" },
  "/about/leadership/": img.consultancy,
  "/about/quality-safety-compliance/": img.technical,
  "/services/": img.commercial,
  "/services/commercial-management/": img.commercial,
  "/services/technical-management/": img.technical,
  "/services/crew-management/": img.crew,
  "/services/marine-consultancy/": img.consultancy,
  "/services/offshore-marine-support/": img.offshore,
  "/ship-owners/": img.hero,
  "/seafarers/": img.crew,
  "/seafarers/vacancies/": img.crew,
  "/seafarers/profile/": img.crew,
  "/recruitment-fraud-advisory/": img.technical,
  "/knowledge-centre/": img.consultancy,
  "/news/": { src: "/images/hero-ship-3.jpg", w: 1600, h: 900, alt: "Sea Hawk Maritime News and Fleet Updates" },
  "/contact/": { src: "/images/hero-ship-2.jpg", w: 1600, h: 900, alt: "Contact Sea Hawk Ship Management Team" },
};

export const ogImage = "/images/og.png";
