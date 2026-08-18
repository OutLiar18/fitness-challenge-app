import { useEffect, useMemo, useRef, useState } from "react";

import {
  getEvidenceClaimSummary,
  getEvidenceDisplayStatus,
  getTimeZoneDateKey,
  isLeaderboardPublicationDue,
} from "../../services/evidence/evidenceModel";
import {
  decideEvidenceClaim,
  publishLeaderboardSnapshot,
  subscribeToLeagueEvidenceClaims,
} from "../../services/evidence/evidenceService";
import { formatDateTimeLocalValue, parseDateTimeLocalValue, toDate } from "../../services/dateService";
import { formatNumber, formatPoints } from "../../utils/displayFormatters";
import LegacyAvatar from "../profile/LegacyAvatar";
import "./EvidenceWorkspace.css";

const dateTimeFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : "Not recorded";
}

function EvidenceClaimList({ claims, selectedId, onSelect }) {
  if (claims.length === 0) {
    return <div className="empty-state">No evidence claims match this view.</div>;
  }
  return (
    <div className="evidence-queue" role="list" aria-label="Evidence review queue">
      {claims.map((claim) => {
        const status = getEvidenceDisplayStatus(claim);
        return (
          <button
            className={`evidence-queue__item${selectedId === claim.id ? " evidence-queue__item--active" : ""}`}
            type="button"
            role="listitem"
            key={claim.id}
            onClick={() => onSelect(claim.id)}
          >
            <LegacyAvatar avatarId={claim.avatarId} size="small" decorative />
            <span>
              <strong>{getEvidenceClaimSummary(claim)}</strong>
              <small>{status?.label} · deadline {formatDateTime(claim.deadlineAt)}</small>
            </span>
            <b>{claim.claimType === "daily-bonus" ? `+${claim.bonusPointsAvailable}` : `${claim.pendingPoints} pending`}</b>
          </button>
        );
      })}
    </div>
  );
}

function ClaimReviewForm({
  claim,
  league,
  actorId,
  isPlatformAdmin,
  notify,
}) {
  const [submittedAt, setSubmittedAt] = useState(() => formatDateTimeLocalValue(new Date()));
  const [verifiedQuantity, setVerifiedQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [working, setWorking] = useState("");

  if (!claim) {
    return (
      <section className="evidence-review card">
        <div className="empty-state">Choose a claim to review its WhatsApp proof.</div>
      </section>
    );
  }

  const status = getEvidenceDisplayStatus(claim);
  const mayReview = Boolean(isPlatformAdmin);
  const quantityRequired = ["water", "fruit"].includes(claim.category);
  const canReverse = ["verified", "rejected"].includes(claim.status);

  async function runDecision(action) {
    if (working || !mayReview) return;
    setWorking(action);
    try {
      await decideEvidenceClaim({
        claim,
        league,
        action,
        actorId,
        submittedAt: submittedAt ? parseDateTimeLocalValue(submittedAt) : null,
        verifiedQuantity,
        reason,
        isPlatformAdmin,
      });
      notify?.(
        action === "verify"
          ? "Proof accepted and the relevant season points were released."
          : action === "reject"
            ? "Proof rejection recorded."
            : "Evidence decision reversed with an audit record.",
        "success",
      );
      setReason("");
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The evidence decision could not be saved.", "error");
    } finally {
      setWorking("");
    }
  }

  return (
    <section className="evidence-review card" aria-labelledby="evidence-review-heading">
      <div className="community-section-heading">
        <div>
          <p className="section-kicker">Structured decision</p>
          <h3 id="evidence-review-heading">{claim.verificationCode}</h3>
        </div>
        <span>{status?.label}</span>
      </div>

      <dl className="evidence-review__facts">
        <div><dt>Player</dt><dd>{claim.displayName}</dd></div>
        <div><dt>Category</dt><dd>{claim.category}</dd></div>
        <div><dt>Activity date</dt><dd>{formatDateTime(claim.challengeDate)}</dd></div>
        <div><dt>Deadline</dt><dd>{formatDateTime(claim.deadlineAt)}</dd></div>
        <div><dt>House when logged</dt><dd>{claim.houseName || "Unassigned"}</dd></div>
        <div>
          <dt>Points waiting</dt>
          <dd>{formatPoints(claim.claimType === "daily-bonus" ? claim.bonusPointsAvailable : claim.pendingPoints)}</dd>
        </div>
      </dl>

      {claim.category === "running" && (
        <div className="inline-alert">
          Confirm that the screenshot shows the activity date, distance and duration. The app calculates average pace from the saved entry.
        </div>
      )}
      {claim.category === "steps" && (
        <div className="inline-alert">
          Confirm the relevant date, total daily steps and a recognisable fitness app or device screen.
        </div>
      )}

      <div className="evidence-review__form">
        <label className="form-field">
          <span>WhatsApp submission time</span>
          <input
            type="datetime-local"
            value={submittedAt}
            onChange={(event) => setSubmittedAt(event.target.value)}
          />
        </label>
        {quantityRequired && (
          <label className="form-field">
            <span>{claim.category === "water" ? "Photographed millilitres" : "Photographed servings"}</span>
            <input
              type="number"
              min={0}
              step={1}
              value={verifiedQuantity}
              onChange={(event) => setVerifiedQuantity(event.target.value)}
            />
          </label>
        )}
        <label className="form-field evidence-review__reason">
          <span>Reason or review note</span>
          <textarea
            maxLength={500}
            placeholder="Required for rejection, reversal and late-proof exceptions."
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
      </div>

      {!mayReview && (
        <div className="inline-alert inline-alert--danger" role="alert">
          Only Platform Administrators can make evidence decisions.
        </div>
      )}

      <div className="evidence-review__actions">
        {!canReverse && (
          <>
            <button
              className="button button--primary"
              type="button"
              disabled={Boolean(working) || !mayReview}
              onClick={() => runDecision("verify")}
            >
              {working === "verify" ? "Accepting…" : "Accept proof"}
            </button>
            <button
              className="button button--danger"
              type="button"
              disabled={Boolean(working) || !mayReview}
              onClick={() => runDecision("reject")}
            >
              {working === "reject" ? "Rejecting…" : "Reject proof"}
            </button>
          </>
        )}
        {canReverse && (
          <button
            className="button button--secondary"
            type="button"
            disabled={Boolean(working) || !mayReview}
            onClick={() => runDecision("reverse")}
          >
            {working === "reverse" ? "Reversing…" : "Reverse this decision"}
          </button>
        )}
      </div>
    </section>
  );
}

function SnapshotPublisher({
  league,
  members,
  contributions,
  powerPlayAssignments,
  actorId,
  notify,
  onPublished,
}) {
  const [publishing, setPublishing] = useState(false);
  const due = isLeaderboardPublicationDue({
    policy: league.ruleset?.evidencePolicy,
    lastPublishedAt: league.publishedLeaderboardAt,
  });
  const timeZone = league.ruleset?.evidencePolicy?.leaderboardPublication?.timezone
    || "Africa/Johannesburg";
  const publishedToday = Boolean(
    league.publishedLeaderboardAt
      && getTimeZoneDateKey(league.publishedLeaderboardAt, timeZone)
        === getTimeZoneDateKey(new Date(), timeZone),
  );

  async function publish(publicationType = "manual") {
    if (publishing) return;
    setPublishing(true);
    try {
      const id = await publishLeaderboardSnapshot({
        league,
        members,
        contributions,
        powerPlayAssignments,
        actorId,
        publicationType,
        replacesSnapshotId: publishedToday
          ? league.publishedLeaderboardSnapshotId || ""
          : "",
      });
      onPublished?.(id);
      notify?.("The player-facing leaderboard snapshot was published.", "success");
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The leaderboard snapshot could not be published.", "error");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <section className={`evidence-snapshot card${due ? " evidence-snapshot--due" : ""}`}>
      <div className="community-section-heading">
        <div>
          <p className="section-kicker">Controlled standings</p>
          <h3>Publish the player leaderboard</h3>
        </div>
        <span>{due ? "10:00 fallback due" : "Current day covered"}</span>
      </div>
      <div className="evidence-snapshot__metrics">
        <article><span>Players</span><strong>{formatNumber(members.length, { whole: true })}</strong></article>
        <article><span>Live contributions</span><strong>{formatNumber(contributions.length, { whole: true })}</strong></article>
        <article><span>Published revision</span><strong>{formatNumber(league.publishedLeaderboardRevision ?? 0, { whole: true })}</strong></article>
      </div>
      <p>
        Players continue seeing the previous snapshot until a new one is published. A corrected publication creates a new immutable snapshot rather than overwriting history.
      </p>
      <button className="button button--primary" type="button" disabled={publishing} onClick={() => publish("manual")}>
        {publishing
          ? "Publishing…"
          : publishedToday
            ? "Publish corrected snapshot"
            : league.publishedLeaderboardSnapshotId
              ? "Publish today’s snapshot"
              : "Publish first snapshot"}
      </button>
    </section>
  );
}

export default function EvidenceWorkspace({
  league,
  members,
  contributions,
  powerPlayAssignments = [],
  actorId,
  isPlatformAdmin,
  isLeagueAdministrator,
  notify,
  onSnapshotPublished,
}) {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");
  const [selectedId, setSelectedId] = useState("");
  const [loadingError, setLoadingError] = useState("");
  const automaticAttempted = useRef(false);

  useEffect(() => subscribeToLeagueEvidenceClaims(
    league.id,
    setClaims,
    (error) => setLoadingError(error.message || "Evidence claims could not be loaded."),
  ), [league.id]);

  const visibleClaims = useMemo(() => {
    const queryText = search.trim().toLowerCase();
    return claims.filter((claim) => {
      const displayStatus = getEvidenceDisplayStatus(claim)?.id;
      if (statusFilter === "open" && !["pending", "expired", "reversed"].includes(displayStatus)) return false;
      if (statusFilter !== "all" && statusFilter !== "open" && displayStatus !== statusFilter) return false;
      if (!queryText) return true;
      return [claim.verificationCode, claim.displayName, claim.category, claim.houseName]
        .some((value) => String(value ?? "").toLowerCase().includes(queryText));
    });
  }, [claims, search, statusFilter]);

  const selectedClaim = visibleClaims.find((claim) => claim.id === selectedId)
    ?? visibleClaims[0]
    ?? null;

  useEffect(() => {
    if (
      automaticAttempted.current ||
      !isLeagueAdministrator ||
      contributions.length === 0 ||
      !isLeaderboardPublicationDue({
        policy: league.ruleset?.evidencePolicy,
        lastPublishedAt: league.publishedLeaderboardAt,
      })
    ) return;
    automaticAttempted.current = true;
    publishLeaderboardSnapshot({
      league,
      members,
      contributions,
      powerPlayAssignments,
      actorId,
      publicationType: "automatic-fallback",
      replacesSnapshotId: "",
    })
      .then((id) => {
        if (id) {
          onSnapshotPublished?.(id);
          notify?.("The 10:00 player leaderboard fallback was published.", "success");
        }
      })
      .catch((error) => {
        console.error(error);
        notify?.("The no-cost 10:00 fallback could not publish. Use the manual control below.", "warning");
      });
  }, [actorId, contributions, isLeagueAdministrator, league, members, notify, onSnapshotPublished, powerPlayAssignments]);

  const metrics = useMemo(() => ({
    pending: claims.filter((claim) => getEvidenceDisplayStatus(claim)?.id === "pending").length,
    expired: claims.filter((claim) => getEvidenceDisplayStatus(claim)?.id === "expired").length,
    verified: claims.filter((claim) => claim.status === "verified").length,
  }), [claims]);

  return (
    <div className="evidence-workspace">
      {loadingError && <div className="inline-alert inline-alert--danger" role="alert">{loadingError}</div>}

      <details className="evidence-boundary card">
        <summary>
          <span><strong>How evidence review works</strong><small>WhatsApp media stays external; decisions stay auditable.</small></span>
          <span aria-hidden="true">+</span>
        </summary>
        <div className="evidence-boundary__content">
          <p>
            Search with the verification ID sent by the player. Champions Legacy
            Challenge stores the review status, points decision and audit history—never
            the media itself.
          </p>
        </div>
      </details>      <section className="evidence-summary card">
        <article><span>Awaiting proof</span><strong>{metrics.pending}</strong></article>
        <article><span>Past deadline</span><strong>{metrics.expired}</strong></article>
        <article><span>Accepted</span><strong>{metrics.verified}</strong></article>
        <article><span>Decision authority</span><strong>{isPlatformAdmin ? "Platform Admin" : "Read only"}</strong></article>
      </section>

      <div className="evidence-layout">
        <section className="evidence-browser card">
          <div>
            <p className="section-kicker">WhatsApp review queue</p>
            <h3>Find evidence by verification ID</h3>
          </div>
          <div className="evidence-browser__filters">
            <label className="form-field">
              <span>Search</span>
              <input
                type="search"
                placeholder="RUN-7K4M9Q or player name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="form-field">
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="open">Open work</option>
                <option value="pending">Awaiting proof</option>
                <option value="expired">Past deadline</option>
                <option value="verified">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="reversed">Reversed</option>
                <option value="superseded">Corrected</option>
                <option value="all">All claims</option>
              </select>
            </label>
          </div>
          <EvidenceClaimList claims={visibleClaims} selectedId={selectedClaim?.id} onSelect={setSelectedId} />
        </section>

        <ClaimReviewForm
          key={selectedClaim?.id || "no-evidence-claim"}
          claim={selectedClaim}
          league={league}
          actorId={actorId}
          isPlatformAdmin={isPlatformAdmin}
          notify={notify}
        />
      </div>

      {isLeagueAdministrator && (
        <SnapshotPublisher
          league={league}
          members={members}
          contributions={contributions}
          powerPlayAssignments={powerPlayAssignments}
          actorId={actorId}
          notify={notify}
          onPublished={onSnapshotPublished}
        />
      )}
    </div>
  );
}
