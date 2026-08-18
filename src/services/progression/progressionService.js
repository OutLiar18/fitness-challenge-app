import { GOAL_RULESET_VERSION } from "../../constants/goals";
import { PROGRESSION_RULESET_VERSION } from "../../constants/progression";
import { getLocalDateKey, normalizeChallengeDate } from "../dateService";
import {
  getActivityPoints,
  getTodayActivityPoints,
} from "../statistics/activityTotals";
import { getEntriesOnOrBefore } from "../statistics/filters";
import { getAchievementSummary } from "./achievementService";
import { getPersonalRecordSummary } from "./personalRecordService";
import { getPointBonusSummary } from "./pointBonusService";
import { getProgressTimeline } from "./timelineService";
import { getXpSummary } from "./xpService";

function getStableProgressionXp({
  entries,
  goalBonusEvents,
  streakMilestoneEvents,
  longestStreak,
}) {
  let xp = getXpSummary(
    entries,
    goalBonusEvents,
    streakMilestoneEvents,
    [],
  );
  let achievements = getAchievementSummary({
    entries,
    goalBonusEvents,
    streakMilestoneEvents,
    longestStreak,
    xpEvents: xp.events,
  });

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const nextXp = getXpSummary(
      entries,
      goalBonusEvents,
      streakMilestoneEvents,
      achievements.xpEvents,
    );
    const nextAchievements = getAchievementSummary({
      entries,
      goalBonusEvents,
      streakMilestoneEvents,
      longestStreak,
      xpEvents: nextXp.events,
    });
    const stable =
      nextXp.totalXp === xp.totalXp &&
      nextAchievements.unlockedCount === achievements.unlockedCount;

    xp = nextXp;
    achievements = nextAchievements;

    if (stable) {
      break;
    }
  }

  return { xp, achievements };
}

export function getProgressionSummary(
  entries = [],
  referenceDate = new Date(),
) {
  const eligibleEntries = getEntriesOnOrBefore(entries, referenceDate);
  const bonuses = getPointBonusSummary(eligibleEntries, referenceDate);
  const { xp, achievements } = getStableProgressionXp({
    entries: eligibleEntries,
    goalBonusEvents: bonuses.goalBonuses.events,
    streakMilestoneEvents: bonuses.streak.milestoneEvents,
    longestStreak: bonuses.streak.longestStreak,
  });
  const activityPoints = getActivityPoints(eligibleEntries);
  const todayActivityPoints = getTodayActivityPoints(
    eligibleEntries,
    referenceDate,
  );
  const todayKey = getLocalDateKey(normalizeChallengeDate(referenceDate));
  const todayXp = xp.events
    .filter((event) => event.earnedDateKey === todayKey)
    .reduce((total, event) => total + Number(event.xp || 0), 0);

  const personalRecords = getPersonalRecordSummary(
    eligibleEntries,
    bonuses.events,
  );
  const timeline = getProgressTimeline({
    entries: eligibleEntries,
    goalBonusEvents: bonuses.goalBonuses.events,
    streakMilestoneEvents: bonuses.streak.milestoneEvents,
    xpEvents: xp.events,
    achievements,
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
    timeline,
    records: {
      longestStreak: bonuses.streak.longestStreak,
      successfulDays: bonuses.streak.successfulDays,
      completedDailyGoals: bonuses.goalBonuses.completedDailyGoals,
      completedWeeklyGoals: bonuses.goalBonuses.completedWeeklyGoals,
      perfectDays: bonuses.goalBonuses.perfectDays,
      perfectWeeks: bonuses.goalBonuses.perfectWeeks,
      personal: personalRecords,
    },
  };
}
