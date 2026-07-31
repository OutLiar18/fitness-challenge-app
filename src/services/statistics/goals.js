import { GOAL_CONFIGURATIONS, GOAL_PERIODS } from "../../constants/goals";
import { GOAL_BONUS_POINTS } from "../../constants/progression";
import { calculateEffectiveReps } from "../points/workoutPoints";
import { getCategoryEntries, getEntriesForWeek, getTodayEntries } from "./filters";
import { getCategoryTotal } from "./activityTotals";

function getWorkoutEffectiveReps(entries = [], categoryIds = []) {
  const allowedCategories = new Set(categoryIds);

  return entries.reduce((total, entry) => {
    if (!allowedCategories.has(entry.category)) {
      return total;
    }

    return total + calculateEffectiveReps(entry.data?.exercises ?? []);
  }, 0);
}

function getGoalCurrent(entries, configuration) {
  if (configuration.metric === "effectiveReps") {
    return getWorkoutEffectiveReps(entries, configuration.categoryIds);
  }

  return getCategoryTotal(entries, configuration.categoryId);
}

function getGoalEntryCount(entries, configuration) {
  if (configuration.categoryId) {
    return getCategoryEntries(entries, configuration.categoryId).length;
  }

  const allowedCategories = new Set(configuration.categoryIds ?? []);
  return entries.filter((entry) => allowedCategories.has(entry.category)).length;
}

function getGoalBonusPoints(period) {
  return period === GOAL_PERIODS.WEEKLY
    ? GOAL_BONUS_POINTS.weeklyGoal
    : GOAL_BONUS_POINTS.dailyGoal;
}

function getMissionBonusPoints(period) {
  return period === GOAL_PERIODS.WEEKLY
    ? GOAL_BONUS_POINTS.weeklyMission
    : GOAL_BONUS_POINTS.dailyMission;
}

function buildGoal(entries, configuration, period) {
  const goal = Number(configuration.targets?.[period]);

  if (!Number.isFinite(goal) || goal <= 0) {
    return null;
  }

  const current = getGoalCurrent(entries, configuration);
  const minimumEntries = Number(configuration.minimumEntries?.[period] ?? 0);
  const entryCount = getGoalEntryCount(entries, configuration);
  const meetsEntryRequirement =
    minimumEntries <= 0 || entryCount >= minimumEntries;

  return {
    id: configuration.selectCategoryId,
    goalId: configuration.id,
    categoryId: configuration.selectCategoryId,
    emoji: configuration.emoji,
    name: configuration.name,
    current,
    goal,
    percentage: Math.min(100, Math.round((current / goal) * 100)),
    unit: configuration.unit,
    completed: current >= goal && meetsEntryRequirement,
    period,
    minimumEntries,
    entryCount,
    meetsEntryRequirement,
    bonusPoints: getGoalBonusPoints(period),
    missionBonusPoints: getMissionBonusPoints(period),
  };
}

export function calculateGoals(entries = [], period = GOAL_PERIODS.DAILY) {
  return GOAL_CONFIGURATIONS.map((configuration) =>
    buildGoal(entries, configuration, period),
  ).filter(Boolean);
}

export function getGoalsForPeriod(
  entries = [],
  period,
  referenceDate = new Date(),
) {
  const periodEntries =
    period === GOAL_PERIODS.WEEKLY
      ? getEntriesForWeek(entries, referenceDate)
      : getTodayEntries(entries, referenceDate);

  return calculateGoals(periodEntries, period);
}

export function getDailyGoals(entries = [], referenceDate = new Date()) {
  return getGoalsForPeriod(entries, GOAL_PERIODS.DAILY, referenceDate);
}

export function getWeeklyGoals(entries = [], referenceDate = new Date()) {
  return getGoalsForPeriod(entries, GOAL_PERIODS.WEEKLY, referenceDate);
}
