import {
  HOUSE_BALANCE_CALCULATION_VERSION,
  HOUSE_COMPOSITION_DISCLOSURE_MINIMUM,
  HOUSE_COMPOSITION_PROFILE_VERSION,
  HOUSE_COMPOSITION_VALUES,
  HOUSE_ROSTER_PLAYER_REST_WEEKS,
} from "../../constants/seasons";
import {
  addDays,
  getLocalDateKey,
  parseDateInputValue,
} from "../dateService";

/**
 * v0.24 checkpoints keep House-movement calculations as pure domain logic.
 * The v4 ruleset version is the frozen House Movement v1 contract; persistence is added only in later checkpoints.
 */
export function supportsHouseMovementV1(league) {
  // v0.24 keeps the security contract deliberately lean: the season ruleset
  // version itself freezes House Movement v1. No redundant nested policy map
  // is required inside the already-complex League document validator.
  return league?.rulesVersion === "season-houses-v4";
}

export function createHouseAssignmentHistoryId(sourceId, userId) {
  return `${sourceId}_${userId}`;
}

export function getRosterRestWindow(weekKey) {
  const start = parseDateInputValue(weekKey);
  if (!start) {
    return {
      lockThroughWeekKey: "",
      eligibleWeekKey: "",
      eligibleAgainAt: null,
    };
  }

  const lockThrough = addDays(start, 7 * HOUSE_ROSTER_PLAYER_REST_WEEKS);
  const eligible = addDays(start, 7 * (HOUSE_ROSTER_PLAYER_REST_WEEKS + 1));

  return {
    lockThroughWeekKey: getLocalDateKey(lockThrough),
    eligibleWeekKey: getLocalDateKey(eligible),
    eligibleAgainAt: eligible,
  };
}

export function getRosterMoveEligibility({
  league,
  membership,
  house,
  weekKey,
  houseLocked = false,
} = {}) {
  if (!membership || membership.status !== "active") {
    return {
      eligible: false,
      code: "inactive-membership",
      label: "Not an active season member",
      detail: "Only active season members can take part in a roster move.",
    };
  }

  if (!membership.currentHouseId || membership.currentHouseId !== house?.id) {
    return {
      eligible: false,
      code: "house-mismatch",
      label: "Not in this House",
      detail: "The player no longer belongs to the selected House.",
    };
  }

  if (
    membership.userId === house?.captainId
      || (house?.viceCaptainIds ?? []).includes(membership.userId)
  ) {
    return {
      eligible: false,
      code: "current-house-leader",
      label: "Current House leader",
      detail: "Leadership must be reassigned before this player can move.",
    };
  }

  if (houseLocked) {
    return {
      eligible: false,
      code: "house-used-weekly-move",
      label: "House already used its weekly move",
      detail: "This House cannot take part in another roster move this week.",
    };
  }

  if (membership.lastRosterWeekKey && membership.lastRosterWeekKey === weekKey) {
    return {
      eligible: false,
      code: "moved-this-week",
      label: "Moved this week",
      detail: "The player has already changed Houses during the current week.",
    };
  }

  if (
    supportsHouseMovementV1(league)
      && membership.rosterLockThroughWeekKey
      && weekKey
      && weekKey <= membership.rosterLockThroughWeekKey
  ) {
    return {
      eligible: false,
      code: "post-move-rest",
      label: "Resting after last week’s move",
      detail: membership.rosterEligibleWeekKey
        ? `Eligible again in the week beginning ${membership.rosterEligibleWeekKey}.`
        : "The one-week post-move rest period is still active.",
      overrideable: true,
    };
  }

  return {
    eligible: true,
    code: "eligible",
    label: "Eligible to move",
    detail: "This player may take part in the current week’s balanced swap.",
    overrideable: false,
  };
}

export function normalizeCompositionValue(value) {
  return HOUSE_COMPOSITION_VALUES.includes(value) ? value : "";
}

export function createCompositionProfile({ leagueId, userId, value } = {}) {
  const normalizedValue = normalizeCompositionValue(value);
  if (!leagueId || !userId || !normalizedValue) {
    throw new Error("Choose one of the available private composition responses.");
  }
  return {
    leagueId,
    userId,
    value: normalizedValue,
    profileVersion: HOUSE_COMPOSITION_PROFILE_VERSION,
  };
}

const DISCLOSED_COMPOSITION_VALUES = Object.freeze(
  HOUSE_COMPOSITION_VALUES.filter((value) => value !== "prefer-not-to-say"),
);

function roundBalance(value, precision = 1) {
  const factor = 10 ** precision;
  return Math.round((Number(value) || 0) * factor) / factor;
}

function emptyCompositionCounts() {
  return Object.fromEntries(DISCLOSED_COMPOSITION_VALUES.map((value) => [value, 0]));
}

function compositionDistribution(counts, total) {
  if (!total) return emptyCompositionCounts();
  return Object.fromEntries(
    DISCLOSED_COMPOSITION_VALUES.map((value) => [
      value,
      roundBalance(((counts[value] ?? 0) / total) * 100),
    ]),
  );
}

function distributionDeviation(first = {}, second = {}) {
  const total = DISCLOSED_COMPOSITION_VALUES.reduce(
    (sum, value) => sum + Math.abs((first[value] ?? 0) - (second[value] ?? 0)),
    0,
  );
  return roundBalance(total / 2);
}

function buildPrivateHouseBalance({ house, members, profileMap, seasonDistribution }) {
  const counts = emptyCompositionCounts();
  let responseCount = 0;
  let preferNotToSayCount = 0;

  members.forEach((membership) => {
    const value = normalizeCompositionValue(profileMap.get(membership.userId)?.value);
    if (value) responseCount += 1;
    if (value === "prefer-not-to-say") preferNotToSayCount += 1;
    if (DISCLOSED_COMPOSITION_VALUES.includes(value)) counts[value] += 1;
  });

  const disclosedCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const distribution = compositionDistribution(counts, disclosedCount);

  return {
    houseId: house.id,
    houseName: house.name,
    houseEmblemId: house.emblemId,
    rosterSize: members.length,
    responseCount,
    disclosedCount,
    undisclosedCount: Math.max(0, members.length - disclosedCount),
    preferNotToSayCount,
    compositionCounts: counts,
    compositionDistribution: distribution,
    deviationPercentagePoints: disclosedCount > 0
      ? distributionDeviation(distribution, seasonDistribution)
      : null,
  };
}

function deriveHouseBalanceStatus({ rosterSizeDifference, visibleHouseCount, houseCount, maximumDeviation }) {
  if (houseCount === 0 || visibleHouseCount < houseCount) return "insufficient-data";
  if (rosterSizeDifference <= 1 && maximumDeviation <= 15) return "balanced";
  if (rosterSizeDifference <= 1 && maximumDeviation <= 25) return "review";
  return "attention";
}

export function buildHouseBalanceCalculation({
  league,
  houses = [],
  memberships = [],
  profiles = [],
  weekKey,
  minimumDisclosureCount = HOUSE_COMPOSITION_DISCLOSURE_MINIMUM,
} = {}) {
  if (!supportsHouseMovementV1(league)) {
    throw new Error("Weekly House balance calculations require a v4 season.");
  }
  if (!weekKey) throw new Error("A valid official season week is required.");

  const activeMembers = memberships.filter(
    (membership) => membership?.status === "active" && membership.currentHouseId,
  );
  const profileMap = new Map(
    profiles
      .filter((profile) => profile?.leagueId === league.id && profile?.userId)
      .map((profile) => [profile.userId, profile]),
  );
  const seasonCounts = emptyCompositionCounts();
  let seasonResponseCount = 0;
  let seasonPreferNotToSayCount = 0;

  activeMembers.forEach((membership) => {
    const value = normalizeCompositionValue(profileMap.get(membership.userId)?.value);
    if (value) seasonResponseCount += 1;
    if (value === "prefer-not-to-say") seasonPreferNotToSayCount += 1;
    if (DISCLOSED_COMPOSITION_VALUES.includes(value)) seasonCounts[value] += 1;
  });

  const seasonDisclosedCount = Object.values(seasonCounts).reduce((sum, count) => sum + count, 0);
  const seasonDistribution = compositionDistribution(seasonCounts, seasonDisclosedCount);
  const privateHouses = houses.map((house) => buildPrivateHouseBalance({
    house,
    members: activeMembers.filter((membership) => membership.currentHouseId === house.id),
    profileMap,
    seasonDistribution,
  }));
  const rosterSizes = privateHouses.map((house) => house.rosterSize);
  const rosterSizeDifference = rosterSizes.length
    ? Math.max(...rosterSizes) - Math.min(...rosterSizes)
    : 0;
  const seasonDistributionVisible = seasonDisclosedCount >= minimumDisclosureCount;
  const publicHouses = privateHouses.map((house) => {
    const compositionVisible = seasonDistributionVisible
      && house.disclosedCount >= minimumDisclosureCount;
    return {
      houseId: house.houseId,
      houseName: house.houseName,
      houseEmblemId: house.houseEmblemId,
      rosterSize: house.rosterSize,
      compositionVisible,
      compositionDistribution: compositionVisible ? house.compositionDistribution : {},
      deviationPercentagePoints: compositionVisible ? house.deviationPercentagePoints : null,
    };
  });
  const allHousesVisible = publicHouses.length > 0
    && publicHouses.every((house) => house.compositionVisible);
  const visibleDeviations = publicHouses
    .map((house) => house.deviationPercentagePoints)
    .filter((value) => Number.isFinite(value));
  const maximumDeviation = allHousesVisible && visibleDeviations.length
    ? Math.max(...visibleDeviations)
    : null;
  const averageDeviation = allHousesVisible && visibleDeviations.length
    ? roundBalance(visibleDeviations.reduce((sum, value) => sum + value, 0) / visibleDeviations.length)
    : null;
  const balanceStatus = deriveHouseBalanceStatus({
    rosterSizeDifference,
    visibleHouseCount: visibleDeviations.length,
    houseCount: houses.length,
    maximumDeviation: maximumDeviation ?? 0,
  });

  return {
    publicResult: {
      leagueId: league.id,
      weekKey,
      rulesVersion: league.rulesVersion,
      calculationVersion: HOUSE_BALANCE_CALCULATION_VERSION,
      scoringEnabled: false,
      minimumDisclosureCount,
      houseCount: houses.length,
      rosterSizeDifference,
      averageDeviationPercentagePoints: averageDeviation,
      maximumDeviationPercentagePoints: maximumDeviation,
      balanceStatus,
      seasonDistributionVisible,
      seasonCompositionDistribution: seasonDistributionVisible ? seasonDistribution : {},
      houses: publicHouses,
    },
    privateResult: {
      leagueId: league.id,
      weekKey,
      rulesVersion: league.rulesVersion,
      calculationVersion: HOUSE_BALANCE_CALCULATION_VERSION,
      profileVersion: HOUSE_COMPOSITION_PROFILE_VERSION,
      scoringEnabled: false,
      minimumDisclosureCount,
      houseCount: houses.length,
      activeMemberCount: activeMembers.length,
      responseCount: seasonResponseCount,
      disclosedCount: seasonDisclosedCount,
      undisclosedCount: Math.max(0, activeMembers.length - seasonDisclosedCount),
      preferNotToSayCount: seasonPreferNotToSayCount,
      rosterSizeDifference,
      averageDeviationPercentagePoints: averageDeviation,
      maximumDeviationPercentagePoints: maximumDeviation,
      balanceStatus,
      seasonCompositionCounts: seasonCounts,
      seasonCompositionDistribution: seasonDistribution,
      houses: privateHouses,
    },
  };
}

export function getBalanceStatusCopy(status) {
  return {
    balanced: {
      label: "Balanced",
      detail: "House sizes and disclosed composition are within the weekly review thresholds.",
    },
    review: {
      label: "Review suggested",
      detail: "House sizes are close, but disclosed composition differs enough to deserve an administrator review.",
    },
    attention: {
      label: "Balancing attention needed",
      detail: "House size or disclosed composition differs materially from the active season distribution.",
    },
    "insufficient-data": {
      label: "More private responses needed",
      detail: "Small disclosed groups are suppressed, so no complete weekly balance judgement is published yet.",
    },
  }[status] ?? {
    label: "Balance unavailable",
    detail: "A weekly balance result has not been calculated.",
  };
}

