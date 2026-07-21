import "./DailyProgress.css";

import {
  getMissionProgress,
  getNextGoal,
} from "../../services/statistics";

export default function DailyProgress({ goals }) {
  const mission = getMissionProgress(goals);

  const nextGoal = getNextGoal(goals);

  return (
    <div className="daily-progress">
      <h2>🔥 Today's Mission</h2>

      <div className="progress-big-bar">
        <div
          className="progress-big-fill"
          style={{
            width: `${mission.percentage}%`,
          }}
        />
      </div>

      <h3>
        {mission.completed} / {mission.total} Goals Complete
      </h3>

      <p>{mission.percentage}% Complete</p>

      {mission.completed === mission.total ? (
        <>
          <h2>🏆 Mission Complete!</h2>

          <p>
            Incredible work! Every daily goal has been
            completed.
          </p>
        </>
      ) : (
        <>
          <p>
            💪 Only{" "}
            {mission.total - mission.completed} goal
            {mission.total - mission.completed === 1
              ? ""
              : "s"}{" "}
            left today.
          </p>

          <hr />

          {nextGoal && (
            <>
              <h3>🎯 Next Quest</h3>

              <h2>
                {nextGoal.emoji} {nextGoal.name}
              </h2>

              <p>
                Progress: {nextGoal.current} /{" "}
                {nextGoal.goal}
                {nextGoal.unit
                  ? ` ${nextGoal.unit}`
                  : ""}
              </p>

              <p>
                Complete this goal to move one step
                closer to today's victory.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}