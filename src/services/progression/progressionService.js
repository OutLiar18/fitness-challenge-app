import { GOAL_RULESET_VERSION } from "../../constants/goals";
import { PROGRESSION_RULESET_VERSION } from "../../constants/progression";
import { getLocalDateKey, normalizeChallengeDate } from "../dateService";
import {
  getActivityPoints,
  getTodayActivityPoints,
} from "../statistics/activityTotals";
import { getEntriesOnOrBefore } from "../statistics/filters";
import { getAchievementSummary } from "./achievementService";
import { getPointBonusSummary } from "./pointBonusService";
import { getXpSummary } from "./xpService";

export function getProgressionSummary(entries = [], referenceDate = new Date()) {
  const eligibleEntries = getEntriesOnOrBefore(entries, referenceDate);
  const bonuses = getPointBonusSummary(eligibleEntries, referenceDate);
  const xp = getXpSummary(
    eligibleEntries,
    bonuses.goalBonuses.events,
    bonuses.streak.milestoneEvents,
  );
  const activityPoints = getActivityPoints(eligibleEntries);
  const todayActivityPoints = getTodayActivityPoints(
    eligibleEntries,
    referenceDate,
  );
  const todayKey = getLocalDateKey(normalizeChallengeDate(referenceDate));
  const todayXp = xp.events
    .filter((event) => event.earnedDateKey === todayKey)
    .reduce((total, event) => total + event.xp, 0);
  const achievements = getAchievementSummary({
    entryCount: eligibleEntries.length,
    completedDailyGoals: bonuses.goalBonuses.completedDailyGoals,
    perfectDays: bonuses.goalBonuses.perfectDays,
    perfectWeeks: bonuses.goalBonuses.perfectWeeks,
    longestStreak: bonuses.streak.longestStreak,
    level: xp.level,
  });

  return {
    rulesets: {
      goals: GOAL_RULESET_VERSION,
      progression: PROGRESSION_RULESET_VERSION,
    },
    score: {
      activityPoints,
      bonusPoints: bonuses.totalPoints,
      totalPoints: activityPoints + bonuses.totalPoints,
      todayActivityPoints,
      todayBonusPoints: bonuses.todayPoints,
      todayPoints: todayActivityPoints + bonuses.todayPoints,
    },
    bonuses,
    streak: bonuses.streak,
    xp: {
      ...xp,
      todayXp,
    },
    achievements,
    records: {
      longestStreak: bonuses.streak.longestStreak,
      successfulDays: bonuses.streak.successfulDays,
      completedDailyGoals: bonuses.goalBonuses.completedDailyGoals,
      completedWeeklyGoals: bonuses.goalBonuses.completedWeeklyGoals,
      perfectDays: bonuses.goalBonuses.perfectDays,
      perfectWeeks: bonuses.goalBonuses.perfectWeeks,
    },
  };
}
