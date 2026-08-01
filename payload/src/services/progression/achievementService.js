import { PROGRESSION_ACHIEVEMENTS } from "../../constants/progression";

function isAchievementUnlocked(id, context) {
  switch (id) {
    case "first-entry":
      return context.entryCount >= 1;
    case "first-goal":
      return context.completedDailyGoals >= 1;
    case "perfect-day":
      return context.perfectDays >= 1;
    case "perfect-week":
      return context.perfectWeeks >= 1;
    case "streak-3":
      return context.longestStreak >= 3;
    case "streak-7":
      return context.longestStreak >= 7;
    case "streak-14":
      return context.longestStreak >= 14;
    case "streak-30":
      return context.longestStreak >= 30;
    case "level-5":
      return context.level >= 5;
    case "level-10":
      return context.level >= 10;
    default:
      return false;
  }
}

export function getAchievementSummary(context) {
  const achievements = PROGRESSION_ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: isAchievementUnlocked(achievement.id, context),
  }));

  return {
    achievements,
    unlocked: achievements.filter((achievement) => achievement.unlocked),
    locked: achievements.filter((achievement) => !achievement.unlocked),
    total: achievements.length,
    unlockedCount: achievements.filter((achievement) => achievement.unlocked)
      .length,
  };
}
