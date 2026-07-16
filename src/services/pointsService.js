import { POINTS } from "../constants/points";

export function calculateEntryPoints(entry) {
  const rules = POINTS[entry.category];

  if (!rules) return 0;

  const data = entry.data || {};

  switch (entry.category) {
    case "water":
      return (
        Math.floor((Number(data.amount) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "fruit":
      return (
        Math.floor((Number(data.quantity) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "reading":
      return (
        Math.floor((Number(data.minutes) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "running":
      return (
        Math.floor((Number(data.distance) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "cardio":
      return (
        Math.floor((Number(data.minutes) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "skill":
      return (
        Math.floor((Number(data.minutes) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "steps":
      return (
        Math.floor((Number(data.steps) || 0) / rules.unitSize) *
        rules.pointsPerUnit
      );

    case "upper_body":
    case "lower_body":
    case "core":
      return rules.pointsPerUnit;

    default:
      return 0;
  }
}
