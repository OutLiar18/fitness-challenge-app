import { getLocalDateKey, normalizeChallengeDate } from "../dateService";
import { getEntriesOnOrBefore } from "../statistics/filters";
import { getGoalBonusSummary } from "./goalBonusService";
import { getStreakSummary } from "./streakService";

export function getPointBonusSummary(entries = [], referenceDate = new Date()) {
  const eligibleEntries = getEntriesOnOrBefore(entries, referenceDate);
  const goalBonuses = getGoalBonusSummary(eligibleEntries, referenceDate);
  const streak = getStreakSummary(eligibleEntries, referenceDate);
  const todayKey = getLocalDateKey(normalizeChallengeDate(referenceDate));
  const streakPoints = streak.milestoneEvents.reduce(
    (total, event) => total + event.points,
    0,
  );
  const todayStreakPoints = streak.milestoneEvents
    .filter((event) => event.earnedDateKey === todayKey)
    .reduce((total, event) => total + event.points, 0);

  return {
    events: [...goalBonuses.events, ...streak.milestoneEvents].sort(
      (first, second) =>
        first.earnedDate - second.earnedDate || first.id.localeCompare(second.id),
    ),
    goalBonuses,
    streak,
    goalPoints: goalBonuses.totalPoints,
    streakPoints,
    totalPoints: goalBonuses.totalPoints + streakPoints,
    todayPoints: goalBonuses.todayPoints + todayStreakPoints,
  };
}
