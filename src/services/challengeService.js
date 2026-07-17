import { getDailyGoals } from "./statisticsService";

export function getNextCategory(entries) {
  const goals = getDailyGoals(entries);

  const next = goals.find((goal) => !goal.completed);

  return next ? next.id : null;
}