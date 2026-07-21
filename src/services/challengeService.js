import { getDailyGoals } from "./statistics";

export function getNextCategory(entries = []) {
  const goals = getDailyGoals(entries);

  const nextGoal = goals.find(
    (goal) => !goal.completed,
  );

  return nextGoal?.id ?? null;
}