import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_SEASON_EVIDENCE_POLICY } from "../src/constants/evidence.js";
import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import {
  allocateEntryPointsForEvidence,
  canReviewEvidenceCategory,
  createEvidenceClaimIdentity,
  createEvidenceVerificationCode,
  getEvidenceDisplayStatus,
  isLeaderboardPublicationDue,
  normalizeEvidencePolicy,
  validateEvidenceDecision,
  validateEvidencePolicy,
} from "../src/services/evidence/evidenceModel.js";
import { calculateLeagueStandings } from "../src/services/leagues/leagueModel.js";

const policy = normalizeEvidencePolicy(DEFAULT_SEASON_EVIDENCE_POLICY);

function timestamp(date) {
  return { toDate: () => new Date(date) };
}

test("season evidence policy requires explicit confirmation and freezes the agreed defaults", () => {
  const unconfirmed = validateEvidencePolicy(DEFAULT_SEASON_EVIDENCE_POLICY);
  const confirmed = validateEvidencePolicy({
    ...DEFAULT_SEASON_EVIDENCE_POLICY,
    confirmed: true,
  });

  assert.equal(unconfirmed.valid, false);
  assert.equal(confirmed.valid, true);
  assert.equal(confirmed.value.proofDeadlineHours, 24);
  assert.equal(confirmed.value.fruitDailyServingCap, 5);
  assert.equal(confirmed.value.waterBonus.thresholdMillilitres, 750);
  assert.equal(confirmed.value.waterBonus.points, 3);
  assert.equal(confirmed.value.fruitBonus.thresholdServings, 3);
  assert.equal(confirmed.value.fruitBonus.points, 3);
  assert.equal(confirmed.value.leaderboardPublication.automaticTime, "10:00");
  assert.equal(
    confirmed.value.leaderboardPublication.automaticFallbackMode,
    "administrator-session",
  );
});

test("verification IDs are stable, human-readable and avoid ambiguous characters", () => {
  const first = createEvidenceVerificationCode("running", "season_entry-one");
  const repeated = createEvidenceVerificationCode("running", "season_entry-one");
  const daily = createEvidenceClaimIdentity({
    leagueId: "season-one",
    userId: "player-one",
    category: "water",
    entryId: "entry-one",
    challengeDate: new Date(2026, 7, 4),
  });

  assert.equal(first, repeated);
  assert.match(first, /^RUN-[A-HJ-NP-Z2-9]{6}$/);
  assert.ok(!/[01IO]/.test(first));
  assert.equal(daily.id, "season-one_player-one_2026-08-04_water");
  assert.equal(daily.claimType, "daily-bonus");
  assert.match(daily.verificationCode, /^WATER-/);
});

test("qualifying Running releases Cardio immediately and holds Running points for proof", () => {
  const allocation = allocateEntryPointsForEvidence({
    category: "running",
    data: { distance: 5, totalMinutes: 30, totalSeconds: 1800 },
  }, policy);

  assert.equal(allocation.immediatePoints, 7);
  assert.equal(allocation.pendingPoints, 18);
  assert.equal(allocation.claimRequired, true);
  assert.equal(allocation.claimType, "required-proof");
});

test("non-qualifying Running keeps its Cardio points without creating a proof claim", () => {
  const allocation = allocateEntryPointsForEvidence({
    category: "running",
    data: { distance: 2, totalMinutes: 20, totalSeconds: 1200 },
  }, policy);

  assert.equal(allocation.immediatePoints, 2);
  assert.equal(allocation.pendingPoints, 0);
  assert.equal(allocation.claimRequired, false);
});

test("Steps points wait for proof while Water and Fruit keep normal points plus one daily bonus claim", () => {
  const steps = allocateEntryPointsForEvidence({
    category: "steps",
    data: { steps: 12500 },
  }, policy);
  const water = allocateEntryPointsForEvidence({
    category: "water",
    data: { amount: 750 },
  }, policy);
  const fruit = allocateEntryPointsForEvidence({
    category: "fruit",
    data: { servings: 3, fruitType: "Apple" },
  }, policy);

  assert.equal(steps.immediatePoints, 0);
  assert.ok(steps.pendingPoints > 0);
  assert.equal(steps.claimType, "required-proof");
  assert.ok(water.immediatePoints > 0);
  assert.equal(water.bonusPointsAvailable, 3);
  assert.equal(water.claimType, "daily-bonus");
  assert.ok(fruit.immediatePoints > 0);
  assert.equal(fruit.bonusPointsAvailable, 3);
});

test("expired proof stays visible and only Platform Administrators may accept it late", () => {
  const claim = {
    id: "season_entry",
    category: "running",
    status: "pending",
    deadlineAt: timestamp("2026-08-04T08:00:00.000Z"),
  };
  const submittedAt = new Date("2026-08-04T09:00:00.000Z");

  assert.equal(
    getEvidenceDisplayStatus(claim, submittedAt).label,
    "Proof not submitted within the time limit",
  );
  assert.equal(validateEvidenceDecision({
    claim,
    action: "verify",
    submittedAt,
    reason: "WhatsApp delivery delay",
    isPlatformAdmin: false,
    policy,
  }).valid, false);
  assert.equal(validateEvidenceDecision({
    claim,
    action: "verify",
    submittedAt,
    reason: "WhatsApp delivery delay",
    isPlatformAdmin: true,
    policy,
  }).valid, true);
});

test("only Platform Administrators can make evidence decisions", () => {
  assert.equal(canReviewEvidenceCategory({
    isPlatformAdmin: false,
  }), false);
  assert.equal(canReviewEvidenceCategory({
    isPlatformAdmin: true,
  }), true);
});

test("the no-cost daily leaderboard fallback becomes due at 10:00 Johannesburg time", () => {
  const before = new Date("2026-08-04T07:59:00.000Z");
  const due = new Date("2026-08-04T08:00:00.000Z");
  const yesterday = new Date("2026-08-03T08:00:00.000Z");

  assert.equal(isLeaderboardPublicationDue({
    policy,
    lastPublishedAt: yesterday,
    referenceDate: before,
  }), false);
  assert.equal(isLeaderboardPublicationDue({
    policy,
    lastPublishedAt: yesterday,
    referenceDate: due,
  }), true);
  assert.equal(isLeaderboardPublicationDue({
    policy,
    lastPublishedAt: due,
    referenceDate: due,
  }), false);
});

test("standings cap Fruit activity at five servings and keep evidence bonuses outside the activity cap", () => {
  const ruleset = {
    ...DEFAULT_LEAGUE_RULESET,
    dailyActivityCap: 100,
    dailyParticipationBonus: 5,
    evidencePolicy: policy,
  };
  const challengeDate = timestamp("2026-08-04T00:00:00.000Z");
  const member = {
    userId: "player-one",
    displayName: "Player One",
    currentHouseId: "house-a",
    currentHouseName: "House A",
    currentHouseEmblemId: "springbok",
  };
  const contributions = [
    {
      entryId: "fruit-one",
      userId: "player-one",
      category: "fruit",
      scoreCategory: "fruit",
      pointGroup: "activity",
      activityPoints: 40,
      challengeDate,
      houseId: "house-a",
      houseName: "House A",
    },
    {
      entryId: "fruit-one",
      userId: "player-one",
      category: "fruit",
      scoreCategory: "fruit",
      pointGroup: "evidenceBonus",
      activityPoints: 3,
      challengeDate,
      houseId: "house-a",
      houseName: "House A",
    },
  ];

  const awarded = calculateLeagueStandings(contributions, [member], ruleset);
  const reversed = calculateLeagueStandings([
    ...contributions,
    { ...contributions[1], activityPoints: -3, entryId: "fruit-reversal" },
  ], [member], ruleset);

  assert.equal(awarded.players[0].activityPoints, 25);
  assert.equal(awarded.players[0].consistencyPoints, 5);
  assert.equal(awarded.players[0].evidenceBonusPoints, 3);
  assert.equal(awarded.players[0].totalPoints, 33);
  assert.equal(reversed.players[0].totalPoints, 30);
});
