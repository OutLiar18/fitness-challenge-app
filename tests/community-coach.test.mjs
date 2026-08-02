import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LEAGUE_RULESET,
  LEAGUE_PARTICIPANT_LIMIT,
  LEAGUE_STATUSES,
} from "../src/constants/leagues.js";
import { TEAM_MEMBER_LIMIT } from "../src/constants/teams.js";
import { createCoachReport, normalizeCoachPreferences } from "../src/services/coach/coachModel.js";
import {
  calculateLeagueStandings,
  canManageLeague,
  canTransitionLeague,
  validateLeagueInput,
} from "../src/services/leagues/leagueModel.js";
import {
  calculateTeamMemberSnapshot,
  createTeamInviteCode,
  getCurrentTeamMemberSnapshot,
  getTeamSummary,
  normalizeTeamCode,
  validateTeamInput,
} from "../src/services/teams/teamModel.js";

function entry({ category = "water", date, data = { amount: 2000 } }) {
  return {
    category,
    data,
    challengeDate: { toDate: () => date },
  };
}

test("Team invitation codes avoid ambiguous characters and normalise safely", () => {
  const code = createTeamInviteCode(() => 0);

  assert.equal(TEAM_MEMBER_LIMIT, 25);
  assert.equal(code.length, 8);
  assert.equal(code, "AAAAAAAA");
  assert.equal(normalizeTeamCode(" ab-cd 23o1 "), "ABCD23");
});

test("Team creation requires a clear identity", () => {
  const valid = validateTeamInput({
    name: "Morning Builders",
    description: "We support one another through small daily actions.",
    motto: "Show up together",
    emblemId: "summit",
  });
  const invalid = validateTeamInput({ name: "A", description: "No", motto: "" });

  assert.equal(valid.valid, true);
  assert.equal(valid.value.emblemId, "summit");
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 3);
});

test("Team weekly snapshots reuse factual entry points", () => {
  const monday = new Date(2026, 6, 27, 12);
  const snapshot = calculateTeamMemberSnapshot(
    [
      entry({ date: monday }),
      entry({ category: "steps", date: new Date(2026, 6, 28, 12), data: { steps: 10000 } }),
    ],
    { streak: { currentStreak: 4 } },
    new Date(2026, 7, 1, 12),
  );

  assert.equal(snapshot.activeDays, 2);
  assert.equal(snapshot.entriesRecorded, 2);
  assert.equal(snapshot.currentStreak, 4);
  assert.ok(snapshot.weeklyPoints > 0);
});


test("Team summaries ignore progress snapshots from an earlier week", () => {
  const referenceDate = new Date(2026, 7, 3, 12);
  const currentWeekKey = "2026-08-03";
  const members = [
    {
      userId: "current",
      weeklyKey: currentWeekKey,
      weeklyPoints: 12.5,
      activeDays: 2,
      entriesRecorded: 3,
    },
    {
      userId: "stale",
      weeklyKey: "2026-07-27",
      weeklyPoints: 99,
      activeDays: 7,
      entriesRecorded: 40,
    },
  ];

  const staleSnapshot = getCurrentTeamMemberSnapshot(members[1], referenceDate);
  const summary = getTeamSummary(members, referenceDate);

  assert.equal(staleSnapshot.weeklyPoints, 0);
  assert.equal(staleSnapshot.activeDays, 0);
  assert.equal(summary.weeklyPoints, 12.5);
  assert.equal(summary.activeDays, 2);
  assert.equal(summary.entriesRecorded, 3);
});

test("League participant limit stays below lifecycle batch capacity", () => {
  assert.equal(LEAGUE_PARTICIPANT_LIMIT, 200);
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

test("League drafts freeze the consistency ruleset", () => {
  const result = validateLeagueInput({
    name: "Spring Consistency League",
    description: "A friendly four-week season that rewards showing up regularly.",
    type: "Community",
    mode: "team",
    startDate: new Date(2026, 8, 1, 12),
    endDate: new Date(2026, 8, 29, 12),
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.value.ruleset, DEFAULT_LEAGUE_RULESET);
});

test("League standings cap daily activity and reward participation", () => {
  const memberships = [
    {
      userId: "steady",
      displayName: "Steady Player",
      avatarId: "legacy-trophy",
      teamId: "team-a",
      teamName: "Team A",
    },
    {
      userId: "burst",
      displayName: "Burst Player",
      avatarId: "legacy-trophy",
      teamId: "team-b",
      teamName: "Team B",
    },
  ];
  const contributions = [
    { leagueId: "league", userId: "steady", category: "water", challengeDate: new Date(2026, 7, 1, 12), activityPoints: 10 },
    { leagueId: "league", userId: "steady", category: "steps", challengeDate: new Date(2026, 7, 2, 12), activityPoints: 10 },
    { leagueId: "league", userId: "burst", category: "running", challengeDate: new Date(2026, 7, 1, 12), activityPoints: 100 },
  ];

  const standings = calculateLeagueStandings(contributions, memberships, DEFAULT_LEAGUE_RULESET);

  assert.equal(standings.players[0].userId, "steady");
  assert.equal(standings.players[0].totalPoints, 30);
  assert.equal(standings.players[1].totalPoints, 25);
  assert.equal(standings.teams[0].teamName, "Team A");
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
