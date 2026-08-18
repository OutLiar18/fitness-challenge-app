import { LEVEL_CONFIGURATION, XP_REWARDS } from "../../constants/progression";
import {
  createProgressionEvent,
  getEntryDate,
  getSortedDateKeys,
  groupEntriesByDate,
} from "./helpers";

function getParticipationEvents(entries = []) {
  const groups = groupEntriesByDate(entries);
  const events = [];

  getSortedDateKeys(groups).forEach((dateKey) => {
    const dateEntries = groups.get(dateKey) ?? [];
    const date = getEntryDate(dateEntries[0]);
    const categoryIds = new Set(
      dateEntries.map((entry) => entry.category).filter(Boolean),
    );

    categoryIds.forEach((categoryId) => {
      events.push(
        createProgressionEvent({
          id: `participation:${dateKey}:${categoryId}`,
          type: "participation",
          label: `${categoryId} participation`,
          xp: XP_REWARDS.uniqueCategoryPerDay,
          earnedDate: date,
          metadata: { categoryId },
        }),
      );
    });
  });

  return events;
}

export function getXpRequiredForLevel(level) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));

  if (safeLevel >= LEVEL_CONFIGURATION.maxLevel) {
    return 0;
  }

  return (
    LEVEL_CONFIGURATION.firstLevelXp +
    (safeLevel - 1) * LEVEL_CONFIGURATION.levelStepXp
  );
}

export function getTotalXpRequiredForLevel(level) {
  const targetLevel = Math.max(
    1,
    Math.min(
      LEVEL_CONFIGURATION.maxLevel,
      Math.floor(Number(level) || 1),
    ),
  );
  let total = 0;

  for (let current = 1; current < targetLevel; current += 1) {
    total += getXpRequiredForLevel(current);
  }

  return total;
}

export function getLevelTitle(level) {
  const safeLevel = Math.max(
    1,
    Math.min(
      LEVEL_CONFIGURATION.maxLevel,
      Math.floor(Number(level) || 1),
    ),
  );

  return (
    LEVEL_CONFIGURATION.titles.find(
      (item) => safeLevel >= item.minimumLevel,
    )?.title ?? "Initiate"
  );
}

export function calculateLevel(totalXp = 0) {
  const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));
  let level = 1;
  let xpIntoLevel = safeXp;

  while (level < LEVEL_CONFIGURATION.maxLevel) {
    const required = getXpRequiredForLevel(level);

    if (required <= 0 || xpIntoLevel < required) {
      break;
    }

    xpIntoLevel -= required;
    level += 1;
  }

  if (level >= LEVEL_CONFIGURATION.maxLevel) {
    return {
      level: LEVEL_CONFIGURATION.maxLevel,
      title: getLevelTitle(LEVEL_CONFIGURATION.maxLevel),
      totalXp: safeXp,
      xpIntoLevel: 0,
      xpForNextLevel: 0,
      xpToNextLevel: 0,
      percentage: 100,
      maximumLevel: true,
    };
  }

  const xpForNextLevel = getXpRequiredForLevel(level);

  return {
    level,
    title: getLevelTitle(level),
    totalXp: safeXp,
    xpIntoLevel,
    xpForNextLevel,
    xpToNextLevel: xpForNextLevel - xpIntoLevel,
    percentage: Math.min(
      100,
      Math.round((xpIntoLevel / xpForNextLevel) * 100),
    ),
    maximumLevel: false,
  };
}

export function getXpSummary(
  entries = [],
  goalBonusEvents = [],
  streakMilestoneEvents = [],
  achievementEvents = [],
) {
  const participationEvents = getParticipationEvents(entries);
  const safeAchievementEvents = (achievementEvents ?? []).filter(
    (event) => event?.type === "achievement" && Number(event.xp) > 0,
  );
  const events = [
    ...participationEvents,
    ...goalBonusEvents,
    ...streakMilestoneEvents,
    ...safeAchievementEvents,
  ].filter((event) => Number(event.xp) > 0);
  const totalXp = events.reduce(
    (total, event) => total + Number(event.xp || 0),
    0,
  );

  return {
    ...calculateLevel(totalXp),
    events,
    participationXp: participationEvents.reduce(
      (total, event) => total + Number(event.xp || 0),
      0,
    ),
    goalXp: goalBonusEvents.reduce(
      (total, event) => total + Number(event.xp || 0),
      0,
    ),
    streakXp: streakMilestoneEvents.reduce(
      (total, event) => total + Number(event.xp || 0),
      0,
    ),
    achievementXp: safeAchievementEvents.reduce(
      (total, event) => total + Number(event.xp || 0),
      0,
    ),
  };
}
