import { getMissionProgress, getNextGoal } from "../../services/statistics";
import "./DailyProgress.css";

export default function DailyProgress({ goals }) {
  const mission = getMissionProgress(goals);
  const nextGoal = getNextGoal(goals);
  const complete = mission.total > 0 && mission.completed === mission.total;

  return (
    <section className="daily-progress card" aria-labelledby="mission-title">
      <div className="daily-progress__header">
        <div>
          <p className="daily-progress__eyebrow">Daily mission</p>
          <h2 id="mission-title">
            {complete ? "Mission complete" : "Build today’s momentum"}
          </h2>
        </div>
        <span className="daily-progress__score">
          {mission.completed}/{mission.total}
        </span>
      </div>

      <div
        className="daily-progress__track"
        role="progressbar"
        aria-label="Daily goals completed"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={mission.percentage}
      >
        <div
          className="daily-progress__fill"
          style={{ width: `${mission.percentage}%` }}
        />
      </div>

      <div className="daily-progress__summary">
        <strong>{mission.percentage}% complete</strong>
        <span>
          {complete
            ? "Every goal is complete. Excellent work."
            : `${mission.total - mission.completed} goal${
                mission.total - mission.completed === 1 ? "" : "s"
              } remaining.`}
        </span>
      </div>

      {!complete && nextGoal && (
        <div
          className="daily-progress__next"
          aria-label={`Next recommended goal: ${nextGoal.name}`}
        >
          <span className="daily-progress__next-icon" aria-hidden="true">
            {nextGoal.emoji}
          </span>
          <span>
            <small>Closest goal</small>
            <strong>{nextGoal.name}</strong>
          </span>
          <span className="daily-progress__next-value">
            {nextGoal.current}/{nextGoal.goal} {nextGoal.unit}
          </span>
        </div>
      )}
    </section>
  );
}
