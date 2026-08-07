import assert from "node:assert/strict";
import test from "node:test";

import {
  HOUSE_MOVEMENT_POLICY_VERSION,
  HOUSE_ROSTER_PLAYER_REST_WEEKS,
} from "../src/constants/seasons.js";
import {
  createHouseAssignmentHistoryId,
  getRosterMoveEligibility,
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
