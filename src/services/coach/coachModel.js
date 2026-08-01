import { CATEGORIES } from "../../constants/categories";
import {
  COACH_FOCUSES,
  COACH_TONES,
  DEFAULT_COACH_PREFERENCES,
} from "../../constants/coach";
import { addDays, getLocalDateKey, normalizeChallengeDate } from "../dateService";
import { calculateEntryPoints } from "../points";
import { getEntryDate } from "../progression/helpers";

const FOCUS_CATEGORY_IDS = Object.freeze({
  balanced: CATEGORIES.map((category) => category.id),
  consistency: CATEGORIES.map((category) => category.id),
  fitness: [
    "water",
    "fruit",
    "running",
    "upperBody",
    "lowerBody",
    "core",
    "cardio",
    "steps",
  ],
  learning: ["reading", "skill"],
});

function cleanPreferences(input = {}) {
  return {
    enabled: input.enabled !== false,
    tone: COACH_TONES.some((item) => item.id === input.tone)
      ? input.tone
      : DEFAULT_COACH_PREFERENCES.tone,
    focus: COACH_FOCUSES.some((item) => item.id === input.focus)
      ? input.focus
      : DEFAULT_COACH_PREFERENCES.focus,
  };
}

export function normalizeCoachPreferences(input = {}) {
  return cleanPreferences(input);
}

function inRange(entry, start, end) {
  const date = getEntryDate(entry);
  return Boolean(date && date >= start && date <= end);
}

function summarizeRange(entries, start, end) {
  const rangeEntries = entries.filter((entry) => inRange(entry, start, end));
  const days = new Set(
    rangeEntries.map((entry) => getLocalDateKey(getEntryDate(entry))).filter(Boolean),
  );
  const categoryCounts = new Map();

  rangeEntries.forEach((entry) => {
    categoryCounts.set(
      entry.category,
      (categoryCounts.get(entry.category) ?? 0) + 1,
    );
  });

  return {
    entries: rangeEntries,
    entryCount: rangeEntries.length,
    activeDays: days.size,
    points: rangeEntries.reduce((total, entry) => total + calculateEntryPoints(entry), 0),
    categoryCounts,
  };
}

function getCategoryName(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.name ?? categoryId;
}

function getToneCopy(tone, copies) {
  return copies[tone] ?? copies.balanced;
}

export function createCoachReport(
  entries = [],
  preferences = DEFAULT_COACH_PREFERENCES,
  referenceDate = new Date(),
) {
  const resolvedPreferences = cleanPreferences(preferences);
  const end = normalizeChallengeDate(referenceDate);
  const currentStart = addDays(end, -6);
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -6);
  const current = summarizeRange(entries, currentStart, end);
  const previous = summarizeRange(entries, previousStart, previousEnd);
  const recommendations = [];

  if (current.activeDays < 4) {
    recommendations.push({
      id: "show-up-more-often",
      priority: 1,
      title: "Choose one small action for tomorrow",
      action: "Record one realistic activity on your next available day.",
      reason: `You were active on ${current.activeDays} of the last 7 days. A smaller repeatable action is more valuable than an ambitious plan that is difficult to sustain.`,
      category: "Consistency",
    });
  } else {
    recommendations.push({
      id: "protect-rhythm",
      priority: 2,
      title: "Protect the rhythm you have built",
      action: "Repeat one of this week’s easiest successful actions.",
      reason: `You were active on ${current.activeDays} of the last 7 days. Repeating a proven action is the safest way to preserve momentum.`,
      category: "Consistency",
    });
  }

  const focusCategoryIds = new Set(
    FOCUS_CATEGORY_IDS[resolvedPreferences.focus] ?? FOCUS_CATEGORY_IDS.balanced,
  );
  const focusCategories = CATEGORIES.filter((category) =>
    focusCategoryIds.has(category.id),
  );
  const leastUsedCategory = focusCategories
    .map((category) => ({
      category,
      count: current.categoryCounts.get(category.id) ?? 0,
    }))
    .sort((first, second) => first.count - second.count)[0];

  if (leastUsedCategory) {
    recommendations.push({
      id: `balance-${leastUsedCategory.category.id}`,
      priority: 3,
      title: `Give ${leastUsedCategory.category.name} a small turn`,
      action: `Choose the easiest honest ${leastUsedCategory.category.name.toLowerCase()} action that fits your day.`,
      reason: `${leastUsedCategory.category.name} had ${leastUsedCategory.count} recorded ${leastUsedCategory.count === 1 ? "entry" : "entries"} during the last 7 days. This is a balance suggestion, not a judgement.`,
      category: "Balance",
    });
  }

  const strongestCategory = [...current.categoryCounts.entries()]
    .filter(([categoryId]) => focusCategoryIds.has(categoryId))
    .sort((first, second) => second[1] - first[1])[0];

  if (strongestCategory) {
    recommendations.push({
      id: `celebrate-${strongestCategory[0]}`,
      priority: 4,
      title: `Recognise your ${getCategoryName(strongestCategory[0])} consistency`,
      action: "Keep the successful cue, time or routine that made this easier.",
      reason: `${getCategoryName(strongestCategory[0])} was your most frequently recorded category this week with ${strongestCategory[1]} entries.`,
      category: "Strength",
    });
  }

  const pointChange = current.points - previous.points;
  const entryChange = current.entryCount - previous.entryCount;
  const summary = getToneCopy(resolvedPreferences.tone, {
    gentle:
      current.entryCount > 0
        ? "You kept moving. Let the useful patterns stay and release the pressure to be perfect."
        : "A quiet week does not erase your progress. The next small action still counts.",
    balanced:
      current.entryCount > 0
        ? "Your recent data shows where consistency is working and where one practical adjustment may help."
        : "There are no recent entries to analyse yet, so the coach will focus on restarting gently.",
    direct:
      current.entryCount > 0
        ? "Keep what worked, reduce what created friction and choose the next action before motivation is required."
        : "Choose one small activity, record it honestly and rebuild from there.",
  });

  return {
    preferences: resolvedPreferences,
    period: {
      start: currentStart,
      end,
      startKey: getLocalDateKey(currentStart),
      endKey: getLocalDateKey(end),
    },
    current,
    previous,
    changes: {
      points: pointChange,
      entries: entryChange,
      activeDays: current.activeDays - previous.activeDays,
    },
    summary,
    recommendations: recommendations.sort((first, second) => first.priority - second.priority),
    evidence: [
      `${current.entryCount} entries during the last 7 days`,
      `${current.activeDays} active days during the last 7 days`,
      `${current.points} activity points during the last 7 days`,
      `${previous.entryCount} entries during the previous 7 days`,
      `Coaching focus: ${resolvedPreferences.focus}`,
    ],
  };
}
