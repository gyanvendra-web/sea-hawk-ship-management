/** ===================================================
 * 🎨 FRONTEND UI: Homepage Quick Contact Form Component
 * =================================================== */
"use client";
import { useState, type FormEvent } from "react";

export default function HomeQuickForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [failMsg, setFailMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const f = new FormData(formElement);

    const nameVal = String(f.get("name") ?? "").trim();
    const emailVal = String(f.get("email") ?? "").trim();
    const phoneVal = String(f.get("phone") ?? "").trim();
    const subjectVal = String(f.get("subject") ?? "").trim();
    const messageVal = String(f.get("message") ?? "").trim();

    if (!nameVal || nameVal.length < 2) {
      setFailMsg("Please enter your full name.");
      setStatus("failed");
      return;
    }

    if (!emailVal || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailVal)) {
      setFailMsg("Please enter a valid email address.");
      setStatus("failed");
      return;
    }

    const payload = {
      name: nameVal,
      company: "Individual",
      email: emailVal,
      phone: phoneVal,
      enquiryType: "Other",
      vesselType: subjectVal || "General Inquiry",
      message: messageVal || subjectVal || "Quick Home Page Contact Inquiry",
      consent: true,
    };

    setStatus("sending");
    setFailMsg("");

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
        const firstErr = Object.values(data.fieldErrors).flat()[0];
        setFailMsg(String(firstErr ?? "Invalid input fields."));
      } else {
        setFailMsg(data.error ?? "Something went wrong. Please check your details.");
      }
      setStatus("failed");
    } catch {
      setFailMsg("Network error. Please try again.");
      setStatus("failed");
    }
  }

  return (
    <div className="quick-form-right" style={{ position: "relative" }}>
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

            <h3 className="popup-modal-title">Inquiry Submitted Successfully 🎉</h3>
            <p className="popup-modal-desc">
              Thank you for reaching out to <strong>Sea Hawk Ship Management</strong>. Your details have been received and saved into our database.
            </p>
            <p className="popup-modal-subtext">
              Our executive representative will review your inquiry and contact you within 24 hours.
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

      <h2 className="form-title">Get in Touch with Us</h2>
      <form onSubmit={onSubmit} className="quick-form" noValidate>
        <div className="form-field full">
          <label htmlFor="home-name">Your name <span style={{ color: "#dc2626" }}>*</span></label>
          <input
            type="text"
            id="home-name"
            name="name"
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-row split">
          <div className="form-field">
            <label htmlFor="home-email">Your email <span style={{ color: "#dc2626" }}>*</span></label>
            <input
              type="email"
              id="home-email"
              name="email"
              required
              placeholder="name@company.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="home-phone">Your Phone</label>
            <input
              type="tel"
              id="home-phone"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        <div className="form-field full">
          <label htmlFor="home-subject">Subject <span style={{ color: "#dc2626" }}>*</span></label>
          <input
            type="text"
            id="home-subject"
            name="subject"
            required
            placeholder="Commercial / Technical / Crew Inquiry"
          />
        </div>

        <div className="form-field full">
          <label htmlFor="home-message">Your message (optional)</label>
          <textarea
            id="home-message"
            name="message"
            rows={4}
            placeholder="Describe your vessel or inquiry..."
          />
        </div>

        {status === "failed" && (
          <div className="form-error-banner" style={{ margin: "0.5rem 0", padding: "0.5rem 0.75rem", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", fontSize: "0.85rem" }}>
            <span>⚠️ {failMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="primary-gold-btn form-submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Transmitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
