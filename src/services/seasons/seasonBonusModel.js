export const SEASON_BONUS_POINT_LIMIT = 10000;
export const SEASON_BONUS_REASON_MIN_LENGTH = 6;
export const SEASON_BONUS_REASON_MAX_LENGTH = 300;

export const SEASON_BONUS_REQUEST_STATUSES = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const SEASON_BONUS_AWARD_KINDS = Object.freeze({
  BONUS: "bonus",
  CORRECTION: "correction",
});

export const SEASON_BONUS_AWARD_SOURCES = Object.freeze({
  PLATFORM_DIRECT: "platform-direct",
  LEAGUE_ADMIN_REQUEST: "league-admin-request",
  PLATFORM_CORRECTION: "platform-correction",
});

export const SEASON_BONUS_AUDIT_ACTIONS = Object.freeze({
  REQUESTED: "season-bonus.requested",
  REQUEST_APPROVED: "season-bonus.request-approved",
  REQUEST_REJECTED: "season-bonus.request-rejected",
  DIRECT_AWARDED: "season-bonus.direct-awarded",
  CORRECTED: "season-bonus.corrected",
});

export function normalizeSeasonBonusReason(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, SEASON_BONUS_REASON_MAX_LENGTH);
}

export function normalizeSeasonBonusPoints(value, { allowNegative = false } = {}) {
  const points = Number(value);
  if (!Number.isInteger(points)) return null;
  if (allowNegative) {
    return points !== 0 && Math.abs(points) <= SEASON_BONUS_POINT_LIMIT ? points : null;
  }
  return points >= 1 && points <= SEASON_BONUS_POINT_LIMIT ? points : null;
}

export function validateSeasonBonusInput({ points, reason, allowNegative = false } = {}) {
  const normalizedPoints = normalizeSeasonBonusPoints(points, { allowNegative });
  const normalizedReason = normalizeSeasonBonusReason(reason);
  const errors = [];
  if (normalizedPoints === null) {
    errors.push(
      allowNegative
        ? `Use a whole-number adjustment from -${SEASON_BONUS_POINT_LIMIT} to ${SEASON_BONUS_POINT_LIMIT}, excluding zero.`
        : `Use a whole-number bonus from 1 to ${SEASON_BONUS_POINT_LIMIT}.`,
    );
  }
  if (normalizedReason.length < SEASON_BONUS_REASON_MIN_LENGTH) {
    errors.push(`Give a factual reason of at least ${SEASON_BONUS_REASON_MIN_LENGTH} characters.`);
  }
  return {
    valid: errors.length === 0,
    errors,
    value: {
      points: normalizedPoints,
      reason: normalizedReason,
    },
  };
}

export function getSeasonBonusMemberIdentity(member = {}) {
  return {
    userId: member.userId || "",
    displayName: member.displayName || "Champion",
    avatarId: member.avatarId || "legacy-trophy",
    houseId: member.currentHouseId || member.houseId || member.teamId || "",
    houseName: member.currentHouseName || member.houseName || member.teamName || "Unassigned",
    houseEmblemId: member.currentHouseEmblemId || member.houseEmblemId || "springbok",
  };
}

export function createSeasonBonusAwardDraft({
  league,
  member,
  points,
  reason,
  source,
  requestId = "",
  requestedBy = "",
} = {}) {
  const validation = validateSeasonBonusInput({ points, reason });
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  if (!league?.id || league.status !== "active") {
    throw new Error("Bonus points can be awarded only during an active league season.");
  }
  const identity = getSeasonBonusMemberIdentity(member);
  if (!identity.userId || !identity.houseId || member?.status !== "active") {
    throw new Error("Choose an active season player who is currently assigned to a House.");
  }
  return {
    ...identity,
    leagueId: league.id,
    points: validation.value.points,
    reason: validation.value.reason,
    kind: SEASON_BONUS_AWARD_KINDS.BONUS,
    source,
    requestId,
    requestedBy,
    correctsAwardId: "",
    rulesVersion: league.rulesVersion || "",
  };
}

export function createSeasonBonusCorrectionDraft({ originalAward, points, reason } = {}) {
  const validation = validateSeasonBonusInput({ points, reason, allowNegative: true });
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  if (!originalAward?.id || !originalAward?.leagueId || !originalAward?.userId || !originalAward?.houseId) {
    throw new Error("Choose a valid historical bonus award to correct.");
  }
  return {
    leagueId: originalAward.leagueId,
    userId: originalAward.userId,
    displayName: originalAward.displayName || "Champion",
    avatarId: originalAward.avatarId || "legacy-trophy",
    houseId: originalAward.houseId,
    houseName: originalAward.houseName || "House",
    houseEmblemId: originalAward.houseEmblemId || "springbok",
    points: validation.value.points,
    reason: validation.value.reason,
    kind: SEASON_BONUS_AWARD_KINDS.CORRECTION,
    source: SEASON_BONUS_AWARD_SOURCES.PLATFORM_CORRECTION,
    requestId: "",
    requestedBy: "",
    correctsAwardId: originalAward.id,
    rulesVersion: originalAward.rulesVersion || "",
    challengeDate: originalAward.challengeDate ?? null,
  };
}
