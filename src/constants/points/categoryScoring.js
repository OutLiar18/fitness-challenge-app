import { POINTS } from "./points";

export const CATEGORY_SCORING = {
  water: {
    field: "amount",
    table: POINTS.water,
  },

  fruit: {
    field: "servings",
    table: POINTS.fruit,
  },

  reading: {
    field: "totalMinutes",
    table: POINTS.reading,
  },

  running: {
    field: "distance",
    table: POINTS.running,
  },

  cardio: {
    field: "totalMinutes",
    table: POINTS.cardio,
  },

  skill: {
    field: "totalMinutes",
    table: POINTS.skill,
  },

  steps: {
    field: "steps",
    table: POINTS.steps,
  },
};
