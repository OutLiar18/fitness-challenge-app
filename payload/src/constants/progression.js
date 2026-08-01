export const PROGRESSION_RULESET_VERSION = "2026-07-v1";

export const GOAL_BONUS_POINTS = Object.freeze({
  dailyGoal: 1,
  dailyMission: 3,
  weeklyGoal: 2,
  weeklyMission: 8,
});

export const STREAK_CONFIGURATION = Object.freeze({
  successfulDayRequirement: "oneDailyGoal",
  shieldEarnInterval: 7,
  maximumShields: 1,
  milestones: [
    { days: 3, points: 1, xp: 5 },
    { days: 7, points: 3, xp: 15 },
    { days: 14, points: 5, xp: 25 },
    { days: 30, points: 10, xp: 50 },
    { days: 60, points: 15, xp: 75 },
    { days: 100, points: 25, xp: 125 },
    { days: 180, points: 40, xp: 200 },
    { days: 365, points: 75, xp: 375 },
  ],
});

export const XP_REWARDS = Object.freeze({
  uniqueCategoryPerDay: 2,
  dailyGoal: 5,
  dailyMission: 10,
  weeklyGoal: 8,
  weeklyMission: 25,
});

export const LEVEL_CONFIGURATION = Object.freeze({
  firstLevelXp: 100,
  levelStepXp: 25,
  titles: [
    { minimumLevel: 50, title: "Living Legend" },
    { minimumLevel: 35, title: "Legacy Builder" },
    { minimumLevel: 20, title: "Champion" },
    { minimumLevel: 10, title: "Dedicated" },
    { minimumLevel: 5, title: "Building Momentum" },
    { minimumLevel: 1, title: "Beginning the Journey" },
  ],
});

export const PROGRESSION_ACHIEVEMENTS = [
  {
    id: "first-entry",
    emoji: "🌱",
    name: "First Step",
    description: "Record your first activity.",
  },
  {
    id: "first-goal",
    emoji: "🎯",
    name: "Goal Getter",
    description: "Complete your first daily goal.",
  },
  {
    id: "perfect-day",
    emoji: "☀️",
    name: "Perfect Day",
    description: "Complete every daily goal in one day.",
  },
  {
    id: "perfect-week",
    emoji: "🗓️",
    name: "Perfect Week",
    description: "Complete every weekly goal in one week.",
  },
  {
    id: "streak-3",
    emoji: "🔥",
    name: "Spark",
    description: "Build a 3-day consistency streak.",
  },
  {
    id: "streak-7",
    emoji: "🔥",
    name: "Momentum",
    description: "Build a 7-day consistency streak.",
  },
  {
    id: "streak-14",
    emoji: "🔥",
    name: "Committed",
    description: "Build a 14-day consistency streak.",
  },
  {
    id: "streak-30",
    emoji: "🏅",
    name: "Unshakeable",
    description: "Build a 30-day consistency streak.",
  },
  {
    id: "level-5",
    emoji: "⚡",
    name: "Momentum Builder",
    description: "Reach personal level 5.",
  },
  {
    id: "level-10",
    emoji: "🏆",
    name: "Dedicated",
    description: "Reach personal level 10.",
  },
];
