import ThemeIcon from "../common/ThemeIcon";
import { formatNumber, pluralize } from "../../utils/displayFormatters";

export default function AdminOverview({
  announcements,
  suggestions,
  users,
  auditEvents,
  libraryItems = [],
  errorReports = [],
  accountDeletionRequests = [],
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
  const publishedLibraryItems = libraryItems.filter(
    (item) => item.status === "published",
  ).length;
  const openErrors = errorReports.filter(
    (report) => report.status === "open",
  ).length;
  const activeDeletionRequests = accountDeletionRequests.filter(
    (request) => request.status === "requested" || request.status === "acknowledged",
  ).length;

  const metrics = [
    {
      iconName: "command",
      value: pendingSuggestions,
      label: pluralize(
        pendingSuggestions,
        "suggestion awaiting review",
        "suggestions awaiting review",
      ),
    },
    {
      iconName: "info",
      value: openErrors,
      label: pluralize(openErrors, "open error report", "open error reports"),
    },
    {
      iconName: "profile",
      value: activeDeletionRequests,
      label: pluralize(
        activeDeletionRequests,
        "active deletion request",
        "active deletion requests",
      ),
    },
    {
      iconName: "inbox",
      value: publishedAnnouncements,
      label: pluralize(
        publishedAnnouncements,
        "published announcement",
        "published announcements",
      ),
    },
    {
      iconName: "journal",
      value: publishedLibraryItems,
      label: pluralize(
        publishedLibraryItems,
        "published library item",
        "published library items",
      ),
    },
    {
      iconName: "roster",
      value: users.length,
      label: pluralize(users.length, "loaded player", "loaded players"),
    },
    {
      iconName: "admin",
      value: administrators,
      label: pluralize(
        administrators,
        "loaded Platform Administrator",
        "loaded Platform Administrators",
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
        <span aria-hidden="true"><ThemeIcon name="compass" size={54} strokeWidth={2.2} /></span>
      </section>

      <section className="admin-metric-grid" aria-label="Administration summary">
        {metrics.map((metric) => (
          <article className="admin-metric card" key={metric.label}>
            <span aria-hidden="true"><ThemeIcon name={metric.iconName} size={26} /></span>
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
