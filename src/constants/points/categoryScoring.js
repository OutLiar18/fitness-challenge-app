import { POINTS } from "./points";

export const RUNNING_SCORING_RULES = Object.freeze({
  minimumDistanceKm: 3,
  maximumPaceSecondsPerKm: 11 * 60,
});

export const CATEGORY_SCORING = {
  water: { field: "amount", table: POINTS.water },
  fruit: { field: "servings", table: POINTS.fruit },
  reading: { field: "totalMinutes", table: POINTS.reading },
  running: { field: "distance", table: POINTS.running },
  cardio: { field: "totalMinutes", table: POINTS.cardio },
  skill: { field: "totalMinutes", table: POINTS.skill },
  steps: { field: "steps", table: POINTS.steps },
};
