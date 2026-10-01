import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages, byPath, type B } from "@/lib/content";
import { vacancies } from "@/lib/vacancies";
import { site } from "@/lib/site";
import { type Crumb } from "@/components/Breadcrumbs";
import GenericForm from "@/components/GenericForm";
import Pic from "@/components/Pic";
import SubpageHero from "@/components/SubpageHero";
import { pageImage } from "@/lib/images";

const p = (slug: string[]) => `/${slug.join("/")}/`;
export const dynamicParams = false;
export function generateStaticParams() {
  return pages.map((x) => ({ slug: x.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const pg = byPath(p((await params).slug));
  if (!pg) return {};
  return {
    title: pg.title,
    description: pg.desc,
    alternates: { canonical: pg.path },
    openGraph: { title: pg.title, description: pg.desc, url: pg.path },
  };
}

function crumbs(path: string): Crumb[] {
  const pg = byPath(path)!;
  const out: Crumb[] = [];
  if (pg.parent) {
    const par = byPath(pg.parent);
    if (par) out.push(...crumbs(par.path));
    else if (pg.parent === "/about/")
      out.push({ name: "About Us", href: "/about/" });
  }
  out.push({ name: pg.crumb, href: pg.path });
  return out;
}

const Cta = ({ x }: { x: [string, string][] }) => (
  <div
    className="btns cta-btns-single-line"
    style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
  >
    {x.map(([h, l], i) =>
      h.startsWith("http") ? (
        <a
          key={h}
          className={`primary-gold-btn${i ? " outline" : ""}`}
          href={h}
          target="_blank"
          rel="noopener noreferrer"
        >
          {l}
        </a>
      ) : (
        <Link key={h} className={`primary-gold-btn${i ? " outline" : ""}`} href={h}>
          {l}
        </Link>
      )
    )}
  </div>
);

function Block({ b }: { b: B }) {
  switch (b.t) {
    case "h2":
      return <h2>{b.x}</h2>;
    case "h3":
      return <h3>{b.x}</h3>;
    case "p":
      return <p>{b.x}</p>;
    case "notice":
      return <div className="notice">{b.x}</div>;
    case "verify":
      return <div className="verify">{b.x}</div>;
    case "ul":
      return (
        <ul className="plain">
          {b.x.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="steps">
          {b.x.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "faq":
      return (
        <div className="faq-wrap">
          {b.x.map(([q, a]) => (
            <div className="faq-box" key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      );
    case "cta":
      return <Cta x={b.x} />;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const pg = byPath(p((await params).slug));
  if (!pg) notFound();
  const now = Date.now();
  const open = vacancies.filter(
    (v) => v.status === "Open" && Date.parse(v.closing) > now
  );
  const ld = pg.schema
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: pg.crumb,
        description: pg.desc,
        url: `${site.url}${pg.path}`,
        provider: { "@type": "Organization", name: site.name, url: site.url },
        areaServed: "IN",
      }
    : null;
  const jobs =
    pg.form === "vacancies"
      ? open.map((v) => ({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: v.title,
          description: `${v.title} — ${v.vesselType}. Required certificates: ${v.certificates}.`,
          identifier: { "@type": "PropertyValue", name: site.name, value: v.id },
          datePosted: v.posted,
          validThrough: v.closing,
          hiringOrganization: {
            "@type": "Organization",
            name: site.name,
            sameAs: site.url,
          },
        }))
      : [];

  const imgObj = pageImage[pg.path] || pageImage["/services/"];
  const heroImg = imgObj.src;
  const isFormPage = pg.form === "enquiry" || pg.form === "profile";

  return (
    <>
      {/* Subpage Hero with embedded Breadcrumbs */}
      <SubpageHero
        title={pg.crumb || pg.h1}
        bgImage={heroImg}
        crumbs={crumbs(pg.path)}
      />

      <section className="section subpage-content-section">
        <div className="wrap">
          {ld && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            />
          )}
          {jobs.map((j) => (
            <script
              key={j.identifier.value}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }}
            />
          ))}

          {/* Top Overview Grid (Text Left, Photo Right) */}
          <div className="subpage-top-overview-grid" style={{ gridTemplateColumns: isFormPage ? "1fr" : undefined, marginBottom: "2.5rem" }}>
            <div className="subpage-top-text">
              <span className="script-subtitle">{pg.crumb || "Sea Hawk Management"}</span>
              <h1 className="subpage-main-h1">{pg.h1}</h1>
              <div className="title-underline left" />
              <p className="subpage-lead-desc">{pg.desc}</p>
            </div>
            {!isFormPage && (
              <div className="subpage-top-image">
                <div className="subpage-photo-card">
                  <Pic i={imgObj} priority sizes="(max-width: 900px) 100vw, 700px" />
                </div>
              </div>
            )}
          </div>

          {/* Main Layout Grid (Full Width 1fr for Form pages, 2-Column Grid with Right Sidebar for Content pages) */}
          <div className="subpage-main-layout-grid" style={{ gridTemplateColumns: isFormPage ? "1fr" : undefined }}>
            <div className="subpage-main-body">
              {/* Dynamic Content Blocks */}
              <div className="subpage-blocks-wrapper">
                {pg.blocks.map((b, i) => (
                  <Block key={i} b={b} />
                ))}
              </div>

              {/* Form Component (If Enquiry or Profile Page) */}
              {(pg.form === "enquiry" || pg.form === "profile") && (
                <div className="subpage-form-wrapper" style={{ marginTop: pg.blocks.length > 0 ? "2rem" : "0" }}>
                  <GenericForm kind={pg.form} />
                </div>
              )}

              {/* Vacancies List */}
              {pg.form === "vacancies" &&
                (open.length === 0 ? (
                  <>
                    <h2 style={{ marginTop: "2rem" }}>No Vacancy State</h2>
                    <p>
                      There are currently no published vacancies matching your
                      selection. You can register or update your profile for
                      consideration against future requirements. Profile
                      registration does not guarantee employment.
                    </p>
                    <Cta
                      x={[["/seafarers/profile/", "Register or update profile"]]}
                    />
                  </>
                ) : (
                  <div className="grid" style={{ marginTop: "2rem" }}>
                    {open.map((v) => (
                      <article className="item" key={v.id}>
                        <h2 style={{ fontSize: "1.25rem" }}>{v.title}</h2>
                        <dl>
                          <dt>Vacancy ID</dt>
                          <dd>{v.id}</dd>
                          <dt>Vessel type</dt>
                          <dd>{v.vesselType}</dd>
                          <dt>Experience</dt>
                          <dd>{v.experience}</dd>
                          <dt>Joining window</dt>
                          <dd>{v.joining}</dd>
                          <dt>Contract</dt>
                          <dd>{v.duration}</dd>
                          {v.flag && (
                            <>
                              <dt>Flag / area</dt>
                              <dd>{v.flag}</dd>
                            </>
                          )}
                          <dt>Certificates</dt>
                          <dd>{v.certificates}</dd>
                          {v.salary && (
                            <>
                              <dt>Salary</dt>
                              <dd>{v.salary}</dd>
                            </>
                          )}
                          <dt>Posted</dt>
                          <dd>{v.posted}</dd>
                          <dt>Closing</dt>
                          <dd>{v.closing}</dd>
                        </dl>
                        <Link
                          className="primary-gold-btn"
                          href={`/seafarers/profile/?vacancy=${encodeURIComponent(
                            v.id
                          )}`}
                        >
                          Apply Now
                        </Link>
                      </article>
                    ))}
                  </div>
                ))}

              {/* Fraud Warning Notices for Seafarer Content Pages */}
              {pg.path.startsWith("/seafarers/") && pg.form !== "profile" && (
                <p className="notice" style={{ marginTop: "2.5rem" }}>
                  See our{" "}
                  <Link href="/recruitment-fraud-advisory/">
                    Recruitment &amp; Fraud Advisory
                  </Link>
                  . Never pay anyone for placement.
                </p>
              )}
            </div>

            {/* Executive Maritime Sidebar Widget (Right Column - Hidden on Form Pages) */}
            {!isFormPage && (
              <aside className="subpage-sidebar">
                <div className="sidebar-widget contact-widget">
                  <span className="widget-subtitle">DIRECT CONTACT</span>
                  <h3>Speak with Our Team</h3>
                  <p>Have questions about vessel management, chartering, technical inspections, or crew deployment?</p>
                  <div className="widget-contact-info">
                    <p><strong>Phone:</strong> <a href={site.phoneHref}>{site.phone}</a></p>
                    <p><strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a></p>
                  </div>
                  <Link href="/contact/" className="primary-gold-btn sidebar-btn">
                    Get in Touch
                  </Link>
                </div>

                <div className="sidebar-widget nav-widget" style={{ marginTop: "2rem" }}>
                  <span className="widget-subtitle">EXPLORE SERVICES</span>
                  <h3>Our Core Solutions</h3>
                  <ul className="sidebar-nav-links">
                    <li><Link href="/services/commercial-management/">&raquo; Commercial Management</Link></li>
                    <li><Link href="/services/technical-management/">&raquo; Technical Management</Link></li>
                    <li><Link href="/services/crew-management/">&raquo; Crew Management</Link></li>
                    <li><Link href="/services/marine-consultancy/">&raquo; Marine Consultancy</Link></li>
                    <li><Link href="/services/offshore-marine-support/">&raquo; Offshore Support</Link></li>
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

