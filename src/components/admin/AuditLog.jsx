import { useMemo, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value) {
  const date = value?.toDate?.();
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Pending server timestamp";
}

export default function AuditLog({
  auditEvents,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      auditEvents.filter((event) =>
        [event.summary, event.action, event.entityType, event.entityId, event.actorId]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    [auditEvents, normalizedSearch],
  );

  return (
    <section className="admin-audit">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Accountability</p>
          <h2>Immutable audit history</h2>
          <p>
            This history records trusted changes. Audit records cannot be edited or deleted from the application.
          </p>
        </div>
      </div>

      <label className="admin-search card">
        <span>Search audit history</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by action, entity or administrator"
        />
      </label>

      <div className="audit-list card">
        {filtered.length === 0 ? (
          <div className="empty-state">No audit records match your search.</div>
        ) : (
          filtered.map((event) => (
            <article className="audit-row" key={event.id}>
              <span className="audit-row__icon" aria-hidden="true">🕵️</span>
              <div>
                <strong>{event.summary}</strong>
                <p>{event.action} · {event.entityType} · {event.entityId}</p>
                <small>
                  {formatDate(event.createdAt)} · Administrator {event.actorId}
                </small>
              </div>
            </article>
          ))
        )}
      </div>

      {hasMore && (
        <button
          className="button button--secondary admin-load-more"
          type="button"
          disabled={loadingMore}
          onClick={onLoadMore}
        >
          {loadingMore ? "Loading more audit records…" : "Load more audit records"}
        </button>
      )}
    </section>
  );
}
