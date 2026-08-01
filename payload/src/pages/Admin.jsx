import PageHeader from "../components/layout/PageHeader";
import usePlayerData from "../hooks/usePlayerData";
import "./Admin.css";

const ADMIN_MODULES = [
  {
    icon: "🧾",
    title: "Suggestion moderation",
    description: "Review Exercise, Cardio and Skill suggestions with an audit trail.",
    status: "Planned",
  },
  {
    icon: "📣",
    title: "Announcement publishing",
    description: "Draft, schedule and retire product or challenge announcements.",
    status: "Foundation ready",
  },
  {
    icon: "👥",
    title: "User and team management",
    description: "Search players, manage teams and handle support cases securely.",
    status: "Planned",
  },
  {
    icon: "⚖️",
    title: "Challenge configuration",
    description: "Publish versioned goals, scoring rules and seasonal settings.",
    status: "Architecture required",
  },
  {
    icon: "🕵️",
    title: "Audit history",
    description: "Record who changed what, when and why.",
    status: "Required before launch",
  },
  {
    icon: "📊",
    title: "Operational analytics",
    description: "Monitor participation, moderation queues and system health.",
    status: "Future",
  },
];

export default function Admin() {
  const { profile } = usePlayerData();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="admin-page page-stack">
      <PageHeader
        eyebrow="Secure operations"
        title="Administration foundation"
        description="The structure is ready. Real admin actions remain disabled until custom claims, server-side authorization and audit history are implemented."
        icon="⚙️"
      />

      {!isAdmin ? (
        <section className="admin-restricted card" role="status">
          <span aria-hidden="true">🔐</span>
          <div>
            <h2>Admin access is not enabled for this account</h2>
            <p>
              This page intentionally exposes no user data and performs no admin
              actions. A client-side profile role will never be treated as sufficient
              production authorization.
            </p>
          </div>
        </section>
      ) : (
        <div className="inline-alert">
          Admin preview mode only. No write actions are connected.
        </div>
      )}

      <section className="admin-modules" aria-labelledby="admin-modules-title">
        <div className="admin-modules__header">
          <div>
            <p>Planned control centre</p>
            <h2 id="admin-modules-title">Admin modules</h2>
          </div>
          <span>Structure only</span>
        </div>

        <div className="admin-modules__grid">
          {ADMIN_MODULES.map((module) => (
            <article className="admin-module card" key={module.title}>
              <span className="admin-module__icon" aria-hidden="true">
                {module.icon}
              </span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <small>{module.status}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-guardrails card">
        <h2>Non-negotiable guardrails</h2>
        <ul>
          <li>Custom claims or equivalent server-trusted roles.</li>
          <li>Firestore rules that enforce every privileged action.</li>
          <li>Immutable audit records for moderation and score changes.</li>
          <li>Versioned challenge configuration before leagues or seasons.</li>
          <li>No hidden score manipulation inside admin UI components.</li>
        </ul>
      </section>
    </div>
  );
}
