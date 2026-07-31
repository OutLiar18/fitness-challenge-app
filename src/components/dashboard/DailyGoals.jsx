import { GOAL_PERIODS } from "../../constants/goals";
import "./DailyGoals.css";

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

function formatValue(value) {
  const number = Number(value);

  return Number.isFinite(number) ? numberFormatter.format(number) : "0";
}

function getEntryRequirement(goal) {
  if (!goal.minimumEntries) {
    return "";
  }

  const label = goal.minimumEntries === 1 ? "run" : "runs";

  return `${goal.entryCount}/${goal.minimumEntries} ${label} logged`;
}

export default function DailyGoals({
  goals,
  period = GOAL_PERIODS.DAILY,
  onPeriodChange,
  onSelect,
}) {
  const weekly = period === GOAL_PERIODS.WEEKLY;
  const completed = goals.filter((goal) => goal.completed).length;
  const title = weekly ? "This week’s goals" : "Today’s goals";

  return (
    <section
      className="daily-goals card"
      aria-labelledby="dashboard-goals-title"
    >
      <div className="daily-goals__header">
        <div>
          <p>Consistency dashboard</p>
          <h2 id="dashboard-goals-title">{title}</h2>
        </div>

        <span>
          {completed}/{goals.length} complete
        </span>
      </div>

      <div className="goal-period-tabs" role="tablist" aria-label="Goal period">
        <button
          id="daily-goals-tab"
          type="button"
          role="tab"
          className={`goal-period-tab${
            !weekly ? " goal-period-tab--active" : ""
          }`}
          aria-selected={!weekly}
          aria-controls="goal-period-panel"
          onClick={() => onPeriodChange(GOAL_PERIODS.DAILY)}
        >
          Daily
        </button>

        <button
          id="weekly-goals-tab"
          type="button"
          role="tab"
          className={`goal-period-tab${
            weekly ? " goal-period-tab--active" : ""
          }`}
          aria-selected={weekly}
          aria-controls="goal-period-panel"
          onClick={() => onPeriodChange(GOAL_PERIODS.WEEKLY)}
        >
          Weekly
        </button>
      </div>

      <div
        id="goal-period-panel"
        className="daily-goals__grid"
        role="tabpanel"
        aria-labelledby={weekly ? "weekly-goals-tab" : "daily-goals-tab"}
      >
        {goals.map((goal) => {
          const requirement = getEntryRequirement(goal);
          const categoryId = goal.categoryId ?? goal.id;

          return (
            <button
              key={goal.goalId ?? goal.id}
              type="button"
              className={`goal-card${
                goal.completed ? " goal-card--completed" : ""
              }`}
              onClick={() => onSelect(categoryId)}
              aria-label={`${goal.name}: ${formatValue(
                goal.current,
              )} of ${formatValue(goal.goal)} ${
                goal.unit
              }. ${goal.percentage}% complete.${
                requirement ? ` ${requirement}.` : ""
              }`}
            >
              <span className="goal-card__topline">
                <span className="goal-card__title">
                  <span className="goal-card__emoji" aria-hidden="true">
                    {goal.emoji}
                  </span>

                  <span>{goal.name}</span>
                </span>

                <strong>{goal.percentage}%</strong>
              </span>

              <span className="goal-card__track" aria-hidden="true">
                <span
                  className="goal-card__fill"
                  style={{
                    width: `${goal.percentage}%`,
                  }}
                />
              </span>

              <span className="goal-card__footer">
                <span>
                  {formatValue(goal.current)} / {formatValue(goal.goal)}
                  {goal.unit ? ` ${goal.unit}` : ""}
                </span>

                <span>{goal.completed ? "Complete ✓" : "Log activity →"}</span>
              </span>

              {requirement && (
                <span className="goal-card__requirement">{requirement}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
