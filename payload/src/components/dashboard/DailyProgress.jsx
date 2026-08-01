import { GOAL_PERIODS } from "../../constants/goals";
import { getMissionProgress, getNextGoal } from "../../services/statistics";
import {
  formatMeasurement,
  formatPoints,
  pluralize,
} from "../../utils/displayFormatters";
import "./DailyProgress.css";

export default function DailyProgress({
  goals,
  period = GOAL_PERIODS.DAILY,
}) {
  const mission = getMissionProgress(goals);
  const nextGoal = getNextGoal(goals);
  const complete = mission.total > 0 && mission.completed === mission.total;
  const weekly = period === GOAL_PERIODS.WEEKLY;
  const periodLabel = weekly ? "Weekly" : "Daily";
  const remaining = mission.total - mission.completed;
  const missionBonus = formatPoints(mission.bonusPoints);

  const heading = complete
    ? weekly
      ? "Weekly goals complete"
      : "Daily goals complete"
    : weekly
      ? "Build this week’s momentum"
      : "Build today’s momentum";

  return (
    <section className="daily-progress card" aria-labelledby="mission-title">
      <div className="daily-progress__header">
        <div>
          <p className="daily-progress__eyebrow">{periodLabel} mission</p>
          <h2 id="mission-title">{heading}</h2>
        </div>

        <span className="daily-progress__score">
          <strong>{mission.completed}</strong>/{mission.total}
        </span>
      </div>

      <div
        className="daily-progress__track"
        role="progressbar"
        aria-label={`${periodLabel} goals completed`}
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
            ? `Every goal is complete. You earned the ${missionBonus} mission bonus.`
            : `${remaining} ${pluralize(
                remaining,
                "goal",
                "goals",
              )} remaining. Complete every goal to earn ${missionBonus}.`}
        </span>
      </div>

      {!complete && nextGoal && (
        <div
          className="daily-progress__next"
          aria-label={`Closest goal: ${nextGoal.name}`}
        >
          <span className="daily-progress__next-icon" aria-hidden="true">
            {nextGoal.emoji}
          </span>

          <span>
            <small>Closest goal</small>
            <strong>{nextGoal.name}</strong>
          </span>

          <span className="daily-progress__next-value">
            {formatMeasurement(nextGoal.current, nextGoal.unit)} of{" "}
            {formatMeasurement(nextGoal.goal, nextGoal.unit)}
          </span>
        </div>
      )}
    </section>
  );
}
