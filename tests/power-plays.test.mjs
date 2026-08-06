import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import { POWER_PLAY_CATEGORY_IDS } from "../src/constants/powerPlays.js";
import {
  calculateLeagueStandings,
  calculateSeasonHonours,
} from "../src/services/leagues/leagueModel.js";
import {
  applyPowerPlayToContributionPoints,
  chooseRandomPowerPlay,
  createBasePowerPlayPool,
  getPowerPlayReadiness,
  getPowerPlayWeekForDate,
  getPowerPlayWeekTiming,
  getSeasonPowerPlayWeeks,
  resolvePowerPlayForContribution,
} from "../src/services/seasons/powerPlayModel.js";
import { buildTrustedSeasonAudit } from "../src/services/seasons/trustedSeasonModel.js";

function timestamp(value) {
  return { toDate: () => new Date(value) };
}

function themedPool() {
  return createBasePowerPlayPool("Mythological Creatures").map((item, index) => ({
    ...item,
    name: index === 0 ? "Release the Kraken" : `Mythic Trial ${index + 1}`,
    normalizedName: index === 0 ? "release the kraken" : `mythic trial ${index + 1}`,
    themeNameConfirmed: true,
  }));
}

function league(overrides = {}) {
  return {
    id: "season-power",
    name: "Mythic Season",
    theme: "Mythological Creatures",
    status: "active",
    rulesVersion: "season-houses-v3",
    startDate: timestamp("2026-08-03T00:00:00.000Z"),
    endDate: timestamp("2026-08-30T00:00:00.000Z"),
    ruleset: {
      ...DEFAULT_LEAGUE_RULESET,
      powerPlayPolicy: {
        ...DEFAULT_LEAGUE_RULESET.powerPlayPolicy,
        powerPlays: themedPool(),
      },
    },
    powerPlayState: {
      usedPowerPlayIds: ["base-water"],
      selectionCount: 1,
      lastWeekKey: "week-01",
      lastPowerPlayId: "base-water",
      lastSelectionAt: timestamp("2026-08-03T00:00:00.000Z"),
      lastSelectionBy: "admin-one",
    },
    ...overrides,
  };
}

function assignment(overrides = {}) {
  return {
    id: "season-power_week-01",
    leagueId: "season-power",
    leagueName: "Mythic Season",
    weekKey: "week-01",
    weekIndex: 1,
    startDate: timestamp("2026-08-03T00:00:00.000Z"),
    endDate: timestamp("2026-08-09T00:00:00.000Z"),
    powerPlayId: "base-water",
    powerPlayName: "Release the Kraken",
    multiplier: 2,
    categories: ["water"],
    selectionSequence: 1,
    previousPowerPlayIds: [],
    redrawCount: 0,
    lastSelectionReason: "",
    correctionCount: 0,
    ...overrides,
  };
}

function membership(overrides = {}) {
  return {
    id: "season-power_player-one",
    leagueId: "season-power",
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

function contribution(overrides = {}) {
  return {
    id: "contribution-one",
    leagueId: "season-power",
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
    challengeDate: timestamp("2026-08-05T00:00:00.000Z"),
    activityPoints: 4,
    source: "activity",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId: "",
    correctionRole: "",
    ...overrides,
  };
}

test("the base library creates one theme-ready Power Play per activity category", () => {
  const pool = createBasePowerPlayPool("Mythological Creatures");
  assert.equal(pool.length, 10);
  assert.deepEqual(pool.map((item) => item.baseCategory), POWER_PLAY_CATEGORY_IDS);
  assert.ok(pool.every((item) => item.categories.length === 1));
  assert.ok(pool.every((item) => item.themeNameConfirmed === false));
  const policy = league({ status: "draft" }).ruleset.powerPlayPolicy;
  assert.equal(policy.powerPlayDefinitions["base-water"].id, "base-water");
  assert.deepEqual(policy.powerPlayDefinitions["base-water"].categories, ["water"]);
});

test("registration readiness requires unique confirmed theme names and enough no-repeat plays", () => {
  const draftLeague = league({ endDate: timestamp("2026-10-18T00:00:00.000Z") });
  const incomplete = getPowerPlayReadiness({
    league: draftLeague,
    powerPlays: createBasePowerPlayPool("Mythological Creatures"),
  });
  assert.equal(incomplete.ready, false);
  assert.equal(incomplete.checks.find((item) => item.id === "theme-names").complete, false);
  assert.equal(incomplete.checks.find((item) => item.id === "enough-plays").complete, false);

  const extended = [
    ...themedPool(),
    ...Array.from({ length: 2 }, (_, index) => ({
      id: `custom-${index}`,
      sourceType: "custom",
      baseCategory: "",
      name: `Olympian Challenge ${index + 1}`,
      normalizedName: `olympian challenge ${index + 1}`,
      description: "A custom mythological multi-category challenge.",
      multiplier: 3,
      categories: ["running", "cardio"],
      enabled: true,
      themeNameConfirmed: true,
      sortOrder: 11 + index,
    })),
  ];
  const unconfirmedCustom = extended.map((item, index) =>
    index === extended.length - 1 ? { ...item, themeNameConfirmed: false } : item,
  );
  const stillIncomplete = getPowerPlayReadiness({
    league: draftLeague,
    powerPlays: unconfirmedCustom,
  });
  assert.equal(stillIncomplete.ready, false);
  assert.equal(stillIncomplete.enabledCount, 11);

  const ready = getPowerPlayReadiness({ league: draftLeague, powerPlays: extended });
  assert.equal(ready.ready, true);
  assert.equal(ready.requiredCount, 11);
});

test("official Power Play weeks are season-relative seven-day windows", () => {
  const weeks = getSeasonPowerPlayWeeks(league());
  assert.equal(weeks.length, 4);
  assert.equal(weeks[0].weekKey, "week-01");
  assert.equal(weeks[3].weekKey, "week-04");
  assert.equal(
    getPowerPlayWeekForDate(league(), timestamp("2026-08-12T00:00:00.000Z")).weekKey,
    "week-02",
  );
});

test("an official Power Play week remains active for its complete final calendar day", () => {
  const week = getSeasonPowerPlayWeeks(league())[0];
  const lateOnFinalLocalDay = new Date(week.endDate);
  lateOnFinalLocalDay.setHours(23, 30, 0, 0);

  const timing = getPowerPlayWeekTiming(week, lateOnFinalLocalDay);
  assert.equal(timing.started, true);
  assert.equal(timing.ended, false);
  assert.equal(timing.currentDate.getTime(), week.endDate.getTime());
  assert.equal(timing.startDate.getTime(), week.startDate.getTime());
  assert.equal(timing.endDate.getTime(), week.endDate.getTime());

  const justAfterFinalLocalDay = new Date(week.endDate);
  justAfterFinalLocalDay.setDate(justAfterFinalLocalDay.getDate() + 1);
  justAfterFinalLocalDay.setHours(0, 1, 0, 0);
  assert.equal(
    getPowerPlayWeekTiming(week, justAfterFinalLocalDay).ended,
    true,
  );
});

test("random selection is deterministic and only uses the supplied unused pool", () => {
  const pool = themedPool();
  const eligible = pool.filter((item) => !["base-water", "base-fruit"].includes(item.id));
  const first = chooseRandomPowerPlay({
    leagueId: "season-power",
    weekKey: "week-02",
    sequence: 3,
    eligiblePowerPlays: eligible,
  });
  const repeated = chooseRandomPowerPlay({
    leagueId: "season-power",
    weekKey: "week-02",
    sequence: 3,
    eligiblePowerPlays: eligible,
  });
  assert.equal(first.id, repeated.id);
  assert.ok(eligible.some((item) => item.id === first.id));
  assert.notEqual(first.id, "base-water");
  assert.notEqual(first.id, "base-fruit");
});

test("Power Plays multiply eligible activity points but not evidence bonuses", () => {
  const active = contribution();
  const evidenceBonus = contribution({
    id: "bonus-one",
    pointGroup: "evidenceBonus",
    activityPoints: 3,
  });
  assert.equal(applyPowerPlayToContributionPoints({
    contribution: active,
    ruleset: league().ruleset,
    assignments: [assignment()],
  }), 8);
  assert.equal(applyPowerPlayToContributionPoints({
    contribution: evidenceBonus,
    ruleset: league().ruleset,
    assignments: [assignment()],
  }), 3);
});

test("Running Cardio points use their score category when a multi-category play applies", () => {
  const customPlay = {
    id: "custom-storm",
    sourceType: "custom",
    baseCategory: "",
    name: "Storm of Hermes",
    normalizedName: "storm of hermes",
    description: "Triple Running and Cardio competitive activity points.",
    multiplier: 3,
    categories: ["running", "cardio"],
    enabled: true,
    themeNameConfirmed: true,
    sortOrder: 11,
  };
  const ruleset = {
    ...league().ruleset,
    powerPlayPolicy: {
      ...league().ruleset.powerPlayPolicy,
      powerPlays: [...themedPool(), customPlay],
    },
  };
  const runningCardio = contribution({
    category: "running",
    scoreCategory: "cardio",
    activityPoints: 2,
  });
  const resolved = resolvePowerPlayForContribution({
    contribution: runningCardio,
    ruleset,
    assignments: [assignment({
      powerPlayId: customPlay.id,
      powerPlayName: customPlay.name,
      multiplier: 3,
      categories: customPlay.categories,
    })],
  });
  assert.equal(resolved.id, customPlay.id);
  assert.equal(applyPowerPlayToContributionPoints({
    contribution: runningCardio,
    ruleset,
    assignments: [assignment({
      powerPlayId: customPlay.id,
      powerPlayName: customPlay.name,
      multiplier: 3,
      categories: customPlay.categories,
    })],
  }), 6);
});

test("the same multiplied contribution drives individual and House standings", () => {
  const standings = calculateLeagueStandings(
    [contribution()],
    [membership()],
    league().ruleset,
    [assignment()],
  );
  assert.equal(standings.players[0].activityPoints, 8);
  assert.equal(standings.players[0].totalPoints, 13);
  assert.equal(standings.houses[0].activityPoints, 8);
  assert.equal(standings.houses[0].totalPoints, 13);
});

test("season honours use Power Play-adjusted standings", () => {
  const honours = calculateSeasonHonours(
    [contribution()],
    [membership()],
    league().ruleset,
    [assignment()],
  );
  assert.equal(honours.houseOfChampions.totalPoints, 13);
  assert.ok(honours.individual.some((item) => item.userId === "player-one"));
});

test("trusted reconciliation blocks repeated Power Plays and mismatched used state", () => {
  const second = assignment({
    id: "season-power_week-02",
    weekKey: "week-02",
    weekIndex: 2,
    startDate: timestamp("2026-08-10T00:00:00.000Z"),
    endDate: timestamp("2026-08-16T00:00:00.000Z"),
    selectionSequence: 2,
  });
  const audit = buildTrustedSeasonAudit({
    league: league({
      powerPlayState: {
        usedPowerPlayIds: ["base-water"],
        selectionCount: 1,
        lastWeekKey: "week-01",
        lastPowerPlayId: "base-water",
        lastSelectionAt: timestamp("2026-08-03T00:00:00.000Z"),
        lastSelectionBy: "admin-one",
      },
    }),
    memberships: [membership()],
    contributions: [contribution()],
    entries: [{ id: "entry-one", userId: "player-one", challengeDate: timestamp("2026-08-05T00:00:00.000Z") }],
    powerPlayAssignments: [assignment(), second],
    referenceDate: new Date("2026-08-12T00:00:00.000Z"),
  });
  assert.equal(audit.publishable, false);
  assert.ok(audit.issues.some((item) => item.code === "POWER_PLAY_REPEATED_IN_SEASON"));
  assert.ok(audit.issues.some((item) => item.code === "POWER_PLAY_SELECTION_COUNT_MISMATCH"));
});
