import "./DailyGoals.css";

export default function DailyGoals({
  goals,
  onSelect,
}) {
  return (
    <div className="daily-goals">
      <h2>🎯 Daily Goals</h2>

      {goals.map((goal) => (
        <div
          key={goal.id}
          className={`goal-card ${
            goal.completed ? "completed" : ""
          }`}
          onClick={() => onSelect(goal.id)}
        >
          <div className="goal-header">
            <span className="goal-title">
              {goal.emoji} {goal.name}
            </span>

            <span className="goal-value">
              {goal.current} / {goal.goal}
              {goal.unit
                ? ` ${goal.unit}`
                : ""}
            </span>
          </div>

          <div className="goal-bar">
            <div
              className="goal-progress"
              style={{
                width: `${goal.percentage}%`,
              }}
            />
          </div>

          <div className="goal-footer">
            {goal.completed ? (
              <span className="goal-complete">
                ✅ Goal Complete
              </span>
            ) : (
              <span className="goal-percent">
                {goal.percentage}% Complete
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}