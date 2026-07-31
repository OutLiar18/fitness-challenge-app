import "./DailyGoals.css";

export default function DailyGoals({ goals, onSelect }) {
  return (
    <section className="daily-goals card" aria-labelledby="daily-goals-title">
      <div className="daily-goals__header">
        <div>
          <p>Consistency dashboard</p>
          <h2 id="daily-goals-title">Today’s goals</h2>
        </div>
        <span>{goals.filter((goal) => goal.completed).length}/{goals.length} complete</span>
      </div>

      <div className="daily-goals__grid">
        {goals.map((goal) => (
          <button
            key={goal.id}
            type="button"
            className={`goal-card${goal.completed ? " goal-card--completed" : ""}`}
            onClick={() => onSelect(goal.id)}
            aria-label={`${goal.name}: ${goal.current} of ${goal.goal} ${goal.unit}. ${goal.percentage}% complete.`}
          >
            <span className="goal-card__topline">
              <span className="goal-card__title">
                <span className="goal-card__emoji" aria-hidden="true">{goal.emoji}</span>
                <span>{goal.name}</span>
              </span>
              <strong>{goal.percentage}%</strong>
            </span>

            <span className="goal-card__track" aria-hidden="true">
              <span className="goal-card__fill" style={{ width: `${goal.percentage}%` }} />
            </span>

            <span className="goal-card__footer">
              <span>{goal.current} / {goal.goal}{goal.unit ? ` ${goal.unit}` : ""}</span>
              <span>{goal.completed ? "Complete ✓" : "Log activity →"}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
