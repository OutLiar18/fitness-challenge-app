import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LEAGUE_RULESET,
  LEAGUE_PARTICIPANT_LIMIT,
  LEAGUE_STATUSES,
} from "../src/constants/leagues.js";
import { createCoachReport, normalizeCoachPreferences } from "../src/services/coach/coachModel.js";
import { createDefaultPowerPlayPolicy } from "../src/services/seasons/powerPlayModel.js";
import {
  calculateLeagueStandings,
  calculateSeasonHonours,
  canManageLeague,
  canTransitionLeague,
  validateLeagueInput,
} from "../src/services/leagues/leagueModel.js";

function entry({ category = "water", date, data = { amount: 2000 } }) {
  return {
    category,
    data,
    challengeDate: { toDate: () => date },
  };
}

test("League participant limit stays below lifecycle batch capacity", () => {
  assert.equal(LEAGUE_PARTICIPANT_LIMIT, 160);
  assert.ok(LEAGUE_PARTICIPANT_LIMIT < 497);
});

test("Platform Administrators can manage every league while scoped administrators cannot", () => {
  const league = { administratorIds: ["league-admin"] };

  assert.equal(canManageLeague(league, "platform-admin", true), true);
  assert.equal(canManageLeague(league, "league-admin", false), true);
  assert.equal(canManageLeague(league, "other-player", false), false);
});

test("League lifecycle only moves forward one audited stage at a time", () => {
  assert.equal(canTransitionLeague(LEAGUE_STATUSES.DRAFT, LEAGUE_STATUSES.REGISTRATION), true);
  assert.equal(canTransitionLeague(LEAGUE_STATUSES.REGISTRATION, LEAGUE_STATUSES.ACTIVE), true);
  assert.equal(canTransitionLeague(LEAGUE_STATUSES.ACTIVE, LEAGUE_STATUSES.ARCHIVED), false);
  assert.equal(canTransitionLeague(LEAGUE_STATUSES.COMPLETED, LEAGUE_STATUSES.DRAFT), false);
});

test("Season drafts freeze the House and Pocket ruleset", () => {
  const result = validateLeagueInput({
    name: "Spring Consistency Season",
    description: "A friendly four-week season that rewards showing up regularly.",
    theme: "South African Animals",
    type: "Community",
    mode: "season",
    houseCount: 6,
    startDate: new Date(2026, 8, 8, 12),
    endDate: new Date(2026, 9, 5, 12),
    evidencePolicy: { confirmed: true },
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.value.ruleset, {
    ...DEFAULT_LEAGUE_RULESET,
    modules: { ...DEFAULT_LEAGUE_RULESET.modules },
    evidencePolicy: result.value.ruleset.evidencePolicy,
    powerPlayPolicy: createDefaultPowerPlayPolicy("South African Animals"),
  });
  assert.equal(result.value.pocketEnabled, true);
  assert.equal(result.value.houseCount, 6);
  assert.equal(result.value.pocketStartDate.getDate(), 1);
  assert.equal(result.value.pocketEndDate.getDate(), 7);
});

test("League standings cap daily activity and preserve historical House allocation", () => {
  const memberships = [
    {
      userId: "steady",
      displayName: "Steady Player",
      avatarId: "legacy-trophy",
      currentHouseId: "house-b",
      currentHouseName: "House Buffalo",
    },
    {
      userId: "burst",
      displayName: "Burst Player",
      avatarId: "legacy-trophy",
      currentHouseId: "house-b",
      currentHouseName: "House Buffalo",
    },
  ];
  const contributions = [
    {
      leagueId: "league",
      userId: "steady",
      category: "water",
      challengeDate: new Date(2026, 7, 1, 12),
      activityPoints: 10,
      houseId: "house-a",
      houseName: "House Springbok",
    },
    {
      leagueId: "league",
      userId: "steady",
      category: "steps",
      challengeDate: new Date(2026, 7, 2, 12),
      activityPoints: 10,
      houseId: "house-b",
      houseName: "House Buffalo",
    },
    {
      leagueId: "league",
      userId: "burst",
      category: "running",
      challengeDate: new Date(2026, 7, 1, 12),
      activityPoints: 100,
      houseId: "house-b",
      houseName: "House Buffalo",
    },
  ];

  const standings = calculateLeagueStandings(contributions, memberships, DEFAULT_LEAGUE_RULESET);

  assert.equal(standings.players[0].userId, "steady");
  assert.equal(standings.players[0].totalPoints, 30);
  assert.equal(standings.players[0].houseName, "House Buffalo");
  assert.equal(standings.players[1].totalPoints, 25);
  assert.equal(standings.houses.find((house) => house.houseId === "house-a").totalPoints, 15);
  assert.equal(standings.houses.find((house) => house.houseId === "house-b").totalPoints, 40);
});


test("Season honours crown one player per individual title and preserve House chapters", () => {
  const memberships = [
    { userId: "one", displayName: "One", avatarId: "legacy-trophy", currentHouseId: "house-b", currentHouseName: "House B" },
    { userId: "two", displayName: "Two", avatarId: "legacy-trophy", currentHouseId: "house-a", currentHouseName: "House A" },
    { userId: "three", displayName: "Three", avatarId: "legacy-trophy", currentHouseId: "house-b", currentHouseName: "House B" },
  ];
  const contributions = [
    { userId: "one", category: "running", challengeDate: new Date(2026, 7, 1), activityPoints: 20, houseId: "house-a", houseName: "House A" },
    { userId: "one", category: "cardio", challengeDate: new Date(2026, 7, 2), activityPoints: 20, houseId: "house-b", houseName: "House B" },
    { userId: "two", category: "running", challengeDate: new Date(2026, 7, 1), activityPoints: 10, houseId: "house-a", houseName: "House A" },
    { userId: "three", category: "cardio", challengeDate: new Date(2026, 7, 2), activityPoints: 15, houseId: "house-b", houseName: "House B" },
  ];

  const honours = calculateSeasonHonours(contributions, memberships, DEFAULT_LEAGUE_RULESET);
  assert.equal(honours.individual[0].title, "Legacy Champion");
  assert.equal(new Set(honours.individual.map((item) => item.userId)).size, honours.individual.length);
  assert.equal(honours.houseChampions.length, 2);
  assert.ok(honours.houseOfChampions);
});

test("Legacy Coach recommendations expose their evidence and remain optional", () => {
  const referenceDate = new Date(2026, 7, 1, 12);
  const report = createCoachReport(
    [
      entry({ date: referenceDate }),
      entry({ category: "reading", date: new Date(2026, 6, 30, 12), data: { totalMinutes: 30 } }),
    ],
    { enabled: true, tone: "direct", focus: "consistency" },
    referenceDate,
  );

  assert.equal(report.preferences.enabled, true);
  assert.ok(report.recommendations.length >= 2);
  assert.ok(report.recommendations.every((recommendation) => recommendation.reason.length > 20));
  assert.equal(report.evidence.length, 5);
  assert.match(report.summary, /Keep what worked|Choose one small activity/);

  assert.deepEqual(normalizeCoachPreferences({ enabled: false, tone: "unknown" }), {
    enabled: false,
    tone: "balanced",
    focus: "balanced",
  });
});
