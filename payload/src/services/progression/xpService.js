import { LEVEL_CONFIGURATION, XP_REWARDS } from "../../constants/progression";
import { createProgressionEvent, getEntryDate, getSortedDateKeys, groupEntriesByDate } from "./helpers";

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

  return (
    LEVEL_CONFIGURATION.firstLevelXp +
    (safeLevel - 1) * LEVEL_CONFIGURATION.levelStepXp
  );
}

export function getLevelTitle(level) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));

  return (
    LEVEL_CONFIGURATION.titles.find(
      (item) => safeLevel >= item.minimumLevel,
    )?.title ?? "Beginning the Journey"
  );
}

export function calculateLevel(totalXp = 0) {
  const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));
  let level = 1;
  let xpIntoLevel = safeXp;
  let xpForNextLevel = getXpRequiredForLevel(level);

  while (xpIntoLevel >= xpForNextLevel) {
    xpIntoLevel -= xpForNextLevel;
    level += 1;
    xpForNextLevel = getXpRequiredForLevel(level);
  }

  return {
    level,
    title: getLevelTitle(level),
    totalXp: safeXp,
    xpIntoLevel,
    xpForNextLevel,
    xpToNextLevel: xpForNextLevel - xpIntoLevel,
    percentage: Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)),
  };
}

export function getXpSummary(
  entries = [],
  goalBonusEvents = [],
  streakMilestoneEvents = [],
) {
  const participationEvents = getParticipationEvents(entries);
  const events = [
    ...participationEvents,
    ...goalBonusEvents,
    ...streakMilestoneEvents,
  ].filter((event) => event.xp > 0);
  const totalXp = events.reduce((total, event) => total + event.xp, 0);

  return {
    ...calculateLevel(totalXp),
    events,
    participationXp: participationEvents.reduce(
      (total, event) => total + event.xp,
      0,
    ),
    goalXp: goalBonusEvents.reduce((total, event) => total + event.xp, 0),
    streakXp: streakMilestoneEvents.reduce(
      (total, event) => total + event.xp,
      0,
    ),
  };
}
