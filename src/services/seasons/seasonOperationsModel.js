import { toDate } from "../dateService";
import {
  getEvidenceDisplayStatus,
  getTimeZoneDateKey,
  isLeaderboardPublicationDue,
  normalizeEvidencePolicy,
} from "../evidence/evidenceModel";
import {
  getChaosReadiness,
  getSeasonWeekKey,
} from "./seasonModel";

const EVIDENCE_CATEGORIES = Object.freeze([
  "water",
  "fruit",
  "running",
  "steps",
]);

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function getDateValue(value) {
  return toDate(value)?.getTime() ?? 0;
}

export function summarizeEvidenceWorkload({
  claims = [],
  assignments = [],
  referenceDate = new Date(),
} = {}) {
  const statusCounts = {
    pending: 0,
    expired: 0,
    verified: 0,
    rejected: 0,
    reversed: 0,
    superseded: 0,
  };
  const categoryCounts = Object.fromEntries(
    EVIDENCE_CATEGORIES.map((category) => [
      category,
      {
        total: 0,
        open: 0,
        expired: 0,
        verified: 0,
        rejected: 0,
        reviewers: 0,
      },
    ]),
  );

  claims.forEach((claim) => {
    const status = getEvidenceDisplayStatus(claim, referenceDate)?.id ?? "pending";
    statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    const category = categoryCounts[claim.category];
    if (!category) return;
    category.total += 1;
    if (["pending", "expired", "reversed"].includes(status)) category.open += 1;
    if (status === "expired") category.expired += 1;
    if (status === "verified") category.verified += 1;
    if (status === "rejected") category.rejected += 1;
  });

  assignments
    .filter((assignment) => assignment.status !== "inactive")
    .forEach((assignment) => {
      [...new Set(assignment.categories ?? [])].forEach((category) => {
        if (categoryCounts[category]) categoryCounts[category].reviewers += 1;
      });
    });

  return {
    statusCounts,
    categoryCounts,
    openCount:
      statusCounts.pending + statusCounts.expired + statusCounts.reversed,
    decidedCount: statusCounts.verified + statusCounts.rejected,
  };
}

export function summarizeDecisionHistory(decisions = []) {
  const typeCounts = countBy(decisions, (decision) => decision.decisionType || "unknown");
  const pointDelta = decisions.reduce(
    (total, decision) => total + Number(decision.pointsDelta ?? 0),
    0,
  );
  const lateExceptions = decisions.filter((decision) => decision.lateException).length;
  const mostRecent = [...decisions].sort(
    (first, second) => getDateValue(second.createdAt) - getDateValue(first.createdAt),
  )[0] ?? null;

  return {
    total: decisions.length,
    typeCounts,
    pointDelta,
    lateExceptions,
    mostRecent,
  };
}

export function summarizeLeadershipOperations({
  houses = [],
  elections = [],
  referenceDate = new Date(),
} = {}) {
  const weekKey = getSeasonWeekKey(referenceDate);
  const currentWeek = elections.filter((election) => election.weekKey === weekKey);
  const open = currentWeek.filter((election) => {
    const closesAt = toDate(election.closesAt);
    return election.status === "open" && closesAt && closesAt > referenceDate;
  });
  const awaitingFinalisation = currentWeek.filter((election) => {
    const closesAt = toDate(election.closesAt);
    return election.status === "open" && closesAt && closesAt <= referenceDate;
  });
  const finalised = currentWeek.filter((election) => election.status === "finalized");
  const housesWithoutBallot = Math.max(0, houses.length - currentWeek.length);
  const housesWithoutCaptain = houses.filter((house) => !house.captainId).length;

  return {
    weekKey,
    openCount: open.length,
    awaitingFinalisationCount: awaitingFinalisation.length,
    finalisedCount: finalised.length,
    housesWithoutBallot,
    housesWithoutCaptain,
  };
}

export function summarizeLeaderboardPublication({
  league,
  snapshots = [],
  referenceDate = new Date(),
} = {}) {
  const policy = normalizeEvidencePolicy(league?.ruleset?.evidencePolicy);
  const timezone = policy.leaderboardPublication.timezone;
  const referenceKey = getTimeZoneDateKey(referenceDate, timezone);
  const publishedToday = Boolean(
    league?.publishedLeaderboardAt
      && getTimeZoneDateKey(league.publishedLeaderboardAt, timezone) === referenceKey,
  );
  const due = isLeaderboardPublicationDue({
    policy,
    lastPublishedAt: league?.publishedLeaderboardAt,
    referenceDate,
  });
  const ordered = [...snapshots].sort(
    (first, second) => getDateValue(second.publishedAt) - getDateValue(first.publishedAt),
  );

  return {
    timezone,
    automaticTime: policy.leaderboardPublication.automaticTime,
    publicationDateKey: referenceKey,
    publishedToday,
    due,
    revision: Number(league?.publishedLeaderboardRevision ?? 0),
    latestSnapshot: ordered[0] ?? null,
    snapshotCount: snapshots.length,
  };
}

function createAction(id, label, description, tone, target) {
  return { id, label, description, tone, target };
}

export function buildSeasonCommandCentre({
  league,
  houses = [],
  memberships = [],
  elections = [],
  claims = [],
  decisions = [],
  reviewerAssignments = [],
  snapshots = [],
  contributions = [],
  referenceDate = new Date(),
} = {}) {
  const evidence = summarizeEvidenceWorkload({
    claims,
    assignments: reviewerAssignments,
    referenceDate,
  });
  const decisionHistory = summarizeDecisionHistory(decisions);
  const leadership = summarizeLeadershipOperations({
    houses,
    elections,
    referenceDate,
  });
  const publication = summarizeLeaderboardPublication({
    league,
    snapshots,
    referenceDate,
  });
  const chaos = getChaosReadiness({ league, houses, memberships });
  const registeredCount = memberships.filter((member) => member.status === "registered").length;
  const activeCount = memberships.filter((member) => member.status === "active").length;
  const assignedCount = memberships.filter((member) => member.currentHouseId).length;
  const expectedHouseCount = Number(league?.houseCount ?? 0);
  const missingHouseCount = Math.max(0, expectedHouseCount - houses.length);
  const pointsTotal = contributions.reduce(
    (total, contribution) => total + Number(contribution.activityPoints ?? 0),
    0,
  );
  const actions = [];

  if (league?.status === "draft") {
    if (missingHouseCount > 0) {
      actions.push(createAction(
        "forge-houses",
        `Create ${missingHouseCount} missing ${missingHouseCount === 1 ? "House" : "Houses"}`,
        "The season cannot open registration until every configured House exists.",
        "danger",
        "houses",
      ));
    } else {
      actions.push(createAction(
        "open-registration",
        "Open season registration",
        "House identities are complete. The season is ready for players to register.",
        "success",
        "overview",
      ));
    }
  }

  if (league?.status === "registration") {
    if (league.chaosStatus === "activated") {
      actions.push(createAction(
        "prepare-start",
        "Prepare the season start",
        "C.H.A.O.S. has assigned every registered player. Confirm the start date before activating the season.",
        "success",
        "overview",
      ));
    } else if (chaos.eligible) {
      actions.push(createAction(
        "activate-chaos",
        "Activate C.H.A.O.S.",
        "Every opening-roster prerequisite is complete and players can now be balanced across Houses.",
        "warning",
        "houses",
      ));
    } else {
      const incomplete = chaos.checks.filter((check) => !check.complete);
      actions.push(createAction(
        "complete-chaos-readiness",
        "Complete C.H.A.O.S. prerequisites",
        incomplete[0]?.detail || "The opening roster is not ready yet.",
        "warning",
        "houses",
      ));
    }
  }

  if (league?.status === "active") {
    if (leadership.awaitingFinalisationCount > 0) {
      actions.push(createAction(
        "finalise-ballots",
        `Finalise ${leadership.awaitingFinalisationCount} closed leadership ${leadership.awaitingFinalisationCount === 1 ? "ballot" : "ballots"}`,
        "The full 24-hour window has closed and the result now needs an administrator decision.",
        "danger",
        "houses",
      ));
    }
    if (evidence.statusCounts.expired > 0) {
      actions.push(createAction(
        "review-expired-proof",
        `Review ${evidence.statusCounts.expired} expired proof ${evidence.statusCounts.expired === 1 ? "claim" : "claims"}`,
        "Late acceptance is restricted to Platform Administrators and requires a reason.",
        "danger",
        "evidence",
      ));
    } else if (evidence.openCount > 0) {
      actions.push(createAction(
        "review-proof",
        `Review ${evidence.openCount} open proof ${evidence.openCount === 1 ? "claim" : "claims"}`,
        "Resolve WhatsApp evidence before the next player-facing leaderboard publication.",
        "warning",
        "evidence",
      ));
    }
    if (publication.due) {
      actions.push(createAction(
        "publish-standings",
        "Publish today’s leaderboard snapshot",
        `The ${publication.automaticTime} ${publication.timezone} fallback is due. Players still see the previous snapshot until publication succeeds.`,
        "warning",
        "evidence",
      ));
    }
  }

  if (league?.status === "completed") {
    if (!publication.publishedToday) {
      actions.push(createAction(
        "publish-final-standings",
        "Publish the final season snapshot",
        "Freeze the latest accepted evidence and final standings before archiving the season.",
        "warning",
        "evidence",
      ));
    } else {
      actions.push(createAction(
        "review-honours",
        "Review final honours and archive",
        "The latest standings are published. Confirm the champions before moving the season to the archive.",
        "success",
        "honours",
      ));
    }
  }

  if (actions.length === 0) {
    actions.push(createAction(
      "monitor-season",
      "No urgent operational action",
      "The current season records are consistent. Continue monitoring proof, leadership and publication status.",
      "success",
      "overview",
    ));
  }

  const urgentCount = actions.filter((action) => action.tone === "danger").length;
  const warningCount = actions.filter((action) => action.tone === "warning").length;
  const health = urgentCount > 0 ? "attention" : warningCount > 0 ? "watch" : "ready";

  return {
    health,
    actions,
    roster: {
      total: memberships.length,
      registered: registeredCount,
      active: activeCount,
      assigned: assignedCount,
      unassigned: Math.max(0, memberships.length - assignedCount),
    },
    houses: {
      expected: expectedHouseCount,
      configured: houses.length,
      missing: missingHouseCount,
    },
    chaos,
    evidence,
    decisionHistory,
    leadership,
    publication,
    contributions: {
      count: contributions.length,
      pointsTotal,
    },
  };
}

export function buildSeasonOperationsReport({
  league,
  commandCentre,
  houses = [],
  memberships = [],
  claims = [],
  decisions = [],
  reviewerAssignments = [],
  snapshots = [],
  generatedAt = new Date(),
  generatedBy = "",
} = {}) {
  return {
    metadata: {
      product: "Champions Legacy Challenge",
      reportType: "season-operations",
      schemaVersion: 1,
      generatedAt,
      generatedBy,
      seasonId: league?.id ?? "",
      seasonName: league?.name ?? "",
    },
    season: league ?? null,
    summary: commandCentre ?? null,
    houses,
    memberships,
    evidenceClaims: claims,
    evidenceDecisions: decisions,
    reviewerAssignments,
    leaderboardSnapshots: snapshots,
  };
}
