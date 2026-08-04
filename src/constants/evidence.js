export const EVIDENCE_POLICY_VERSION = "whatsapp-proof-v1";

export const EVIDENCE_CATEGORIES = Object.freeze([
  "water",
  "fruit",
  "running",
  "steps",
]);

export const EVIDENCE_REQUIRED_CATEGORIES = Object.freeze([
  "running",
  "steps",
]);

export const EVIDENCE_BONUS_CATEGORIES = Object.freeze([
  "water",
  "fruit",
]);

export const EVIDENCE_STATUS = Object.freeze({
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  REVERSED: "reversed",
  SUPERSEDED: "superseded",
});

export const EVIDENCE_DECISION_TYPES = Object.freeze({
  VERIFY: "verify",
  REJECT: "reject",
  REVERSE: "reverse",
  LATE_VERIFY: "late-verify",
});

export const DEFAULT_SEASON_EVIDENCE_POLICY = Object.freeze({
  version: EVIDENCE_POLICY_VERSION,
  timezone: "Africa/Johannesburg",
  proofDeadlineHours: 24,
  fruitDailyServingCap: 5,
  running: Object.freeze({
    proofRequired: true,
    requiredFields: Object.freeze(["activityDate", "distance", "duration"]),
    calculatePaceAutomatically: true,
  }),
  steps: Object.freeze({
    proofRequired: true,
    requiredFields: Object.freeze(["activityDate", "totalSteps", "recognisableAppOrDevice"]),
  }),
  waterBonus: Object.freeze({
    enabled: true,
    thresholdMillilitres: 750,
    points: 3,
    maximumAwardsPerDay: 1,
  }),
  fruitBonus: Object.freeze({
    enabled: true,
    thresholdServings: 3,
    points: 3,
    maximumAwardsPerDay: 1,
  }),
  leaderboardPublication: Object.freeze({
    timezone: "Africa/Johannesburg",
    automaticTime: "10:00",
    manualPublicationAllowed: true,
    correctedReplacementAllowed: true,
    automaticFallbackMode: "administrator-session",
  }),
});

export const EVIDENCE_REVIEW_CATEGORY_OPTIONS = Object.freeze([
  { id: "running", label: "Running proof" },
  { id: "steps", label: "Steps proof" },
  { id: "water", label: "Water photo bonus" },
  { id: "fruit", label: "Fruit photo bonus" },
]);
