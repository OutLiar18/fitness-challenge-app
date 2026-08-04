import {
  DEFAULT_SEASON_EVIDENCE_POLICY,
  EVIDENCE_BONUS_CATEGORIES,
  EVIDENCE_CATEGORIES,
  EVIDENCE_POLICY_VERSION,
  EVIDENCE_REQUIRED_CATEGORIES,
  EVIDENCE_STATUS,
} from "../../constants/evidence";
import { getLocalDateKey, toDate } from "../dateService";
import { getEntryPointBreakdown } from "../points";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CATEGORY_PREFIX = Object.freeze({
  running: "RUN",
  steps: "STEP",
  water: "WATER",
  fruit: "FRUIT",
});

function clonePolicy(policy = DEFAULT_SEASON_EVIDENCE_POLICY) {
  return {
    ...DEFAULT_SEASON_EVIDENCE_POLICY,
    ...policy,
    running: {
      ...DEFAULT_SEASON_EVIDENCE_POLICY.running,
      ...(policy?.running ?? {}),
    },
    steps: {
      ...DEFAULT_SEASON_EVIDENCE_POLICY.steps,
      ...(policy?.steps ?? {}),
    },
    waterBonus: {
      ...DEFAULT_SEASON_EVIDENCE_POLICY.waterBonus,
      ...(policy?.waterBonus ?? {}),
    },
    fruitBonus: {
      ...DEFAULT_SEASON_EVIDENCE_POLICY.fruitBonus,
      ...(policy?.fruitBonus ?? {}),
    },
    leaderboardPublication: {
      ...DEFAULT_SEASON_EVIDENCE_POLICY.leaderboardPublication,
      ...(policy?.leaderboardPublication ?? {}),
    },
  };
}

function cleanInteger(value, fallback, minimum, maximum) {
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum
    ? number
    : fallback;
}

export function normalizeEvidencePolicy(input = {}) {
  const policy = clonePolicy(input);
  return {
    version: EVIDENCE_POLICY_VERSION,
    timezone: "Africa/Johannesburg",
    proofDeadlineHours: cleanInteger(policy.proofDeadlineHours, 24, 1, 168),
    fruitDailyServingCap: cleanInteger(policy.fruitDailyServingCap, 5, 1, 20),
    running: {
      proofRequired: policy.running.proofRequired !== false,
      requiredFields: ["activityDate", "distance", "duration"],
      calculatePaceAutomatically: true,
    },
    steps: {
      proofRequired: policy.steps.proofRequired !== false,
      requiredFields: ["activityDate", "totalSteps", "recognisableAppOrDevice"],
    },
    waterBonus: {
      enabled: policy.waterBonus.enabled !== false,
      thresholdMillilitres: cleanInteger(
        policy.waterBonus.thresholdMillilitres,
        750,
        250,
        10000,
      ),
      points: cleanInteger(policy.waterBonus.points, 3, 0, 100),
      maximumAwardsPerDay: 1,
    },
    fruitBonus: {
      enabled: policy.fruitBonus.enabled !== false,
      thresholdServings: cleanInteger(
        policy.fruitBonus.thresholdServings,
        3,
        1,
        20,
      ),
      points: cleanInteger(policy.fruitBonus.points, 3, 0, 100),
      maximumAwardsPerDay: 1,
    },
    leaderboardPublication: {
      timezone: "Africa/Johannesburg",
      automaticTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(
        policy.leaderboardPublication.automaticTime,
      )
        ? policy.leaderboardPublication.automaticTime
        : "10:00",
      manualPublicationAllowed: true,
      correctedReplacementAllowed: true,
      automaticFallbackMode: "administrator-session",
    },
  };
}

export function validateEvidencePolicy(input = {}) {
  const value = normalizeEvidencePolicy(input);
  const errors = [];
  if (input.confirmed !== true) {
    errors.push("Confirm the season evidence and leaderboard publication rules.");
  }
  return { valid: errors.length === 0, errors, value };
}

function hashSeed(value) {
  let hash = 2166136261;
  const text = String(value ?? "");
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createEvidenceVerificationCode(category, seed) {
  const prefix = CATEGORY_PREFIX[category] ?? "PROOF";
  let value = hashSeed(`${category}:${seed}`);
  let body = "";
  for (let index = 0; index < 6; index += 1) {
    body += CODE_ALPHABET[value % CODE_ALPHABET.length];
    value = Math.floor(value / CODE_ALPHABET.length) || hashSeed(`${seed}:${index}`);
  }
  return `${prefix}-${body}`;
}

export function createEvidenceClaimIdentity({
  leagueId,
  userId,
  category,
  entryId,
  challengeDate,
}) {
  const dateKey = getLocalDateKey(challengeDate);
  if (!leagueId || !userId || !EVIDENCE_CATEGORIES.includes(category) || !dateKey) {
    return null;
  }
  const daily = EVIDENCE_BONUS_CATEGORIES.includes(category);
  const id = daily
    ? `${leagueId}_${userId}_${dateKey}_${category}`
    : `${leagueId}_${entryId}`;
  return {
    id,
    dateKey,
    claimType: daily ? "daily-bonus" : "required-proof",
    verificationCode: createEvidenceVerificationCode(category, id),
  };
}

export function getEvidenceRequirement(policyInput, category) {
  const policy = normalizeEvidencePolicy(policyInput);
  if (category === "running") {
    return policy.running.proofRequired
      ? { type: "required-proof", enabled: true }
      : { type: "none", enabled: false };
  }
  if (category === "steps") {
    return policy.steps.proofRequired
      ? { type: "required-proof", enabled: true }
      : { type: "none", enabled: false };
  }
  if (category === "water") {
    return policy.waterBonus.enabled
      ? {
          type: "daily-bonus",
          enabled: true,
          threshold: policy.waterBonus.thresholdMillilitres,
          bonusPoints: policy.waterBonus.points,
        }
      : { type: "none", enabled: false };
  }
  if (category === "fruit") {
    return policy.fruitBonus.enabled
      ? {
          type: "daily-bonus",
          enabled: true,
          threshold: policy.fruitBonus.thresholdServings,
          bonusPoints: policy.fruitBonus.points,
        }
      : { type: "none", enabled: false };
  }
  return { type: "none", enabled: false };
}

export function allocateEntryPointsForEvidence(entry, policyInput) {
  const policy = normalizeEvidencePolicy(policyInput);
  const result = getEntryPointBreakdown(entry);
  const requirement = getEvidenceRequirement(policy, entry?.category);
  const main = result.breakdown.find((item) => item.type === "main")?.points ?? 0;
  const bonus = result.breakdown
    .filter((item) => item.type === "bonus")
    .reduce((total, item) => total + Number(item.points ?? 0), 0);

  if (entry?.category === "running" && requirement.enabled) {
    if (main > 0) {
      return {
        immediatePoints: bonus,
        pendingPoints: main,
        claimRequired: true,
        claimType: "required-proof",
      };
    }
    return {
      immediatePoints: result.total,
      pendingPoints: 0,
      claimRequired: false,
      claimType: "none",
    };
  }

  if (entry?.category === "steps" && requirement.enabled && result.total > 0) {
    return {
      immediatePoints: 0,
      pendingPoints: result.total,
      claimRequired: true,
      claimType: "required-proof",
    };
  }

  return {
    immediatePoints: result.total,
    pendingPoints: 0,
    claimRequired: requirement.enabled,
    claimType: requirement.type,
    bonusPointsAvailable: requirement.bonusPoints ?? 0,
  };
}

export function getEvidenceDisplayStatus(claim, referenceDate = new Date()) {
  if (!claim) return null;
  if (claim.status === EVIDENCE_STATUS.VERIFIED) {
    return { id: "verified", label: "Proof accepted", tone: "success" };
  }
  if (claim.status === EVIDENCE_STATUS.REJECTED) {
    return { id: "rejected", label: "Proof rejected", tone: "danger" };
  }
  if (claim.status === EVIDENCE_STATUS.REVERSED) {
    return { id: "reversed", label: "Previous proof decision reversed", tone: "warning" };
  }
  if (claim.status === EVIDENCE_STATUS.SUPERSEDED) {
    return { id: "superseded", label: "Replaced by a corrected entry", tone: "neutral" };
  }

  const deadline = toDate(claim.deadlineAt);
  const reference = toDate(referenceDate) ?? new Date();
  if (deadline && reference > deadline) {
    return {
      id: "expired",
      label: "Proof not submitted within the time limit",
      tone: "danger",
    };
  }

  return { id: "pending", label: "Awaiting WhatsApp proof", tone: "warning" };
}

export function canReviewEvidenceCategory({
  category,
  userId,
  isPlatformAdmin = false,
  reviewerAssignments = [],
}) {
  if (isPlatformAdmin) return true;
  return reviewerAssignments.some(
    (assignment) =>
      assignment.userId === userId &&
      assignment.status !== "inactive" &&
      assignment.categories?.includes(category),
  );
}

export function isLateEvidenceSubmission(claim, submittedAt) {
  const deadline = toDate(claim?.deadlineAt);
  const submitted = toDate(submittedAt);
  return Boolean(deadline && submitted && submitted > deadline);
}

export function validateEvidenceDecision({
  claim,
  action,
  submittedAt,
  verifiedQuantity,
  reason,
  isPlatformAdmin = false,
  policy: policyInput,
}) {
  const policy = normalizeEvidencePolicy(policyInput);
  const errors = [];
  const submitted = toDate(submittedAt);
  const cleanReason = String(reason ?? "").trim().replace(/\s+/g, " ").slice(0, 500);

  if (!claim?.id) errors.push("Choose a valid evidence claim.");
  if (!["verify", "reject", "reverse"].includes(action)) {
    errors.push("Choose a valid evidence decision.");
  }
  if (action === "verify" && !submitted) {
    errors.push("Record the WhatsApp proof submission time.");
  }
  if (action === "reject" && cleanReason.length < 4) {
    errors.push("Explain why the proof was rejected.");
  }
  if (action === "reverse" && cleanReason.length < 6) {
    errors.push("Explain why the earlier decision is being reversed.");
  }

  const late = action === "verify" && isLateEvidenceSubmission(claim, submitted);
  if (late && !isPlatformAdmin) {
    errors.push("Only a Platform Administrator may accept late proof.");
  }
  if (late && cleanReason.length < 6) {
    errors.push("Late-proof exceptions require an audit reason.");
  }

  let quantity = Number(verifiedQuantity ?? 0);
  if (claim?.category === "water" && action === "verify") {
    if (!Number.isFinite(quantity) || quantity < policy.waterBonus.thresholdMillilitres) {
      errors.push(`Confirm at least ${policy.waterBonus.thresholdMillilitres} millilitres of photographed water.`);
    }
  } else if (claim?.category === "fruit" && action === "verify") {
    if (!Number.isFinite(quantity) || quantity < policy.fruitBonus.thresholdServings) {
      errors.push(`Confirm at least ${policy.fruitBonus.thresholdServings} photographed fruit servings.`);
    }
  } else {
    quantity = 0;
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      submittedAt: submitted,
      verifiedQuantity: quantity,
      reason: cleanReason,
      late,
    },
  };
}

export function getEvidenceClaimSortValue(claim) {
  const status = getEvidenceDisplayStatus(claim)?.id;
  const priority = { pending: 0, expired: 1, rejected: 2, verified: 3, reversed: 4, superseded: 5 }[status] ?? 6;
  const deadline = toDate(claim?.deadlineAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return priority * 10 ** 15 + deadline;
}

export function getEvidenceClaimSummary(claim) {
  if (!claim) return "Evidence claim";
  if (claim.category === "running") {
    return `${claim.displayName || "Player"} · Running · ${claim.verificationCode}`;
  }
  if (claim.category === "steps") {
    return `${claim.displayName || "Player"} · Steps · ${claim.verificationCode}`;
  }
  const quantityLabel = claim.category === "water" ? "750 ml daily photo target" : "3 daily fruit servings";
  return `${claim.displayName || "Player"} · ${quantityLabel} · ${claim.verificationCode}`;
}

export function isEvidenceCategory(category) {
  return EVIDENCE_CATEGORIES.includes(category);
}

export function isRequiredEvidenceCategory(category) {
  return EVIDENCE_REQUIRED_CATEGORIES.includes(category);
}

export function getTimeZoneDateKey(value = new Date(), timeZone = "Africa/Johannesburg") {
  const date = toDate(value) ?? new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getTimeZoneMinutes(value = new Date(), timeZone = "Africa/Johannesburg") {
  const date = toDate(value) ?? new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

export function isLeaderboardPublicationDue({
  policy: policyInput,
  lastPublishedAt,
  referenceDate = new Date(),
}) {
  const policy = normalizeEvidencePolicy(policyInput);
  const timeZone = policy.leaderboardPublication.timezone;
  const [hour, minute] = policy.leaderboardPublication.automaticTime
    .split(":")
    .map(Number);
  const dueMinutes = hour * 60 + minute;
  const referenceKey = getTimeZoneDateKey(referenceDate, timeZone);
  const lastKey = lastPublishedAt
    ? getTimeZoneDateKey(lastPublishedAt, timeZone)
    : "";
  return getTimeZoneMinutes(referenceDate, timeZone) >= dueMinutes && lastKey !== referenceKey;
}
