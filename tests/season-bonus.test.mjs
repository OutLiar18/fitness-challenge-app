import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import {
  calculateLeagueStandings,
  calculateSeasonHonours,
} from "../src/services/leagues/leagueModel.js";
import {
  SEASON_BONUS_AWARD_SOURCES,
  createSeasonBonusAwardDraft,
  createSeasonBonusCorrectionDraft,
  validateSeasonBonusInput,
} from "../src/services/seasons/seasonBonusModel.js";
import { buildTrustedSeasonAudit } from "../src/services/seasons/trustedSeasonModel.js";

const ruleset = {
  ...DEFAULT_LEAGUE_RULESET,
  modules: { ...DEFAULT_LEAGUE_RULESET.modules, powerPlay: false },
};
const league = {
  id: "league-one",
  name: "Test Season",
  status: "active",
  rulesVersion: "season-houses-v4",
  startDate: new Date("2026-08-01T00:00:00.000Z"),
  endDate: new Date("2026-08-31T23:59:59.000Z"),
  ruleset,
};
const member = {
  id: "league-one_player-one",
  leagueId: "league-one",
  userId: "player-one",
  displayName: "Player One",
  avatarId: "legacy-trophy",
  status: "active",
  currentHouseId: "house-b",
  currentHouseName: "House B",
  currentHouseEmblemId: "springbok",
};
const bonusContribution = {
  id: "season_bonus_award-one",
  leagueId: "league-one",
  entryId: "",
  userId: "player-one",
  displayName: "Player One",
  avatarId: "legacy-trophy",
  houseId: "house-b",
  houseName: "House B",
  houseEmblemId: "springbok",
  teamId: "house-b",
  teamName: "House B",
  category: "seasonBonus",
  scoreCategory: "seasonBonus",
  pointGroup: "seasonBonus",
  challengeDate: new Date("2026-08-10T10:00:00.000Z"),
  activityPoints: 75,
  rulesVersion: "season-houses-v4",
  source: "season-bonus",
  sourceRedemptionId: "",
  evidenceClaimId: "",
  evidenceDecisionId: "",
  correctionId: "",
  correctionRole: "",
  replacesContributionIds: [],
  bonusAwardId: "award-one",
};

test("season bonus input requires a positive whole-number award and factual reason", () => {
  assert.equal(validateSeasonBonusInput({ points: 50, reason: "Exceptional sportsmanship" }).valid, true);
  assert.equal(validateSeasonBonusInput({ points: 0, reason: "Exceptional sportsmanship" }).valid, false);
  assert.equal(validateSeasonBonusInput({ points: 2.5, reason: "Exceptional sportsmanship" }).valid, false);
  assert.equal(validateSeasonBonusInput({ points: 50, reason: "Nice" }).valid, false);
});

test("normal bonus award identity uses the player's current House at award time", () => {
  const award = createSeasonBonusAwardDraft({
    league,
    member,
    points: 75,
    reason: "Exceptional season contribution",
    source: SEASON_BONUS_AWARD_SOURCES.LEAGUE_ADMIN_REQUEST,
    requestId: "request-one",
    requestedBy: "league-admin",
  });
  assert.equal(award.houseId, "house-b");
  assert.equal(award.houseName, "House B");
  assert.equal(award.points, 75);
});

test("bonus correction keeps the original historical House even after the player moves", () => {
  const correction = createSeasonBonusCorrectionDraft({
    originalAward: {
      id: "award-one",
      leagueId: "league-one",
      userId: "player-one",
      displayName: "Player One",
      avatarId: "legacy-trophy",
      houseId: "house-a",
      houseName: "House A",
      houseEmblemId: "lion",
      rulesVersion: "season-houses-v4",
      challengeDate: new Date("2026-08-08T10:00:00.000Z"),
    },
    points: -25,
    reason: "Correct duplicate portion of the award",
  });
  assert.equal(correction.houseId, "house-a");
  assert.equal(correction.points, -25);
  assert.equal(correction.correctsAwardId, "award-one");
});

test("season bonus points bypass daily caps and Power Plays while increasing player and House totals equally", () => {
  const activityContribution = {
    ...bonusContribution,
    id: "activity-one",
    entryId: "entry-one",
    category: "reading",
    scoreCategory: "reading",
    pointGroup: "activity",
    activityPoints: 40,
    source: "activity",
    bonusAwardId: "",
  };
  const standings = calculateLeagueStandings(
    [activityContribution, bonusContribution],
    [member],
    ruleset,
    [],
  );
  assert.equal(standings.players[0].activityPoints, 20);
  assert.equal(standings.players[0].consistencyPoints, 5);
  assert.equal(standings.players[0].seasonBonusPoints, 75);
  assert.equal(standings.players[0].totalPoints, 100);
  assert.equal(standings.houses[0].seasonBonusPoints, 75);
  assert.equal(standings.houses[0].totalPoints, 100);
});

test("season bonus affects overall and House honours but never creates a category title", () => {
  const honours = calculateSeasonHonours([bonusContribution], [member], ruleset, []);
  assert.equal(honours.individual[0].id, "legacy");
  assert.equal(honours.individual[0].userId, "player-one");
  assert.equal(honours.individual.some((item) => item.id === "seasonBonus"), false);
  assert.equal(honours.houseChampions[0].userId, "player-one");
  assert.equal(honours.houseOfChampions.houseId, "house-b");
});

test("trusted season audit accepts a structurally valid season bonus contribution", () => {
  const audit = buildTrustedSeasonAudit({
    league,
    memberships: [member],
    contributions: [bonusContribution],
    referenceDate: new Date("2026-08-10T12:00:00.000Z"),
  });
  assert.equal(audit.issueCounts.blocking, 0);
  assert.equal(audit.standings.players[0].seasonBonusPoints, 75);
});

test("trusted season audit blocks a malformed bonus contribution", () => {
  const audit = buildTrustedSeasonAudit({
    league,
    memberships: [member],
    contributions: [{ ...bonusContribution, bonusAwardId: "", source: "activity" }],
    referenceDate: new Date("2026-08-10T12:00:00.000Z"),
  });
  assert.equal(audit.issueCounts.blocking > 0, true);
  assert.equal(audit.issues.some((issue) => issue.code === "SEASON_BONUS_AWARD_LINK_INVALID"), true);
});
