import { formatNumber, pluralize } from "../../utils/displayFormatters";

export default function AdminOverview({
  announcements,
  suggestions,
  users,
  auditEvents,
}) {
  const pendingSuggestions = suggestions.filter(
    (suggestion) => suggestion.status === "pending",
  ).length;
  const publishedAnnouncements = announcements.filter(
    (announcement) => announcement.status === "published",
  ).length;
  const administrators = users.filter(
    (player) => player.role === "admin",
  ).length;

  const metrics = [
    {
      icon: "📣",
      value: publishedAnnouncements,
      label: pluralize(
        publishedAnnouncements,
        "published announcement",
        "published announcements",
      ),
    },
    {
      icon: "🧾",
      value: pendingSuggestions,
      label: pluralize(
        pendingSuggestions,
        "suggestion awaiting review",
        "suggestions awaiting review",
      ),
    },
    {
      icon: "👥",
      value: users.length,
      label: pluralize(users.length, "registered player", "registered players"),
    },
    {
      icon: "🛡️",
      value: administrators,
      label: pluralize(
        administrators,
        "Platform Administrator",
        "Platform Administrators",
      ),
    },
  ];

  return (
    <div className="admin-overview">
      <section className="admin-overview__hero card">
        <div>
          <p className="section-kicker">Trusted operations</p>
          <h2>Platform control centre</h2>
          <p>
            Publish clear updates, review community suggestions and manage trusted
            access without changing competitive scores behind the scenes.
          </p>
        </div>
        <span aria-hidden="true">🧭</span>
      </section>

      <section className="admin-metric-grid" aria-label="Administration summary">
        {metrics.map((metric) => (
          <article className="admin-metric card" key={metric.label}>
            <span aria-hidden="true">{metric.icon}</span>
            <strong>{formatNumber(metric.value, { whole: true })}</strong>
            <small>{metric.label}</small>
          </article>
        ))}
      </section>

      <section className="admin-principles card">
        <p className="section-kicker">Operating principles</p>
        <h2>Authority should leave a trail</h2>
        <div className="admin-principles__grid">
          <article>
            <strong>Least privilege</strong>
            <p>Give people only the access required for their actual responsibility.</p>
          </article>
          <article>
            <strong>Explain every decision</strong>
            <p>Moderation decisions should be respectful, specific and reviewable.</p>
          </article>
          <article>
            <strong>Protect fair competition</strong>
            <p>Administrative tools never hide or duplicate scoring logic.</p>
          </article>
          <article>
            <strong>Keep immutable history</strong>
            <p>{formatNumber(auditEvents.length, { whole: true })} recent audit records are available.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
