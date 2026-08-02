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
  { id: "individual", label: "Individual standings" },
  { id: "team", label: "Team and individual standings" },
]);

export const LEAGUE_PARTICIPANT_LIMIT = 200;

export const LEAGUE_RULESET_VERSION = "consistency-v1";
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
});
