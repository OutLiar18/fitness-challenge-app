import { toDate } from "../dateService";
import {
  calculateLeagueStandings,
  calculateSeasonHonours,
  isEntryWithinLeague,
} from "../leagues/leagueModel";

export const TRUSTED_SEASON_MODEL_VERSION = "trusted-season-v1";
export const TRUSTED_RUN_STALE_HOURS = 26;

const ISSUE_SEVERITIES = Object.freeze({
  blocking: 0,
  warning: 1,
  information: 2,
});

function roundPoints(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object" || value instanceof Date) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortObject(value[key])]),
  );
}

export function stableStringify(value) {
  return JSON.stringify(sortObject(value));
}

export function hashTrustedValue(value) {
  const text = typeof value === "string" ? value : stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function portableDate(value) {
  return toDate(value)?.toISOString() ?? "";
}

function canonicalContribution(item = {}) {
  return {
    id: item.id || "",
    leagueId: item.leagueId || "",
    entryId: item.entryId || "",
    userId: item.userId || "",
    houseId: item.houseId || item.teamId || "",
    category: item.category || "",
    scoreCategory: item.scoreCategory || item.category || "",
    pointGroup: item.pointGroup || "activity",
    challengeDate: portableDate(item.challengeDate),
    activityPoints: roundPoints(item.activityPoints),
    source: item.source || "activity",
    evidenceClaimId: item.evidenceClaimId || "",
    evidenceDecisionId: item.evidenceDecisionId || "",
    correctionId: item.correctionId || "",
    correctionRole: item.correctionRole || "",
  };
}

function canonicalMembership(item = {}) {
  return {
    id: item.id || "",
    userId: item.userId || "",
    status: item.status || "",
    displayName: item.displayName || "Champion",
    avatarId: item.avatarId || "legacy-trophy",
    currentHouseId: item.currentHouseId || item.houseId || item.teamId || "",
    currentHouseName: item.currentHouseName || item.houseName || item.teamName || "Unassigned",
    currentHouseEmblemId: item.currentHouseEmblemId || item.houseEmblemId || "springbok",
  };
}

export function createTrustedSeasonFingerprint({
  league,
  memberships = [],
  contributions = [],
} = {}) {
  const payload = {
    modelVersion: TRUSTED_SEASON_MODEL_VERSION,
    league: {
      id: league?.id || "",
      rulesVersion: league?.rulesVersion || "",
      status: league?.status || "",
      startDate: portableDate(league?.startDate),
      endDate: portableDate(league?.endDate),
      ruleset: league?.ruleset ?? null,
    },
    memberships: memberships
      .map(canonicalMembership)
      .sort((first, second) => `${first.userId}:${first.id}`.localeCompare(`${second.userId}:${second.id}`)),
    contributions: contributions
      .map(canonicalContribution)
      .sort((first, second) => first.id.localeCompare(second.id)),
  };
  return hashTrustedValue(payload);
}

function canonicalPlayerRow(row = {}) {
  return {
    rank: Number(row.rank ?? 0),
    userId: row.userId || "",
    displayName: row.displayName || "Champion",
    houseId: row.houseId || row.teamId || "",
    activityPoints: roundPoints(row.activityPoints),
    consistencyPoints: roundPoints(row.consistencyPoints),
    evidenceBonusPoints: roundPoints(row.evidenceBonusPoints),
    totalPoints: roundPoints(row.totalPoints),
    activeDays: Number(row.activeDays ?? 0),
    entriesRecorded: Number(row.entriesRecorded ?? 0),
  };
}

function canonicalHouseRow(row = {}) {
  return {
    rank: Number(row.rank ?? 0),
    houseId: row.houseId || row.teamId || "",
    houseName: row.houseName || row.teamName || "Unassigned",
    activityPoints: roundPoints(row.activityPoints),
    consistencyPoints: roundPoints(row.consistencyPoints),
    evidenceBonusPoints: roundPoints(row.evidenceBonusPoints),
    totalPoints: roundPoints(row.totalPoints),
    activeDays: Number(row.activeDays ?? 0),
    memberCount: Number(row.memberCount ?? 0),
  };
}

function rowsById(rows, getId) {
  return new Map(rows.map((row) => [getId(row), row]));
}

function compareRows(expectedRows, actualRows, getId, rowType) {
  const expected = rowsById(expectedRows, getId);
  const actual = rowsById(actualRows, getId);
  const differences = [];
  const identifiers = [...new Set([...expected.keys(), ...actual.keys()])].sort();

  identifiers.forEach((id) => {
    const expectedRow = expected.get(id) ?? null;
    const actualRow = actual.get(id) ?? null;
    if (stableStringify(expectedRow) !== stableStringify(actualRow)) {
      differences.push({ rowType, id, expected: expectedRow, published: actualRow });
    }
  });
  return differences;
}

export function compareTrustedSnapshot({ standings, snapshot } = {}) {
  if (!snapshot) {
    return {
      status: "missing",
      matches: false,
      playerDifferenceCount: standings?.players?.length ?? 0,
      houseDifferenceCount: standings?.houses?.length ?? 0,
      differences: [],
    };
  }

  const expectedPlayers = (standings?.players ?? []).map(canonicalPlayerRow);
  const actualPlayers = (snapshot.players ?? []).map(canonicalPlayerRow);
  const expectedHouses = (standings?.houses ?? []).map(canonicalHouseRow);
  const actualHouses = (snapshot.houses ?? []).map(canonicalHouseRow);
  const differences = [
    ...compareRows(expectedPlayers, actualPlayers, (row) => row.userId, "player"),
    ...compareRows(expectedHouses, actualHouses, (row) => row.houseId, "house"),
  ];

  return {
    status: differences.length === 0 ? "matching" : "different",
    matches: differences.length === 0,
    playerDifferenceCount: differences.filter((item) => item.rowType === "player").length,
    houseDifferenceCount: differences.filter((item) => item.rowType === "house").length,
    differences,
  };
}

function createIssue(severity, code, message, entityType = "season", entityId = "") {
  return { severity, code, message, entityType, entityId };
}

function issueSort(first, second) {
  return (
    ISSUE_SEVERITIES[first.severity] - ISSUE_SEVERITIES[second.severity]
    || first.code.localeCompare(second.code)
    || first.entityId.localeCompare(second.entityId)
  );
}

function latestSnapshotForLeague(league, snapshots = []) {
  const pointerId = league?.publishedLeaderboardSnapshotId || "";
  const pointer = snapshots.find((snapshot) => snapshot.id === pointerId);
  if (pointer) return pointer;
  return [...snapshots].sort(
    (first, second) =>
      (toDate(second.publishedAt)?.getTime() ?? 0)
      - (toDate(first.publishedAt)?.getTime() ?? 0),
  )[0] ?? null;
}

function createSourceMaps({ entries, claims, decisions, corrections, contributions }) {
  return {
    entries: new Map(entries.map((item) => [item.id, item])),
    claims: new Map(claims.map((item) => [item.id, item])),
    decisions: new Map(decisions.map((item) => [item.id, item])),
    corrections: new Map(corrections.map((item) => [item.id, item])),
    contributions: new Map(contributions.map((item) => [item.id, item])),
  };
}

function inspectContribution(contribution, league, maps, includedCategories) {
  const issues = [];
  const id = contribution.id || "unknown";
  const points = Number(contribution.activityPoints);
  const scoreCategory = contribution.scoreCategory || contribution.category;

  if (contribution.leagueId !== league.id) {
    issues.push(createIssue("blocking", "CONTRIBUTION_WRONG_SEASON", "A contribution belongs to a different season.", "leagueContribution", id));
  }
  if (!contribution.userId) {
    issues.push(createIssue("blocking", "CONTRIBUTION_USER_MISSING", "A contribution has no player identifier.", "leagueContribution", id));
  }
  if (!Number.isFinite(points)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_POINTS_INVALID", "A contribution has invalid activity points.", "leagueContribution", id));
  }
  if (!toDate(contribution.challengeDate)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_DATE_INVALID", "A contribution has no valid challenge date.", "leagueContribution", id));
  } else if (!isEntryWithinLeague(contribution, league)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_OUTSIDE_SEASON", "A contribution falls outside the season dates.", "leagueContribution", id));
  }
  if (!includedCategories.has(scoreCategory)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_CATEGORY_EXCLUDED", `The score category ${scoreCategory || "unknown"} is not included in the frozen ruleset.`, "leagueContribution", id));
  }
  if (contribution.entryId && !maps.entries.has(contribution.entryId)) {
    issues.push(createIssue("warning", "CONTRIBUTION_ENTRY_UNAVAILABLE", "The source entry is no longer readable, but the immutable competition contribution remains.", "leagueContribution", id));
  }
  if (contribution.evidenceClaimId && !maps.claims.has(contribution.evidenceClaimId)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_CLAIM_MISSING", "An evidence-linked contribution points to a missing claim.", "leagueContribution", id));
  }
  if (contribution.evidenceDecisionId && !maps.decisions.has(contribution.evidenceDecisionId)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_DECISION_MISSING", "An evidence-linked contribution points to a missing decision.", "leagueContribution", id));
  }
  if (contribution.correctionId && !maps.corrections.has(contribution.correctionId)) {
    issues.push(createIssue("blocking", "CONTRIBUTION_CORRECTION_MISSING", "A correction contribution points to a missing correction record.", "leagueContribution", id));
  }
  if (contribution.correctionRole && !contribution.correctionId) {
    issues.push(createIssue("blocking", "CONTRIBUTION_CORRECTION_ID_MISSING", "A correction contribution has a role but no correction identifier.", "leagueContribution", id));
  }
  return issues;
}

function inspectClaim(claim, maps) {
  const issues = [];
  const id = claim.id || "unknown";
  const releasedPoints = roundPoints(claim.releasedPoints);
  const releasedContribution = claim.releasedContributionId
    ? maps.contributions.get(claim.releasedContributionId)
    : null;

  if (claim.status === "verified" && releasedPoints > 0) {
    if (!claim.releasedContributionId || !releasedContribution) {
      issues.push(createIssue("blocking", "VERIFIED_CLAIM_CONTRIBUTION_MISSING", "A verified proof claim has no released contribution.", "seasonEvidenceClaim", id));
    } else {
      if (releasedContribution.evidenceClaimId !== id) {
        issues.push(createIssue("blocking", "VERIFIED_CLAIM_LINK_MISMATCH", "The released contribution does not point back to its proof claim.", "seasonEvidenceClaim", id));
      }
      if (roundPoints(releasedContribution.activityPoints) !== releasedPoints) {
        issues.push(createIssue("blocking", "VERIFIED_CLAIM_POINTS_MISMATCH", "The released contribution points do not match the verified claim.", "seasonEvidenceClaim", id));
      }
    }
  }
  if (claim.decisionId && !maps.decisions.has(claim.decisionId)) {
    issues.push(createIssue("blocking", "CLAIM_DECISION_MISSING", "A proof claim points to a missing decision.", "seasonEvidenceClaim", id));
  }
  if (claim.supersededByClaimId && !maps.claims.has(claim.supersededByClaimId)) {
    issues.push(createIssue("warning", "SUPERSEDING_CLAIM_MISSING", "A superseded claim points to a replacement claim that is not present in this season data.", "seasonEvidenceClaim", id));
  }
  return issues;
}

function inspectDecision(decision, maps) {
  const issues = [];
  const id = decision.id || "unknown";
  if (!maps.claims.has(decision.claimId)) {
    issues.push(createIssue("blocking", "DECISION_CLAIM_MISSING", "An evidence decision points to a missing claim.", "seasonEvidenceDecision", id));
  }
  if (roundPoints(decision.pointsDelta) !== 0) {
    if (!decision.contributionId || !maps.contributions.has(decision.contributionId)) {
      issues.push(createIssue("blocking", "DECISION_CONTRIBUTION_MISSING", "A point-changing evidence decision has no matching contribution.", "seasonEvidenceDecision", id));
    }
  }
  return issues;
}

function inspectCorrection(correction, maps, leagueId) {
  const issues = [];
  const id = correction.id || "unknown";
  if (!(correction.affectedLeagueIds ?? []).includes(leagueId)) return issues;
  const contributionIds = [
    ...(correction.reversalContributionIds ?? []),
    ...(correction.replacementContributionIds ?? []),
  ];
  contributionIds.forEach((contributionId) => {
    if (!maps.contributions.has(contributionId)) {
      issues.push(createIssue("blocking", "CORRECTION_CONTRIBUTION_MISSING", "A completed correction points to a missing reconciliation contribution.", "entryCorrection", id));
    }
  });
  if (!maps.entries.has(correction.replacementEntryId)) {
    const accountDeletionRemoved = correction.accountDeletionEntryDataRemoved === true
      || correction.accountDeletionAnonymised === true;
    issues.push(createIssue(
      accountDeletionRemoved ? "warning" : "blocking",
      accountDeletionRemoved
        ? "CORRECTION_ENTRY_REMOVED_BY_ACCOUNT_DELETION"
        : "CORRECTION_REPLACEMENT_ENTRY_MISSING",
      accountDeletionRemoved
        ? "The private replacement entry was removed by trusted account deletion; immutable correction contributions remain available for reconciliation."
        : "A completed correction points to a missing replacement entry.",
      "entryCorrection",
      id,
    ));
  }
  return issues;
}

export function buildTrustedSeasonAudit({
  league,
  memberships = [],
  contributions = [],
  entries = [],
  claims = [],
  decisions = [],
  corrections = [],
  snapshots = [],
  referenceDate = new Date(),
} = {}) {
  if (!league?.id) {
    throw new Error("A season is required for trusted reconciliation.");
  }

  const includedCategories = new Set(league.ruleset?.includedCategories ?? []);
  const maps = createSourceMaps({ entries, claims, decisions, corrections, contributions });
  const issues = [
    ...contributions.flatMap((item) => inspectContribution(item, league, maps, includedCategories)),
    ...claims.flatMap((item) => inspectClaim(item, maps)),
    ...decisions.flatMap((item) => inspectDecision(item, maps)),
    ...corrections.flatMap((item) => inspectCorrection(item, maps, league.id)),
  ].sort(issueSort);

  const standings = calculateLeagueStandings(contributions, memberships, league.ruleset);
  const honours = calculateSeasonHonours(contributions, memberships, league.ruleset);
  const latestSnapshot = latestSnapshotForLeague(league, snapshots);
  const snapshotComparison = compareTrustedSnapshot({ standings, snapshot: latestSnapshot });
  const fingerprint = createTrustedSeasonFingerprint({ league, memberships, contributions });
  const issueCounts = {
    blocking: issues.filter((item) => item.severity === "blocking").length,
    warning: issues.filter((item) => item.severity === "warning").length,
    information: issues.filter((item) => item.severity === "information").length,
  };
  const health = issueCounts.blocking > 0
    ? "blocked"
    : issueCounts.warning > 0 || !snapshotComparison.matches
      ? "warning"
      : "healthy";

  return {
    modelVersion: TRUSTED_SEASON_MODEL_VERSION,
    leagueId: league.id,
    leagueName: league.name || "Season",
    generatedAt: toDate(referenceDate)?.toISOString() ?? new Date().toISOString(),
    fingerprint,
    health,
    publishable: issueCounts.blocking === 0,
    issueCounts,
    issues,
    sourceCounts: {
      memberships: memberships.length,
      contributions: contributions.length,
      entries: entries.length,
      claims: claims.length,
      decisions: decisions.length,
      corrections: corrections.filter((item) => (item.affectedLeagueIds ?? []).includes(league.id)).length,
      snapshots: snapshots.length,
    },
    standings,
    honours,
    latestSnapshotId: latestSnapshot?.id || "",
    latestSnapshotFingerprint: latestSnapshot?.trustedFingerprint || "",
    snapshotComparison,
  };
}

export function summarizeTrustedSeasonRun(run, referenceDate = new Date()) {
  if (!run) {
    return {
      status: "never-run",
      tone: "warning",
      label: "Trusted reconciliation not run",
      detail: "Run the local trusted season command before relying on prize-bearing standings.",
      ageHours: null,
      stale: true,
    };
  }

  const completedAt = toDate(run.completedAt || run.createdAt);
  const reference = toDate(referenceDate) ?? new Date();
  const ageHours = completedAt
    ? Math.max(0, (reference.getTime() - completedAt.getTime()) / (60 * 60 * 1000))
    : null;
  const stale = ageHours === null || ageHours > TRUSTED_RUN_STALE_HOURS;

  if (run.status === "blocked" || Number(run.issueCounts?.blocking ?? 0) > 0) {
    return {
      status: "blocked",
      tone: "danger",
      label: "Trusted reconciliation blocked",
      detail: "Resolve the blocking integrity issues before publishing another trusted snapshot.",
      ageHours,
      stale,
    };
  }
  if (run.status === "failed") {
    return {
      status: "failed",
      tone: "danger",
      label: "Trusted reconciliation failed",
      detail: run.failureMessage || "The last trusted run did not complete.",
      ageHours,
      stale,
    };
  }
  if (stale) {
    return {
      status: "stale",
      tone: "warning",
      label: "Trusted reconciliation is due",
      detail: "The latest trusted result is older than the daily operating window.",
      ageHours,
      stale: true,
    };
  }
  return {
    status: run.status || "healthy",
    tone: run.status === "warning" ? "warning" : "success",
    label: run.status === "published" ? "Trusted snapshot published" : "Trusted reconciliation current",
    detail: run.status === "published"
      ? "The latest player-facing standings were published from the trusted local calculation."
      : "The trusted local calculation completed without blocking integrity errors.",
    ageHours,
    stale: false,
  };
}
