import { CATEGORY_SCORING } from "../../constants/points/categoryScoring";
import { DIFFICULTY } from "../../constants/libraries/difficulty";
import { getScoreFromTable } from "./utils";

const FRUIT_POINTS_PER_SERVING = 5;

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

  return servings * FRUIT_POINTS_PER_SERVING;
}

function getCardioDifficulty(data = {}) {
  /*
   * Running automatically counts as Tier 3 Cardio.
   */
  if (data.isRunningBonus === true || data.activity === "Running") {
    return DIFFICULTY.TIER_3;
  }

  /*
   * Normal Cardio entries should contain the activity
   * definition copied from the Cardio library.
   */
  const savedDifficulty = data.activityDefinition?.difficulty;

  if (savedDifficulty && Number.isFinite(Number(savedDifficulty.multiplier))) {
    return savedDifficulty;
  }

  /*
   * Support custom activities that have a proposed tier.
   */
  const proposedTier = Number(
    data.activityDefinition?.proposedTier ?? data.proposedTier ?? 0,
  );

  const proposedDifficulty = DIFFICULTY[`TIER_${proposedTier}`];

  if (proposedDifficulty) {
    return proposedDifficulty;
  }

  /*
   * Old Cardio entries without difficulty information
   * safely score as Tier 1.
   */
  return DIFFICULTY.TIER_1;
}

function calculateCardioPoints(data = {}) {
  const basePoints = calculateConfiguredCategoryPoints("cardio", data);

  if (basePoints <= 0) {
    return 0;
  }

  const difficulty = getCardioDifficulty(data);

  const multiplier = Number(difficulty.multiplier ?? 1);

  return Math.round(basePoints * multiplier);
}

function calculateSingleCategoryPoints(category, data = {}) {
  if (category === "fruit") {
    return calculateFruitPoints(data);
  }

  if (category === "cardio") {
    return calculateCardioPoints(data);
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

export function calculateCategoryPoints(category, data = {}) {
  const mainPoints = calculateSingleCategoryPoints(category, data);

  const bonusCategories = BONUS_CATEGORY_MAP[category] ?? [];

  const bonusPoints = bonusCategories.reduce((total, bonusCategory) => {
    const bonusData = getBonusCategoryData(category, bonusCategory, data);

    return total + calculateSingleCategoryPoints(bonusCategory, bonusData);
  }, 0);

  return mainPoints + bonusPoints;
}
