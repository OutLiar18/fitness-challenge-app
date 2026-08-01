import { useMemo, useState } from "react";

import { resolveErrorReport } from "../../services/admin/errorReportService";
import { formatNumber } from "../../utils/displayFormatters";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value) {
  const date = value?.toDate?.() ?? value;

  return date instanceof Date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Date unavailable";
}

function ErrorReportCard({ report, actorId, notify, onResolved }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleResolve() {
    setBusy(true);

    try {
      await resolveErrorReport({
        report,
        resolutionNote: note,
        actorId,
      });
      notify("The error report was marked as resolved.");
      onResolved?.(report.id, note);
      setNote("");
    } catch (error) {
      notify(error.message || "The error report could not be resolved.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`error-report card error-report--${report.status}`}>
      <header className="error-report__header">
        <div>
          <span className={`status-pill status-pill--${report.status}`}>
            {report.status}
          </span>
          <h3>{report.name || "Application error"}</h3>
        </div>
        <time>{formatDate(report.reportedAt ?? report.occurredAt)}</time>
      </header>

      <p className="error-report__message">{report.message}</p>

      <dl className="error-report__details">
        <div>
          <dt>Source</dt>
          <dd>{report.source || "Unknown"}</dd>
        </div>
        <div>
          <dt>Route</dt>
          <dd>{report.route || "Unknown"}</dd>
        </div>
        <div>
          <dt>Release</dt>
          <dd>{report.releaseVersion || "Unknown"}</dd>
        </div>
        <div>
          <dt>Player identifier</dt>
          <dd>{report.userId || "Unknown"}</dd>
        </div>
      </dl>

      {report.stack && (
        <details className="error-report__stack">
          <summary>Technical stack</summary>
          <pre>{report.stack}</pre>
        </details>
      )}

      {report.status === "open" ? (
        <div className="error-report__resolution">
          <label>
            <span>Resolution note</span>
            <textarea
              value={note}
              rows={3}
              maxLength={500}
              placeholder="Explain what was fixed or why the report can be closed."
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <button
            className="button button--success"
            type="button"
            disabled={busy}
            onClick={handleResolve}
          >
            Mark as resolved
          </button>
        </div>
      ) : (
        <div className="error-report__resolved">
          <strong>Resolved</strong>
          <p>{report.resolutionNote || "No resolution note was recorded."}</p>
        </div>
      )}
    </article>
  );
}

export default function ErrorReports({
  reports,
  hasMore,
  loadingMore,
  onLoadMore,
  onResolved,
  actorId,
  notify,
}) {
  const [statusFilter, setStatusFilter] = useState("open");
  const filteredReports = useMemo(
    () =>
      reports.filter(
        (report) => statusFilter === "all" || report.status === statusFilter,
      ),
    [reports, statusFilter],
  );
  const openCount = reports.filter((report) => report.status === "open").length;

  return (
    <section className="admin-errors">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Production monitoring</p>
          <h2>Client error reports</h2>
          <p>
            Review sanitised application failures reported by authenticated
            players. Error reporting can be switched between off, console and
            Firestore modes through environment configuration.
          </p>
        </div>
        <strong>{formatNumber(openCount, { whole: true })} open</strong>
      </div>

      <div className="admin-filter-row card">
        {[
          { id: "open", label: "Open reports" },
          { id: "resolved", label: "Resolved reports" },
          { id: "all", label: "All reports" },
        ].map((filter) => (
          <button
            className={`admin-filter-button${
              statusFilter === filter.id ? " admin-filter-button--active" : ""
            }`}
            key={filter.id}
            type="button"
            aria-pressed={statusFilter === filter.id}
            onClick={() => setStatusFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state card">
          No error reports match this filter.
        </div>
      ) : (
        <div className="error-report-list">
          {filteredReports.map((report) => (
            <ErrorReportCard
              report={report}
              actorId={actorId}
              notify={notify}
              onResolved={onResolved}
              key={report.id}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <button
          className="button button--secondary admin-load-more"
          type="button"
          disabled={loadingMore}
          onClick={onLoadMore}
        >
          {loadingMore ? "Loading more reports…" : "Load more reports"}
        </button>
      )}
    </section>
  );
}
