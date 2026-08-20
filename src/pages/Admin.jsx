import { useEffect, useRef } from "react";
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
import ThemeIcon from "../components/common/ThemeIcon";
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
  { id: "overview", label: "Overview", icon: <ThemeIcon name="compass" size={18} /> },
  { id: "announcements", label: "Announcements", icon: <ThemeIcon name="inbox" size={18} /> },
  { id: "suggestions", label: "Suggestions", icon: <ThemeIcon name="command" size={18} /> },
  { id: "library", label: "Library releases", icon: <ThemeIcon name="journal" size={18} /> },
  { id: "users", label: "Players and roles", icon: <ThemeIcon name="roster" size={18} /> },
  { id: "errors", label: "Error reports", icon: <ThemeIcon name="info" size={18} /> },
  { id: "account-requests", label: "Account requests", icon: <ThemeIcon name="profile" size={18} /> },
  { id: "entry-integrity", label: "Entry integrity", icon: <ThemeIcon name="evidence" size={18} /> },
  { id: "audit", label: "Audit history", icon: <ThemeIcon name="admin" size={18} /> },
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
  const adminErrorRef = useRef(null);

  useEffect(() => {
    if (adminData.errors.length > 0) adminErrorRef.current?.focus();
  }, [adminData.errors.length]);

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
        icon={<ThemeIcon name="admin" size={28} strokeWidth={2.2} />}
      />

      {!isAdmin ? (
        <section className="admin-restricted card" role="status">
          <span aria-hidden="true"><ThemeIcon name="evidence" size={30} /></span>
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
            <section
              className="admin-data-errors inline-alert inline-alert--danger"
              ref={adminErrorRef}
              role="alert"
              tabIndex="-1"
            >
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
                  overview: "Current workload",
                  announcements: "Publish platform updates",
                  suggestions: "Review community ideas",
                  library: "Publish shared options",
                  users: "Trusted player access",
                  errors: "Client failures",
                  "account-requests": "Deletion workflow",
                  "entry-integrity": "Audited factual corrections",
                  audit: "Trusted change history",
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
