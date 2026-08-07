import { DEFAULT_LEAGUE_RULESET } from "../../constants/leagues";
import { DIFFICULTY } from "../../constants/libraries/difficulty";
import { GOAL_BONUS_POINTS } from "../../constants/progression";
import { POINTS } from "../../constants/points/points";
import { WORKOUT_POINTS } from "../../constants/points/workoutPoints";
import { RUNNING_SCORING_RULES } from "../../constants/points/categoryScoring";
import { FRUIT_POINTS_PER_SERVING } from "./categoryPoints";

export const POINTS_GUIDE_VERSION = "points-v3";

export function createThresholdRows(table = [], increment = 1) {
  if (table.length === 0) {
    return [];
  }

  const firstMinimum = table[0].min;
  const zeroPointRows =
    firstMinimum > 0
      ? [
          {
            minimum: 0,
            maximum: firstMinimum - increment,
            points: 0,
          },
        ]
      : [];

  return [
    ...zeroPointRows,
    ...table.map((bracket, index) => {
      const next = table[index + 1];

      return {
        minimum: bracket.min,
        maximum: next ? next.min - increment : null,
        points: bracket.points,
      };
    }),
  ];
}

function createTableGuide({
  id,
  name,
  icon,
  unit,
  table,
  increment = 1,
  intro,
  footnote = "",
  accent = "blue",
}) {
  return Object.freeze({
    id,
    name,
    icon,
    unit,
    type: "table",
    rows: Object.freeze(createThresholdRows(table, increment)),
    intro,
    footnote,
    accent,
  });
}

export const ACTIVITY_POINT_GUIDES = Object.freeze([
  createTableGuide({
    id: "steps",
    name: "Steps",
    icon: "👣",
    unit: "steps",
    table: POINTS.steps,
    intro: "Daily movement begins earning points at 3,000 steps.",
    accent: "cyan",
  }),
  createTableGuide({
    id: "water",
    name: "Water",
    icon: "💧",
    unit: "ml",
    table: POINTS.water,
    intro: "Plain still water begins earning points at 500 millilitres.",
    accent: "blue",
  }),
  Object.freeze({
    id: "fruit",
    name: "Fruit",
    icon: "🍎",
    unit: "servings",
    type: "formula",
    formula: `Fruit points = whole servings × ${FRUIT_POINTS_PER_SERVING}`,
    intro: `Each complete qualifying serving earns ${FRUIT_POINTS_PER_SERVING} points.`,
    examples: Object.freeze([
      { input: "0 servings", points: 0 },
      { input: "1 serving", points: FRUIT_POINTS_PER_SERVING },
      { input: "2 servings", points: FRUIT_POINTS_PER_SERVING * 2 },
      { input: "3 servings", points: FRUIT_POINTS_PER_SERVING * 3 },
      { input: "5 servings", points: FRUIT_POINTS_PER_SERVING * 5 },
    ]),
    accent: "red",
  }),
  createTableGuide({
    id: "reading",
    name: "Reading",
    icon: "📚",
    unit: "min",
    table: POINTS.reading,
    intro: "Focused reading begins earning points at 10 minutes.",
    accent: "purple",
  }),
  createTableGuide({
    id: "skill",
    name: "Skill Development",
    icon: "🎯",
    unit: "min",
    table: POINTS.skill,
    intro: "Deliberate skill practice begins earning points at 10 minutes.",
    accent: "gold",
  }),
  createTableGuide({
    id: "cardio",
    name: "Cardio",
    icon: "❤️",
    unit: "min",
    table: POINTS.cardio,
    intro: "Cardio uses duration points, followed by an activity difficulty multiplier.",
    footnote: "The chart shows base points before the difficulty multiplier.",
    accent: "red",
  }),
  createTableGuide({
    id: "running",
    name: "Running",
    icon: "🏃",
    unit: "km",
    table: POINTS.running,
    increment: 0.01,
    intro: "Running points require both the minimum distance and qualifying pace.",
    footnote: `Minimum ${RUNNING_SCORING_RULES.minimumDistanceKm} kilometres at ${Math.floor(
      RUNNING_SCORING_RULES.maximumPaceSecondsPerKm / 60,
    )}:00 per kilometre or faster. Running duration also receives Cardio points at Tier 3.`,
    accent: "green",
  }),
  createTableGuide({
    id: "workouts",
    name: "Body Workouts",
    icon: "💪",
    unit: "effective reps",
    table: WORKOUT_POINTS,
    intro: "Upper Body, Core and Lower Body share one Effective Repetitions table.",
    footnote: "Exercise difficulty is applied before this table is used.",
    accent: "orange",
  }),
]);

export const ACTIVITY_POINT_GUIDE_IDS = Object.freeze(
  ACTIVITY_POINT_GUIDES.map((guide) => guide.id),
);

export const DIFFICULTY_POINT_GUIDE = Object.freeze(
  Object.values(DIFFICULTY).map((difficulty) => ({
    tier: difficulty.tier,
    name: difficulty.name,
    multiplier: difficulty.multiplier,
  })),
);

export const PUBLIC_GOAL_BONUSES = Object.freeze([
  {
    id: "daily-goal",
    label: "Complete one daily goal",
    points: GOAL_BONUS_POINTS.dailyGoal,
    icon: "☀️",
  },
  {
    id: "perfect-day",
    label: "Complete every daily goal",
    points: GOAL_BONUS_POINTS.dailyMission,
    suffix: "additional",
    icon: "✨",
  },
  {
    id: "weekly-goal",
    label: "Complete one weekly goal",
    points: GOAL_BONUS_POINTS.weeklyGoal,
    icon: "🗓️",
  },
  {
    id: "perfect-week",
    label: "Complete every weekly goal",
    points: GOAL_BONUS_POINTS.weeklyMission,
    suffix: "additional",
    icon: "👑",
  },
]);

export const PUBLIC_POINT_FORMULAS = Object.freeze([
  {
    id: "cardio",
    label: "Cardio",
    formula: "Cardio points = round(base duration points × difficulty multiplier)",
  },
  {
    id: "dynamic-workout",
    label: "Workout repetitions",
    formula:
      "Effective repetitions = round(sum(repetitions × exercise difficulty multiplier))",
  },
  {
    id: "hold-workout",
    label: "Timed holds",
    formula:
      "Base repetitions = floor(seconds held ÷ configured seconds per repetition)",
  },
  {
    id: "running",
    label: "Qualifying run",
    formula:
      "Entry total = Running distance points + round(Cardio duration base points × 1.2)",
  },
]);

export const PUBLIC_LEAGUE_SCORING = Object.freeze({
  dailyActivityCap: DEFAULT_LEAGUE_RULESET.dailyActivityCap,
  dailyParticipationBonus: DEFAULT_LEAGUE_RULESET.dailyParticipationBonus,
  formula: `League day score = min(${DEFAULT_LEAGUE_RULESET.dailyActivityCap}, activity points) + ${DEFAULT_LEAGUE_RULESET.dailyParticipationBonus} when active`,
  note:
    "League score is a seasonal ranking value. It does not replace or reduce personal points. The same scored day is credited to the House represented when each contribution was earned.",
  houseFormula: "House score = sum of member league-day scores credited while representing that House",
  pocketFormula: "Stored Pocket activity = 0 points until activated; activation uses the normal category calculation",
  powerPlayFormula: "Eligible Power Play activity points = base competitive activity points × 2 or 3 before the daily activity cap",
  powerPlayExclusions: "Power Plays do not multiply goal, mission, streak, Experience Point, active-day, evidence-bonus or administrative adjustment points",
});

export function getActivityPointGuide(guideId) {
  return ACTIVITY_POINT_GUIDES.find((guide) => guide.id === guideId) ?? null;
}
