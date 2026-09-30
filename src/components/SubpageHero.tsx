import React from "react";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

interface SubpageHeroProps {
  title: string;
  bgImage?: string;
  crumbs?: Crumb[];
}

export default function SubpageHero({
  title,
  bgImage = "/images/hero-ship-1.webp",
  crumbs = [],
}: SubpageHeroProps) {
  return (
    <div className="subpage-hero-banner">
      <div
        className="subpage-hero-bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="subpage-hero-overlay" />
      <div className="wrap subpage-hero-container">
        {crumbs && crumbs.length > 0 && (
          <div className="subpage-hero-top-crumbs">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <div className="subpage-hero-center-content">
          <h1 className="subpage-hero-title">{title}</h1>
        </div>
      </div>
      <div className="nautical-rope-divider subpage-rope" aria-hidden="true" />
    </div>
  );
}


