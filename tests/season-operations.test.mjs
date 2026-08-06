import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_SEASON_EVIDENCE_POLICY } from "../src/constants/evidence.js";
import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import { createBasePowerPlayPool } from "../src/services/seasons/powerPlayModel.js";
import {
  buildSeasonCommandCentre,
  buildSeasonOperationsReport,
  summarizeDecisionHistory,
  summarizeEvidenceWorkload,
  summarizeLeadershipOperations,
} from "../src/services/seasons/seasonOperationsModel.js";

function timestamp(value) {
  return { toDate: () => new Date(value) };
}

function createLeague(overrides = {}) {
  return {
    id: "season-one",
    name: "Season One",
    status: "active",
    houseCount: 2,
    chaosStatus: "activated",
    ruleset: {
      evidencePolicy: {
        ...DEFAULT_SEASON_EVIDENCE_POLICY,
        confirmed: true,
      },
    },
    publishedLeaderboardAt: timestamp("2026-08-03T08:00:00.000Z"),
    publishedLeaderboardRevision: 2,
    ...overrides,
  };
}

const houses = [
  { id: "house-a", name: "House A", captainId: "player-one" },
  { id: "house-b", name: "House B", captainId: "" },
];

const members = [
  { userId: "player-one", status: "active", currentHouseId: "house-a" },
  { userId: "player-two", status: "active", currentHouseId: "house-b" },
  { userId: "player-three", status: "active", currentHouseId: "house-a" },
  { userId: "player-four", status: "active", currentHouseId: "house-b" },
];

test("evidence workload separates open, expired and decided claims by category", () => {
  const summary = summarizeEvidenceWorkload({
    claims: [
      {
        id: "pending-run",
        category: "running",
        status: "pending",
        deadlineAt: timestamp("2026-08-04T10:00:00.000Z"),
      },
      {
        id: "expired-steps",
        category: "steps",
        status: "pending",
        deadlineAt: timestamp("2026-08-04T07:00:00.000Z"),
      },
      { id: "verified-water", category: "water", status: "verified" },
      { id: "rejected-fruit", category: "fruit", status: "rejected" },
    ],
    assignments: [
      { status: "active", categories: ["running", "steps"] },
      { status: "active", categories: ["running"] },
      { status: "inactive", categories: ["fruit"] },
    ],
    referenceDate: new Date("2026-08-04T08:00:00.000Z"),
  });

  assert.equal(summary.openCount, 2);
  assert.equal(summary.statusCounts.pending, 1);
  assert.equal(summary.statusCounts.expired, 1);
  assert.equal(summary.statusCounts.verified, 1);
  assert.equal(summary.statusCounts.rejected, 1);
  assert.equal(summary.categoryCounts.running.reviewers, 2);
  assert.equal(summary.categoryCounts.steps.reviewers, 1);
});

test("decision history preserves reversals, late exceptions and net point movement", () => {
  const summary = summarizeDecisionHistory([
    { decisionType: "verify", pointsDelta: 10, createdAt: timestamp("2026-08-04T08:00:00.000Z") },
    { decisionType: "reverse", pointsDelta: -10, createdAt: timestamp("2026-08-04T09:00:00.000Z") },
    { decisionType: "late-verify", pointsDelta: 10, lateException: true, createdAt: timestamp("2026-08-04T10:00:00.000Z") },
  ]);

  assert.equal(summary.total, 3);
  assert.equal(summary.pointDelta, 10);
  assert.equal(summary.lateExceptions, 1);
  assert.equal(summary.typeCounts.reverse, 1);
  assert.equal(summary.mostRecent.decisionType, "late-verify");
});

test("leadership operations identify closed ballots waiting for finalisation", () => {
  const summary = summarizeLeadershipOperations({
    houses,
    elections: [
      {
        houseId: "house-a",
        weekKey: "2026-08-03",
        status: "open",
        closesAt: timestamp("2026-08-04T07:00:00.000Z"),
      },
    ],
    referenceDate: new Date("2026-08-04T08:00:00.000Z"),
  });

  assert.equal(summary.weekKey, "2026-08-03");
  assert.equal(summary.awaitingFinalisationCount, 1);
  assert.equal(summary.housesWithoutBallot, 1);
  assert.equal(summary.housesWithoutCaptain, 1);
});

test("active season command centre prioritises ballots, expired proof and publication", () => {
  const summary = buildSeasonCommandCentre({
    league: createLeague(),
    houses,
    memberships: members,
    elections: [
      {
        houseId: "house-a",
        weekKey: "2026-08-03",
        status: "open",
        closesAt: timestamp("2026-08-04T07:00:00.000Z"),
      },
    ],
    claims: [
      {
        id: "expired-run",
        category: "running",
        status: "pending",
        deadlineAt: timestamp("2026-08-04T07:00:00.000Z"),
      },
    ],
    contributions: [{ activityPoints: 12 }, { activityPoints: 8 }],
    referenceDate: new Date("2026-08-04T08:00:00.000Z"),
  });

  assert.equal(summary.health, "attention");
  assert.equal(summary.roster.assigned, 4);
  assert.equal(summary.contributions.pointsTotal, 20);
  assert.deepEqual(
    summary.actions.map((action) => action.id),
    ["finalise-ballots", "review-expired-proof", "publish-standings"],
  );
});

test("operations report keeps immutable season records and generated metadata together", () => {
  const league = createLeague({ status: "completed" });
  const summary = buildSeasonCommandCentre({
    league,
    houses,
    memberships: members,
    snapshots: [{ id: "snapshot-one", publishedAt: timestamp("2026-08-04T08:00:00.000Z") }],
    referenceDate: new Date("2026-08-04T09:00:00.000Z"),
  });
  const report = buildSeasonOperationsReport({
    league,
    commandCentre: summary,
    houses,
    memberships: members,
    claims: [{ id: "claim-one" }],
    decisions: [{ id: "decision-one" }],
    snapshots: [{ id: "snapshot-one" }],
    generatedAt: new Date("2026-08-04T09:30:00.000Z"),
    generatedBy: "platform-admin",
  });

  assert.equal(report.metadata.reportType, "season-operations");
  assert.equal(report.metadata.seasonId, "season-one");
  assert.equal(report.metadata.generatedBy, "platform-admin");
  assert.equal(report.summary.publication.snapshotCount, 1);
  assert.equal(report.evidenceDecisions[0].id, "decision-one");
});


test("draft command centre blocks registration until theme-named no-repeat Power Plays are ready", () => {
  const league = createLeague({
    status: "draft",
    startDate: timestamp("2026-08-10T00:00:00.000Z"),
    endDate: timestamp("2026-10-25T00:00:00.000Z"),
    ruleset: {
      ...DEFAULT_LEAGUE_RULESET,
      powerPlayPolicy: {
        ...DEFAULT_LEAGUE_RULESET.powerPlayPolicy,
        powerPlays: createBasePowerPlayPool("Mythological Creatures"),
      },
    },
  });
  const summary = buildSeasonCommandCentre({
    league,
    houses,
    memberships: [],
    referenceDate: new Date("2026-08-05T08:00:00.000Z"),
  });

  assert.equal(summary.actions[0].id, "configure-power-plays");
  assert.equal(summary.actions[0].target, "power-plays");
  assert.equal(summary.powerPlay.readiness.ready, false);
});

test("active command centre prioritises a missing current-week Power Play", () => {
  const themedPowerPlays = createBasePowerPlayPool("Mythological Creatures").map((item, index) => ({
    ...item,
    name: `Mythic Trial ${index + 1}`,
    normalizedName: `mythic trial ${index + 1}`,
    themeNameConfirmed: true,
  }));
  const league = createLeague({
    startDate: timestamp("2026-08-03T00:00:00.000Z"),
    endDate: timestamp("2026-08-30T00:00:00.000Z"),
    ruleset: {
      ...DEFAULT_LEAGUE_RULESET,
      powerPlayPolicy: {
        ...DEFAULT_LEAGUE_RULESET.powerPlayPolicy,
        powerPlays: themedPowerPlays,
      },
    },
    powerPlayState: {
      usedPowerPlayIds: [],
      selectionCount: 0,
      lastWeekKey: "",
      lastPowerPlayId: "",
      lastSelectionAt: null,
      lastSelectionBy: "",
    },
  });
  const summary = buildSeasonCommandCentre({
    league,
    houses,
    memberships: members,
    powerPlayAssignments: [],
    referenceDate: new Date("2026-08-05T08:00:00.000Z"),
  });

  assert.equal(summary.actions[0].id, "select-current-power-play");
  assert.equal(summary.actions[0].target, "power-plays");
  assert.equal(summary.powerPlay.current.status, "missing");
});
