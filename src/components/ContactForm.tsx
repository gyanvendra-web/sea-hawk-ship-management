/** ===================================================
 * 🎨 FRONTEND UI: Main Contact Form Component
 * =================================================== */
"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { enquiryTypes } from "@/lib/validate";
import styles from "./ContactForm.module.css";

type Errors = Record<string, string[] | undefined>;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [failMsg, setFailMsg] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const f = new FormData(formElement);
    const payload = {
      name: f.get("name"),
      company: f.get("company"),
      email: f.get("email"),
      phone: f.get("phone"),
      enquiryType: f.get("enquiryType"),
      vesselType: f.get("vesselType"),
      message: f.get("message"),
      consent: f.get("consent") === "on",
      website: f.get("website"),
    };
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("done");
        formElement.reset();
        return;
      }
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        setStatus("idle");
        return;
      }
      setFailMsg(data.error ?? "Something went wrong.");
      setStatus("failed");
    } catch {
      setFailMsg("Network error. Check your connection and try again.");
      setStatus("failed");
    }
  }

  const a = (id: string) => ({
    id,
    name: id,
    onFocus: () => setFocusedField(id),
    onBlur: () => setFocusedField(null),
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-err` : undefined,
  });

  return (
    <div className={styles.cardContainer}>
      {/* SUCCESS MODAL POPUP DIALOG */}
      {status === "done" && (
        <div className="popup-modal-overlay" role="dialog" aria-modal="true">
          <div className="popup-modal-card">
            <div className="popup-top-gold-bar" />
            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setStatus("idle")}
              aria-label="Close popup"
            >
              ✕
            </button>

            <div className="popup-icon-container">
              <div className="popup-checkmark-badge">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
            </div>

            <h3 className="popup-modal-title">Enquiry Transmitted Successfully 🎉</h3>
            <p className="popup-modal-desc">
              Thank you for reaching out to <strong>Sea Hawk Ship Management</strong>. Your message has been routed to our commercial and technical team and logged in our system.
            </p>
            <p className="popup-modal-subtext">
              Our executive team will review your requirements and respond within 24 hours.
            </p>

            <button
              type="button"
              className="popup-modal-action-btn"
              onClick={() => setStatus("idle")}
            >
              <span>Great, Thank You!</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Clean Ship Image Header Banner (240px Height) */}
      <div className={styles.cardShipBanner}>
        <div
          className={styles.cardShipBg}
          style={{ backgroundImage: "url('/images/hero-ship-2.webp')" }}
        />
        <div className={styles.cardShipOverlay} />
        <div className={styles.cardShipHeaderContent}>
          <span className={styles.cardShipSubtitle}>SEA HAWK INTAKE</span>
          <h3 className={styles.cardShipTitle}>Send a Business Enquiry</h3>
        </div>
      </div>

      <div className={styles.cardFormBody}>
        <form className={styles.animatedForm} onSubmit={onSubmit} noValidate>
          <div className={styles.formGrid2col}>
            <div className={`${styles.animField} ${focusedField === "name" ? styles.animFieldFocused : ""} ${errors.name ? styles.animFieldError : ""}`}>
              <label htmlFor="name">Full Name <span className={styles.reqStar}>*</span></label>
              <input {...a("name")} autoComplete="name" placeholder="e.g. Capt. Rajesh Sharma" required />
              {errors.name?.[0] && <p className={styles.errMsg} id="name-err">{errors.name[0]}</p>}
            </div>

            <div className={`${styles.animField} ${focusedField === "company" ? styles.animFieldFocused : ""} ${errors.company ? styles.animFieldError : ""}`}>
              <label htmlFor="company">Company / Organization</label>
              <input {...a("company")} autoComplete="organization" placeholder="e.g. Maritime Shipping Lines Ltd" />
              {errors.company?.[0] && <p className={styles.errMsg} id="company-err">{errors.company[0]}</p>}
            </div>
          </div>

          <div className="form-grid-2col">
            <div className={`anim-field ${focusedField === "email" ? "is-focused" : ""} ${errors.email ? "is-error" : ""}`}>
              <label htmlFor="email">Business Email <span className="req-star">*</span></label>
              <input {...a("email")} type="email" autoComplete="email" placeholder="e.g. capt.sharma@shippingcorp.com" required />
              {errors.email?.[0] && <p className="err-msg" id="email-err">{errors.email[0]}</p>}
            </div>

            <div className={`anim-field ${focusedField === "phone" ? "is-focused" : ""} ${errors.phone ? "is-error" : ""}`}>
              <label htmlFor="phone">Phone / WhatsApp Number <span className="req-star">*</span></label>
              <input {...a("phone")} type="tel" autoComplete="tel" placeholder="e.g. +91 98765 43210" required />
              {errors.phone?.[0] && <p className="err-msg" id="phone-err">{errors.phone[0]}</p>}
            </div>
          </div>

          <div className="form-grid-2col">
            <div className={`anim-field ${focusedField === "enquiryType" ? "is-focused" : ""} ${errors.enquiryType ? "is-error" : ""}`}>
              <label htmlFor="enquiryType">Service Enquiry Category <span className="req-star">*</span></label>
              <div className="select-custom-wrapper">
                <select {...a("enquiryType")} defaultValue="" required>
                  <option value="" disabled>Select required service</option>
                  {enquiryTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {errors.enquiryType?.[0] && <p className="err-msg" id="enquiryType-err">{errors.enquiryType[0]}</p>}
            </div>

            <div className={`anim-field ${focusedField === "vesselType" ? "is-focused" : ""} ${errors.vesselType ? "is-error" : ""}`}>
              <label htmlFor="vesselType">Vessel / Project Category</label>
              <div className="select-custom-wrapper">
                <select {...a("vesselType")} defaultValue="">
                  <option value="">Select Vessel Category (Optional)</option>
                  <option value="Bulk Carrier">Bulk Carrier</option>
                  <option value="Oil / Chemical Tanker">Oil / Chemical Tanker</option>
                  <option value="Gas Carrier (LPG/LNG)">Gas Carrier (LPG/LNG)</option>
                  <option value="Container Ship">Container Ship</option>
                  <option value="General Cargo / Multi-Purpose">General Cargo / Multi-Purpose</option>
                  <option value="Offshore Vessel (AHTS/PSV)">Offshore Vessel (AHTS/PSV)</option>
                  <option value="Passenger / Cruise Ship">Passenger / Cruise Ship</option>
                  <option value="Tugboat / Barge">Tugboat / Barge</option>
                  <option value="Other / General Enquiry">Other / General Enquiry</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {errors.vesselType?.[0] && <p className="err-msg" id="vesselType-err">{errors.vesselType[0]}</p>}
            </div>
          </div>

          <div className={`anim-field ${focusedField === "message" ? "is-focused" : ""} ${errors.message ? "is-error" : ""}`}>
            <label htmlFor="message">Requirement Details & Message <span className="req-star">*</span></label>
            <textarea
              {...a("message")}
              rows={4}
              placeholder="Please detail your vessel specs, trading area, required crew ranks, technical scope or project timelines..."
              required
            />
            {errors.message?.[0] && <p className="err-msg" id="message-err">{errors.message[0]}</p>}
          </div>

          {/* Spam Honeypot Field */}
          <div className="hp" aria-hidden="true" style={{ display: "none" }}>
            <label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <div className={`anim-field-check ${errors.consent ? "is-error" : ""}`}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-err" : undefined}
              />
              <span className="checkbox-custom" />
              <span className="checkbox-label">
                I consent to Sea Hawk Ship Management storing and processing my details to respond to this enquiry as governed by the{" "}
                <Link href="/privacy-policy/" target="_blank">Privacy Policy</Link>. <span className="req-star">*</span>
              </span>
            </label>
            {errors.consent?.[0] && <p className="err-msg" id="consent-err">{errors.consent[0]}</p>}
          </div>

          {status === "failed" && (
            <div className="form-error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{failMsg}</span>
            </div>
          )}

          <div className="form-submit-row">
            <button
              className="animated-submit-btn"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                <span className="btn-loading-state">
                  <span className="spinner-ring" /> Transmitting Enquiry...
                </span>
              ) : (
                <span className="btn-normal-state">
                  Send Business Enquiry <span className="btn-arrow">→</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
