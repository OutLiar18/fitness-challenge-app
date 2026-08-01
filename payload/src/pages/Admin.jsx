import { useState } from "react";

import AdminOverview from "../components/admin/AdminOverview";
import AnnouncementManager from "../components/admin/AnnouncementManager";
import AuditLog from "../components/admin/AuditLog";
import SuggestionModeration from "../components/admin/SuggestionModeration";
import UserManagement from "../components/admin/UserManagement";
import Toast from "../components/common/Toast/Toast";
import PageHeader from "../components/layout/PageHeader";
import useAdminData from "../hooks/useAdminData";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import "./Admin.css";

const ADMIN_TABS = Object.freeze([
  { id: "overview", label: "Overview", icon: "🧭" },
  { id: "announcements", label: "Announcements", icon: "📣" },
  { id: "suggestions", label: "Suggestions", icon: "🧾" },
  { id: "users", label: "Players and roles", icon: "👥" },
  { id: "audit", label: "Audit history", icon: "🕵️" },
]);

export default function Admin() {
  const { user, isPlatformAdmin } = usePlayerData();
  const isAdmin = isPlatformAdmin;
  const adminData = useAdminData(isAdmin);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast, showToast, dismissToast } = useToast();

  function renderPanel() {
    switch (activeTab) {
      case "announcements":
        return (
          <AnnouncementManager
            announcements={adminData.announcements}
            actorId={user?.uid}
            notify={showToast}
          />
        );

      case "suggestions":
        return (
          <SuggestionModeration
            suggestions={adminData.suggestions}
            actorId={user?.uid}
            notify={showToast}
          />
        );

      case "users":
        return (
          <UserManagement
            users={adminData.users}
            actorId={user?.uid}
            notify={showToast}
          />
        );

      case "audit":
        return <AuditLog auditEvents={adminData.auditEvents} />;

      default:
        return (
          <AdminOverview
            announcements={adminData.announcements}
            suggestions={adminData.suggestions}
            users={adminData.users}
            auditEvents={adminData.auditEvents}
          />
        );
    }
  }

  return (
    <div className="admin-page page-stack">
      <PageHeader
        eyebrow="Secure operations"
        title="Platform administration"
        description="Publish announcements, review community suggestions and manage trusted access with an immutable audit trail."
        icon="⚙️"
      />

      {!isAdmin ? (
        <section className="admin-restricted card" role="status">
          <span aria-hidden="true">🔐</span>
          <div>
            <p className="section-kicker">Restricted area</p>
            <h2>Platform Administrator access is required</h2>
            <p>
              Ordinary players cannot grant themselves administrative access. The first
              administrator must be assigned through the Firebase console or a trusted
              Firebase Admin SDK process.
            </p>
          </div>
        </section>
      ) : (
        <>
          {adminData.errors.length > 0 && (
            <section className="admin-data-errors inline-alert inline-alert--danger" role="alert">
              <strong>Some administrative data could not be loaded.</strong>
              <ul>
                {adminData.errors.map((error) => (
                  <li key={error.source}>
                    {error.source}: {error.message}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="admin-workspace">
            <nav className="admin-tabs card" aria-label="Administration sections">
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`admin-tab${
                    activeTab === tab.id ? " admin-tab--active" : ""
                  }`}
                  type="button"
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  <strong>{tab.label}</strong>
                </button>
              ))}
            </nav>

            <div className="admin-panel">{renderPanel()}</div>
          </div>
        </>
      )}

      <Toast
        message={toast?.message}
        type={toast?.type}
        onDismiss={dismissToast}
      />
    </div>
  );
}
