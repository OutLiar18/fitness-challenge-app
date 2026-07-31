import { GOAL_PERIODS, GOAL_RULESET_VERSION } from "../../constants/goals";
import {
  GOAL_BONUS_POINTS,
  PROGRESSION_RULESET_VERSION,
  XP_REWARDS,
} from "../../constants/progression";
import {
  getDateRange,
  getLocalDateKey,
  getWeekEnd,
  normalizeChallengeDate,
} from "../dateService";
import { calculateGoals } from "../statistics/goals";
import {
  createProgressionEvent,
  getEntryDate,
  getSortedDateKeys,
  getUniqueWeekStarts,
  groupEntriesByDate,
} from "./helpers";

function getDailyGoalEvents(entries = []) {
  const groups = groupEntriesByDate(entries);
  const events = [];

  getSortedDateKeys(groups).forEach((dateKey) => {
    const dateEntries = groups.get(dateKey) ?? [];
    const date = getEntryDate(dateEntries[0]);
    const goals = calculateGoals(dateEntries, GOAL_PERIODS.DAILY);
    const completed = goals.filter((goal) => goal.completed);

    completed.forEach((goal) => {
      events.push(
        createProgressionEvent({
          id: `daily-goal:${dateKey}:${goal.goalId}`,
          type: "daily-goal",
          label: `${goal.name} daily goal`,
          points: GOAL_BONUS_POINTS.dailyGoal,
          xp: XP_REWARDS.dailyGoal,
          earnedDate: date,
          metadata: {
            goalId: goal.goalId,
            period: GOAL_PERIODS.DAILY,
            goalRulesetVersion: GOAL_RULESET_VERSION,
            progressionRulesetVersion: PROGRESSION_RULESET_VERSION,
          },
        }),
      );
    });

    if (goals.length > 0 && completed.length === goals.length) {
      events.push(
        createProgressionEvent({
          id: `daily-mission:${dateKey}`,
          type: "daily-mission",
          label: "Perfect day",
          points: GOAL_BONUS_POINTS.dailyMission,
          xp: XP_REWARDS.dailyMission,
          earnedDate: date,
          metadata: {
            period: GOAL_PERIODS.DAILY,
            goalRulesetVersion: GOAL_RULESET_VERSION,
            progressionRulesetVersion: PROGRESSION_RULESET_VERSION,
          },
        }),
      );
    }
  });

  return events;
}

function getWeekEntries(entries, weekStart) {
  const weekEnd = getWeekEnd(weekStart);

  return entries
    .filter((entry) => {
      const date = getEntryDate(entry);
      return Boolean(date && date >= weekStart && date <= weekEnd);
    })
    .sort((first, second) => getEntryDate(first) - getEntryDate(second));
}

function getWeeklyGoalEvents(entries = []) {
  const events = [];

  getUniqueWeekStarts(entries).forEach((weekStart) => {
    const weekStartKey = getLocalDateKey(weekStart);
    const weekEntries = getWeekEntries(entries, weekStart);
    const weekEnd = getWeekEnd(weekStart);
    const completedGoalIds = new Set();
    let missionCompleted = false;

    getDateRange(weekStart, weekEnd).forEach((date) => {
      const cumulativeEntries = weekEntries.filter(
        (entry) => getEntryDate(entry) <= date,
      );

      if (cumulativeEntries.length === 0) {
        return;
      }

      const goals = calculateGoals(cumulativeEntries, GOAL_PERIODS.WEEKLY);

      goals.forEach((goal) => {
        if (!goal.completed || completedGoalIds.has(goal.goalId)) {
          return;
        }

        completedGoalIds.add(goal.goalId);
        events.push(
          createProgressionEvent({
            id: `weekly-goal:${weekStartKey}:${goal.goalId}`,
            type: "weekly-goal",
            label: `${goal.name} weekly goal`,
            points: GOAL_BONUS_POINTS.weeklyGoal,
            xp: XP_REWARDS.weeklyGoal,
            earnedDate: date,
            metadata: {
              goalId: goal.goalId,
              period: GOAL_PERIODS.WEEKLY,
              weekStart: weekStartKey,
              goalRulesetVersion: GOAL_RULESET_VERSION,
              progressionRulesetVersion: PROGRESSION_RULESET_VERSION,
            },
          }),
        );
      });

      if (
        !missionCompleted &&
        goals.length > 0 &&
        goals.every((goal) => goal.completed)
      ) {
        missionCompleted = true;
        events.push(
          createProgressionEvent({
            id: `weekly-mission:${weekStartKey}`,
            type: "weekly-mission",
            label: "Perfect week",
            points: GOAL_BONUS_POINTS.weeklyMission,
            xp: XP_REWARDS.weeklyMission,
            earnedDate: date,
            metadata: {
              period: GOAL_PERIODS.WEEKLY,
              weekStart: weekStartKey,
              goalRulesetVersion: GOAL_RULESET_VERSION,
              progressionRulesetVersion: PROGRESSION_RULESET_VERSION,
            },
          }),
        );
      }
    });
  });

  return events;
}

export function getGoalBonusEvents(entries = []) {
  return [...getDailyGoalEvents(entries), ...getWeeklyGoalEvents(entries)].sort(
    (first, second) =>
      first.earnedDate - second.earnedDate || first.id.localeCompare(second.id),
  );
}

export function getGoalBonusSummary(entries = [], referenceDate = new Date()) {
  const events = getGoalBonusEvents(entries);
  const todayKey = getLocalDateKey(normalizeChallengeDate(referenceDate));

  return {
    events,
    totalPoints: events.reduce((total, event) => total + event.points, 0),
    todayPoints: events
      .filter((event) => event.earnedDateKey === todayKey)
      .reduce((total, event) => total + event.points, 0),
    completedDailyGoals: events.filter((event) => event.type === "daily-goal")
      .length,
    completedWeeklyGoals: events.filter((event) => event.type === "weekly-goal")
      .length,
    perfectDays: events.filter((event) => event.type === "daily-mission").length,
    perfectWeeks: events.filter((event) => event.type === "weekly-mission").length,
  };
}
