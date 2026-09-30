"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { forms } from "@/lib/forms";

export default function GenericForm({ kind }: { kind: "enquiry" | "profile" }) {
  const cfg = forms[kind];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setState("sending");
    setErrors({});
    try {
      const r = await fetch(`/api/submit?form=${kind}`, { method: "POST", body: new FormData(formElement) });
      const d = await r.json();
      if (d.ok) {
        setState("done");
        formElement.reset();
        return;
      }
      if (d.errors) { setErrors(d.errors); return setState("idle"); }
      setMsg(d.error ?? "Something went wrong."); setState("failed");
    } catch { setMsg("Network error. Check your connection and try again."); setState("failed"); }
  }

  return (
    <div style={{ position: "relative" }}>
      {/* SUCCESS MODAL POPUP DIALOG */}
      {state === "done" && (
        <div className="popup-modal-overlay" role="dialog" aria-modal="true">
          <div className="popup-modal-card">
            <div className="popup-top-gold-bar" />
            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setState("idle")}
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

            <h3 className="popup-modal-title">
              {kind === "enquiry" ? "Enquiry Submitted Successfully! 🎉" : "Profile Submitted Successfully! 🎉"}
            </h3>
            <p className="popup-modal-desc">
              {kind === "enquiry"
                ? "Thank you. Your enquiry has been received by Sea Hawk Ship Management. Our team will review your details and contact you."
                : "Thank you. Your seafarer profile has been registered in our database. Our crewing desk will contact you as vacancies arise."}
            </p>

            <button
              type="button"
              className="popup-modal-action-btn"
              onClick={() => setState("idle")}
            >
              <span>Great, Thank You!</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      )}

      <form className="enq" onSubmit={submit} noValidate encType="multipart/form-data">
        {cfg.fields.map((f) => {
          const id = f.name, err = errors[id];
          const aria = { id, name: id, "aria-invalid": err ? true : undefined, "aria-describedby": [err ? `${id}-e` : "", f.hint ? `${id}-h` : ""].filter(Boolean).join(" ") || undefined };
          if (f.type === "checkbox") return (
            <div className="field" key={id}><div className="check"><input type="checkbox" {...aria} />
              <label htmlFor={id}>{f.label} (required) {id === "consent" && <Link href="/privacy-policy/">Privacy Policy</Link>}</label></div>
              {err && <p className="err" id={`${id}-e`}>{err}</p>}</div>);
          return (
            <div className="field" key={id}>
              <label htmlFor={id}>{f.label}{f.required ? " (required)" : ""}</label>
              {f.hint && <p id={`${id}-h`} style={{ margin: "0 0 .3rem", color: "var(--muted)", fontSize: ".9rem" }}>{f.hint}</p>}
              {f.type === "textarea" ? <textarea {...aria} required={f.required} />
                : f.type === "select" ? <select {...aria} defaultValue="" required={f.required}><option value="">Select one</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
                : f.type === "file" ? <input {...aria} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required={f.required} />
                : <input {...aria} type={f.type} required={f.required} />}
              {err && <p className="err" id={`${id}-e`}>{err}</p>}
            </div>);
        })}
        <div className="hp" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {state === "failed" && <p className="err" role="alert">{msg}</p>}
        <div><button className="btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : kind === "enquiry" ? "Send enquiry" : "Submit profile"}</button></div>
      </form>
    </div>
  );
}
