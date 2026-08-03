import {
  DEFAULT_HOUSE_ACCENT_ID,
  DEFAULT_HOUSE_EMBLEM_ID,
  HOUSE_ACCENTS,
  HOUSE_EMBLEMS,
  LEADERSHIP_ELECTION_DURATION_HOURS,
  POCKET_CATEGORY_CONFIG,
  POCKET_WINDOW_DAYS,
  SEASON_HOUSE_LIMITS,
} from "../../constants/seasons";
import {
  addDays,
  getLocalDateKey,
  getWeekEnd,
  getWeekStart,
  normalizeChallengeDate,
  toDate,
} from "../dateService";

function cleanText(value, maximumLength = 160) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maximumLength);
}

const INVITATION_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createSeasonInviteCode(random = Math.random) {
  return Array.from({ length: 8 }, () => {
    const index = Math.floor(random() * INVITATION_ALPHABET.length);
    return INVITATION_ALPHABET[Math.max(0, Math.min(index, INVITATION_ALPHABET.length - 1))];
  }).join("");
}

export function normalizeSeasonCode(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[01OI]/g, "")
    .slice(0, 8);
}

function stableStringHash(value) {
  let hash = 2166136261;
  String(value ?? "").split("").forEach((character) => {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = stableStringHash(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function getSeasonWeekKey(value = new Date()) {
  return getLocalDateKey(getWeekStart(value));
}

export function getSeasonWeekWindow(value = new Date()) {
  return {
    weekKey: getSeasonWeekKey(value),
    startDate: getWeekStart(value),
    endDate: getWeekEnd(value),
  };
}

export function getPocketWindow(startDate) {
  const normalizedStart = normalizeChallengeDate(startDate);
  return {
    startDate: normalizedStart ? addDays(normalizedStart, -POCKET_WINDOW_DAYS) : null,
    endDate: normalizedStart ? addDays(normalizedStart, -1) : null,
  };
}

export function isDateWithinWindow(value, startValue, endValue) {
  const date = normalizeChallengeDate(value);
  const start = normalizeChallengeDate(startValue);
  const end = normalizeChallengeDate(endValue);
  return Boolean(date && start && end && date >= start && date <= end);
}

export function getSeasonPhase(league, referenceDate = new Date()) {
  const reference = normalizeChallengeDate(referenceDate);
  const start = normalizeChallengeDate(league?.startDate);
  const end = normalizeChallengeDate(league?.endDate);
  const pocketStart = normalizeChallengeDate(league?.pocketStartDate);
  const pocketEnd = normalizeChallengeDate(league?.pocketEndDate);

  if (!reference || !start || !end) {
    return league?.status ?? "draft";
  }
  if (league?.status === "archived") return "archived";
  if (reference > end || league?.status === "completed") return "completed";
  if (league?.pocketEnabled && pocketStart && pocketEnd && reference >= pocketStart && reference <= pocketEnd) return "pocket";
  if (reference >= start && reference <= end && league?.status === "active") return "active";
  return league?.status ?? "draft";
}

export function validateHouseInput(input = {}) {
  const emblemId = HOUSE_EMBLEMS.some((item) => item.id === input.emblemId)
    ? input.emblemId
    : DEFAULT_HOUSE_EMBLEM_ID;
  const accentId = HOUSE_ACCENTS.some((item) => item.id === input.accentId)
    ? input.accentId
    : DEFAULT_HOUSE_ACCENT_ID;
  const value = {
    name: cleanText(input.name, 48),
    description: cleanText(input.description, 220),
    motto: cleanText(input.motto, 90),
    emblemId,
    accentId,
  };
  const errors = [];
  if (value.name.length < 3) errors.push("House name must contain at least 3 characters.");
  if (value.description.length < 10) errors.push("Describe what this House represents.");
  if (value.motto.length < 3) errors.push("Add a short House motto.");
  return { valid: errors.length === 0, errors, value };
}

export function validateSeasonHouseCount(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= SEASON_HOUSE_LIMITS.minimum && number <= SEASON_HOUSE_LIMITS.maximum;
}

export function distributePlayersWithChaos(members = [], houses = [], seed = "champions-legacy") {
  if (houses.length < SEASON_HOUSE_LIMITS.minimum) {
    throw new Error("Create at least two Houses before activating C.H.A.O.S.");
  }
  if (members.length < houses.length * 2) {
    throw new Error(
      "C.H.A.O.S. requires at least two registered players for every House so each House can appoint a captain and vice-captain.",
    );
  }

  const random = seededRandom(seed);
  const shuffledMembers = [...members]
    .map((member) => ({ member, order: random() }))
    .sort((first, second) => first.order - second.order)
    .map(({ member }) => member);
  const shuffledHouses = [...houses]
    .map((house) => ({ house, order: random() }))
    .sort((first, second) => first.order - second.order)
    .map(({ house }) => house);

  return shuffledMembers.map((member, index) => {
    const house = shuffledHouses[index % shuffledHouses.length];
    return {
      userId: member.userId,
      membershipId: member.id,
      houseId: house.id,
      houseName: house.name,
      houseEmblemId: house.emblemId,
      houseAccentId: house.accentId,
    };
  });
}

export function calculateHouseBalance(assignments = []) {
  const counts = new Map();
  assignments.forEach((assignment) => {
    counts.set(assignment.houseId, (counts.get(assignment.houseId) ?? 0) + 1);
  });
  const values = [...counts.values()];
  return values.length === 0 ? { minimum: 0, maximum: 0, difference: 0 } : {
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    difference: Math.max(...values) - Math.min(...values),
  };
}

export function createElectionId(leagueId, houseId, weekKey) {
  return `${leagueId}_${houseId}_${weekKey}`;
}

export function createVoteId(electionId, userId) {
  return `${electionId}_${userId}`;
}

export function getElectionWindow(openedAt) {
  const start = toDate(openedAt) ?? new Date();
  const end = new Date(start.getTime() + LEADERSHIP_ELECTION_DURATION_HOURS * 60 * 60 * 1000);
  return { openedAt: start, closesAt: end };
}

export function calculateLeadershipResult(votes = [], candidates = []) {
  const candidateMap = new Map(candidates.map((candidate) => [candidate.userId, candidate]));
  const counts = new Map();

  votes.forEach((vote) => {
    if (candidateMap.has(vote.candidateId)) {
      counts.set(vote.candidateId, (counts.get(vote.candidateId) ?? 0) + 1);
    }
  });

  const ranked = [...candidateMap.values()]
    .map((candidate) => ({ ...candidate, votes: counts.get(candidate.userId) ?? 0 }))
    .sort((first, second) => second.votes - first.votes || String(first.displayName).localeCompare(String(second.displayName)));
  const positive = ranked.filter((candidate) => candidate.votes > 0);

  if (positive.length === 0) {
    return { status: "no-votes", captainId: "", viceCaptainId: "", ranked };
  }

  const topVotes = positive[0].votes;
  const top = positive.filter((candidate) => candidate.votes === topVotes);
  if (top.length > 1) {
    return { status: "captain-tie", captainId: "", viceCaptainId: "", ranked };
  }

  const remaining = positive.filter((candidate) => candidate.userId !== top[0].userId);
  if (remaining.length === 0) {
    return { status: "vice-required", captainId: top[0].userId, viceCaptainId: "", ranked };
  }

  const secondVotes = remaining[0].votes;
  const second = remaining.filter((candidate) => candidate.votes === secondVotes);
  if (second.length > 1) {
    return { status: "vice-tie", captainId: top[0].userId, viceCaptainId: "", ranked };
  }

  return { status: "ready", captainId: top[0].userId, viceCaptainId: second[0].userId, ranked };
}

export function isHouseLeader(house, userId) {
  return Boolean(
    userId &&
      (house?.captainId === userId || house?.viceCaptainIds?.includes(userId)),
  );
}

export function createRosterSwapId(leagueId, houseIds = [], weekKey) {
  return `${leagueId}_${[...houseIds].sort().join("_")}_${weekKey}`;
}

export function getPocketCategoryConfig(category) {
  return POCKET_CATEGORY_CONFIG[category] ?? null;
}

export function getPocketQuantity(category, data = {}) {
  const config = getPocketCategoryConfig(category);
  if (!config) return 0;
  if (config.mode === "whole") return 1;
  const value = Number(data[config.field] ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function normalizePocketRedemptionQuantity(category, quantity) {
  const config = getPocketCategoryConfig(category);
  if (!config) {
    throw new Error("That category cannot be stored in Pocket Week.");
  }

  const requested = Number(quantity);
  if (!Number.isFinite(requested) || requested <= 0) {
    throw new Error("Choose a valid Pocket amount.");
  }

  if (config.mode === "whole") {
    if (requested !== 1) {
      throw new Error("This stored activity must be redeemed as a complete session.");
    }
    return 1;
  }

  if (["water", "fruit", "steps"].includes(category)) {
    if (!Number.isInteger(requested)) {
      throw new Error("Choose a whole-number Pocket amount for this category.");
    }
    return requested;
  }

  const totalSeconds = Math.round(requested * 60);
  if (totalSeconds < 1) {
    throw new Error("Choose at least one second of stored activity.");
  }
  return totalSeconds / 60;
}

function durationFromMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, Number(totalMinutes) || 0);
  const totalSeconds = Math.round(safeMinutes * 60);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    totalMinutes: totalSeconds / 60,
  };
}

export function createPocketRedemptionData(category, sourceData = {}, quantity) {
  const config = getPocketCategoryConfig(category);
  if (!config) throw new Error("That category cannot be stored in Pocket Week.");
  const requested = normalizePocketRedemptionQuantity(category, quantity);

  if (config.mode === "whole") {
    return { ...sourceData };
  }

  if (category === "water") return { amount: requested };
  if (category === "fruit") return { fruitType: sourceData.fruitType || "Pocket fruit", servings: requested };
  if (category === "steps") return { steps: requested };
  if (["reading", "skill", "cardio"].includes(category)) {
    const duration = durationFromMinutes(requested);
    if (category === "reading") {
      return {
        ...duration,
        title: sourceData.title || "Pocket Week reading",
        author: sourceData.author || "",
        totalPages: sourceData.totalPages ?? "",
        reflection: sourceData.reflection || "",
        completed: sourceData.completed ?? false,
      };
    }
    if (category === "skill") {
      return {
        ...duration,
        skill: sourceData.skill || "Pocket Week skill",
        source: sourceData.source || "library",
        suggestionStatus: "",
        skillDefinition: sourceData.skillDefinition ?? null,
      };
    }
    return {
      ...duration,
      activity: sourceData.activity || "Pocket Week cardio",
      source: sourceData.source || "library",
      suggestionStatus: "",
      activityDefinition: sourceData.activityDefinition,
      distance: "",
      notes: sourceData.notes || "",
    };
  }

  throw new Error("That Pocket activity could not be prepared for redemption.");
}

export function validatePocketRedemption({ pocket, quantity, targetDate, league }) {
  const errors = [];
  const available = Number(pocket?.remainingQuantity ?? 0);
  let requested = 0;
  try {
    requested = normalizePocketRedemptionQuantity(pocket?.category, quantity);
  } catch (error) {
    errors.push(error.message);
  }
  const target = normalizeChallengeDate(targetDate);
  const today = normalizeChallengeDate(new Date());
  const start = normalizeChallengeDate(league?.startDate);
  const end = normalizeChallengeDate(league?.endDate);

  if (!pocket || pocket.status === "empty" || available <= 0) errors.push("This Pocket activity is empty.");
  if (requested > available) errors.push("Choose an amount that is still available.");
  if (!target || !today || target > today) errors.push("Pocket activities cannot be added to a future day.");
  if (!target || !start || !end || target < start || target > end) errors.push("Choose a day inside the active season.");
  if (pocket?.mode === "whole" && requested !== 1) errors.push("This Pocket activity must be redeemed as a complete session.");
  return { valid: errors.length === 0, errors };
}
