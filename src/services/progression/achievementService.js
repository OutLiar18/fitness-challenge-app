import { PROGRESSION_ACHIEVEMENTS } from "../../constants/progression";
import { calculateEffectiveReps } from "../points/workoutPoints";
import {
  createProgressionEvent,
  getEntryDate,
} from "./helpers";
import { calculateLevel } from "./xpService";

const WORKOUT_CATEGORIES = new Set(["upperBody", "lowerBody", "core"]);

function toPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function sortEventsAscending(events = []) {
  return [...events]
    .filter((event) => event?.earnedDate instanceof Date)
    .sort(
      (first, second) =>
        first.earnedDate - second.earnedDate ||
        String(first.id ?? "").localeCompare(String(second.id ?? "")),
    );
}

function getCategoryContribution(entry, categoryId) {
  if (!entry || !categoryId) {
    return 0;
  }

  if (WORKOUT_CATEGORIES.has(categoryId)) {
    return entry.category === categoryId
      ? calculateEffectiveReps(entry.data?.exercises ?? [])
      : 0;
  }

  if (categoryId === "cardio") {
    if (entry.category === "cardio" || entry.category === "running") {
      return toPositiveNumber(entry.data?.totalMinutes);
    }

    return 0;
  }

  if (entry.category !== categoryId) {
    return 0;
  }

  const fields = {
    water: "amount",
    fruit: "servings",
    reading: "totalMinutes",
    running: "distance",
    skill: "totalMinutes",
    steps: "steps",
  };
  const field = fields[categoryId];

  return field ? toPositiveNumber(entry.data?.[field]) : 0;
}

function getCumulativeMetric(entries, categoryId, target) {
  const sorted = [...entries]
    .map((entry) => ({
      entry,
      date: getEntryDate(entry),
      value: getCategoryContribution(entry, categoryId),
    }))
    .filter((item) => item.date && item.value > 0)
    .sort((first, second) => first.date - second.date);

  let total = 0;
  let earnedDate = null;

  sorted.forEach((item) => {
    total += item.value;

    if (!earnedDate && total >= target) {
      earnedDate = item.date;
    }
  });

  return { current: total, earnedDate };
}

function getSingleMetric(entries, categoryId, target) {
  const candidates = entries
    .map((entry) => ({
      entry,
      date: getEntryDate(entry),
      value: getCategoryContribution(entry, categoryId),
    }))
    .filter((item) => item.date && item.value > 0)
    .sort((first, second) => first.date - second.date);

  const current = candidates.reduce(
    (highest, item) => Math.max(highest, item.value),
    0,
  );
  const earnedDate =
    candidates.find((item) => item.value >= target)?.date ?? null;

  return { current, earnedDate };
}

function getCompletedBooksMetric(entries, target) {
  const completed = entries
    .filter(
      (entry) =>
        entry.category === "reading" &&
        entry.data?.completed === true &&
        getEntryDate(entry),
    )
    .map((entry) => getEntryDate(entry))
    .sort((first, second) => first - second);

  return {
    current: completed.length,
    earnedDate: completed[target - 1] ?? null,
  };
}

function getEventMetric(events, type, target) {
  const matching = sortEventsAscending(events).filter((event) => event.type === type);

  return {
    current: matching.length,
    earnedDate: matching[target - 1]?.earnedDate ?? null,
  };
}

function getStreakMetric(streakMilestoneEvents, longestStreak, target) {
  const event = sortEventsAscending(streakMilestoneEvents).find(
    (candidate) => Number(candidate.metadata?.days) === Number(target),
  );

  return {
    current: Math.max(0, Number(longestStreak) || 0),
    earnedDate: event?.earnedDate ?? null,
  };
}

function getLevelMetric(xpEvents, target) {
  const sorted = sortEventsAscending(xpEvents);
  let cumulativeXp = 0;
  let earnedDate = null;

  sorted.forEach((event) => {
    cumulativeXp += Math.max(0, Number(event.xp) || 0);

    if (!earnedDate && calculateLevel(cumulativeXp).level >= target) {
      earnedDate = event.earnedDate;
    }
  });

  return {
    current: calculateLevel(cumulativeXp).level,
    earnedDate,
  };
}

function evaluateMetric(achievement, context) {
  const metric = achievement.metric ?? {};
  const target = Math.max(1, Number(metric.target) || 1);

  switch (metric.type) {
    case "entryCount": {
      const datedEntries = context.entries
        .map((entry) => ({ entry, date: getEntryDate(entry) }))
        .filter((item) => item.date)
        .sort((first, second) => first.date - second.date);

      return {
        current: datedEntries.length,
        earnedDate: datedEntries[target - 1]?.date ?? null,
      };
    }
    case "dailyGoalCount":
      return getEventMetric(context.goalBonusEvents, "daily-goal", target);
    case "perfectDays":
      return getEventMetric(context.goalBonusEvents, "daily-mission", target);
    case "perfectWeeks":
      return getEventMetric(context.goalBonusEvents, "weekly-mission", target);
    case "streak":
      return getStreakMetric(
        context.streakMilestoneEvents,
        context.longestStreak,
        target,
      );
    case "level":
      return getLevelMetric(context.xpEvents, target);
    case "completedBooks":
      return getCompletedBooksMetric(context.entries, target);
    case "categorySingle":
      return getSingleMetric(context.entries, metric.categoryId, target);
    case "workoutTotal":
    case "categoryTotal":
      return getCumulativeMetric(context.entries, metric.categoryId, target);
    default:
      return { current: 0, earnedDate: null };
  }
}

function toPercentage(current, target, unlocked) {
  if (unlocked) {
    return 100;
  }

  const safeTarget = Math.max(1, Number(target) || 1);
  return Math.max(
    0,
    Math.min(99, Math.floor((Math.max(0, current) / safeTarget) * 100)),
  );
}

function getNextByFamily(achievements) {
  const byFamily = new Map();

  achievements
    .filter((achievement) => !achievement.hidden && !achievement.unlocked)
    .forEach((achievement) => {
      const current = byFamily.get(achievement.family);

      if (
        !current ||
        achievement.targetValue < current.targetValue
      ) {
        byFamily.set(achievement.family, achievement);
      }
    });

  return [...byFamily.values()].sort((first, second) => {
    const progressDifference =
      second.progressPercentage - first.progressPercentage;

    if (progressDifference !== 0) {
      return progressDifference;
    }

    return first.targetValue - second.targetValue;
  });
}

export function getAchievementSummary({
  entries = [],
  goalBonusEvents = [],
  streakMilestoneEvents = [],
  longestStreak = 0,
  xpEvents = [],
} = {}) {
  const context = {
    entries,
    goalBonusEvents,
    streakMilestoneEvents,
    longestStreak,
    xpEvents,
  };

  const achievements = PROGRESSION_ACHIEVEMENTS.map((achievement) => {
    const targetValue = Math.max(1, Number(achievement.metric?.target) || 1);
    const metric = evaluateMetric(achievement, context);
    const currentValue = Math.max(0, Number(metric.current) || 0);
    const unlocked = currentValue >= targetValue;

    return {
      ...achievement,
      unlocked,
      earnedDate: unlocked ? metric.earnedDate : null,
      currentValue,
      targetValue,
      progressPercentage: toPercentage(currentValue, targetValue, unlocked),
    };
  });

  const unlocked = achievements.filter((achievement) => achievement.unlocked);
  const locked = achievements.filter((achievement) => !achievement.unlocked);
  const nextByFamily = getNextByFamily(achievements);
  const inProgress = nextByFamily.filter(
    (achievement) => achievement.currentValue > 0,
  );
  const available = nextByFamily.filter(
    (achievement) => achievement.currentValue <= 0,
  );
  const achievementXpEvents = unlocked
    .filter((achievement) => achievement.earnedDate && achievement.xp > 0)
    .map((achievement) =>
      createProgressionEvent({
        id: `achievement:${achievement.id}`,
        type: "achievement",
        label: achievement.name,
        xp: achievement.xp,
        earnedDate: achievement.earnedDate,
        metadata: {
          achievementId: achievement.id,
          difficulty: achievement.difficulty,
          family: achievement.family,
        },
      }),
    );

  return {
    achievements,
    unlocked,
    locked,
    inProgress,
    available,
    nextByFamily,
    total: achievements.length,
    unlockedCount: unlocked.length,
    hiddenTotal: achievements.filter((achievement) => achievement.hidden).length,
    hiddenUnlockedCount: unlocked.filter((achievement) => achievement.hidden)
      .length,
    xpEvents: achievementXpEvents,
    totalXpAwarded: achievementXpEvents.reduce(
      (total, event) => total + Number(event.xp || 0),
      0,
    ),
  };
}
