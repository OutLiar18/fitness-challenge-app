import { useMemo, useState } from "react";

import {
  getAccountDeletionTiming,
  getAccountRequestReasonLabel,
  getAccountRequestStatus,
} from "../../services/account/accountModel";
import { acknowledgeAccountDeletionRequest } from "../../services/admin/accountRequestService";

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

function RequestCard({ request, actorId, notify }) {
  const [busy, setBusy] = useState(false);
  const status = getAccountRequestStatus(request.status);
  const timing = getAccountDeletionTiming(request);

  async function handleAcknowledge() {
    setBusy(true);

    try {
      await acknowledgeAccountDeletionRequest({ request, actorId });
      notify("The account deletion request was acknowledged.");
    } catch (error) {
      notify(error?.message || "The request could not be acknowledged.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`account-request-card card account-request-card--${request.status}`}>
      <header>
        <div>
          <span className={`status-pill status-pill--${request.status}`}>
            {status.label}
          </span>
          <h3>{request.displayName || "Champion"}</h3>
          <p>{request.email || "Email unavailable"}</p>
        </div>
        <time>{formatDate(request.requestedAt)}</time>
      </header>

      <dl>
        <div>
          <dt>Player identifier</dt>
          <dd>{request.userId}</dd>
        </div>
        <div>
          <dt>Reason</dt>
          <dd>{getAccountRequestReasonLabel(request.reasonCode)}</dd>
        </div>
        <div>
          <dt>Request version</dt>
          <dd>{request.acknowledgementVersion || 1}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(request.updatedAt)}</dd>
        </div>
      </dl>

      <div className="account-request-card__note">
        <strong>Operational boundary</strong>
        <p>
          Acknowledging starts a seven-day cancellation window. After the window,
          use the trusted local deletion command. The command removes eligible private
          records and anonymises shared competition history before deleting Authentication.
        </p>
      </div>

      {request.status === "requested" && (
        <button
          className="button button--primary"
          type="button"
          disabled={busy}
          onClick={handleAcknowledge}
        >
          {busy ? "Acknowledging…" : "Acknowledge request"}
        </button>
      )}

      {request.status === "acknowledged" && (
        <div className="account-request-card__acknowledged">
          <p>Acknowledged {formatDate(request.acknowledgedAt)} by {request.acknowledgedBy || "an administrator"}.</p>
          <p>{timing.eligible ? "Eligible for trusted processing now." : `Trusted processing becomes eligible ${formatDate(timing.eligibleAt)}.`}</p>
        </div>
      )}

      {["processing", "failed", "completed"].includes(request.status) && (
        <div className="account-request-card__acknowledged">
          <p>{status.description}</p>
          {request.executionId && <p>Execution: {request.executionId}</p>}
          {request.failureMessage && <p>Last failure: {request.failureMessage}</p>}
        </div>
      )}

      {request.status === "cancelled" && (
        <p className="account-request-card__cancelled">
          Cancelled {formatDate(request.cancelledAt)} by the player.
        </p>
      )}
    </article>
  );
}

export default function AccountDeletionRequests({ requests, actorId, notify }) {
  const [statusFilter, setStatusFilter] = useState("active");
  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active") {
          return ["requested", "acknowledged", "processing", "failed"].includes(request.status);
        }
        return request.status === statusFilter;
      }),
    [requests, statusFilter],
  );
  const activeCount = requests.filter(
    (request) => ["requested", "acknowledged", "processing", "failed"].includes(request.status),
  ).length;

  return (
    <section className="admin-account-requests">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Player privacy operations</p>
          <h2>Account deletion requests</h2>
          <p>
            Acknowledge player requests, respect the seven-day cancellation window,
            then use the trusted local processor. Shared history is preserved under an anonymous identity.
          </p>
        </div>
        <strong>{activeCount} active</strong>
      </div>

      <div className="admin-filter-row card">
        {[
          { id: "active", label: "Active requests" },
          { id: "requested", label: "New requests" },
          { id: "acknowledged", label: "Acknowledged" },
          { id: "processing", label: "Processing" },
          { id: "failed", label: "Needs attention" },
          { id: "completed", label: "Completed" },
          { id: "cancelled", label: "Cancelled" },
          { id: "all", label: "All requests" },
        ].map((filter) => (
          <button
            className={`admin-filter-button${
              statusFilter === filter.id ? " admin-filter-button--active" : ""
            }`}
            type="button"
            aria-pressed={statusFilter === filter.id}
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state card">
          No account deletion requests match this filter.
        </div>
      ) : (
        <div className="account-request-list">
          {filteredRequests.map((request) => (
            <RequestCard
              request={request}
              actorId={actorId}
              notify={notify}
              key={request.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
