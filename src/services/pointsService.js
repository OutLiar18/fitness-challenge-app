import { POINTS } from "../constants/points";
import { WORKOUT_POINTS } from "../constants/workoutPoints";
import { CATEGORY_SCORING } from "../constants/categoryScoring";
import {
  getExercise,
  isStaticExercise,
} from "../services/exerciseLibraryService";

function getScoreFromTable(value, table) {
  let score = 0;

  for (const bracket of table) {
    if (value >= bracket.min) {
      score = bracket.points;
    } else {
      break;
    }
  }

  return score;
}

function calculateEffectiveReps(exercises = []) {
  let total = 0;

  for (const exercise of exercises) {
    const metadata = getExercise(exercise.exercise);

    if (!metadata) continue;

    let reps = Number(exercise.reps || 0);

    if (isStaticExercise(exercise.exercise)) {
      const seconds = Number(exercise.seconds || 0);
      reps = Math.floor(seconds / metadata.secondsPerRep);
    }

    total += reps * metadata.difficulty.multiplier;
  }

  return Math.round(total);
}

function getWorkoutScore(effectiveReps) {
  return getScoreFromTable(effectiveReps, WORKOUT_POINTS);
}

function calculateCategoryScore(category, data) {
  const config = CATEGORY_SCORING[category];

  if (!config) return null;

  const value = Number(data[config.field] || 0);

  if (category === "fruit") {
    return Math.min(value, 3);
  }

  return getScoreFromTable(value, config.table);
}

export function calculateEntryPoints(entry) {
  const data = entry.data || {};

  switch (entry.category) {
    case "water":
    case "fruit":
    case "reading":
    case "running":
    case "cardio":
    case "skill":
    case "steps":
      return calculateCategoryScore(entry.category, data);

    case "upperBody":
    case "lowerBody":
    case "core": {
      const effectiveReps = calculateEffectiveReps(data.exercises || []);
      return getWorkoutScore(effectiveReps);
    }

    default:
      return 0;
  }
}
