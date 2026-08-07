import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import { buildSeasonCommandCentre } from "../src/services/seasons/seasonOperationsModel.js";
import {
  buildTrustedSeasonAudit,
  compareTrustedSnapshot,
  createTrustedSeasonFingerprint,
  summarizeTrustedSeasonRun,
} from "../src/services/seasons/trustedSeasonModel.js";

function timestamp(value) {
  return { toDate: () => new Date(value) };
}

function league(overrides = {}) {
  const legacyRuleset = {
    ...DEFAULT_LEAGUE_RULESET,
    version: "season-houses-v2",
    modules: {
      ...DEFAULT_LEAGUE_RULESET.modules,
      powerPlay: false,
    },
  };
  delete legacyRuleset.powerPlayPolicy;
  return {
    id: "season-one",
    name: "Trusted Season",
    status: "active",
    rulesVersion: "season-houses-v2",
    ruleset: legacyRuleset,
    startDate: timestamp("2026-08-01T00:00:00.000Z"),
    endDate: timestamp("2026-08-31T00:00:00.000Z"),
    publishedLeaderboardSnapshotId: "",
    publishedLeaderboardAt: null,
    publishedLeaderboardRevision: 0,
    houseCount: 2,
    chaosStatus: "activated",
    ...overrides,
  };
}

function membership(overrides = {}) {
  return {
    id: "season-one_player-one",
    leagueId: "season-one",
    userId: "player-one",
    status: "active",
    displayName: "Player One",
    avatarId: "legacy-trophy",
    currentHouseId: "house-a",
    currentHouseName: "House A",
    currentHouseEmblemId: "springbok",
    ...overrides,
  };
}

function entry(overrides = {}) {
  return {
    id: "entry-one",
    userId: "player-one",
    category: "water",
    data: { amount: 500 },
    challengeDate: timestamp("2026-08-04T00:00:00.000Z"),
    ...overrides,
  };
}

function contribution(overrides = {}) {
  return {
    id: "season-one_entry-one",
    leagueId: "season-one",
    entryId: "entry-one",
    userId: "player-one",
    displayName: "Player One",
    avatarId: "legacy-trophy",
    houseId: "house-a",
    houseName: "House A",
    houseEmblemId: "springbok",
    category: "water",
    scoreCategory: "water",
    pointGroup: "activity",
    challengeDate: timestamp("2026-08-04T00:00:00.000Z"),
    activityPoints: 2,
    source: "activity",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId: "",
    correctionRole: "",
    ...overrides,
  };
}

function baseAudit(overrides = {}) {
  return buildTrustedSeasonAudit({
    league: league(overrides.league),
    memberships: overrides.memberships ?? [membership()],
    contributions: overrides.contributions ?? [contribution()],
    entries: overrides.entries ?? [entry()],
    claims: overrides.claims ?? [],
    decisions: overrides.decisions ?? [],
    corrections: overrides.corrections ?? [],
    snapshots: overrides.snapshots ?? [],
    referenceDate: new Date("2026-08-05T10:00:00.000Z"),
  });
}

test("trusted season fingerprints are stable when source arrays arrive in a different order", () => {
  const first = createTrustedSeasonFingerprint({
    league: league(),
    memberships: [membership(), membership({ id: "season-one_player-two", userId: "player-two" })],
    contributions: [contribution(), contribution({ id: "second", userId: "player-two", entryId: "entry-two" })],
  });
  const second = createTrustedSeasonFingerprint({
    league: league(),
    memberships: [membership({ id: "season-one_player-two", userId: "player-two" }), membership()],
    contributions: [contribution({ id: "second", userId: "player-two", entryId: "entry-two" }), contribution()],
  });

  assert.equal(first, second);
});

test("a complete immutable contribution ledger produces a publishable trusted audit", () => {
  const audit = baseAudit();

  assert.equal(audit.publishable, true);
  assert.equal(audit.issueCounts.blocking, 0);
  assert.equal(audit.standings.players[0].totalPoints, 7);
  assert.equal(audit.snapshotComparison.status, "missing");
});

test("trusted snapshot comparison recognises matching calculated standings", () => {
  const calculated = baseAudit();
  const snapshot = {
    players: calculated.standings.players,
    houses: calculated.standings.houses,
  };
  const comparison = compareTrustedSnapshot({ standings: calculated.standings, snapshot });

  assert.equal(comparison.matches, true);
  assert.equal(comparison.status, "matching");
});

test("trusted reconciliation blocks broken evidence contribution links", () => {
  const audit = baseAudit({
    contributions: [contribution({ evidenceClaimId: "missing-claim", evidenceDecisionId: "missing-decision" })],
  });

  assert.equal(audit.publishable, false);
  assert.ok(audit.issues.some((item) => item.code === "CONTRIBUTION_CLAIM_MISSING"));
  assert.ok(audit.issues.some((item) => item.code === "CONTRIBUTION_DECISION_MISSING"));
});

test("verified proof with no released contribution is a blocking integrity error", () => {
  const audit = baseAudit({
    claims: [{
      id: "claim-one",
      leagueId: "season-one",
      status: "verified",
      releasedPoints: 18,
      releasedContributionId: "missing-release",
      decisionId: "",
    }],
  });

  assert.equal(audit.publishable, false);
  assert.ok(audit.issues.some((item) => item.code === "VERIFIED_CLAIM_CONTRIBUTION_MISSING"));
});

test("completed corrections require every immutable reconciliation contribution", () => {
  const audit = baseAudit({
    corrections: [{
      id: "correction-one",
      affectedLeagueIds: ["season-one"],
      sourceEntryId: "entry-one",
      replacementEntryId: "replacement-entry",
      reversalContributionIds: ["missing-reversal"],
      replacementContributionIds: ["missing-replacement"],
    }],
  });

  assert.equal(audit.publishable, false);
  assert.equal(
    audit.issues.filter((item) => item.code === "CORRECTION_CONTRIBUTION_MISSING").length,
    2,
  );
  assert.ok(audit.issues.some((item) => item.code === "CORRECTION_REPLACEMENT_ENTRY_MISSING"));
});

test("trusted run summaries distinguish current, stale and blocked results", () => {
  const current = summarizeTrustedSeasonRun({
    status: "published",
    completedAt: timestamp("2026-08-05T09:00:00.000Z"),
    issueCounts: { blocking: 0 },
  }, new Date("2026-08-05T10:00:00.000Z"));
  const stale = summarizeTrustedSeasonRun({
    status: "published",
    completedAt: timestamp("2026-08-03T00:00:00.000Z"),
    issueCounts: { blocking: 0 },
  }, new Date("2026-08-05T10:00:00.000Z"));
  const blocked = summarizeTrustedSeasonRun({
    status: "blocked",
    completedAt: timestamp("2026-08-05T09:00:00.000Z"),
    issueCounts: { blocking: 2 },
  }, new Date("2026-08-05T10:00:00.000Z"));

  assert.equal(current.tone, "success");
  assert.equal(stale.status, "stale");
  assert.equal(blocked.tone, "danger");
});

test("the command centre surfaces the free local trusted command when no run exists", () => {
  const result = buildSeasonCommandCentre({
    league: league({
      publishedLeaderboardAt: timestamp("2026-08-05T08:00:00.000Z"),
    }),
    houses: [{ id: "house-a", captainId: "player-one" }, { id: "house-b", captainId: "player-two" }],
    memberships: [membership()],
    contributions: [contribution()],
    trustedOperationsEnabled: true,
    trustedRuns: [],
    referenceDate: new Date("2026-08-05T10:00:00.000Z"),
  });

  assert.equal(result.trusted.status, "never-run");
  assert.ok(result.actions.some((action) => action.target === "trusted"));
});
