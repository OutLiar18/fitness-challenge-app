import { GOAL_PERIODS } from "../../constants/goals";
import {
  PROGRESSION_RULESET_VERSION,
  STREAK_CONFIGURATION,
} from "../../constants/progression";
import {
  addDays,
  getDateRange,
  getLocalDateKey,
  isSameDay,
  normalizeChallengeDate,
} from "../dateService";
import { calculateGoals } from "../statistics/goals";
import {
  createProgressionEvent,
  dateFromKey,
  getSortedDateKeys,
  groupEntriesByDate,
} from "./helpers";

function isSuccessfulDay(entries = []) {
  return calculateGoals(entries, GOAL_PERIODS.DAILY).some(
    (goal) => goal.completed,
  );
}

function getMilestone(days) {
  return STREAK_CONFIGURATION.milestones.find(
    (milestone) => milestone.days === days,
  );
}

export function getStreakSummary(entries = [], referenceDate = new Date()) {
  const reference = normalizeChallengeDate(referenceDate);
  const groups = groupEntriesByDate(entries);
  const sortedKeys = getSortedDateKeys(groups);

  if (!reference || sortedKeys.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      successfulDays: 0,
      todaySuccessful: false,
      status: "inactive",
      shieldAvailable: 0,
      daysUntilShield: STREAK_CONFIGURATION.shieldEarnInterval,
      protectedDays: [],
      milestoneEvents: [],
      nextMilestone: STREAK_CONFIGURATION.milestones[0],
    };
  }

  const todayKey = getLocalDateKey(reference);
  const todaySuccessful = isSuccessfulDay(groups.get(todayKey) ?? []);
  const referenceIsToday = isSameDay(reference, new Date());
  const evaluationEnd =
    referenceIsToday && !todaySuccessful ? addDays(reference, -1) : reference;
  const firstDate = dateFromKey(sortedKeys[0]);

  if (!evaluationEnd || !firstDate || firstDate > evaluationEnd) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      successfulDays: 0,
      todaySuccessful,
      status: "inactive",
      shieldAvailable: 0,
      daysUntilShield: STREAK_CONFIGURATION.shieldEarnInterval,
      protectedDays: [],
      milestoneEvents: [],
      nextMilestone: STREAK_CONFIGURATION.milestones[0],
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let successfulDays = 0;
  let shieldAvailable = 0;
  let successfulDaysTowardShield = 0;
  const protectedDays = [];
  const milestoneEvents = [];

  getDateRange(firstDate, evaluationEnd).forEach((date) => {
    const dateKey = getLocalDateKey(date);
    const successful = isSuccessfulDay(groups.get(dateKey) ?? []);

    if (successful) {
      currentStreak += 1;
      successfulDays += 1;
      successfulDaysTowardShield += 1;

      if (
        successfulDaysTowardShield >=
        STREAK_CONFIGURATION.shieldEarnInterval
      ) {
        shieldAvailable = Math.min(
          STREAK_CONFIGURATION.maximumShields,
          shieldAvailable + 1,
        );
        successfulDaysTowardShield = 0;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        const milestone = getMilestone(longestStreak);

        if (milestone) {
          milestoneEvents.push(
            createProgressionEvent({
              id: `streak-milestone:${milestone.days}`,
              type: "streak-milestone",
              label: `${milestone.days}-day streak`,
              points: milestone.points,
              xp: milestone.xp,
              earnedDate: date,
              metadata: {
                days: milestone.days,
                progressionRulesetVersion: PROGRESSION_RULESET_VERSION,
              },
            }),
          );
        }
      }

      return;
    }

    if (currentStreak > 0 && shieldAvailable > 0) {
      shieldAvailable -= 1;
      protectedDays.push(dateKey);
      return;
    }

    currentStreak = 0;
    shieldAvailable = 0;
    successfulDaysTowardShield = 0;
  });

  const nextMilestone =
    STREAK_CONFIGURATION.milestones.find(
      (milestone) => milestone.days > longestStreak,
    ) ?? null;

  const status = todaySuccessful
    ? "active"
    : referenceIsToday && currentStreak > 0
      ? "pending"
      : currentStreak > 0
        ? "active"
        : "inactive";

  return {
    currentStreak,
    longestStreak,
    successfulDays,
    todaySuccessful,
    status,
    shieldAvailable,
    daysUntilShield:
      shieldAvailable > 0
        ? 0
        : Math.max(
            0,
            STREAK_CONFIGURATION.shieldEarnInterval -
              successfulDaysTowardShield,
          ),
    protectedDays,
    milestoneEvents,
    nextMilestone,
  };
}
