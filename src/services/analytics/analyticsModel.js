import { CATEGORIES } from "../../constants/categories";
import {
  addDays,
  getDateRange,
  getLocalDateKey,
  getWeekStart,
  normalizeChallengeDate,
} from "../dateService";
import { calculateEntryPoints, getEntryPointBreakdown } from "../points";

export const ANALYTICS_RANGE_OPTIONS = Object.freeze([4, 8, 12, 26]);

function clampRangeWeeks(value) {
  const number = Number(value);
  return ANALYTICS_RANGE_OPTIONS.includes(number) ? number : 8;
}

function getEntryDate(entry) {
  return normalizeChallengeDate(entry?.challengeDate);
}

function getEntriesWithin(entries, startDate, endDate) {
  return entries.filter((entry) => {
    const date = getEntryDate(entry);
    return Boolean(date && date >= startDate && date <= endDate);
  });
}

function sumEntryPoints(entries) {
  return entries.reduce((total, entry) => total + calculateEntryPoints(entry), 0);
}

function createWeekBuckets(startDate, rangeWeeks) {
  return Array.from({ length: rangeWeeks }, (_, index) => {
    const start = addDays(startDate, index * 7);
    return {
      id: getLocalDateKey(start),
      startDate: start,
      endDate: addDays(start, 6),
      entries: 0,
      points: 0,
      activeDays: new Set(),
    };
  });
}

function buildWeeklyTrend(entries, startDate, rangeWeeks) {
  const buckets = createWeekBuckets(startDate, rangeWeeks);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.id, bucket]));

  entries.forEach((entry) => {
    const date = getEntryDate(entry);
    const weekStart = getWeekStart(date);
    const bucket = bucketMap.get(getLocalDateKey(weekStart));
    if (!bucket) return;

    bucket.entries += 1;
    bucket.points += calculateEntryPoints(entry);
    bucket.activeDays.add(getLocalDateKey(date));
  });

  return buckets.map((bucket) => ({
    ...bucket,
    activeDays: bucket.activeDays.size,
  }));
}

function buildCategoryBalance(entries) {
  const categoryMap = new Map(
    CATEGORIES.map((category) => [
      category.id,
      {
        id: category.id,
        name: category.name,
        emoji: category.emoji,
        points: 0,
        entries: 0,
        activeDays: new Set(),
      },
    ]),
  );

  entries.forEach((entry) => {
    const direct = categoryMap.get(entry.category);
    const dateKey = getLocalDateKey(getEntryDate(entry));
    if (direct) {
      direct.entries += 1;
      if (dateKey) direct.activeDays.add(dateKey);
    }

    getEntryPointBreakdown(entry).breakdown.forEach((part) => {
      const category = categoryMap.get(part.categoryId);
      if (!category) return;
      category.points += Number(part.points) || 0;
      if (dateKey) category.activeDays.add(dateKey);
    });
  });

  return [...categoryMap.values()]
    .map((category) => ({ ...category, activeDays: category.activeDays.size }))
    .filter((category) => category.entries > 0 || category.points > 0)
    .sort(
      (first, second) =>
        second.points - first.points ||
        second.activeDays - first.activeDays ||
        first.name.localeCompare(second.name),
    );
}

function buildDailyConsistency(entries, endDate, numberOfDays = 28) {
  const startDate = addDays(endDate, -(numberOfDays - 1));
  const daily = new Map(
    getDateRange(startDate, endDate).map((date) => [
      getLocalDateKey(date),
      { date, dateKey: getLocalDateKey(date), entries: 0, points: 0 },
    ]),
  );

  getEntriesWithin(entries, startDate, endDate).forEach((entry) => {
    const bucket = daily.get(getLocalDateKey(getEntryDate(entry)));
    if (!bucket) return;
    bucket.entries += 1;
    bucket.points += calculateEntryPoints(entry);
  });

  return [...daily.values()];
}

function getMomentum(entries, referenceDate) {
  const currentStart = addDays(referenceDate, -13);
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -13);
  const currentPoints = sumEntryPoints(getEntriesWithin(entries, currentStart, referenceDate));
  const previousPoints = sumEntryPoints(getEntriesWithin(entries, previousStart, previousEnd));
  const difference = currentPoints - previousPoints;
  const percentage = previousPoints > 0 ? Math.round((difference / previousPoints) * 100) : null;

  return { currentPoints, previousPoints, difference, percentage };
}

function buildInsights({ weeklyTrend, categoryBalance, dailyConsistency, momentum }) {
  const insights = [];
  const bestWeek = [...weeklyTrend].sort(
    (first, second) => second.points - first.points || second.activeDays - first.activeDays,
  )[0];
  const consistentCategory = [...categoryBalance].sort(
    (first, second) => second.activeDays - first.activeDays || second.points - first.points,
  )[0];
  const activeDays = dailyConsistency.filter((day) => day.entries > 0).length;

  if (bestWeek?.points > 0) {
    insights.push({
      id: "best-week",
      icon: "🏅",
      title: "Strongest week",
      message: `${bestWeek.points} activity points across ${bestWeek.activeDays} active days.`,
      date: bestWeek.startDate,
    });
  }

  if (consistentCategory) {
    insights.push({
      id: "consistent-category",
      icon: consistentCategory.emoji,
      title: "Most consistent category",
      message: `${consistentCategory.name} appeared on ${consistentCategory.activeDays} different days in this range.`,
    });
  }

  if (momentum.currentPoints > momentum.previousPoints) {
    insights.push({
      id: "momentum-up",
      icon: "↗️",
      title: "Recent momentum is rising",
      message: `${momentum.difference} more activity points than the previous 14 days.`,
    });
  } else if (momentum.currentPoints < momentum.previousPoints) {
    insights.push({
      id: "momentum-steady",
      icon: "🌱",
      title: "A gentle rebuild opportunity",
      message: "Recent activity is quieter than the previous fortnight. One honest next action can restart momentum.",
    });
  } else if (momentum.currentPoints > 0) {
    insights.push({
      id: "momentum-level",
      icon: "⚖️",
      title: "Momentum is steady",
      message: "Your last two 14-day periods earned the same number of activity points.",
    });
  }

  insights.push({
    id: "consistency-window",
    icon: "🗓️",
    title: "28-day consistency",
    message: `${activeDays} active ${activeDays === 1 ? "day" : "days"} in the latest four-week window.`,
  });

  return insights.slice(0, 4);
}

export function getPersonalAnalytics(
  entries = [],
  { rangeWeeks = 8, referenceDate = new Date() } = {},
) {
  const weeks = clampRangeWeeks(rangeWeeks);
  const endDate = normalizeChallengeDate(referenceDate) ?? normalizeChallengeDate(new Date());
  const startDate = addDays(getWeekStart(endDate), -(weeks - 1) * 7);
  const rangeEntries = getEntriesWithin(entries, startDate, endDate);
  const weeklyTrend = buildWeeklyTrend(rangeEntries, startDate, weeks);
  const categoryBalance = buildCategoryBalance(rangeEntries);
  const dailyConsistency = buildDailyConsistency(entries, endDate);
  const momentum = getMomentum(entries, endDate);
  const activeDays = new Set(
    rangeEntries.map((entry) => getLocalDateKey(getEntryDate(entry))).filter(Boolean),
  ).size;
  const activityPoints = sumEntryPoints(rangeEntries);
  const bestDay = [...dailyConsistency].sort(
    (first, second) => second.points - first.points || second.entries - first.entries,
  )[0];

  return {
    rangeWeeks: weeks,
    startDate,
    endDate,
    summary: {
      entries: rangeEntries.length,
      activeDays,
      activityPoints,
      averagePointsPerActiveDay: activeDays > 0 ? Math.round(activityPoints / activeDays) : 0,
      bestDay: bestDay?.points > 0 ? bestDay : null,
    },
    weeklyTrend,
    categoryBalance,
    dailyConsistency,
    momentum,
    insights: buildInsights({ weeklyTrend, categoryBalance, dailyConsistency, momentum }),
  };
}
