import { SEASON_MODULES } from "./seasons";

export const LEAGUE_STATUSES = Object.freeze({
  DRAFT: "draft",
  REGISTRATION: "registration",
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
});

export const LEAGUE_TYPES = Object.freeze([
  "Friends",
  "Family",
  "Workplace",
  "School",
  "Community",
  "Charity",
  "Tournament",
]);

export const LEAGUE_MODES = Object.freeze([
  { id: "season", label: "Individual and House standings" },
  { id: "individual", label: "Individual standings only" },
]);

export const LEAGUE_PARTICIPANT_LIMIT = 160;

export const LEAGUE_RULESET_VERSION = "season-houses-v1";
export const DEFAULT_LEAGUE_RULESET = Object.freeze({
  version: LEAGUE_RULESET_VERSION,
  scoringEngineVersion: "points-v2",
  dailyActivityCap: 20,
  dailyParticipationBonus: 5,
  includedCategories: Object.freeze([
    "water",
    "fruit",
    "reading",
    "running",
    "upperBody",
    "lowerBody",
    "core",
    "cardio",
    "skill",
    "steps",
  ]),
  modules: SEASON_MODULES,
});
