"use client";

import { useState } from "react";

export default function StaffLoginClient({ error }: { error?: string }) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Sign-In Form State
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign-Up Form State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupDepartment, setSignupDepartment] = useState("Manning & Crewing");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirmPass, setSignupConfirmPass] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupPassMismatch, setSignupPassMismatch] = useState(false);

  return (
    <div className="split-portal-page">
      <div className="split-portal-wrapper">
        {/* ================= LEFT PANEL: MARITIME VISUAL ================= */}
        <div className="split-visual-panel">
          <div
            className="visual-ship-bg"
            style={{ backgroundImage: "url('/images/hero-ship-2.jpg')" }}
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

          {/* SEGMENTED TAB SWITCHER */}
          <div className="segmented-tab-switch">
            <button
              type="button"
              className={`segmented-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("login");
              }}
            >
              🔒 Staff Sign-In
            </button>
            <button
              type="button"
              className={`segmented-tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("signup");
              }}
            >
              ✍️ Staff Registration
            </button>
          </div>

          {/* ================= TAB 1: SIGN-IN FORM ================= */}
          {activeTab === "login" && (
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

                <div className="remember-row">
                  <label className="checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember session on this device</span>
                  </label>
                </div>

                <button type="submit" className="split-submit-btn">
                  <span>Sign In To Dashboard</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 2: SIGN-UP FORM (EXACT ROW-BY-ROW LAYOUT) ================= */}
          {activeTab === "signup" && (
            <div className="tab-pane-fade">
              {signupPassMismatch && (
                <div className="split-alert error" role="alert">
                  <span>⚠️</span>
                  <span>Passwords do not match. Please re-enter.</span>
                </div>
              )}

              <form
                className="split-signup-custom-grid"
                method="post"
                action="/api/admin/signup"
                onSubmit={(e) => {
                  if (signupPass && signupConfirmPass && signupPass !== signupConfirmPass) {
                    e.preventDefault();
                    setSignupPassMismatch(true);
                  } else {
                    setSignupPassMismatch(false);
                  }
                }}
              >
                {/* ROW 1: FULL NAME | OFFICIAL EMAIL */}
                <div className="signup-2col-row">
                  <div className="form-field">
                    <label htmlFor="signupName">
                      Full Name <span className="req">*</span>
                    </label>
                    <div className="input-group-box">
                      <span className="prefix-icon">👤</span>
                      <input
                        id="signupName"
                        name="name"
                        type="text"
                        placeholder="Capt. Rajesh Sharma"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="signupEmail">
                      Official Email <span className="req">*</span>
                    </label>
                    <div className="input-group-box">
                      <span className="prefix-icon">✉️</span>
                      <input
                        id="signupEmail"
                        name="email"
                        type="email"
                        placeholder="rajesh@seahawk.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ROW 2: PHONE NUMBER | DEPARTMENT */}
                <div className="signup-2col-row">
                  <div className="form-field">
                    <label htmlFor="signupPhone">Phone Number</label>
                    <div className="input-group-box">
                      <span className="prefix-icon">📞</span>
                      <input
                        id="signupPhone"
                        name="phone"
                        type="tel"
                        placeholder="+91 99992 42808"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="signupDepartment">Department</label>
                    <div className="input-group-box">
                      <span className="prefix-icon">⚓</span>
                      <select
                        id="signupDepartment"
                        name="role"
                        value={signupDepartment}
                        onChange={(e) => setSignupDepartment(e.target.value)}
                      >
                        <option value="Manning & Crewing">Manning & Crewing</option>
                        <option value="Technical Operations">Technical Ops</option>
                        <option value="HR & Admin">HR & Admin</option>
                        <option value="Commercial Ops">Commercial Ops</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ROW 3: PASSWORD | CONFIRM PASSWORD */}
                <div className="signup-2col-row">
                  <div className="form-field">
                    <label htmlFor="signupPass">
                      Password <span className="req">*</span>
                    </label>
                    <div className="input-group-box has-eye-toggle">
                      <span className="prefix-icon">🔑</span>
                      <input
                        id="signupPass"
                        name="password"
                        type={showSignupPass ? "text" : "password"}
                        placeholder="Create password"
                        value={signupPass}
                        onChange={(e) => setSignupPass(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="eye-toggle-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSignupPass((prev) => !prev);
                        }}
                      >
                        {showSignupPass ? "👁️ Hide" : "👁️ Show"}
                      </button>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="signupConfirmPass">
                      Confirm Password <span className="req">*</span>
                    </label>
                    <div className="input-group-box has-eye-toggle">
                      <span className="prefix-icon">🔒</span>
                      <input
                        id="signupConfirmPass"
                        type={showSignupPass ? "text" : "password"}
                        placeholder="Confirm password"
                        value={signupConfirmPass}
                        onChange={(e) => setSignupConfirmPass(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="eye-toggle-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSignupPass((prev) => !prev);
                        }}
                      >
                        {showSignupPass ? "👁️ Hide" : "👁️ Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ROW 4: SUBMIT BUTTON (FULL WIDTH) */}
                <button type="submit" className="split-submit-btn line-full">
                  <span>Create Staff Account & Access Dashboard</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          )}

          {/* Legal Footer */}
          <div className="form-panel-footer">
            <span className="security-note">🛡️ 256-Bit SSL Encrypted Enterprise System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
