"use client";

import { useState } from "react";
import Link from "next/link";

type R = Record<string, unknown> & {
  id: string;
  receivedAt: string;
  status?: string;
  files?: Record<string, string>;
  fullName?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  rank?: string;
  vesselType?: string;
  experience?: string;
  message?: string;
  enquiryType?: string;
};

type Session = { u: string; r: "admin" | "recruiter" };

export default function StaffDashboardClient({
  session,
  profiles,
  enquiries,
  contacts,
  accessLogs,
  staffUsers = [],
}: {
  session: Session;
  profiles: R[];
  enquiries: R[];
  contacts: R[];
  accessLogs: Record<string, unknown>[];
  staffUsers?: Record<string, unknown>[];
}) {
  const [activeTab, setActiveTab] = useState<"profiles" | "enquiries" | "contacts" | "logs" | "staff">("profiles");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Staff Registration Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState("Manning & Crewing");
  const [regMessage, setRegMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [staffList, setStaffList] = useState<Record<string, unknown>[]>(staffUsers);

  // Top-Right Toast & Detail Popup Modal States
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);
  const [selectedRecordModal, setSelectedRecordModal] = useState<{ title: string; type: string; data: Record<string, unknown> } | null>(null);
  const [editingStaff, setEditingStaff] = useState<Record<string, unknown> | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const isAdmin = session.r === "admin";

  const triggerToast = (title: string, message: string, type: "success" | "error" = "success") => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Register New Staff Member
  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegMessage(null);
    setRegLoading(true);

    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, role: regRole }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        triggerToast("🎉 Staff Registered!", data.message || `Credentials emailed to ${regEmail}`, "success");
        setStaffList((prev) => [
          { name: regName, email: regEmail, phone: regPhone, role: regRole, status: "active", createdAt: new Date().toISOString() },
          ...prev,
        ]);
        setRegName("");
        setRegEmail("");
        setRegPhone("");
      } else {
        setRegMessage({ type: "error", text: data.error || "Failed to create staff account." });
        triggerToast("⚠️ Registration Failed", data.error || "Could not register staff.", "error");
      }
    } catch (err) {
      setRegMessage({ type: "error", text: "Network error occurred." });
      triggerToast("⚠️ Network Error", "Connection failed.", "error");
    } finally {
      setRegLoading(false);
    }
  };

  // Toggle Active / Inactive Status
  const handleToggleStatus = async (item: Record<string, unknown>) => {
    const currentStatus = String(item.status || "active").toLowerCase();
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await fetch("/api/admin/staff-manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_status", id: item._id, email: item.email, status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStaffList((prev) =>
          prev.map((s) => (s.email === item.email || s._id === item._id ? { ...s, status: newStatus } : s))
        );
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      alert("Network error updating status.");
    }
  };

  // Delete Staff Member
  const handleDeleteStaff = async (item: Record<string, unknown>) => {
    if (!confirm(`Are you sure you want to delete staff account for '${item.name || item.email}'?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/staff-manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: item._id, email: item.email }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStaffList((prev) => prev.filter((s) => s.email !== item.email && s._id !== item._id));
      } else {
        alert(data.error || "Failed to delete staff member.");
      }
    } catch (err) {
      alert("Network error deleting staff member.");
    }
  };

  // Save Edit Staff Details
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setEditLoading(true);

    try {
      const res = await fetch("/api/admin/staff-manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", ...editingStaff }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStaffList((prev) =>
          prev.map((s) => (s.email === editingStaff.email || s._id === editingStaff._id ? { ...s, ...editingStaff } : s))
        );
        setEditingStaff(null);
      } else {
        alert(data.error || "Failed to save staff updates.");
      }
    } catch (err) {
      alert("Network error updating staff member.");
    } finally {
      setEditLoading(false);
    }
  };

  // Filter profiles based on search and status
  const filteredProfiles = profiles.filter((p) => {
    const text = `${p.fullName || p.name || ""} ${p.rank || ""} ${p.vesselType || ""} ${p.email || ""} ${p.id}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const text = `${e.name || e.company || ""} ${e.vesselType || ""} ${e.enquiryType || ""} ${e.email || ""}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const filteredContacts = contacts.filter((c) => {
    const text = `${c.name || c.company || ""} ${c.email || ""} ${c.message || ""}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="staff-dashboard-wrap">
      {/* 1. TOP EXECUTIVE HEADER BAR */}
      <header className="dash-top-bar">
        <div className="wrap dash-top-flex">
          <div className="dash-user-info">
            <span className="dash-avatar-badge">⚓</span>
            <div>
              <span className="dash-role-tag">{session.r.toUpperCase()} PORTAL</span>
              <h1 className="dash-user-name">Welcome, {session.u}</h1>
            </div>
          </div>

          <div className="dash-top-actions">
            <div className="dash-system-status">
              <span className="status-dot-pulse" /> 24/7 Security Protocol Active
            </div>
            <form method="post" action="/api/admin/logout">
              <button type="submit" className="dash-logout-btn">
                🚪 Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="wrap dash-body-container">
        {/* 2. STATS ANALYTICS BANNER */}
        <div className="dash-stats-grid">
          <div
            className={`dash-stat-card ${activeTab === "profiles" ? "active" : ""}`}
            onClick={() => setActiveTab("profiles")}
          >
            <div className="stat-icon-wrap gold">👨‍✈️</div>
            <div className="stat-info">
              <span className="stat-number">{profiles.length}</span>
              <span className="stat-label">Seafarer Candidates</span>
            </div>
          </div>

          {isAdmin && (
            <div
              className={`dash-stat-card ${activeTab === "enquiries" ? "active" : ""}`}
              onClick={() => setActiveTab("enquiries")}
            >
              <div className="stat-icon-wrap navy">🚢</div>
              <div className="stat-info">
                <span className="stat-number">{enquiries.length}</span>
                <span className="stat-label">Vessel Enquiries</span>
              </div>
            </div>
          )}

          {isAdmin && (
            <div
              className={`dash-stat-card ${activeTab === "contacts" ? "active" : ""}`}
              onClick={() => setActiveTab("contacts")}
            >
              <div className="stat-icon-wrap teal">✉️</div>
              <div className="stat-info">
                <span className="stat-number">{contacts.length}</span>
                <span className="stat-label">Contact Messages</span>
              </div>
            </div>
          )}

          {isAdmin && (
            <div
              className={`dash-stat-card ${activeTab === "staff" ? "active" : ""}`}
              onClick={() => setActiveTab("staff")}
            >
              <div className="stat-icon-wrap blue">👥</div>
              <div className="stat-info">
                <span className="stat-number">{staffList.length}</span>
                <span className="stat-label">Staff Members</span>
              </div>
            </div>
          )}

          {isAdmin && (
            <div
              className={`dash-stat-card ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <div className="stat-icon-wrap grey">🛡️</div>
              <div className="stat-info">
                <span className="stat-number">{accessLogs.length}</span>
                <span className="stat-label">Access Audit Logs</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. CONTROLS BAR: SEARCH & TABS */}
        <div className="dash-controls-bar">
          <div className="dash-tabs-header">
            <button
              className={`dash-tab-btn ${activeTab === "profiles" ? "active" : ""}`}
              onClick={() => setActiveTab("profiles")}
            >
              👨‍✈️ Seafarers ({profiles.length})
            </button>
            {isAdmin && (
              <button
                className={`dash-tab-btn ${activeTab === "enquiries" ? "active" : ""}`}
                onClick={() => setActiveTab("enquiries")}
              >
                🚢 Vessel Management ({enquiries.length})
              </button>
            )}
            {isAdmin && (
              <button
                className={`dash-tab-btn ${activeTab === "contacts" ? "active" : ""}`}
                onClick={() => setActiveTab("contacts")}
              >
                ✉️ Enquiries ({contacts.length})
              </button>
            )}
            {isAdmin && (
              <button
                className={`dash-tab-btn ${activeTab === "staff" ? "active" : ""}`}
                onClick={() => setActiveTab("staff")}
              >
                ➕ Register Staff ({staffList.length})
              </button>
            )}
            {isAdmin && (
              <button
                className={`dash-tab-btn ${activeTab === "logs" ? "active" : ""}`}
                onClick={() => setActiveTab("logs")}
              >
                🛡️ Access Audit ({accessLogs.length})
              </button>
            )}
          </div>

          <div className="dash-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, rank, vessel, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 4. MAIN CONTENT PANELS */}
        <div className="dash-content-area">
          {/* TAB 1: SEAFARER PROFILES TABLE */}
          {activeTab === "profiles" && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Registered Seafarer Profiles & Resumes</h2>
                <p>Candidate profiles submitted through Sea Hawk Seafarer Hub. Click any row to view full candidate detail & documents.</p>
              </div>

              {filteredProfiles.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">⚓</span>
                  <h3>No candidate profiles found</h3>
                  <p>When seafarers register profiles via the Seafarer Hub, candidate records and uploaded resumes will appear here.</p>
                </div>
              ) : (
                <div className="audit-table-wrap">
                  <table className="audit-table">
                    <thead>
                      <tr>
                        <th>Candidate Name</th>
                        <th>Rank / Title</th>
                        <th>Vessel Type</th>
                        <th>Sea Experience</th>
                        <th>Email / Phone</th>
                        <th>Date</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((r) => (
                        <tr
                          key={r.id}
                          className="clickable-row"
                          onClick={() =>
                            setSelectedRecordModal({
                              title: "👨‍✈️ Seafarer Candidate Profile Detail",
                              type: "seafarer",
                              data: r,
                            })
                          }
                        >
                          <td><strong>{String(r.fullName || r.name || "Seafarer Candidate")}</strong></td>
                          <td><span className="event-badge green">{String(r.rank || "N/A")}</span></td>
                          <td>{String(r.vesselType || "N/A")}</td>
                          <td>{String(r.experience || "N/A")}</td>
                          <td>{String(r.email || r.phone || "N/A")}</td>
                          <td className="time-col">{r.receivedAt?.slice(0, 10) || "Recent"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="file-download-btn"
                              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                            >
                              👁️ View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VESSEL MANAGEMENT ENQUIRIES TABLE */}
          {activeTab === "enquiries" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Vessel Management Enquiries</h2>
                <p>Commercial, Technical, Crew & Marine Management requests. Click any row to inspect complete enquiry info.</p>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">🚢</span>
                  <h3>No vessel management enquiries found</h3>
                  <p>Enquiries submitted by ship owners via the Ship Owners portal will appear here.</p>
                </div>
              ) : (
                <div className="audit-table-wrap">
                  <table className="audit-table">
                    <thead>
                      <tr>
                        <th>Company / Vessel</th>
                        <th>Contact Person</th>
                        <th>Vessel Type</th>
                        <th>Enquiry Type</th>
                        <th>Business Email</th>
                        <th>Date</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.map((r) => (
                        <tr
                          key={r.id}
                          className="clickable-row"
                          onClick={() =>
                            setSelectedRecordModal({
                              title: "🚢 Vessel Management Enquiry Detail",
                              type: "enquiry",
                              data: r,
                            })
                          }
                        >
                          <td><strong>{String(r.company || r.name || "Vessel Enquiry")}</strong></td>
                          <td>{String(r.name || "N/A")}</td>
                          <td>{String(r.vesselType || "N/A")}</td>
                          <td><span className="event-badge green">{String(r.enquiryType || "Management")}</span></td>
                          <td>{String(r.email || "N/A")}</td>
                          <td className="time-col">{r.receivedAt?.slice(0, 10) || "Recent"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="file-download-btn"
                              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                            >
                              👁️ View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES TABLE */}
          {activeTab === "contacts" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Direct Business Contacts</h2>
                <p>Submissions from the website Contact Us page. Click any row to read complete message content.</p>
              </div>

              {filteredContacts.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">✉️</span>
                  <h3>No contact messages found</h3>
                  <p>Inbound messages submitted through the Contact Us form will appear here.</p>
                </div>
              ) : (
                <div className="audit-table-wrap">
                  <table className="audit-table">
                    <thead>
                      <tr>
                        <th>Sender Name</th>
                        <th>Company</th>
                        <th>Email Address</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((r) => (
                        <tr
                          key={r.id}
                          className="clickable-row"
                          onClick={() =>
                            setSelectedRecordModal({
                              title: "✉️ Business Contact Message Detail",
                              type: "contact",
                              data: r,
                            })
                          }
                        >
                          <td><strong>{String(r.name || "Sender")}</strong></td>
                          <td>{String(r.company || "N/A")}</td>
                          <td>{String(r.email || "N/A")}</td>
                          <td>{String(r.phone || "N/A")}</td>
                          <td><span className="event-badge green">{String(r.subject || r.enquiryType || "General")}</span></td>
                          <td className="time-col">{r.receivedAt?.slice(0, 10) || "Recent"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="file-download-btn"
                              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                            >
                              👁️ View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STAFF REGISTRATION & MANAGEMENT */}
          {activeTab === "staff" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>➕ Register New Staff Member</h2>
                <p>Only authorized administrators can create staff user accounts for Sea Hawk portal access.</p>
              </div>

              {regMessage && (
                <div className={`split-alert ${regMessage.type === "error" ? "error" : "success"}`} style={{ marginBottom: "20px" }}>
                  <span>{regMessage.type === "error" ? "⚠️" : "✅"}</span>
                  <span>{regMessage.text}</span>
                </div>
              )}

              <form className="split-signup-custom-grid" onSubmit={handleRegisterStaff} style={{ marginBottom: "40px" }}>
                <div className="signup-2col-row">
                  <div className="form-field">
                    <label htmlFor="regName">Full Name <span className="req">*</span></label>
                    <div className="input-group-box">
                      <span className="prefix-icon">👤</span>
                      <input
                        id="regName"
                        type="text"
                        placeholder="e.g. Capt. Rajesh Sharma"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="regEmail">Official Email <span className="req">*</span></label>
                    <div className="input-group-box">
                      <span className="prefix-icon">✉️</span>
                      <input
                        id="regEmail"
                        type="email"
                        placeholder="e.g. rajesh@seahawkgroup.co.in"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="signup-2col-row">
                  <div className="form-field">
                    <label htmlFor="regPhone">Phone Number</label>
                    <div className="input-group-box">
                      <span className="prefix-icon">📞</span>
                      <input
                        id="regPhone"
                        type="tel"
                        placeholder="+91 99992 42808"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="regRole">Department / Role</label>
                    <div className="input-group-box">
                      <span className="prefix-icon">⚓</span>
                      <select
                        id="regRole"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                      >
                        <option value="Manning & Crewing">Manning & Crewing</option>
                        <option value="Technical Operations">Technical Operations</option>
                        <option value="HR & Admin">HR & Admin</option>
                        <option value="Commercial Ops">Commercial Ops</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" className="split-submit-btn line-full" disabled={regLoading}>
                  <span>{regLoading ? "Creating Staff Account & Sending Email..." : "➕ Create Account & Email Login Credentials"}</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>

              <div className="panel-top-title">
                <h3>Registered Staff Directory</h3>
                <p>Active staff accounts stored in MongoDB database.</p>
              </div>

              {staffList.length === 0 ? (
                <div className="empty-state">No staff accounts registered yet. Use the form above to add staff members.</div>
              ) : (
                <div className="audit-table-wrap">
                  <table className="audit-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department / Role</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.map((u, idx) => {
                        const isInactive = String(u.status || "active").toLowerCase() === "inactive";
                        return (
                          <tr key={idx}>
                            <td><strong>{String(u.name || "")}</strong></td>
                            <td>{String(u.email || "")}</td>
                            <td><span className="event-badge green">{String(u.role || "Staff")}</span></td>
                            <td>{String(u.phone || "N/A")}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(u)}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  border: "none",
                                  fontWeight: 700,
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                  background: isInactive ? "#fee2e2" : "#dcfce7",
                                  color: isInactive ? "#991b1b" : "#166534",
                                }}
                                title="Click to toggle Active / Inactive"
                              >
                                {isInactive ? "🔴 Inactive" : "🟢 Active"}
                              </button>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  onClick={() => setEditingStaff({ ...u })}
                                  style={{ padding: "5px 10px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "5px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", color: "#0f172a" }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStaff(u)}
                                  style={{ padding: "5px 10px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "5px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", color: "#991b1b" }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACCESS AUDIT LOGS */}
          {activeTab === "logs" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Security & Access Audit Trail</h2>
                <p>Every login attempt, view action, and document download is recorded for security compliance. Click any row to inspect audit log details.</p>
              </div>

              <div className="audit-table-wrap">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Event</th>
                      <th>User</th>
                      <th>IP Address</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessLogs.map((l, i) => (
                      <tr
                        key={i}
                        className="clickable-row"
                        onClick={() =>
                          setSelectedRecordModal({
                            title: "🛡️ Access Audit Log Detail",
                            type: "log",
                            data: l,
                          })
                        }
                      >
                        <td className="time-col">{String(l.at || "")}</td>
                        <td>
                          <span className={`event-badge ${String(l.event).includes("failed") ? "red" : "green"}`}>
                            {String(l.event || "")}
                          </span>
                        </td>
                        <td><strong>{String(l.user || "system")}</strong></td>
                        <td className="ip-col">{String(l.ip || "127.0.0.1")}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="file-download-btn"
                            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                          >
                            👁️ View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= TOP-RIGHT FLOATING TOAST NOTIFICATION ================= */}
      {toast && (
        <div className={`top-right-toast-box ${toast.type}`}>
          <div style={{ fontSize: "1.4rem" }}>{toast.type === "error" ? "⚠️" : "✅"}</div>
          <div>
            <h4 style={{ margin: "0 0 2px", fontSize: "0.95rem", color: "#0f172a", fontWeight: 700 }}>{toast.title}</h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569" }}>{toast.message}</p>
          </div>
          <button type="button" className="toast-close-btn" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}

      {/* ================= CLICKABLE TABLE ROW RECORD DETAIL VIEW MODAL ================= */}
      {selectedRecordModal && (
        <div className="quick-contact-modal-backdrop">
          <div className="quick-contact-modal-box" style={{ maxWidth: "560px" }}>
            <button type="button" className="quick-contact-modal-close" onClick={() => setSelectedRecordModal(null)}>
              ✕
            </button>

            <div style={{ marginBottom: "16px" }}>
              <span className="quick-contact-modal-badge">DATA INSPECTOR</span>
              <h3 style={{ color: "#0b2233", fontSize: "1.35rem", fontWeight: 800, margin: "4px 0 0" }}>
                {selectedRecordModal.title}
              </h3>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", marginBottom: "20px", maxHeight: "380px", overflowY: "auto" }}>
              {Object.entries(selectedRecordModal.data).map(([key, value]) => {
                if (!value || key === "_id" || key === "id") return null;

                if (key === "files" && typeof value === "object" && value !== null) {
                  return (
                    <div key={key} style={{ marginBottom: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>ATTACHED DOCUMENTS / RESUME</span>
                      <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {Object.entries(value as Record<string, string>).map(([docKey, docVal]) => {
                          const [stored, orig] = docVal.split("|");
                          return (
                            <a
                              key={docKey}
                              href={`/admin/file/${stored}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="file-download-btn"
                              style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                            >
                              📄 {docKey}: {orig} ↓
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={key} style={{ marginBottom: "10px", borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    </span>
                    <p style={{ margin: "2px 0 0", color: "#0f172a", fontWeight: 600, fontSize: "0.92rem", wordBreak: "break-word" }}>
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>

            <button type="button" className="split-submit-btn line-full" onClick={() => setSelectedRecordModal(null)}>
              <span>Close Detail View</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT STAFF MEMBER MODAL DIALOG ================= */}
      {editingStaff && (
        <div className="quick-contact-modal-backdrop">
          <div className="quick-contact-modal-box" style={{ maxWidth: "480px" }}>
            <button type="button" className="quick-contact-modal-close" onClick={() => setEditingStaff(null)}>
              ✕
            </button>

            <h3 style={{ color: "#0b2233", fontSize: "1.3rem", fontWeight: 800, margin: "0 0 16px" }}>
              ✏️ Edit Staff Details
            </h3>

            <form onSubmit={handleSaveEdit}>
              <div className="form-field" style={{ marginBottom: "14px" }}>
                <label>Full Name <span className="req">*</span></label>
                <div className="input-group-box">
                  <span className="prefix-icon">👤</span>
                  <input
                    type="text"
                    value={String(editingStaff.name || "")}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: "14px" }}>
                <label>Official Email <span className="req">*</span></label>
                <div className="input-group-box">
                  <span className="prefix-icon">✉️</span>
                  <input
                    type="email"
                    value={String(editingStaff.email || "")}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: "14px" }}>
                <label>Phone Number</label>
                <div className="input-group-box">
                  <span className="prefix-icon">📞</span>
                  <input
                    type="tel"
                    value={String(editingStaff.phone || "")}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: "20px" }}>
                <label>Department / Role</label>
                <div className="input-group-box">
                  <span className="prefix-icon">⚓</span>
                  <select
                    value={String(editingStaff.role || "Manning & Crewing")}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  >
                    <option value="Manning & Crewing">Manning & Crewing</option>
                    <option value="Technical Operations">Technical Operations</option>
                    <option value="HR & Admin">HR & Admin</option>
                    <option value="Commercial Ops">Commercial Ops</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  style={{ padding: "12px 16px", background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button type="submit" className="split-submit-btn line-full" disabled={editLoading}>
                  <span>{editLoading ? "Saving Changes..." : "Save Updates"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



