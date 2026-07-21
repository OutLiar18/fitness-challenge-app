export function getMissionProgress(goals = []) {
  const completed = goals.filter(
    (goal) => goal.completed,
  ).length;

  const total = goals.length;

  return {
    completed,
    total,
    percentage:
      total === 0
        ? 0
        : Math.round((completed / total) * 100),
  };
}

export function getNextGoal(goals = []) {
  return (
    goals
      .filter((goal) => !goal.completed)
      .sort(
        (first, second) =>
          second.percentage - first.percentage,
      )[0] ?? null
  );
}