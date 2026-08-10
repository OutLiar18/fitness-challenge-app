import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { subscribeToLeagueEvidenceClaims } from "../../services/evidence/evidenceService";
import {
  buildSeasonCommandCentre,
  buildSeasonOperationsReport,
} from "../../services/seasons/seasonOperationsModel";
import {
  createSeasonOperationsFilename,
  downloadSeasonOperationsReport,
  subscribeToLeagueEvidenceDecisions,
  subscribeToLeagueLeaderboardSnapshots,
  subscribeToTrustedSeasonRuns,
} from "../../services/seasons/seasonOperationsService";
import {
  subscribeToLeadershipElections,
  subscribeToLeagueHouses,
} from "../../services/seasons/seasonService";
import { toDate } from "../../services/dateService";
import BonusPointsWorkspace from "./BonusPointsWorkspace";
import {
  formatNumber,
  formatPoints,
  pluralize,
} from "../../utils/displayFormatters";
import "./SeasonCommandCentre.css";

const CATEGORY_LABELS = Object.freeze({
  water: "Water",
  fruit: "Fruit",
  running: "Running",
  steps: "Steps",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Johannesburg",
});

function formatDateTime(value) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : "Not recorded";
}

function healthCopy(health) {
  return {
    attention: {
      label: "Action required",
      description: "One or more operational items need prompt administrator attention.",
      icon: "🚨",
    },
    watch: {
      label: "Keep watch",
      description: "The season is operating, with work waiting before the next publication.",
      icon: "👀",
    },
    ready: {
      label: "Operations steady",
      description: "No urgent season administration action is currently outstanding.",
      icon: "✅",
    },
  }[health] ?? {
    label: "Operations status",
    description: "Season information is ready for review.",
    icon: "🧭",
  };
}

function ActionButton({
  action,
  leagueId,
  onOpenEvidence,
  onOpenHonours,
  onOpenPowerPlays,
}) {
  if (action.target === "houses") {
    return (
      <Link className="button button--secondary" to={`/houses?league=${leagueId}`}>
        Open Houses
      </Link>
    );
  }
  if (action.target === "evidence") {
    return (
      <button className="button button--secondary" type="button" onClick={onOpenEvidence}>
        Open evidence operations
      </button>
    );
  }
  if (action.target === "power-plays") {
    return (
      <button className="button button--secondary" type="button" onClick={onOpenPowerPlays}>
        Open Power Plays
      </button>
    );
  }
  if (action.target === "honours") {
    return (
      <button className="button button--secondary" type="button" onClick={onOpenHonours}>
        Open honours
      </button>
    );
  }
  if (action.target === "trusted") {
    return (
      <a className="button button--secondary" href="#trusted-season-operations">
        View trusted command
      </a>
    );
  }
  return null;
}

function DecisionHistory({ decisions }) {
  if (decisions.length === 0) {
    return <div className="empty-state">No evidence decisions have been recorded yet.</div>;
  }

  return (
    <div className="season-ops-history" role="list" aria-label="Recent evidence decisions">
      {decisions.slice(0, 8).map((decision) => (
        <article key={decision.id} role="listitem">
          <div>
            <strong>{decision.verificationCode}</strong>
            <span>
              {CATEGORY_LABELS[decision.category] || decision.category} · {decision.decisionType}
              {decision.lateException ? " · late exception" : ""}
            </span>
          </div>
          <div>
            <b>{formatPoints(decision.pointsDelta ?? 0)}</b>
            <small>{formatDateTime(decision.createdAt)}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function SnapshotHistory({ snapshots, currentSnapshotId }) {
  if (snapshots.length === 0) {
    return <div className="empty-state">No player-facing leaderboard snapshot has been published yet.</div>;
  }

  return (
    <div className="season-ops-history" role="list" aria-label="Leaderboard publication history">
      {snapshots.slice(0, 8).map((snapshot) => (
        <article key={snapshot.id} role="listitem">
          <div>
            <strong>
              {snapshot.publicationDateKey || "Publication"}
              {snapshot.id === currentSnapshotId ? " · Current" : ""}
            </strong>
            <span>
              {snapshot.publicationType === "automatic-fallback"
                ? "10:00 fallback"
                : snapshot.publicationType === "trusted-local"
                  ? "Trusted local snapshot"
                  : snapshot.replacesSnapshotId
                    ? "Corrected manual snapshot"
                    : "Manual snapshot"}
            </span>
          </div>
          <div>
            <b>{formatNumber(snapshot.players?.length ?? 0, { whole: true })} players</b>
            <small>{formatDateTime(snapshot.publishedAt)}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function SeasonCommandCentre({
  league,
  members,
  contributions,
  powerPlayAssignments = [],
  actorId,
  isPlatformAdmin,
  isLeagueAdministrator,
  notify,
  onOpenEvidence,
  onOpenHonours,
  onOpenPowerPlays,
}) {
  const [houses, setHouses] = useState([]);
  const [elections, setElections] = useState([]);
  const [claims, setClaims] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [trustedRuns, setTrustedRuns] = useState([]);
  const [loadingErrors, setLoadingErrors] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const canViewEvidenceOperations = Boolean(isPlatformAdmin || isLeagueAdministrator);
  const canViewTrustedOperations = canViewEvidenceOperations;

  const recordError = useCallback((leagueId, source, error) => {
    setLoadingErrors((current) => [
      ...current.filter((item) => item.leagueId !== leagueId || item.source !== source),
      {
        leagueId,
        source,
        message: error?.message || `${source} could not be loaded.`,
      },
    ]);
  }, []);

  useEffect(() => {
    const unsubscribeHouses = subscribeToLeagueHouses(
      league.id,
      setHouses,
      (error) => recordError(league.id, "Houses", error),
    );
    const unsubscribeElections = subscribeToLeadershipElections(
      league.id,
      setElections,
      (error) => recordError(league.id, "Leadership", error),
    );
    const unsubscribeClaims = subscribeToLeagueEvidenceClaims(
      league.id,
      setClaims,
      (error) => recordError(league.id, "Evidence claims", error),
    );
    const unsubscribeDecisions = subscribeToLeagueEvidenceDecisions(
      league.id,
      setDecisions,
      (error) => recordError(league.id, "Evidence decisions", error),
    );
    const unsubscribeSnapshots = subscribeToLeagueLeaderboardSnapshots(
      league.id,
      setSnapshots,
      (error) => recordError(league.id, "Leaderboard history", error),
    );
    const unsubscribeTrustedRuns = canViewTrustedOperations
      ? subscribeToTrustedSeasonRuns(
          league.id,
          setTrustedRuns,
          (error) => recordError(league.id, "Trusted reconciliation", error),
        )
      : () => {};

    return () => {
      unsubscribeHouses();
      unsubscribeElections();
      unsubscribeClaims();
      unsubscribeDecisions();
      unsubscribeSnapshots();
      unsubscribeTrustedRuns();
    };
  }, [canViewTrustedOperations, league.id, recordError]);

  const visibleLoadingErrors = loadingErrors.filter((error) => error.leagueId === league.id);

  const commandCentre = useMemo(
    () => buildSeasonCommandCentre({
      league,
      houses,
      memberships: members,
      elections,
      claims,
      decisions,
      snapshots,
      contributions,
      trustedRuns,
      powerPlayAssignments,
      trustedOperationsEnabled: canViewTrustedOperations,
    }),
    [canViewTrustedOperations, claims, contributions, decisions, elections, houses, league, members, powerPlayAssignments, snapshots, trustedRuns],
  );
  const health = healthCopy(commandCentre.health);

  function downloadReport() {
    if (downloading) return;
    setDownloading(true);
    try {
      const report = buildSeasonOperationsReport({
        league,
        commandCentre,
        houses,
        memberships: members,
        claims,
        decisions,
        snapshots,
        trustedRuns,
        powerPlayAssignments,
        generatedAt: new Date(),
        generatedBy: actorId,
      });
      downloadSeasonOperationsReport(report, league);
      notify?.(
        `Season operations report downloaded as ${createSeasonOperationsFilename(league)}.`,
        "success",
      );
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The season operations report could not be downloaded.", "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="season-command-centre">
      {visibleLoadingErrors.length > 0 && (
        <section className="inline-alert inline-alert--danger" role="alert">
          <strong>Some season operations data could not be loaded.</strong>
          <ul>
            {visibleLoadingErrors.map((error) => (
              <li key={error.source}>{error.source}: {error.message}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={`season-ops-hero card season-ops-hero--${commandCentre.health}`}>
        <span aria-hidden="true">{health.icon}</span>
        <div>
          <p className="section-kicker">Season command centre</p>
          <h2>{health.label}</h2>
          <p>{health.description}</p>
        </div>
        <button className="button button--secondary" type="button" disabled={downloading} onClick={downloadReport}>
          {downloading ? "Preparing report…" : "Download operations report"}
        </button>
      </section>

      <section className="season-ops-metrics" aria-label="Season operations summary">
        <article className="card">
          <span>Players</span>
          <strong>{formatNumber(commandCentre.roster.total, { whole: true })}</strong>
          <small>{commandCentre.roster.assigned} assigned · {commandCentre.roster.unassigned} unassigned</small>
        </article>
        <article className="card">
          <span>Houses</span>
          <strong>{commandCentre.houses.configured}/{commandCentre.houses.expected}</strong>
          <small>{commandCentre.chaos.eligible ? "C.H.A.O.S. ready" : `${commandCentre.chaos.checks.filter((check) => check.complete).length}/${commandCentre.chaos.checks.length} checks complete`}</small>
        </article>
        <article className="card">
          <span>Open proof</span>
          <strong>{formatNumber(commandCentre.evidence.openCount, { whole: true })}</strong>
          <small>{commandCentre.evidence.statusCounts.expired} past deadline</small>
        </article>
        <article className="card">
          <span>Published revision</span>
          <strong>{formatNumber(commandCentre.publication.revision, { whole: true })}</strong>
          <small>{commandCentre.publication.publishedToday ? "Today covered" : commandCentre.publication.due ? "Publication due" : "Before publication time"}</small>
        </article>
        {commandCentre.powerPlay.enabled && (
          <article className="card">
            <span>Power Plays</span>
            <strong>{formatNumber(commandCentre.powerPlay.selectedWeeks, { whole: true })}</strong>
            <small>unique weekly draws locked</small>
          </article>
        )}
      </section>

      <section className="season-ops-actions card">
        <div className="community-section-heading">
          <div>
            <p className="section-kicker">Next required actions</p>
            <h2>Keep the season moving</h2>
          </div>
          <span>{commandCentre.actions.length} {pluralize(commandCentre.actions.length, "action", "actions")}</span>
        </div>
        <div className="season-ops-actions__list">
          {commandCentre.actions.map((action) => (
            <article key={action.id} className={`season-ops-action season-ops-action--${action.tone}`}>
              <div>
                <strong>{action.label}</strong>
                <p>{action.description}</p>
              </div>
              <ActionButton
                action={action}
                leagueId={league.id}
                onOpenEvidence={onOpenEvidence}
                onOpenHonours={onOpenHonours}
                onOpenPowerPlays={onOpenPowerPlays}
              />
            </article>
          ))}
        </div>
      </section>

      <BonusPointsWorkspace
        key={league.id}
        league={league}
        members={members}
        actorId={actorId}
        isPlatformAdmin={isPlatformAdmin}
        isLeagueAdministrator={isLeagueAdministrator}
        notify={notify}
      />

      {canViewTrustedOperations && (
        <section
          id="trusted-season-operations"
          className={`season-ops-trusted card season-ops-trusted--${commandCentre.trusted.tone}`}
          aria-labelledby="trusted-season-heading"
        >
          <div className="community-section-heading">
            <div>
              <p className="section-kicker">Free trusted operations</p>
              <h2 id="trusted-season-heading">{commandCentre.trusted.label}</h2>
            </div>
            <span>{trustedRuns[0]?.fingerprint || "No fingerprint yet"}</span>
          </div>
          <p>{commandCentre.trusted.detail}</p>
          <dl className="season-ops-facts season-ops-trusted__facts">
            <div>
              <dt>Last completed</dt>
              <dd>{formatDateTime(trustedRuns[0]?.completedAt)}</dd>
            </div>
            <div>
              <dt>Blocking issues</dt>
              <dd>{formatNumber(trustedRuns[0]?.issueCounts?.blocking ?? 0, { whole: true })}</dd>
            </div>
            <div>
              <dt>Warnings</dt>
              <dd>{formatNumber(trustedRuns[0]?.issueCounts?.warning ?? 0, { whole: true })}</dd>
            </div>
            <div>
              <dt>Published snapshot</dt>
              <dd>{trustedRuns[0]?.snapshotId || "Not published by the trusted tool"}</dd>
            </div>
          </dl>
          <div className="season-ops-command-grid">
            <article>
              <strong>1. Safe dry run</strong>
              <code>npm run season:reconcile</code>
              <small>Reads the season and creates a local report. It does not change competition data.</small>
            </article>
            <article>
              <strong>2. Publish after review</strong>
              <code>npm run season:reconcile:publish</code>
              <small>Publishes only when the trusted audit has no blocking integrity errors.</small>
            </article>
          </div>
          <p className="season-ops-trusted__privacy">
            The private service-account file stays outside this project and must never be committed.
            This free-first tool runs only when an administrator starts it on the trusted computer.
          </p>
        </section>
      )}

      <div className="season-ops-grid">
        <section className="season-ops-card card">
          <div className="community-section-heading">
            <div>
              <p className="section-kicker">Evidence workload</p>
              <h2>Queue by category</h2>
            </div>
            <span>{commandCentre.evidence.decidedCount} decided</span>
          </div>
          <div className="season-ops-category-grid">
            {Object.entries(commandCentre.evidence.categoryCounts).map(([category, summary]) => (
              <article key={category}>
                <strong>{CATEGORY_LABELS[category]}</strong>
                <span>{summary.open} open · {summary.expired} expired</span>
                <small>Platform Administrator review</small>
              </article>
            ))}
          </div>
        </section>

        <section className="season-ops-card card">
          <div className="community-section-heading">
            <div>
              <p className="section-kicker">Weekly leadership</p>
              <h2>{commandCentre.leadership.weekKey}</h2>
            </div>
            <span>{commandCentre.leadership.finalisedCount} finalised</span>
          </div>
          <dl className="season-ops-facts">
            <div><dt>Open ballots</dt><dd>{commandCentre.leadership.openCount}</dd></div>
            <div><dt>Awaiting finalisation</dt><dd>{commandCentre.leadership.awaitingFinalisationCount}</dd></div>
            <div><dt>Houses without a ballot</dt><dd>{commandCentre.leadership.housesWithoutBallot}</dd></div>
            <div><dt>Houses without a captain</dt><dd>{commandCentre.leadership.housesWithoutCaptain}</dd></div>
          </dl>
        </section>
      </div>

      <div className="season-ops-grid">
        <section className="season-ops-card card">
          <div className="community-section-heading">
            <div>
              <p className="section-kicker">Immutable proof history</p>
              <h2>Recent evidence decisions</h2>
            </div>
            <span>{commandCentre.decisionHistory.total} total</span>
          </div>
          <DecisionHistory decisions={decisions} />
        </section>

        <section className="season-ops-card card">
          <div className="community-section-heading">
            <div>
              <p className="section-kicker">Published standings</p>
              <h2>Snapshot history</h2>
            </div>
            <span>{commandCentre.publication.snapshotCount} revisions</span>
          </div>
          <SnapshotHistory
            snapshots={snapshots}
            currentSnapshotId={league.publishedLeaderboardSnapshotId}
          />
        </section>
      </div>

      <section className="season-ops-note card">
        <span aria-hidden="true">🧾</span>
        <div>
          <strong>Reports reflect the data visible to your role</strong>
          <p>
            Platform and season administrators receive the complete season operations record.
            Only Platform Administrators can make evidence decisions. League Administrators retain read-only evidence visibility for season operations.
            WhatsApp media is never included.
          </p>
        </div>
      </section>
    </div>
  );
}
