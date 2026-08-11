import { useSearchParams } from "react-router-dom";

import AccountDeletionRequests from "../components/admin/AccountDeletionRequests";
import AdminOverview from "../components/admin/AdminOverview";
import AnnouncementManager from "../components/admin/AnnouncementManager";
import AuditLog from "../components/admin/AuditLog";
import ErrorReports from "../components/admin/ErrorReports";
import EntryIntegrityWorkspace from "../components/admin/EntryIntegrityWorkspace";
import LibraryPublisher from "../components/admin/LibraryPublisher";
import SuggestionModeration from "../components/admin/SuggestionModeration";
import UserManagement from "../components/admin/UserManagement";
import Toast from "../components/common/Toast/Toast";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import useAdminData from "../hooks/useAdminData";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import "./Admin.css";

const ADMIN_TABS = Object.freeze([
  { id: "overview", label: "Overview", icon: "🧭" },
  { id: "announcements", label: "Announcements", icon: "📣" },
  { id: "suggestions", label: "Suggestions", icon: "🧾" },
  { id: "library", label: "Library releases", icon: "📚" },
  { id: "users", label: "Players and roles", icon: "👥" },
  { id: "errors", label: "Error reports", icon: "🚨" },
  { id: "account-requests", label: "Account requests", icon: "🧹" },
  { id: "entry-integrity", label: "Entry integrity", icon: "🧾" },
  { id: "audit", label: "Audit history", icon: "🕵️" },
]);

export default function Admin() {
  const { user, isPlatformAdmin } = usePlayerData();
  const isAdmin = isPlatformAdmin;
  const adminData = useAdminData(isAdmin);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = ADMIN_TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "overview";
  const { toast, showToast, dismissToast } = useToast();

  function setActiveTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "overview") next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

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

      case "library":
        return (
          <LibraryPublisher
            suggestions={adminData.suggestions}
            libraryItems={adminData.libraryItems}
            releases={adminData.libraryReleases}
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
            hasMore={adminData.usersPage.hasMore}
            loadingMore={adminData.usersPage.loading}
            onLoadMore={adminData.loadMoreUsers}
            onUpdated={adminData.markUserUpdated}
          />
        );

      case "errors":
        return (
          <ErrorReports
            reports={adminData.errorReports}
            hasMore={adminData.errorPage.hasMore}
            loadingMore={adminData.errorPage.loading}
            onLoadMore={adminData.loadMoreErrorReports}
            onResolved={adminData.markErrorResolved}
            actorId={user?.uid}
            notify={showToast}
          />
        );

      case "account-requests":
        return (
          <AccountDeletionRequests
            requests={adminData.accountDeletionRequests}
            actorId={user?.uid}
            notify={showToast}
          />
        );

      case "entry-integrity":
        return (
          <EntryIntegrityWorkspace
            actorId={user?.uid}
            notify={showToast}
          />
        );

      case "audit":
        return (
          <AuditLog
            auditEvents={adminData.auditEvents}
            hasMore={adminData.auditPage.hasMore}
            loadingMore={adminData.auditPage.loading}
            onLoadMore={adminData.loadMoreAuditEvents}
          />
        );

      default:
        return (
          <AdminOverview
            announcements={adminData.announcements}
            suggestions={adminData.suggestions}
            users={adminData.users}
            auditEvents={adminData.auditEvents}
            libraryItems={adminData.libraryItems}
            errorReports={adminData.errorReports}
            accountDeletionRequests={adminData.accountDeletionRequests}
          />
        );
    }
  }

  return (
    <div className="admin-page page-stack">
      <PageHeader
        eyebrow="Secure operations"
        title="Platform administration"
        description="Publish announcements, review community suggestions, reconcile factual entry history and manage trusted access with an immutable audit trail."
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

          <WorkspaceTabs
            idPrefix="admin"
            label="Administration sections"
            tabs={ADMIN_TABS.map((tab) => ({
              ...tab,
              description:
                {
                  overview: "Operational health and current workload",
                  announcements: "Create and publish platform updates",
                  suggestions: "Review community-submitted library ideas",
                  library: "Prepare and publish versioned library releases",
                  users: "Manage trusted access and player roles",
                  errors: "Inspect first-party client error reports",
                  "account-requests": "Acknowledge player account deletion requests",
                  "entry-integrity": "Inspect and replace incorrect factual entries with immutable correction chains",
                  audit: "Review immutable administrative history",
                }[tab.id],
            }))}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          <WorkspacePanel id={activeTab} activeId={activeTab} idPrefix="admin">
            <div className="admin-panel">{renderPanel()}</div>
          </WorkspacePanel>
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
