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
}: {
  session: Session;
  profiles: R[];
  enquiries: R[];
  contacts: R[];
  accessLogs: Record<string, unknown>[];
}) {
  const [activeTab, setActiveTab] = useState<"profiles" | "enquiries" | "contacts" | "logs">("profiles");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAdmin = session.r === "admin";

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
          {/* TAB 1: SEAFARER PROFILES */}
          {activeTab === "profiles" && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Registered Seafarer Profiles & Resumes</h2>
                <p>Candidate profiles submitted through Sea Hawk Seafarer Hub.</p>
              </div>

              {filteredProfiles.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">⚓</span>
                  <h3>No candidate profiles found</h3>
                  <p>When seafarers register profiles via the Seafarer Hub, candidate records and uploaded resumes will appear here.</p>
                </div>
              ) : (
                <div className="records-cards-list">
                  {filteredProfiles.map((r) => (
                    <div className="record-card" key={r.id}>
                      <div className="record-card-header">
                        <div className="record-main-title">
                          <h3>{String(r.fullName || r.name || "Seafarer Candidate")}</h3>
                          <span className="record-date-badge">Submitted: {r.receivedAt?.slice(0, 10)}</span>
                        </div>
                        <span className="record-status-tag">{r.status || "Received"}</span>
                      </div>

                      <div className="record-grid-details">
                        {r.rank && (
                          <div className="detail-item">
                            <span className="detail-label">RANK / TITLE</span>
                            <span className="detail-val highlight">{String(r.rank)}</span>
                          </div>
                        )}
                        {r.vesselType && (
                          <div className="detail-item">
                            <span className="detail-label">VESSEL TYPE</span>
                            <span className="detail-val">{String(r.vesselType)}</span>
                          </div>
                        )}
                        {r.experience && (
                          <div className="detail-item">
                            <span className="detail-label">SEA EXPERIENCE</span>
                            <span className="detail-val">{String(r.experience)}</span>
                          </div>
                        )}
                        {r.email && (
                          <div className="detail-item">
                            <span className="detail-label">EMAIL</span>
                            <span className="detail-val">
                              <a href={`mailto:${r.email}`}>{String(r.email)}</a>
                            </span>
                          </div>
                        )}
                        {r.phone && (
                          <div className="detail-item">
                            <span className="detail-label">PHONE</span>
                            <span className="detail-val">
                              <a href={`tel:${r.phone}`}>{String(r.phone)}</a>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* File Attachments */}
                      {r.files && Object.keys(r.files).length > 0 && (
                        <div className="record-files-box">
                          <span className="files-title">📎 Attached Documents / Resume:</span>
                          <div className="files-flex">
                            {Object.entries(r.files).map(([k, v]) => {
                              const [stored, orig] = v.split("|");
                              return (
                                <a
                                  key={k}
                                  href={`/admin/file/${stored}/`}
                                  className="file-download-btn"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  📄 {k}: {orig} ↓
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VESSEL ENQUIRIES */}
          {activeTab === "enquiries" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Vessel Management Enquiries</h2>
                <p>Commercial, Technical, Crew & Marine Management requests from ship owners.</p>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">🚢</span>
                  <h3>No vessel management enquiries found</h3>
                  <p>Enquiries submitted by ship owners via the Ship Owners portal will appear here.</p>
                </div>
              ) : (
                <div className="records-cards-list">
                  {filteredEnquiries.map((r) => (
                    <div className="record-card" key={r.id}>
                      <div className="record-card-header">
                        <div className="record-main-title">
                          <h3>{String(r.company || r.name || "Vessel Enquiry")}</h3>
                          <span className="record-date-badge">Submitted: {r.receivedAt?.slice(0, 10)}</span>
                        </div>
                        <span className="record-status-tag gold">{r.enquiryType || "Management"}</span>
                      </div>

                      <div className="record-grid-details">
                        {r.name && (
                          <div className="detail-item">
                            <span className="detail-label">CONTACT PERSON</span>
                            <span className="detail-val">{String(r.name)}</span>
                          </div>
                        )}
                        {r.vesselType && (
                          <div className="detail-item">
                            <span className="detail-label">VESSEL TYPE</span>
                            <span className="detail-val">{String(r.vesselType)}</span>
                          </div>
                        )}
                        {r.email && (
                          <div className="detail-item">
                            <span className="detail-label">BUSINESS EMAIL</span>
                            <span className="detail-val">
                              <a href={`mailto:${r.email}`}>{String(r.email)}</a>
                            </span>
                          </div>
                        )}
                        {r.phone && (
                          <div className="detail-item">
                            <span className="detail-label">PHONE</span>
                            <span className="detail-val">{String(r.phone)}</span>
                          </div>
                        )}
                      </div>

                      {r.message && (
                        <div className="record-message-box">
                          <span className="message-label">Enquiry Message:</span>
                          <p>{String(r.message)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES */}
          {activeTab === "contacts" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Direct Business Contacts</h2>
                <p>Submissions from the main website Contact Us page.</p>
              </div>

              {filteredContacts.length === 0 ? (
                <div className="empty-state-card">
                  <span className="empty-icon">✉️</span>
                  <h3>No contact messages found</h3>
                  <p>Inbound messages submitted through the Contact Us form will appear here.</p>
                </div>
              ) : (
                <div className="records-cards-list">
                  {filteredContacts.map((r) => (
                    <div className="record-card" key={r.id}>
                      <div className="record-card-header">
                        <div className="record-main-title">
                          <h3>{String(r.name || r.company || "Contact Enquiry")}</h3>
                          <span className="record-date-badge">{r.receivedAt?.slice(0, 10)}</span>
                        </div>
                        <span className="record-status-tag">{r.enquiryType || "General"}</span>
                      </div>

                      <div className="record-grid-details">
                        {r.company && (
                          <div className="detail-item">
                            <span className="detail-label">COMPANY</span>
                            <span className="detail-val">{String(r.company)}</span>
                          </div>
                        )}
                        {r.email && (
                          <div className="detail-item">
                            <span className="detail-label">EMAIL</span>
                            <span className="detail-val">
                              <a href={`mailto:${r.email}`}>{String(r.email)}</a>
                            </span>
                          </div>
                        )}
                        {r.phone && (
                          <div className="detail-item">
                            <span className="detail-label">PHONE</span>
                            <span className="detail-val">{String(r.phone)}</span>
                          </div>
                        )}
                      </div>

                      {r.message && (
                        <div className="record-message-box">
                          <span className="message-label">Message Content:</span>
                          <p>{String(r.message)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACCESS AUDIT LOGS */}
          {activeTab === "logs" && isAdmin && (
            <div className="dash-panel">
              <div className="panel-top-title">
                <h2>Security & Access Audit Trail</h2>
                <p>Every login attempt, view action, and document download is recorded for security compliance.</p>
              </div>

              <div className="audit-table-wrap">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Event</th>
                      <th>User</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessLogs.map((l, i) => (
                      <tr key={i}>
                        <td className="time-col">{String(l.at || "")}</td>
                        <td>
                          <span className={`event-badge ${String(l.event).includes("failed") ? "red" : "green"}`}>
                            {String(l.event || "")}
                          </span>
                        </td>
                        <td><strong>{String(l.user || "system")}</strong></td>
                        <td className="ip-col">{String(l.ip || "127.0.0.1")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
