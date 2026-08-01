import { useMemo, useState } from "react";

import { SUGGESTION_STATUSES } from "../../constants/admin";
import { reviewSuggestion } from "../../services/admin/moderationService";
import { formatNumber } from "../../utils/displayFormatters";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value) {
  const date = value?.toDate?.();
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Date unavailable";
}

function getDefinitionDetails(suggestion) {
  return Object.entries(suggestion.definition ?? {})
    .filter(([, value]) =>
      ["string", "number"].includes(typeof value) && String(value).trim(),
    )
    .slice(0, 8);
}

function SuggestionCard({ suggestion, actorId, notify }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [busy, setBusy] = useState(false);
  const details = getDefinitionDetails(suggestion);
  const name = suggestion.definition?.name || "Unnamed suggestion";

  async function decide(decision) {
    setBusy(true);

    try {
      await reviewSuggestion({
        suggestion,
        decision,
        rejectionReason,
        actorId,
      });
      notify(
        decision === "approved"
          ? `${name} was approved.`
          : `${name} was rejected with feedback.`,
      );
      setRejectionReason("");
    } catch (error) {
      notify(error.message || "The suggestion could not be reviewed.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`suggestion-review card suggestion-review--${suggestion.status}`}>
      <header className="suggestion-review__header">
        <div>
          <span className="suggestion-review__type">
            {suggestion.kind === "exercise" ? "Exercise" : suggestion.itemType}
          </span>
          <h3>{name}</h3>
        </div>
        <span className={`status-pill status-pill--${suggestion.status}`}>
          {suggestion.status === "pending" ? "Pending review" : suggestion.status}
        </span>
      </header>

      <dl className="suggestion-review__details">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt>{label.replace(/([A-Z])/g, " $1")}</dt>
            <dd>{String(value)}</dd>
          </div>
        ))}
      </dl>

      <p className="suggestion-review__meta">
        Submitted {formatDate(suggestion.createdAt)} · Player identifier {suggestion.submittedBy}
      </p>

      {suggestion.status === "pending" ? (
        <div className="suggestion-review__actions">
          <label>
            <span>Rejection feedback</span>
            <textarea
              value={rejectionReason}
              rows={3}
              maxLength={500}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Required only when rejecting. Keep the explanation specific and respectful."
            />
          </label>

          <div>
            <button
              className="button button--success"
              type="button"
              disabled={busy}
              onClick={() => decide("approved")}
            >
              Approve suggestion
            </button>
            <button
              className="button button--danger"
              type="button"
              disabled={busy}
              onClick={() => decide("rejected")}
            >
              Reject with feedback
            </button>
          </div>
        </div>
      ) : (
        <div className="suggestion-review__decision">
          <strong>
            {suggestion.status === "approved" ? "Approved" : "Rejected"} by {suggestion.reviewedBy || "an administrator"}
          </strong>
          {suggestion.rejectionReason && <p>{suggestion.rejectionReason}</p>}
          {suggestion.publicationStatus === "published" && (
            <p>
              Published to the shared library in release {suggestion.libraryVersion}.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default function SuggestionModeration({ suggestions, actorId, notify }) {
  const [statusFilter, setStatusFilter] = useState("pending");
  const filtered = useMemo(
    () =>
      suggestions.filter(
        (suggestion) => statusFilter === "all" || suggestion.status === statusFilter,
      ),
    [statusFilter, suggestions],
  );
  const pendingCount = suggestions.filter(
    (suggestion) => suggestion.status === "pending",
  ).length;

  return (
    <section className="admin-moderation">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Community moderation</p>
          <h2>Suggestion review queue</h2>
          <p>
            Review proposed exercises, cardio activities and skills before they can become shared library content.
          </p>
        </div>
        <strong>{formatNumber(pendingCount, { whole: true })} awaiting review</strong>
      </div>

      <div className="admin-filter-row card">
        {[
          { id: "all", label: "All suggestions" },
          ...SUGGESTION_STATUSES,
        ].map((status) => (
          <button
            key={status.id}
            className={`admin-filter-button${
              statusFilter === status.id ? " admin-filter-button--active" : ""
            }`}
            type="button"
            aria-pressed={statusFilter === status.id}
            onClick={() => setStatusFilter(status.id)}
          >
            {status.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">No suggestions match this filter.</div>
      ) : (
        <div className="suggestion-review-grid">
          {filtered.map((suggestion) => (
            <SuggestionCard
              key={`${suggestion.collectionName}-${suggestion.id}`}
              suggestion={suggestion}
              actorId={actorId}
              notify={notify}
            />
          ))}
        </div>
      )}
    </section>
  );
}
