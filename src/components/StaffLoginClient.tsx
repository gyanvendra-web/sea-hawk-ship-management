"use client";

import { useState } from "react";

export default function StaffLoginClient({ error }: { error?: string }) {
  // Sign-In Form State
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [simulatedOtpCode, setSimulatedOtpCode] = useState("");

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setForgotLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email: forgotEmail }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setForgotMsg({ type: "success", text: data.message });
        if (data.simulatedOtp) {
          setSimulatedOtpCode(data.simulatedOtp);
        }
        setForgotStep(2);
      } else {
        setForgotMsg({ type: "error", text: data.error || "Failed to send OTP code." });
      }
    } catch (err) {
      setForgotMsg({ type: "error", text: "Network error occurred." });
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    if (newPass !== confirmNewPass) {
      setForgotMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_otp",
          email: forgotEmail,
          otp: forgotOtp,
          newPassword: newPass,
        }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setForgotMsg({ type: "success", text: data.message });
        setForgotStep(3);
      } else {
        setForgotMsg({ type: "error", text: data.error || "Invalid OTP code." });
      }
    } catch (err) {
      setForgotMsg({ type: "error", text: "Network error occurred." });
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setForgotOtp("");
    setNewPass("");
    setConfirmNewPass("");
    setForgotMsg(null);
    setSimulatedOtpCode("");
  };

  return (
    <div className="split-portal-page">
      <div className="split-portal-wrapper">
        {/* ================= LEFT PANEL: MARITIME VISUAL ================= */}
        <div className="split-visual-panel">
          <div
            className="visual-ship-bg"
            style={{ backgroundImage: "url('/images/hero-ship-2.webp')" }}
          />
          <div className="visual-dark-overlay" />

          <div className="visual-content-wrap">
            <div className="visual-header-block">
              <div className="visual-badge">
                <span>⚓ SEA HAWK MARITIME PORTAL</span>
              </div>
              <h1 className="visual-title">Maritime Operations Gateway</h1>
              <p className="visual-tagline">
                Secure Access for Fleet & Seafarer Operations
              </p>
            </div>

            <div className="visual-security-footer">
              <span className="live-status-dot" /> System Status: Operational
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL: CLEAN FORM CARD ================= */}
        <div className="split-form-panel">
          <div className="form-panel-top-gold" />

          {/* HEADER BADGE */}
          <div className="login-header-badge-box">
            <h2 className="login-panel-title">🔒 Authorized Staff Login</h2>
            <p className="login-panel-subtitle">Enter your official Sea Hawk credentials to enter the operations portal.</p>
          </div>

          {/* ================= SIGN-IN FORM ================= */}
          <div className="tab-pane-fade">
            {error && (
              <div className="split-alert error" role="alert">
                <span>⚠️</span>
                <span>
                  {error === "limit"
                    ? "Too many failed attempts. Please wait 10 minutes."
                    : "Invalid credentials. Please verify your staff username and password."}
                </span>
              </div>
            )}

            <form className="split-form" method="post" action="/api/admin/login">
              <div className="form-field">
                <label htmlFor="user">
                  Staff Username / Email <span className="req">*</span>
                </label>
                <div className="input-group-box">
                  <span className="prefix-icon">👤</span>
                  <input
                    id="user"
                    name="user"
                    type="text"
                    autoComplete="username"
                    placeholder="Username or email"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="password">
                  Security Password <span className="req">*</span>
                </label>
                <div className="input-group-box has-eye-toggle">
                  <span className="prefix-icon">🔑</span>
                  <input
                    id="password"
                    name="password"
                    type={showLoginPass ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter security password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLoginPass((prev) => !prev);
                    }}
                  >
                    {showLoginPass ? "👁️ Hide" : "👁️ Show"}
                  </button>
                </div>
              </div>

              <div className="remember-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember session</span>
                </label>

                <button
                  type="button"
                  className="forgot-link-btn"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: "none", border: "none", color: "#d49b18", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
                >
                  🔑 Forgot Password?
                </button>
              </div>

              <button type="submit" className="split-submit-btn">
                <span>Sign In To Dashboard</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>

          {/* Legal Footer */}
          <div className="form-panel-footer">
            <span className="security-note">🛡️ 256-Bit SSL Encrypted Enterprise System</span>
          </div>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD / MAIL OTP MODAL ================= */}
      {showForgotModal && (
        <div className="quick-contact-modal-backdrop">
          <div className="quick-contact-modal-box" style={{ maxWidth: "460px" }}>
            <button type="button" className="quick-contact-modal-close" onClick={closeForgotModal}>
              ✕
            </button>

            <div className="quick-contact-modal-header" style={{ textAlign: "center" }}>
              <span className="quick-contact-modal-badge">🔐 SECURITY VERIFICATION</span>
              <h3 className="quick-contact-modal-title">Reset Staff Password</h3>
              <p className="quick-contact-modal-subtitle">
                {forgotStep === 1 && "Enter your registered official email to receive a 6-digit OTP code."}
                {forgotStep === 2 && "Enter the 6-digit OTP code sent to your email along with your new password."}
                {forgotStep === 3 && "Your password has been successfully updated!"}
              </p>
            </div>

            {forgotMsg && (
              <div className={`split-alert ${forgotMsg.type === "error" ? "error" : "success"}`} style={{ margin: "15px 0" }}>
                <span>{forgotMsg.type === "error" ? "⚠️" : "✅"}</span>
                <span>{forgotMsg.text}</span>
              </div>
            )}

            {/* STEP 1: SEND OTP */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} style={{ marginTop: "15px" }}>
                <div className="form-field" style={{ marginBottom: "20px" }}>
                  <label htmlFor="forgotEmail">Official Registered Email <span className="req">*</span></label>
                  <div className="input-group-box">
                    <span className="prefix-icon">✉️</span>
                    <input
                      id="forgotEmail"
                      type="email"
                      placeholder="e.g. staff@seahawkgroup.co.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="split-submit-btn line-full" disabled={forgotLoading}>
                  <span>{forgotLoading ? "Sending OTP..." : "📨 Send Verification OTP"}</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            )}

            {/* STEP 2: VERIFY OTP & NEW PASSWORD */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} style={{ marginTop: "15px" }}>
                {simulatedOtpCode && (
                  <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "0.85rem", color: "#92400e" }}>
                    ℹ️ <strong>Demo Mode Code:</strong> <code style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{simulatedOtpCode}</code>
                  </div>
                )}

                <div className="form-field" style={{ marginBottom: "12px" }}>
                  <label htmlFor="forgotOtp">6-Digit OTP Code <span className="req">*</span></label>
                  <div className="input-group-box">
                    <span className="prefix-icon">🔢</span>
                    <input
                      id="forgotOtp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: "12px" }}>
                  <label htmlFor="newPass">New Password <span className="req">*</span></label>
                  <div className="input-group-box">
                    <span className="prefix-icon">🔑</span>
                    <input
                      id="newPass"
                      type="password"
                      placeholder="Create new password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: "20px" }}>
                  <label htmlFor="confirmNewPass">Confirm New Password <span className="req">*</span></label>
                  <div className="input-group-box">
                    <span className="prefix-icon">🔒</span>
                    <input
                      id="confirmNewPass"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    style={{ padding: "12px 16px", background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer" }}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="split-submit-btn line-full" disabled={forgotLoading}>
                    <span>{forgotLoading ? "Verifying..." : "✅ Reset Password"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {forgotStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎉</div>
                <h4 style={{ color: "#0b2233", margin: "0 0 10px" }}>Password Successfully Reset!</h4>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
                  You can now log in to the staff portal using your email and new password.
                </p>
                <button type="button" className="split-submit-btn line-full" onClick={closeForgotModal}>
                  <span>Return to Sign In →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


