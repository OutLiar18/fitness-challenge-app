export const PROGRESSION_RULESET_VERSION = "2026-08-v2";

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

export const ACHIEVEMENT_DIFFICULTY = Object.freeze({
  starter: Object.freeze({ label: "Starter", xp: 25 }),
  bronze: Object.freeze({ label: "Bronze", xp: 50 }),
  silver: Object.freeze({ label: "Silver", xp: 125 }),
  gold: Object.freeze({ label: "Gold", xp: 300 }),
  epic: Object.freeze({ label: "Epic", xp: 750 }),
  legendary: Object.freeze({ label: "Legendary", xp: 2000 }),
});

export const LEVEL_CONFIGURATION = Object.freeze({
  firstLevelXp: 150,
  levelStepXp: 70,
  maxLevel: 100,
  targetYears: 10,
  titles: Object.freeze([
    { minimumLevel: 100, title: "Living Legend" },
    { minimumLevel: 95, title: "Immortal Standard" },
    { minimumLevel: 90, title: "Legacy Warden" },
    { minimumLevel: 85, title: "Mythic Competitor" },
    { minimumLevel: 80, title: "Titan of Discipline" },
    { minimumLevel: 75, title: "Grandmaster" },
    { minimumLevel: 70, title: "Paragon" },
    { minimumLevel: 65, title: "Unbroken" },
    { minimumLevel: 60, title: "Master of Momentum" },
    { minimumLevel: 55, title: "Elite Champion" },
    { minimumLevel: 50, title: "Champion" },
    { minimumLevel: 45, title: "Legacy Forger" },
    { minimumLevel: 40, title: "Battle Tested" },
    { minimumLevel: 35, title: "Standard Bearer" },
    { minimumLevel: 30, title: "Vanguard" },
    { minimumLevel: 25, title: "Relentless Builder" },
    { minimumLevel: 20, title: "Proven Competitor" },
    { minimumLevel: 15, title: "Iron Habit" },
    { minimumLevel: 10, title: "Disciplined Challenger" },
    { minimumLevel: 5, title: "Momentum Seeker" },
    { minimumLevel: 1, title: "Initiate" },
  ]),
});

function createAchievement({
  id,
  family,
  categoryId = "",
  emoji,
  name,
  description,
  requirement,
  difficulty,
  metric,
  hidden = false,
  xp = null,
}) {
  const tier = ACHIEVEMENT_DIFFICULTY[difficulty];

  if (!tier) {
    throw new Error(`Unknown achievement difficulty: ${difficulty}`);
  }

  return Object.freeze({
    id,
    family,
    categoryId,
    emoji,
    name,
    description,
    requirement,
    difficulty,
    difficultyLabel: tier.label,
    xp: Number.isFinite(Number(xp)) && Number(xp) > 0 ? Number(xp) : tier.xp,
    hidden,
    metric: Object.freeze({ ...metric }),
  });
}

function createLadder({
  family,
  categoryId = family,
  emoji,
  metricType = "categoryTotal",
  steps,
}) {
  return steps.map((step) =>
    createAchievement({
      id: `${family}-${step.id}`,
      family,
      categoryId,
      emoji,
      name: step.name,
      description: step.description,
      requirement: step.requirement,
      difficulty: step.difficulty,
      hidden: Boolean(step.hidden),
      xp: step.xp,
      metric: {
        type: metricType,
        categoryId,
        target: step.target,
      },
    }),
  );
}

const FOUNDATION_ACHIEVEMENTS = [
  createAchievement({
    id: "first-entry",
    family: "foundation",
    emoji: "🌱",
    name: "First Step",
    description: "The journey has a first line in the record.",
    requirement: "Record your first activity.",
    difficulty: "starter",
    metric: { type: "entryCount", target: 1 },
  }),
  createAchievement({
    id: "first-goal",
    family: "foundation-goals",
    emoji: "🎯",
    name: "Goal Getter",
    description: "One goal moved from intention to fact.",
    requirement: "Complete your first daily goal.",
    difficulty: "starter",
    metric: { type: "dailyGoalCount", target: 1 },
  }),
  createAchievement({
    id: "perfect-day",
    family: "perfect-day",
    emoji: "☀️",
    name: "Perfect Day",
    description: "Every daily target answered on the same day.",
    requirement: "Complete every daily goal in one day.",
    difficulty: "bronze",
    metric: { type: "perfectDays", target: 1 },
  }),
  createAchievement({
    id: "perfect-week",
    family: "perfect-week",
    emoji: "🗓️",
    name: "Perfect Week",
    description: "A complete week with nothing left on the board.",
    requirement: "Complete every weekly goal in one week.",
    difficulty: "silver",
    metric: { type: "perfectWeeks", target: 1 },
  }),
];

const STREAK_ACHIEVEMENTS = [
  [3, "starter", "Spark"],
  [7, "bronze", "Momentum"],
  [14, "silver", "Committed"],
  [30, "gold", "Unshakeable"],
  [60, "gold", "Iron Rhythm"],
  [100, "epic", "Century of Discipline"],
  [180, "epic", "Half-Year Hammer"],
  [365, "legendary", "Year Unbroken"],
].map(([days, difficulty, name]) =>
  createAchievement({
    id: `streak-${days}`,
    family: "streak",
    emoji: days >= 100 ? "🔥" : "⚡",
    name,
    description: `${days} successful days belong to the record now.`,
    requirement: `Build a ${days}-day consistency streak.`,
    difficulty,
    metric: { type: "streak", target: days },
  }),
);

const LEVEL_ACHIEVEMENTS = [
  [5, "bronze", "Momentum Builder", null],
  [10, "silver", "Dedicated", null],
  [25, "gold", "Vanguard", null],
  [50, "epic", "Champion", null],
  [75, "legendary", "Grandmaster", null],
  [100, "legendary", "Living Legend", 3000],
].map(([level, difficulty, name, xp]) =>
  createAchievement({
    id: `level-${level}`,
    family: "level",
    emoji: level >= 50 ? "🏆" : "⚡",
    name,
    description: `Level ${level} is no longer ahead of you.`,
    requirement: `Reach personal level ${level}.`,
    difficulty,
    xp,
    metric: { type: "level", target: level },
  }),
);

const WATER_ACHIEVEMENTS = createLadder({
  family: "water",
  emoji: "💧",
  steps: [
    { id: "2l", target: 2000, difficulty: "starter", name: "First Reservoir", requirement: "Log 2 litres of water in total.", description: "Hydration is officially on the board." },
    { id: "25l", target: 25000, difficulty: "bronze", name: "Well Supplied", requirement: "Log 25 litres of water in total.", description: "The habit has started to hold water." },
    { id: "100l", target: 100000, difficulty: "silver", name: "Deep Well", requirement: "Log 100 litres of water in total.", description: "Consistency now runs deeper." },
    { id: "500l", target: 500000, difficulty: "gold", name: "Aquifer", requirement: "Log 500 litres of water in total.", description: "A long-running hydration reserve." },
    { id: "2000l", target: 2000000, difficulty: "epic", name: "Living Reservoir", requirement: "Log 2,000 litres of water in total.", description: "Years of ordinary discipline became extraordinary volume." },
    { id: "5000l", target: 5000000, difficulty: "legendary", name: "Ocean Within", requirement: "Log 5,000 litres of water in total.", description: "Somewhere along the way, the water bottle became a lifestyle.", hidden: true },
  ],
});

const FRUIT_ACHIEVEMENTS = createLadder({
  family: "fruit",
  emoji: "🍎",
  steps: [
    { id: "3", target: 3, difficulty: "starter", name: "First Harvest", requirement: "Log 3 fruit servings in total.", description: "The first harvest is in." },
    { id: "50", target: 50, difficulty: "bronze", name: "Fruit Basket", requirement: "Log 50 fruit servings in total.", description: "A habit is starting to fill the basket." },
    { id: "250", target: 250, difficulty: "silver", name: "Orchard Regular", requirement: "Log 250 fruit servings in total.", description: "You keep returning to the orchard." },
    { id: "1000", target: 1000, difficulty: "gold", name: "Harvest Keeper", requirement: "Log 1,000 fruit servings in total.", description: "Four digits of consistent nutrition." },
    { id: "3000", target: 3000, difficulty: "epic", name: "Orchard Master", requirement: "Log 3,000 fruit servings in total.", description: "The harvest became part of the routine." },
    { id: "7500", target: 7500, difficulty: "legendary", name: "Cornucopia", requirement: "Log 7,500 fruit servings in total.", description: "A ridiculous amount of fruit, earned one serving at a time.", hidden: true },
  ],
});

const READING_ACHIEVEMENTS = createLadder({
  family: "reading",
  emoji: "📚",
  steps: [
    { id: "60m", target: 60, difficulty: "starter", name: "First Chapter", requirement: "Read for 60 minutes in total.", description: "One focused hour opens the library." },
    { id: "10h", target: 600, difficulty: "bronze", name: "Ten-Hour Reader", requirement: "Read for 10 hours in total.", description: "Ten hours of deliberate reading." },
    { id: "50h", target: 3000, difficulty: "silver", name: "Fifty-Hour Scholar", requirement: "Read for 50 hours in total.", description: "The reading habit has real weight now." },
    { id: "250h", target: 15000, difficulty: "gold", name: "Deep Reader", requirement: "Read for 250 hours in total.", description: "A serious body of focused reading." },
    { id: "1000h", target: 60000, difficulty: "epic", name: "Thousand-Hour Mind", requirement: "Read for 1,000 hours in total.", description: "A thousand hours spent deliberately learning." },
    { id: "2500h", target: 150000, difficulty: "legendary", name: "Living Library", requirement: "Read for 2,500 hours in total.", description: "At this point the bookshelf is probably afraid of you.", hidden: true },
  ],
});

const BOOK_ACHIEVEMENTS = createLadder({
  family: "books",
  categoryId: "reading",
  emoji: "📖",
  metricType: "completedBooks",
  steps: [
    { id: "1", target: 1, difficulty: "starter", name: "Book Closed", requirement: "Finish 1 recorded book.", description: "One complete book added to the record." },
    { id: "10", target: 10, difficulty: "silver", name: "Shelf Builder", requirement: "Finish 10 recorded books.", description: "A shelf worth of completed reading." },
    { id: "50", target: 50, difficulty: "gold", name: "Bibliophile", requirement: "Finish 50 recorded books.", description: "Fifty endings, and more beginnings." },
    { id: "100", target: 100, difficulty: "epic", name: "Century of Books", requirement: "Finish 100 recorded books.", description: "A century of books completed." },
  ],
});

const RUNNING_ACHIEVEMENTS = createLadder({
  family: "running",
  emoji: "🏃",
  metricType: "categorySingle",
  steps: [
    { id: "1k", target: 1, difficulty: "starter", name: "First Kilometre", requirement: "Complete a single run of at least 1 km.", description: "The first kilometre is recorded." },
    { id: "3k", target: 3, difficulty: "bronze", name: "Three-Kilometre Mark", requirement: "Complete a single run of at least 3 km.", description: "Three kilometres without negotiating it down." },
    { id: "5k", target: 5, difficulty: "bronze", name: "Five-Kilometre Mark", requirement: "Complete a single run of at least 5 km.", description: "A proper five on the board." },
    { id: "10k", target: 10, difficulty: "silver", name: "Double Digits", requirement: "Complete a single run of at least 10 km.", description: "Distance reaches double digits." },
    { id: "15k", target: 15, difficulty: "silver", name: "Fifteen Strong", requirement: "Complete a single run of at least 15 km.", description: "Fifteen kilometres of proof." },
    { id: "20k", target: 20, difficulty: "gold", name: "Twenty-Kilometre Mark", requirement: "Complete a single run of at least 20 km.", description: "Twenty kilometres changes what long means." },
    { id: "half", target: 21.1, difficulty: "gold", name: "Half Marathon", requirement: "Complete a single run of at least 21.1 km.", description: "Half-marathon distance belongs to you." },
    { id: "marathon", target: 42.2, difficulty: "epic", xp: 1500, name: "Marathoner", requirement: "Complete a single run of at least 42.2 km.", description: "Marathon distance. No small feat." },
    { id: "ultra50", target: 50, difficulty: "legendary", xp: 3000, name: "Ultra Runner", requirement: "Complete a single run of at least 50 km.", description: "The road kept going, so did you." },
    { id: "ultra100", target: 100, difficulty: "legendary", xp: 7000, name: "Beyond the Map", requirement: "Complete a single run of at least 100 km.", description: "This stopped being a normal run a long time ago.", hidden: true },
  ],
});

function workoutLadder(family, emoji, label) {
  return createLadder({
    family,
    emoji,
    metricType: "workoutTotal",
    steps: [
      { id: "50", target: 50, difficulty: "starter", name: `${label} Foundation`, requirement: `Record 50 ${label.toLowerCase()} effective repetitions in total.`, description: "The foundation is set." },
      { id: "500", target: 500, difficulty: "bronze", name: `${label} Builder`, requirement: `Record 500 ${label.toLowerCase()} effective repetitions in total.`, description: "Repetition is becoming capacity." },
      { id: "2500", target: 2500, difficulty: "silver", name: `${label} Engine`, requirement: `Record 2,500 ${label.toLowerCase()} effective repetitions in total.`, description: "The engine is getting difficult to ignore." },
      { id: "10000", target: 10000, difficulty: "gold", name: `${label} Forge`, requirement: `Record 10,000 ${label.toLowerCase()} effective repetitions in total.`, description: "Ten thousand effective repetitions forged over time." },
      { id: "50000", target: 50000, difficulty: "epic", name: `${label} Titan`, requirement: `Record 50,000 ${label.toLowerCase()} effective repetitions in total.`, description: "This is no longer a short-term training phase." },
      { id: "150000", target: 150000, difficulty: "legendary", name: `${label} Legacy`, requirement: `Record 150,000 ${label.toLowerCase()} effective repetitions in total.`, description: "A training history measured in years.", hidden: true },
    ],
  });
}

const UPPER_BODY_ACHIEVEMENTS = workoutLadder("upperBody", "💪", "Upper-body");
const LOWER_BODY_ACHIEVEMENTS = workoutLadder("lowerBody", "🦵", "Lower-body");
const CORE_ACHIEVEMENTS = workoutLadder("core", "🔥", "Core");

const CARDIO_ACHIEVEMENTS = createLadder({
  family: "cardio",
  emoji: "❤️",
  steps: [
    { id: "15m", target: 15, difficulty: "starter", name: "Heart Started", requirement: "Record 15 cardio minutes in total.", description: "Conditioning has officially begun." },
    { id: "5h", target: 300, difficulty: "bronze", name: "Five Hours Moving", requirement: "Record 5 cardio hours in total.", description: "Five hours of deliberate conditioning." },
    { id: "25h", target: 1500, difficulty: "silver", name: "Conditioned", requirement: "Record 25 cardio hours in total.", description: "The engine is becoming dependable." },
    { id: "100h", target: 6000, difficulty: "gold", name: "Endurance Engine", requirement: "Record 100 cardio hours in total.", description: "A hundred hours under the hood." },
    { id: "500h", target: 30000, difficulty: "epic", name: "Cardio Veteran", requirement: "Record 500 cardio hours in total.", description: "Conditioning accumulated over the long haul." },
    { id: "1500h", target: 90000, difficulty: "legendary", name: "Endurance Legend", requirement: "Record 1,500 cardio hours in total.", description: "An endurance history measured in years.", hidden: true },
  ],
});

const SKILL_ACHIEVEMENTS = createLadder({
  family: "skill",
  emoji: "🎯",
  steps: [
    { id: "15m", target: 15, difficulty: "starter", name: "Practice Begins", requirement: "Record 15 skill-development minutes in total.", description: "Deliberate practice is on the board." },
    { id: "5h", target: 300, difficulty: "bronze", name: "Focused Five", requirement: "Record 5 skill-development hours in total.", description: "Five hours of deliberate practice." },
    { id: "25h", target: 1500, difficulty: "silver", name: "Apprentice Hours", requirement: "Record 25 skill-development hours in total.", description: "Enough practice to notice the difference." },
    { id: "100h", target: 6000, difficulty: "gold", name: "Craft Builder", requirement: "Record 100 skill-development hours in total.", description: "One hundred hours invested in getting better." },
    { id: "500h", target: 30000, difficulty: "epic", name: "Master in Motion", requirement: "Record 500 skill-development hours in total.", description: "Skill compounds when practice stays deliberate." },
    { id: "1500h", target: 90000, difficulty: "legendary", name: "Lifelong Craftsman", requirement: "Record 1,500 skill-development hours in total.", description: "Practice became part of a life.", hidden: true },
  ],
});

const STEP_ACHIEVEMENTS = createLadder({
  family: "steps",
  emoji: "👣",
  steps: [
    { id: "10k", target: 10000, difficulty: "starter", name: "Ten Thousand", requirement: "Record 10,000 steps in total.", description: "The first ten thousand are behind you." },
    { id: "100k", target: 100000, difficulty: "bronze", name: "Hundred Thousand", requirement: "Record 100,000 steps in total.", description: "Six digits of movement." },
    { id: "500k", target: 500000, difficulty: "silver", name: "Half Million", requirement: "Record 500,000 steps in total.", description: "Half a million steps accumulated." },
    { id: "2m", target: 2000000, difficulty: "gold", name: "Two Million", requirement: "Record 2,000,000 steps in total.", description: "The distance is becoming hard to picture." },
    { id: "10m", target: 10000000, difficulty: "epic", name: "Ten Million", requirement: "Record 10,000,000 steps in total.", description: "Eight digits of movement." },
    { id: "30m", target: 30000000, difficulty: "legendary", name: "Thirty Million", requirement: "Record 30,000,000 steps in total.", description: "A long road made from ordinary days.", hidden: true },
  ],
});

export const PROGRESSION_ACHIEVEMENTS = Object.freeze([
  ...FOUNDATION_ACHIEVEMENTS,
  ...STREAK_ACHIEVEMENTS,
  ...LEVEL_ACHIEVEMENTS,
  ...WATER_ACHIEVEMENTS,
  ...FRUIT_ACHIEVEMENTS,
  ...READING_ACHIEVEMENTS,
  ...BOOK_ACHIEVEMENTS,
  ...RUNNING_ACHIEVEMENTS,
  ...UPPER_BODY_ACHIEVEMENTS,
  ...LOWER_BODY_ACHIEVEMENTS,
  ...CORE_ACHIEVEMENTS,
  ...CARDIO_ACHIEVEMENTS,
  ...SKILL_ACHIEVEMENTS,
  ...STEP_ACHIEVEMENTS,
]);
