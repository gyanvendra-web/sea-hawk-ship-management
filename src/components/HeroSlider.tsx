"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

export type Slide = {
  id: number;
  image: string;
  tagline: string;
  title: string;
  description: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/hero-ship-1.webp",
    tagline: "INTEGRATED SHIP MANAGEMENT",
    title: "Safer, Smarter Maritime Operations",
    description:
      "Supporting ship owners, vessel operators, and maritime businesses with commercial management, technical management, crew management, and marine consultancy.",
    primaryCta: { href: "/contact/", label: "Discuss Your Requirements" },
    secondaryCta: { href: "/services/", label: "Explore Our Services" },
  },
  {
    id: 2,
    image: "/images/hero-ship-2.webp",
    tagline: "COMMERCIAL & FLEET MANAGEMENT",
    title: "Commercial Excellence & Voyage Performance",
    description:
      "Post-fixture operations, chartering coordination, marine accounting, and continuous operational oversight to maximize asset value.",
    primaryCta: { href: "/services/commercial-management/", label: "Commercial Management" },
    secondaryCta: { href: "/ship-owners/", label: "Solutions For Owners" },
  },
  {
    id: 3,
    image: "/images/hero-ship-3.webp",
    tagline: "TECHNICAL MANAGEMENT & SAFETY",
    title: "Optimizing Vessel Reliability & Asset Life",
    description:
      "Structured technical maintenance, condition monitoring, dry-dock planning, defect follow-up, and statutory compliance management.",
    primaryCta: { href: "/services/technical-management/", label: "Technical Management" },
    secondaryCta: { href: "/about/quality-safety-compliance/", label: "Safety & Quality" },
  },
  {
    id: 4,
    image: "/images/hero-ship-4.webp",
    tagline: "OFFSHORE & CREW MANAGEMENT",
    title: "Specialized Marine & Manpower Support",
    description:
      "Sourcing, qualification screening, STCW compliance, pre-joining administration, and offshore project mobilization.",
    primaryCta: { href: "/services/crew-management/", label: "Crew Management" },
    secondaryCta: { href: "/seafarers/", label: "Open Seafarer Hub" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    resetTimer();
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  };

  return (
    <div className="hero-slider-container">
      {/* Top Animated Progress Bar */}
      <div className="hero-progress-bar-wrap">
        <div key={current} className="hero-progress-bar" />
      </div>

      {/* Slide Counter Badge */}
      <div className="hero-counter-badge">
        <span className="current-num">0{current + 1}</span>
        <span className="divider">/</span>
        <span className="total-num">0{slides.length}</span>
      </div>

      {/* Track & Sliding Items */}
      <div className="hero-slider-track-wrap">
        {slides.map((slide, index) => {
          const isActive = index === current;
          const offsetPercent = (index - current) * 100;
          return (
            <div
              key={slide.id}
              className={`hero-slide-item ${isActive ? "active" : ""}`}
              style={{
                transform: `translateX(${offsetPercent}%)`,
                visibility: Math.abs(index - current) <= 1 ? "visible" : "hidden",
              }}
              aria-hidden={!isActive}
            >
              {/* Background Image */}
              <div
                className="hero-slide-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Dark Gradient Overlay */}
              <div className="hero-slide-overlay" />

              {/* Slide Content Wrap */}
              <div className="wrap hero-content-wrap">
                <div className="hero-content">
                  <span className="hero-tagline">{slide.tagline}</span>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-description">{slide.description}</p>
                  <div className="btns hero-btns">
                    <Link
                      href={slide.primaryCta.href}
                      className="btn hero-btn-primary"
                    >
                      {slide.primaryCta.label}
                    </Link>
                    <Link
                      href={slide.secondaryCta.href}
                      className="btn ghost hero-btn-secondary"
                    >
                      {slide.secondaryCta.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        className="hero-arrow prev"
        aria-label="Previous Slide"
        onClick={prevSlide}
      >
        ‹
      </button>
      <button
        type="button"
        className="hero-arrow next"
        aria-label="Next Slide"
        onClick={nextSlide}
      >
        ›
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`hero-dot ${index === current ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          >
            <span className="dot-fill" />
          </button>
        ))}
      </div>
    </div>
  );
}
