import { DIFFICULTY } from "../../constants/libraries/difficulty";
import {
  CATEGORY_SCORING,
  RUNNING_SCORING_RULES,
} from "../../constants/points/categoryScoring";
import { getScoreFromTable } from "./utils";

export const FRUIT_POINTS_PER_SERVING = 5;

const BONUS_CATEGORY_MAP = {
  running: ["cardio"],
};

function calculateConfiguredCategoryPoints(category, data = {}) {
  const config = CATEGORY_SCORING[category];

  if (!config) {
    return 0;
  }

  const value = Number(data[config.field] ?? 0);

  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return getScoreFromTable(value, config.table);
}

function calculateFruitPoints(data = {}) {
  const servings = Number(data.servings ?? data.quantity ?? 0);

  if (!Number.isFinite(servings) || servings <= 0) {
    return 0;
  }

  return Math.floor(servings) * FRUIT_POINTS_PER_SERVING;
}

function getRunningPaceSecondsPerKm(data = {}) {
  const savedPace = Number(data.averagePaceSecondsPerKm);

  if (Number.isFinite(savedPace) && savedPace > 0) {
    return savedPace;
  }

  const distance = Number(data.distance ?? 0);
  const savedTotalSeconds = Number(data.totalSeconds);
  const savedTotalMinutes = Number(data.totalMinutes);

  const totalSeconds =
    Number.isFinite(savedTotalSeconds) && savedTotalSeconds > 0
      ? savedTotalSeconds
      : Number.isFinite(savedTotalMinutes) && savedTotalMinutes > 0
        ? savedTotalMinutes * 60
        : 0;

  if (!Number.isFinite(distance) || distance <= 0 || totalSeconds <= 0) {
    return 0;
  }

  return totalSeconds / distance;
}

export function getRunningPointEligibility(data = {}) {
  const distance = Number(data.distance ?? 0);
  const paceSecondsPerKm = getRunningPaceSecondsPerKm(data);

  const meetsDistance =
    Number.isFinite(distance) &&
    distance >= RUNNING_SCORING_RULES.minimumDistanceKm;

  const meetsPace =
    Number.isFinite(paceSecondsPerKm) &&
    paceSecondsPerKm > 0 &&
    paceSecondsPerKm <= RUNNING_SCORING_RULES.maximumPaceSecondsPerKm;

  return {
    eligible: meetsDistance && meetsPace,
    meetsDistance,
    meetsPace,
    distance,
    paceSecondsPerKm,
  };
}

function getRunningPointDetail(data = {}) {
  const eligibility = getRunningPointEligibility(data);

  if (eligibility.eligible) {
    return "";
  }

  if (!eligibility.meetsDistance && !eligibility.meetsPace) {
    return "No Running points: complete at least 3 kilometres at 11:00 per kilometre or faster.";
  }

  if (!eligibility.meetsDistance) {
    return "No Running points: Running requires at least 3 kilometres.";
  }

  return "No Running points: pace must be 11:00 per kilometre or faster.";
}

function getCardioDifficulty(data = {}) {
  if (data.isRunningBonus === true || data.activity === "Running") {
    return DIFFICULTY.TIER_3;
  }

  const savedDifficulty = data.activityDefinition?.difficulty;
  const savedMultiplier = Number(savedDifficulty?.multiplier);

  if (Number.isFinite(savedMultiplier) && savedMultiplier > 0) {
    return savedDifficulty;
  }

  const proposedTier = Number(
    data.activityDefinition?.proposedTier ?? data.proposedTier ?? 0,
  );

  return DIFFICULTY[`TIER_${proposedTier}`] ?? DIFFICULTY.TIER_1;
}

function calculateCardioPoints(data = {}) {
  const basePoints = calculateConfiguredCategoryPoints("cardio", data);

  if (basePoints <= 0) {
    return 0;
  }

  const multiplier = Number(getCardioDifficulty(data).multiplier ?? 1);

  return Math.round(basePoints * multiplier);
}

export function calculateBaseCategoryPoints(category, data = {}) {
  if (category === "fruit") {
    return calculateFruitPoints(data);
  }

  if (category === "cardio") {
    return calculateCardioPoints(data);
  }

  if (category === "running" && !getRunningPointEligibility(data).eligible) {
    return 0;
  }

  return calculateConfiguredCategoryPoints(category, data);
}

function getBonusCategoryData(category, bonusCategory, data = {}) {
  if (category === "running" && bonusCategory === "cardio") {
    return {
      activity: "Running",
      isRunningBonus: true,
      totalMinutes: Number(data.totalMinutes ?? 0),
      activityDefinition: {
        name: "Running",
        tier: DIFFICULTY.TIER_3.tier,
        difficulty: DIFFICULTY.TIER_3,
      },
    };
  }

  return data;
}

export function calculateCategoryPointBreakdown(category, data = {}) {
  const main = {
    categoryId: category,
    points: calculateBaseCategoryPoints(category, data),
    type: "main",
    detail: category === "running" ? getRunningPointDetail(data) : "",
  };

  const bonuses = (BONUS_CATEGORY_MAP[category] ?? []).map(
    (bonusCategory) => ({
      categoryId: bonusCategory,
      points: calculateBaseCategoryPoints(
        bonusCategory,
        getBonusCategoryData(category, bonusCategory, data),
      ),
      type: "bonus",
      sourceCategoryId: category,
    }),
  );

  return {
    main,
    bonuses,
    total: bonuses.reduce(
      (total, bonus) => total + bonus.points,
      main.points,
    ),
  };
}

export function calculateCategoryPoints(category, data = {}) {
  return calculateCategoryPointBreakdown(category, data).total;
}
