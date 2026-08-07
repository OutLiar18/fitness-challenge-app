import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import {
  HOUSE_BALANCE_CALCULATION_VERSION,
  HOUSE_COMPOSITION_DISCLOSURE_MINIMUM,
  HOUSE_MOVEMENT_POLICY_VERSION,
} from "../src/constants/seasons.js";
import {
  buildHouseBalanceCalculation,
  createCompositionProfile,
  createHouseAssignmentHistoryId,
  getRosterMoveEligibility,
  getRosterRestWindow,
  supportsHouseMovementV1,
} from "../src/services/seasons/houseMovementModel.js";

function league(overrides = {}) {
  return {
    id: "season-v4",
    name: "Legacy Season",
    status: "active",
    rulesVersion: "season-houses-v4",
    ruleset: DEFAULT_LEAGUE_RULESET,
    ...overrides,
  };
}

const houses = [
  { id: "house-a", name: "House A", emblemId: "lion", captainId: "captain-a", viceCaptainIds: [] },
  { id: "house-b", name: "House B", emblemId: "eagle", captainId: "captain-b", viceCaptainIds: [] },
];

function membership(userId, houseId, overrides = {}) {
  return {
    id: `season-v4_${userId}`,
    leagueId: "season-v4",
    userId,
    displayName: userId,
    status: "active",
    currentHouseId: houseId,
    lastRosterWeekKey: "",
    rosterLockThroughWeekKey: "",
    rosterEligibleWeekKey: "",
    ...overrides,
  };
}

test("v4 seasons freeze the one-week House movement policy", () => {
  assert.equal(supportsHouseMovementV1(league()), true);
  assert.equal(DEFAULT_LEAGUE_RULESET.houseMovementPolicy.version, HOUSE_MOVEMENT_POLICY_VERSION);
  assert.equal(DEFAULT_LEAGUE_RULESET.houseMovementPolicy.playerRestWeeks, 1);
  assert.equal(DEFAULT_LEAGUE_RULESET.houseMovementPolicy.compositionPolicy.scoringEnabled, false);
  assert.equal(DEFAULT_LEAGUE_RULESET.modules.weeklyHouseBalance, true);
  assert.equal(DEFAULT_LEAGUE_RULESET.modules.compositionPrivacy, true);
});

test("a roster move locks the following week and reopens in the week after", () => {
  const window = getRosterRestWindow("2026-08-03");
  assert.equal(window.lockThroughWeekKey, "2026-08-10");
  assert.equal(window.eligibleWeekKey, "2026-08-17");
  assert.equal(window.eligibleAgainAt.getFullYear(), 2026);
  assert.equal(window.eligibleAgainAt.getMonth(), 7);
  assert.equal(window.eligibleAgainAt.getDate(), 17);
});

test("C.H.A.O.S. assignment does not create a post-move rest lock", () => {
  const result = getRosterMoveEligibility({
    league: league(),
    membership: membership("player-a", "house-a", { houseAssignmentMethod: "chaos" }),
    house: houses[0],
    weekKey: "2026-08-03",
  });
  assert.equal(result.eligible, true);
  assert.equal(result.code, "eligible");
});

test("movement eligibility explains leaders, current-week moves and post-move rest", () => {
  const leader = getRosterMoveEligibility({
    league: league(),
    membership: membership("captain-a", "house-a"),
    house: houses[0],
    weekKey: "2026-08-10",
  });
  assert.equal(leader.code, "current-house-leader");
  assert.equal(leader.overrideable, undefined);

  const movedNow = getRosterMoveEligibility({
    league: league(),
    membership: membership("player-a", "house-a", { lastRosterWeekKey: "2026-08-10" }),
    house: houses[0],
    weekKey: "2026-08-10",
  });
  assert.equal(movedNow.code, "moved-this-week");
  assert.equal(movedNow.overrideable, undefined);

  const resting = getRosterMoveEligibility({
    league: league(),
    membership: membership("player-a", "house-a", {
      lastRosterWeekKey: "2026-08-03",
      rosterLockThroughWeekKey: "2026-08-10",
      rosterEligibleWeekKey: "2026-08-17",
    }),
    house: houses[0],
    weekKey: "2026-08-10",
  });
  assert.equal(resting.code, "post-move-rest");
  assert.equal(resting.overrideable, true);
  assert.match(resting.detail, /2026-08-17/);
});

test("House assignment history identifiers are deterministic per source and player", () => {
  assert.equal(
    createHouseAssignmentHistoryId("swap-one", "player-a"),
    "swap-one_player-a",
  );
});

test("composition profiles are season-scoped and accept the protected response set", () => {
  assert.deepEqual(createCompositionProfile({
    leagueId: "season-v4",
    userId: "player-a",
    value: "prefer-not-to-say",
  }), {
    leagueId: "season-v4",
    userId: "player-a",
    value: "prefer-not-to-say",
    profileVersion: "season-composition-v1",
  });
  assert.throws(
    () => createCompositionProfile({ leagueId: "season-v4", userId: "player-a", value: "invalid" }),
    /Choose one/,
  );
});

test("weekly balance compares each House with the active season distribution", () => {
  const memberships = [
    membership("a1", "house-a"),
    membership("a2", "house-a"),
    membership("a3", "house-a"),
    membership("b1", "house-b"),
    membership("b2", "house-b"),
    membership("b3", "house-b"),
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
    league: league(),
    houses,
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
  assert.equal(privateResult.rosterSnapshot.length, 6);
});

test("small House composition groups are hidden from the public result", () => {
  const memberships = [
    membership("a1", "house-a"),
    membership("a2", "house-a"),
    membership("b1", "house-b"),
    membership("b2", "house-b"),
  ];
  const profiles = memberships.map((item, index) => ({
    leagueId: "season-v4",
    userId: item.userId,
    value: index % 2 ? "man" : "woman",
  }));
  const { publicResult } = buildHouseBalanceCalculation({
    league: league(), houses, memberships, profiles, weekKey: "2026-08-03",
  });

  assert.equal(publicResult.balanceStatus, "insufficient-data");
  assert.ok(publicResult.houses.every((item) => item.compositionVisible === false));
  assert.ok(publicResult.houses.every((item) => Object.keys(item.compositionDistribution).length === 0));
});

test("weekly House balance is informational and cannot alter standings", () => {
  const { publicResult, privateResult } = buildHouseBalanceCalculation({
    league: league(),
    houses,
    memberships: [],
    profiles: [],
    weekKey: "2026-08-03",
  });
  assert.equal(publicResult.scoringEnabled, false);
  assert.equal(privateResult.scoringEnabled, false);
  assert.equal("points" in publicResult, false);
  assert.equal("multiplier" in publicResult, false);
});
