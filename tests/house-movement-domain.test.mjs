import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_LEAGUE_RULESET, LEAGUE_RULESET_VERSION } from "../src/constants/leagues.js";
import { validateLeagueInput } from "../src/services/leagues/leagueModel.js";
import {
  HOUSE_BALANCE_CALCULATION_VERSION,
  HOUSE_COMPOSITION_DISCLOSURE_MINIMUM,
  HOUSE_MOVEMENT_POLICY_VERSION,
  HOUSE_ROSTER_PLAYER_REST_WEEKS,
} from "../src/constants/seasons.js";
import {
  buildHouseBalanceCalculation,
  createCompositionProfile,
  createHouseAssignmentHistoryId,
  getBalanceStatusCopy,
  getRosterMoveEligibility,
  normalizeCompositionValue,
  getRosterRestWindow,
  supportsHouseMovementV1,
} from "../src/services/seasons/houseMovementModel.js";

function futureV4League(overrides = {}) {
  return {
    id: "season-v4",
    name: "Legacy Season",
    status: "active",
    rulesVersion: "season-houses-v4",
    ...overrides,
  };
}

const house = {
  id: "house-a",
  name: "House A",
  captainId: "captain-a",
  viceCaptainIds: ["vice-a"],
};

function membership(userId = "player-a", overrides = {}) {
  return {
    id: `season-v4_${userId}`,
    leagueId: "season-v4",
    userId,
    displayName: userId,
    status: "active",
    currentHouseId: "house-a",
    lastRosterWeekKey: "",
    rosterLockThroughWeekKey: "",
    rosterEligibleWeekKey: "",
    ...overrides,
  };
}

test("v0.24 House movement is activated by the v4 season contract without a nested Rules policy", () => {
  assert.equal(supportsHouseMovementV1(futureV4League()), true);
  assert.equal(supportsHouseMovementV1({ rulesVersion: "season-houses-v3" }), false);
  assert.equal(HOUSE_MOVEMENT_POLICY_VERSION, "house-movement-v1");
  assert.equal(HOUSE_ROSTER_PLAYER_REST_WEEKS, 1);
});

test("a roster move locks the following week and reopens in the week after", () => {
  const window = getRosterRestWindow("2026-08-03");
  assert.equal(window.lockThroughWeekKey, "2026-08-10");
  assert.equal(window.eligibleWeekKey, "2026-08-17");
  assert.equal(window.eligibleAgainAt.getFullYear(), 2026);
  assert.equal(window.eligibleAgainAt.getMonth(), 7);
  assert.equal(window.eligibleAgainAt.getDate(), 17);
});

test("opening C.H.A.O.S. assignment does not create a post-move rest lock", () => {
  const result = getRosterMoveEligibility({
    league: futureV4League(),
    membership: membership("player-a", { houseAssignmentMethod: "chaos" }),
    house,
    weekKey: "2026-08-03",
  });
  assert.equal(result.eligible, true);
  assert.equal(result.code, "eligible");
});

test("movement eligibility explains leadership, House locks and current-week moves", () => {
  assert.equal(getRosterMoveEligibility({
    league: futureV4League(), membership: membership("captain-a"), house, weekKey: "2026-08-10",
  }).code, "current-house-leader");

  assert.equal(getRosterMoveEligibility({
    league: futureV4League(), membership: membership(), house, weekKey: "2026-08-10", houseLocked: true,
  }).code, "house-used-weekly-move");

  assert.equal(getRosterMoveEligibility({
    league: futureV4League(),
    membership: membership("player-a", { lastRosterWeekKey: "2026-08-10" }),
    house,
    weekKey: "2026-08-10",
  }).code, "moved-this-week");
});

test("only the future v4 policy activates the one-week post-move rest", () => {
  const movedMembership = membership("player-a", {
    lastRosterWeekKey: "2026-08-03",
    rosterLockThroughWeekKey: "2026-08-10",
    rosterEligibleWeekKey: "2026-08-17",
  });

  const v4Result = getRosterMoveEligibility({
    league: futureV4League(), membership: movedMembership, house, weekKey: "2026-08-10",
  });
  assert.equal(v4Result.eligible, false);
  assert.equal(v4Result.code, "post-move-rest");
  assert.equal(v4Result.overrideable, true);
  assert.match(v4Result.detail, /2026-08-17/);

  const v3Result = getRosterMoveEligibility({
    league: { rulesVersion: "season-houses-v3" },
    membership: movedMembership,
    house,
    weekKey: "2026-08-10",
  });
  assert.equal(v3Result.eligible, true);
  assert.equal(v3Result.code, "eligible");
});

test("House assignment history identifiers are deterministic per source and player", () => {
  assert.equal(createHouseAssignmentHistoryId("swap-one", "player-a"), "swap-one_player-a");
});


test("normal new-season creation now emits the v4 House movement contract", () => {
  const result = validateLeagueInput({
    name: "House Movement Season",
    description: "A full season used to verify the v4 runtime creation contract.",
    theme: "Warrior Houses",
    type: "Community",
    mode: "season",
    houseCount: 8,
    startDate: new Date(2026, 8, 7, 12),
    endDate: new Date(2026, 9, 5, 12),
    evidencePolicy: { confirmed: true },
  });

  assert.equal(result.valid, true);
  assert.equal(LEAGUE_RULESET_VERSION, "season-houses-v4");
  assert.equal(DEFAULT_LEAGUE_RULESET.version, "season-houses-v4");
  assert.equal(result.value.ruleset.version, "season-houses-v4");
  assert.equal(supportsHouseMovementV1({ rulesVersion: result.value.ruleset.version }), true);
});


test("season composition responses are constrained, private-ready and season scoped", () => {
  assert.equal(normalizeCompositionValue("woman"), "woman");
  assert.equal(normalizeCompositionValue("prefer-not-to-say"), "prefer-not-to-say");
  assert.equal(normalizeCompositionValue("invented-value"), "");
  assert.deepEqual(createCompositionProfile({
    leagueId: "season-one",
    userId: "player-one",
    value: "man",
  }), {
    leagueId: "season-one",
    userId: "player-one",
    value: "man",
    profileVersion: "season-composition-v1",
  });
  assert.throws(
    () => createCompositionProfile({ leagueId: "season-one", userId: "player-one", value: "" }),
    /available private composition responses/,
  );
});

test("weekly House balance compares each visible House with the season distribution", () => {
  const balanceHouses = [
    { id: "house-a", name: "House A", emblemId: "lion" },
    { id: "house-b", name: "House B", emblemId: "wolf" },
  ];
  const memberships = [
    membership("a1", { currentHouseId: "house-a" }),
    membership("a2", { currentHouseId: "house-a" }),
    membership("a3", { currentHouseId: "house-a" }),
    membership("b1", { currentHouseId: "house-b" }),
    membership("b2", { currentHouseId: "house-b" }),
    membership("b3", { currentHouseId: "house-b" }),
  ];
  const profiles = [
    { leagueId: "season-v4", userId: "a1", value: "woman" },
    { leagueId: "season-v4", userId: "a2", value: "woman" },
    { leagueId: "season-v4", userId: "a3", value: "man" },
    { leagueId: "season-v4", userId: "b1", value: "woman" },
    { leagueId: "season-v4", userId: "b2", value: "man" },
    { leagueId: "season-v4", userId: "b3", value: "man" },
  ];
  const { publicResult, privateResult } = buildHouseBalanceCalculation({
    league: futureV4League(),
    houses: balanceHouses,
    memberships,
    profiles,
    weekKey: "2026-08-03",
  });

  assert.equal(publicResult.calculationVersion, HOUSE_BALANCE_CALCULATION_VERSION);
  assert.equal(publicResult.minimumDisclosureCount, HOUSE_COMPOSITION_DISCLOSURE_MINIMUM);
  assert.deepEqual(publicResult.seasonCompositionDistribution, {
    woman: 50,
    man: 50,
    "non-binary-or-another": 0,
  });
  assert.equal(publicResult.houses[0].compositionVisible, true);
  assert.equal(publicResult.houses[0].deviationPercentagePoints, 16.7);
  assert.equal(publicResult.balanceStatus, "review");
  assert.equal(privateResult.houses[0].disclosedCount, 3);
  assert.equal(privateResult.scoringEnabled, false);
  assert.equal("points" in publicResult, false);
  assert.equal("multiplier" in publicResult, false);
});

test("weekly House balance suppresses small disclosed groups from the member snapshot", () => {
  const balanceHouses = [
    { id: "house-a", name: "House A", emblemId: "lion" },
    { id: "house-b", name: "House B", emblemId: "wolf" },
  ];
  const memberships = [
    membership("a1", { currentHouseId: "house-a" }),
    membership("a2", { currentHouseId: "house-a" }),
    membership("b1", { currentHouseId: "house-b" }),
    membership("b2", { currentHouseId: "house-b" }),
  ];
  const profiles = memberships.map((item, index) => ({
    leagueId: "season-v4",
    userId: item.userId,
    value: index % 2 ? "man" : "woman",
  }));
  const { publicResult, privateResult } = buildHouseBalanceCalculation({
    league: futureV4League(),
    houses: balanceHouses,
    memberships,
    profiles,
    weekKey: "2026-08-03",
  });

  assert.equal(publicResult.balanceStatus, "insufficient-data");
  assert.equal(publicResult.maximumDeviationPercentagePoints, null);
  assert.ok(publicResult.houses.every((item) => item.compositionVisible === false));
  assert.ok(publicResult.houses.every((item) => Object.keys(item.compositionDistribution).length === 0));
  assert.equal(privateResult.houses[0].disclosedCount, 2);
  assert.equal(privateResult.houses[0].compositionDistribution.woman, 50);
});

test("weekly House balance status copy remains informational", () => {
  assert.equal(getBalanceStatusCopy("balanced").label, "Balanced");
  assert.match(getBalanceStatusCopy("insufficient-data").detail, /suppressed/);
});

