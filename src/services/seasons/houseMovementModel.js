import {
  HOUSE_BALANCE_CALCULATION_VERSION,
  HOUSE_COMPOSITION_DISCLOSURE_MINIMUM,
  HOUSE_COMPOSITION_PROFILE_VERSION,
  HOUSE_COMPOSITION_VALUES,
  HOUSE_MOVEMENT_POLICY_VERSION,
} from "../../constants/seasons";
import {
  addDays,
  getLocalDateKey,
  parseDateInputValue,
} from "../dateService";

const DISCLOSED_COMPOSITION_VALUES = Object.freeze(
  HOUSE_COMPOSITION_VALUES.filter((value) => value !== "prefer-not-to-say"),
);

function round(value, precision = 1) {
  const factor = 10 ** precision;
  return Math.round((Number(value) || 0) * factor) / factor;
}

function emptyCounts() {
  return Object.fromEntries(DISCLOSED_COMPOSITION_VALUES.map((value) => [value, 0]));
}

function toDistribution(counts, total) {
  if (!total) return emptyCounts();
  return Object.fromEntries(
    DISCLOSED_COMPOSITION_VALUES.map((value) => [
      value,
      round(((counts[value] ?? 0) / total) * 100),
    ]),
  );
}

function totalVariationDistance(first = {}, second = {}) {
  const total = DISCLOSED_COMPOSITION_VALUES.reduce(
    (sum, value) => sum + Math.abs((first[value] ?? 0) - (second[value] ?? 0)),
    0,
  );
  return round(total / 2);
}

export function supportsHouseMovementV1(league) {
  return Boolean(
    league?.rulesVersion === "season-houses-v4"
    && league?.ruleset?.houseMovementPolicy?.version === HOUSE_MOVEMENT_POLICY_VERSION,
  );
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
  const lockThrough = addDays(start, 7);
  const eligible = addDays(start, 14);
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

export function createCompositionProfile({ leagueId, userId, value }) {
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

function buildExactHouseSummary({ house, members, profileMap, seasonDistribution }) {
  const counts = emptyCounts();
  let responseCount = 0;
  let preferNotToSayCount = 0;
  const rosterSnapshot = members.map((membership) => {
    const value = normalizeCompositionValue(profileMap.get(membership.userId)?.value);
    if (value) responseCount += 1;
    if (value === "prefer-not-to-say") preferNotToSayCount += 1;
    if (DISCLOSED_COMPOSITION_VALUES.includes(value)) counts[value] += 1;
    return {
      userId: membership.userId,
      displayName: membership.displayName || "Champion",
      houseId: house.id,
      houseName: house.name,
      compositionValue: value,
    };
  });
  const disclosedCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const undisclosedCount = Math.max(0, members.length - disclosedCount);
  const distribution = toDistribution(counts, disclosedCount);
  const deviation = disclosedCount > 0
    ? totalVariationDistance(distribution, seasonDistribution)
    : null;
  return {
    houseId: house.id,
    houseName: house.name,
    houseEmblemId: house.emblemId,
    rosterSize: members.length,
    responseCount,
    disclosedCount,
    undisclosedCount,
    preferNotToSayCount,
    compositionCounts: counts,
    compositionDistribution: distribution,
    deviationPercentagePoints: deviation,
    rosterSnapshot,
  };
}

function deriveBalanceStatus({ rosterSizeDifference, visibleHouseCount, houseCount, maximumDeviation }) {
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
  const seasonCounts = emptyCounts();
  let seasonResponseCount = 0;
  let seasonPreferNotToSayCount = 0;

  activeMembers.forEach((membership) => {
    const value = normalizeCompositionValue(profileMap.get(membership.userId)?.value);
    if (value) seasonResponseCount += 1;
    if (value === "prefer-not-to-say") seasonPreferNotToSayCount += 1;
    if (DISCLOSED_COMPOSITION_VALUES.includes(value)) seasonCounts[value] += 1;
  });

  const seasonDisclosedCount = Object.values(seasonCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const seasonUndisclosedCount = Math.max(0, activeMembers.length - seasonDisclosedCount);
  const seasonDistribution = toDistribution(seasonCounts, seasonDisclosedCount);
  const exactHouses = houses.map((house) => buildExactHouseSummary({
    house,
    members: activeMembers.filter((membership) => membership.currentHouseId === house.id),
    profileMap,
    seasonDistribution,
  }));
  const rosterSizes = exactHouses.map((house) => house.rosterSize);
  const rosterSizeDifference = rosterSizes.length
    ? Math.max(...rosterSizes) - Math.min(...rosterSizes)
    : 0;
  const seasonDistributionVisible = seasonDisclosedCount >= minimumDisclosureCount;
  const publicHouses = exactHouses.map((house) => {
    const compositionVisible = seasonDistributionVisible
      && house.disclosedCount >= minimumDisclosureCount;
    return {
      houseId: house.houseId,
      houseName: house.houseName,
      houseEmblemId: house.houseEmblemId,
      rosterSize: house.rosterSize,
      responseCount: house.responseCount,
      disclosedCount: house.disclosedCount,
      undisclosedCount: house.undisclosedCount,
      compositionVisible,
      compositionDistribution: compositionVisible ? house.compositionDistribution : {},
      deviationPercentagePoints: compositionVisible
        ? house.deviationPercentagePoints
        : null,
    };
  });
  const visibleDeviations = publicHouses
    .map((house) => house.deviationPercentagePoints)
    .filter((value) => Number.isFinite(value));
  const maximumDeviation = visibleDeviations.length ? Math.max(...visibleDeviations) : 0;
  const averageDeviation = visibleDeviations.length
    ? round(visibleDeviations.reduce((sum, value) => sum + value, 0) / visibleDeviations.length)
    : null;
  const balanceStatus = deriveBalanceStatus({
    rosterSizeDifference,
    visibleHouseCount: visibleDeviations.length,
    houseCount: houses.length,
    maximumDeviation,
  });

  const common = {
    leagueId: league.id,
    leagueName: league.name,
    weekKey,
    rulesVersion: league.rulesVersion,
    calculationVersion: HOUSE_BALANCE_CALCULATION_VERSION,
    profileVersion: HOUSE_COMPOSITION_PROFILE_VERSION,
    scoringEnabled: false,
    minimumDisclosureCount,
    activeMemberCount: activeMembers.length,
    responseCount: seasonResponseCount,
    disclosedCount: seasonDisclosedCount,
    undisclosedCount: seasonUndisclosedCount,
    preferNotToSayCount: seasonPreferNotToSayCount,
    rosterSizeDifference,
    averageDeviationPercentagePoints: averageDeviation,
    maximumDeviationPercentagePoints: visibleDeviations.length ? maximumDeviation : null,
    balanceStatus,
  };

  return {
    publicResult: {
      ...common,
      seasonDistributionVisible,
      seasonCompositionDistribution: seasonDistributionVisible ? seasonDistribution : {},
      houses: publicHouses,
    },
    privateResult: {
      ...common,
      seasonCompositionCounts: seasonCounts,
      seasonCompositionDistribution: seasonDistribution,
      houses: exactHouses.map((house) => Object.fromEntries(
        Object.entries(house).filter(([key]) => key !== "rosterSnapshot"),
      )),
      rosterSnapshot: exactHouses.flatMap((house) => house.rosterSnapshot),
    },
  };
}

export function getBalanceStatusCopy(status) {
  return {
    balanced: {
      label: "Balanced",
      detail: "House sizes and disclosed composition are within the current review thresholds.",
    },
    review: {
      label: "Review suggested",
      detail: "Roster sizes are close, but composition differs enough to deserve an administrator review.",
    },
    attention: {
      label: "Balancing attention needed",
      detail: "House size or composition differs materially from the active season distribution.",
    },
    "insufficient-data": {
      label: "More private responses needed",
      detail: "The calculation protects small groups and does not expose composition detail yet.",
    },
  }[status] ?? {
    label: "Balance unavailable",
    detail: "A weekly balance result has not been calculated.",
  };
}
