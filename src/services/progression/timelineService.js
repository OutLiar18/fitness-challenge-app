import { getLocalDateKey, normalizeChallengeDate } from "../dateService";
import { getEntryDate } from "./helpers";
import { calculateLevel, getLevelTitle } from "./xpService";

const EVENT_PRIORITY = Object.freeze({
  achievement: 5,
  "level-up": 4,
  "streak-milestone": 3,
  "daily-mission": 2,
  "weekly-mission": 2,
  "daily-goals": 1,
  "weekly-goals": 1,
});

function createTimelineEvent({
  id,
  type,
  icon,
  label,
  description = "",
  points = 0,
  xp = 0,
  earnedDate,
  metadata = {},
}) {
  const date = normalizeChallengeDate(earnedDate);

  if (!date) {
    return null;
  }

  return {
    id,
    type,
    icon,
    label,
    description,
    points: Number(points) || 0,
    xp: Number(xp) || 0,
    earnedDate: date,
    earnedDateKey: getLocalDateKey(date),
    metadata,
  };
}

function sortAscending(events = []) {
  return [...events].sort(
    (first, second) =>
      first.earnedDate - second.earnedDate || first.id.localeCompare(second.id),
  );
}

function sortDescending(events = []) {
  return [...events].sort((first, second) => {
    const dateDifference = second.earnedDate - first.earnedDate;

    if (dateDifference !== 0) {
      return dateDifference;
    }

    const priorityDifference =
      (EVENT_PRIORITY[second.type] ?? 0) - (EVENT_PRIORITY[first.type] ?? 0);

    return priorityDifference || first.id.localeCompare(second.id);
  });
}

function getGroupedGoalEvents(goalBonusEvents = []) {
  const groups = new Map();

  goalBonusEvents
    .filter((event) => event.type === "daily-goal" || event.type === "weekly-goal")
    .forEach((event) => {
      const period = event.type === "daily-goal" ? "daily" : "weekly";
      const groupKey = `${event.earnedDateKey}:${period}`;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          period,
          earnedDate: event.earnedDate,
          events: [],
        });
      }

      groups.get(groupKey).events.push(event);
    });

  return [...groups.entries()]
    .map(([groupKey, group]) => {
      const daily = group.period === "daily";
      const goalNames = group.events
        .map((event) =>
          event.label.replace(daily ? " daily goal" : " weekly goal", ""),
        )
        .sort();

      return createTimelineEvent({
        id: `goal-summary:${groupKey}`,
        type: daily ? "daily-goals" : "weekly-goals",
        icon: daily ? "🎯" : "🗓️",
        label: `Completed ${group.events.length} ${group.period} goal${
          group.events.length === 1 ? "" : "s"
        }`,
        description: goalNames.join(", "),
        points: group.events.reduce(
          (total, event) => total + Number(event.points || 0),
          0,
        ),
        xp: group.events.reduce(
          (total, event) => total + Number(event.xp || 0),
          0,
        ),
        earnedDate: group.earnedDate,
        metadata: {
          period: group.period,
          goalIds: group.events.map((event) => event.metadata?.goalId),
        },
      });
    })
    .filter(Boolean);
}

function getMissionEvents(goalBonusEvents = []) {
  return goalBonusEvents
    .filter(
      (event) => event.type === "daily-mission" || event.type === "weekly-mission",
    )
    .map((event) => {
      const daily = event.type === "daily-mission";

      return createTimelineEvent({
        id: `timeline:${event.id}`,
        type: event.type,
        icon: daily ? "☀️" : "🏆",
        label: event.label,
        description: daily
          ? "Completed every daily goal."
          : "Completed every weekly goal.",
        points: event.points,
        xp: event.xp,
        earnedDate: event.earnedDate,
        metadata: event.metadata,
      });
    })
    .filter(Boolean);
}

function getStreakEvents(streakMilestoneEvents = []) {
  return streakMilestoneEvents
    .map((event) =>
      createTimelineEvent({
        id: `timeline:${event.id}`,
        type: "streak-milestone",
        icon: "🔥",
        label: event.label,
        description: "Consistency milestone reached.",
        points: event.points,
        xp: event.xp,
        earnedDate: event.earnedDate,
        metadata: event.metadata,
      }),
    )
    .filter(Boolean);
}

function getLevelEvents(xpEvents = []) {
  const events = [];
  let cumulativeXp = 0;
  let previousLevel = 1;

  sortAscending(xpEvents).forEach((event) => {
    cumulativeXp += Number(event.xp || 0);
    const currentLevel = calculateLevel(cumulativeXp).level;

    while (previousLevel < currentLevel) {
      previousLevel += 1;
      events.push(
        createTimelineEvent({
          id: `level-up:${previousLevel}`,
          type: "level-up",
          icon: "⚡",
          label: `Reached Level ${previousLevel}`,
          description: `Personal title: ${getLevelTitle(previousLevel)}.`,
          earnedDate: event.earnedDate,
          metadata: {
            level: previousLevel,
            title: getLevelTitle(previousLevel),
            cumulativeXp,
          },
        }),
      );
    }
  });

  return events.filter(Boolean);
}

function getFirstEntryDate(entries = []) {
  return (
    entries
      .map(getEntryDate)
      .filter(Boolean)
      .sort((first, second) => first - second)[0] ?? null
  );
}

function findFirstEvent(events, type) {
  return sortAscending(events).find((event) => event.type === type) ?? null;
}

function getAchievementDate({
  achievementId,
  entries,
  goalBonusEvents,
  streakMilestoneEvents,
  levelEvents,
}) {
  switch (achievementId) {
    case "first-entry":
      return getFirstEntryDate(entries);
    case "first-goal":
      return findFirstEvent(goalBonusEvents, "daily-goal")?.earnedDate;
    case "perfect-day":
      return findFirstEvent(goalBonusEvents, "daily-mission")?.earnedDate;
    case "perfect-week":
      return findFirstEvent(goalBonusEvents, "weekly-mission")?.earnedDate;
    case "streak-3":
    case "streak-7":
    case "streak-14":
    case "streak-30": {
      const days = Number(achievementId.replace("streak-", ""));
      return streakMilestoneEvents.find(
        (event) => Number(event.metadata?.days) === days,
      )?.earnedDate;
    }
    case "level-5":
    case "level-10": {
      const level = Number(achievementId.replace("level-", ""));
      return levelEvents.find(
        (event) => Number(event.metadata?.level) === level,
      )?.earnedDate;
    }
    default:
      return null;
  }
}

function getAchievementEvents({
  achievements,
  entries,
  goalBonusEvents,
  streakMilestoneEvents,
  levelEvents,
}) {
  return (achievements?.unlocked ?? [])
    .map((achievement) =>
      createTimelineEvent({
        id: `achievement:${achievement.id}`,
        type: "achievement",
        icon: achievement.emoji,
        label: achievement.name,
        description: achievement.description,
        xp: achievement.xp,
        earnedDate:
          achievement.earnedDate ??
          getAchievementDate({
            achievementId: achievement.id,
            entries,
            goalBonusEvents,
            streakMilestoneEvents,
            levelEvents,
          }),
        metadata: {
          achievementId: achievement.id,
          difficulty: achievement.difficulty,
          family: achievement.family,
        },
      }),
    )
    .filter(Boolean);
}

export function getProgressTimeline({
  entries = [],
  goalBonusEvents = [],
  streakMilestoneEvents = [],
  xpEvents = [],
  achievements = { unlocked: [] },
}) {
  const levelEvents = getLevelEvents(xpEvents);

  const events = [
    ...getGroupedGoalEvents(goalBonusEvents),
    ...getMissionEvents(goalBonusEvents),
    ...getStreakEvents(streakMilestoneEvents),
    ...levelEvents,
    ...getAchievementEvents({
      achievements,
      entries,
      goalBonusEvents,
      streakMilestoneEvents,
      levelEvents,
    }),
  ];

  const sortedEvents = sortDescending(events);

  return {
    events: sortedEvents,
    count: sortedEvents.length,
    latest: sortedEvents[0] ?? null,
  };
}
