import assert from "node:assert/strict";
import test from "node:test";

import {
  HOUSE_ROSTER_MOVES_PER_WEEK,
  HOUSE_VICE_CAPTAIN_LIMIT,
  LEADERSHIP_ELECTION_DURATION_HOURS,
  POCKET_WINDOW_DAYS,
  SEASON_MODULES,
} from "../src/constants/seasons.js";
import {
  calculateHouseBalance,
  createSeasonInviteCode,
  calculateLeadershipResult,
  createElectionId,
  createPocketRedemptionData,
  createRosterSwapId,
  distributePlayersWithChaos,
  getChaosReadiness,
  getPocketQuantity,
  getPocketWindow,
  normalizePocketRedemptionQuantity,
  getSeasonPhase,
  normalizeSeasonCode,
  validateHouseInput,
} from "../src/services/seasons/seasonModel.js";

const houses = [
  { id: "springbok", name: "House Springbok", emblemId: "springbok", accentId: "emerald" },
  { id: "lion", name: "House Lion", emblemId: "lion", accentId: "sunstone" },
  { id: "eagle", name: "House Eagle", emblemId: "eagle", accentId: "sapphire" },
];

const members = Array.from({ length: 10 }, (_, index) => ({
  id: `league_player-${index + 1}`,
  userId: `player-${index + 1}`,
  displayName: `Player ${index + 1}`,
}));


test("Season invitation codes avoid ambiguous characters", () => {
  assert.equal(createSeasonInviteCode(() => 0), "AAAAAAAA");
  assert.equal(normalizeSeasonCode(" ab-cd 23o1 "), "ABCD23");
});

test("Season competition modules keep unclear legacy mechanics inactive", () => {
  assert.equal(SEASON_MODULES.houses, true);
  assert.equal(SEASON_MODULES.chaosAssignment, true);
  assert.equal(SEASON_MODULES.leadershipElections, true);
  assert.equal(SEASON_MODULES.rosterSwaps, true);
  assert.equal(SEASON_MODULES.pocketWeek, true);
  assert.equal(SEASON_MODULES.powerPlay, false);
  assert.equal(SEASON_MODULES.transferMarket, false);
  assert.equal(SEASON_MODULES.buddyBonus, false);
  assert.equal(SEASON_MODULES.fiveFires, false);
});

test("C.H.A.O.S. is deterministic and balances every registered player", () => {
  const first = distributePlayersWithChaos(members, houses, "season-one");
  const repeated = distributePlayersWithChaos(members, houses, "season-one");
  const different = distributePlayersWithChaos(members, houses, "season-two");

  assert.deepEqual(first, repeated);
  assert.notDeepEqual(first, different);
  assert.equal(first.length, members.length);
  assert.ok(first.every((assignment) => houses.some((house) => house.id === assignment.houseId)));
  assert.ok(calculateHouseBalance(first).difference <= 1);
  assert.throws(
    () => distributePlayersWithChaos(members.slice(0, 5), houses, "too-small"),
    /at least two registered players/,
  );
});


test("C.H.A.O.S. readiness explains every prerequisite before assignment", () => {
  const league = { status: "draft", houseCount: 3, chaosStatus: "pending" };
  const registered = members.slice(0, 6).map((member) => ({ ...member, status: "registered" }));
  const draft = getChaosReadiness({ league, houses, memberships: registered });
  assert.equal(draft.eligible, false);
  assert.equal(draft.registrationOpen, false);
  assert.equal(draft.houseCountReady, true);
  assert.equal(draft.enoughPlayers, true);

  const shortRoster = getChaosReadiness({
    league: { ...league, status: "registration" },
    houses,
    memberships: registered.slice(0, 5),
  });
  assert.equal(shortRoster.eligible, false);
  assert.equal(shortRoster.minimumPlayerCount, 6);
  assert.equal(shortRoster.registeredPlayerCount, 5);

  const ready = getChaosReadiness({
    league: { ...league, status: "registration" },
    houses,
    memberships: registered,
  });
  assert.equal(ready.eligible, true);
  assert.ok(ready.checks.every((check) => check.complete));

  const completed = getChaosReadiness({
    league: { ...league, status: "registration", chaosStatus: "activated" },
    houses,
    memberships: registered,
  });
  assert.equal(completed.eligible, false);
  assert.equal(completed.unused, false);
});

test("House identity validation preserves themed presentation", () => {
  const valid = validateHouseInput({
    name: "House Springbok",
    description: "We move with speed, courage and South African pride.",
    motto: "Leap together",
    emblemId: "springbok",
    accentId: "emerald",
  });
  const invalid = validateHouseInput({ name: "A", description: "No", motto: "" });

  assert.equal(valid.valid, true);
  assert.equal(valid.value.emblemId, "springbok");
  assert.equal(invalid.valid, false);
});

test("Leadership voting lasts one day and ranks captain then vice-captain", () => {
  const result = calculateLeadershipResult(
    [
      { candidateId: "player-1" },
      { candidateId: "player-1" },
      { candidateId: "player-2" },
    ],
    members.slice(0, 3),
  );

  assert.equal(LEADERSHIP_ELECTION_DURATION_HOURS, 24);
  assert.equal(HOUSE_VICE_CAPTAIN_LIMIT, 2);
  assert.equal(result.status, "ready");
  assert.equal(result.captainId, "player-1");
  assert.equal(result.viceCaptainId, "player-2");
});

test("Leadership results expose ties and no-vote administrator resolution", () => {
  const noVotes = calculateLeadershipResult([], members.slice(0, 3));
  const tie = calculateLeadershipResult(
    [{ candidateId: "player-1" }, { candidateId: "player-2" }],
    members.slice(0, 3),
  );

  assert.equal(noVotes.status, "no-votes");
  assert.equal(tie.status, "captain-tie");
});

test("Election and roster identifiers are stable per House and week", () => {
  assert.equal(createElectionId("season", "house-a", "2026-08-03"), "season_house-a_2026-08-03");
  assert.equal(
    createRosterSwapId("season", ["house-b", "house-a"], "2026-08-03"),
    "season_house-a_house-b_2026-08-03",
  );
  assert.equal(HOUSE_ROSTER_MOVES_PER_WEEK, 1);
});

test("Pocket Week is the seven days immediately before a season", () => {
  const startDate = new Date(2026, 8, 8, 12);
  const window = getPocketWindow(startDate);
  const league = {
    status: "registration",
    pocketEnabled: true,
    startDate,
    endDate: new Date(2026, 9, 5, 12),
    pocketStartDate: window.startDate,
    pocketEndDate: window.endDate,
  };

  assert.equal(POCKET_WINDOW_DAYS, 7);
  assert.equal(window.startDate.getDate(), 1);
  assert.equal(window.endDate.getDate(), 7);
  assert.equal(getSeasonPhase(league, new Date(2026, 8, 4, 12)), "pocket");
});

test("Pocket redemption supports canonical partial quantities and whole sessions", () => {
  assert.equal(getPocketQuantity("water", { amount: 1500 }), 1500);
  assert.equal(getPocketQuantity("running", { distance: 5 }), 1);
  assert.equal(normalizePocketRedemptionQuantity("reading", 10.501), 10.5);
  assert.deepEqual(createPocketRedemptionData("water", { amount: 1500 }, 500), { amount: 500 });
  assert.equal(createPocketRedemptionData("reading", { title: "Atomic Habits" }, 15).totalMinutes, 15);
  assert.deepEqual(createPocketRedemptionData("running", { distance: 5, totalMinutes: 31 }, 1), {
    distance: 5,
    totalMinutes: 31,
  });
  assert.throws(
    () => normalizePocketRedemptionQuantity("fruit", 1.5),
    /whole-number Pocket amount/,
  );
  assert.throws(
    () => createPocketRedemptionData("running", { distance: 5 }, 0.5),
    /complete session/,
  );
});

test("Pocket redemption preserves stored activity identity while changing only quantity", () => {
  const reading = createPocketRedemptionData("reading", {
    title: "Atomic Habits",
    author: "James Clear",
    totalPages: 320,
    reflection: "Small actions compound.",
    completed: false,
  }, 12.5);
  assert.equal(reading.totalSeconds, 750);
  assert.equal(reading.title, "Atomic Habits");
  assert.equal(reading.reflection, "Small actions compound.");

  const cardio = createPocketRedemptionData("cardio", {
    activity: "Cycling",
    source: "library",
    suggestionStatus: "",
    activityDefinition: { difficulty: "moderate" },
    notes: "Easy recovery ride.",
  }, 20);
  assert.equal(cardio.activity, "Cycling");
  assert.equal(cardio.notes, "Easy recovery ride.");
  assert.equal(cardio.distance, "");
});
