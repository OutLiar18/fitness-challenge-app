import { POINTS } from "./points";

export const CATEGORY_SCORING = {
  water: {
    field: "amount",
    table: POINTS.water,
  },

  fruit: {
    field: "quantity",
    table: POINTS.fruit,
  },

  reading: {
    field: "minutes",
    table: POINTS.reading,
  },

  running: {
    field: "distance",
    table: POINTS.running,
  },

  cardio: {
    field: "minutes",
    table: POINTS.cardio,
  },

  skill: {
    field: "minutes",
    table: POINTS.skill,
  },

  steps: {
    field: "steps",
    table: POINTS.steps,
  },
};