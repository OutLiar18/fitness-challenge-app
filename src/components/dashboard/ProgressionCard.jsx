import { Link } from "react-router-dom";

import { formatExperiencePoints } from "../../utils/displayFormatters";
import "./ProgressionCard.css";

export default function ProgressionCard({ progression }) {
  const { xp, streak, achievements } = progression;
  const nextAchievement =
    achievements.inProgress?.[0] ?? achievements.available?.[0] ?? null;
  const latestAchievement = achievements.unlocked?.slice(-1)[0] ?? null;
  const featuredAchievement = nextAchievement ?? latestAchievement;
  const achievementLabel = nextAchievement ? "Next achievement" : "Latest achievement";

  return (
    <section
      className="progression-card card"
      aria-labelledby="progression-title"
    >
      <div className="progression-card__header">
        <div>
          <p>Personal progression</p>
          <h2 id="progression-title">
            Level {xp.level} · {xp.title}
          </h2>
        </div>

        <span
          className="progression-card__level"
          aria-label={`Level ${xp.level}`}
        >
          {xp.level}
        </span>
      </div>

      <div className="progression-card__xp-summary">
        <span>
          {formatExperiencePoints(xp.xpIntoLevel)} / {formatExperiencePoints(xp.xpForNextLevel)}
        </span>
        <strong>{xp.percentage}%</strong>
      </div>

      <div
        className="progression-card__track"
        role="progressbar"
        aria-label="Progress to the next personal level"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={xp.percentage}
      >
        <span style={{ width: `${xp.percentage}%` }} />
      </div>

      <p className="progression-card__next-level">
        <strong>{formatExperiencePoints(xp.xpToNextLevel)}</strong> until Level{" "}
        {xp.level + 1}
      </p>

      <div className="progression-card__highlights">
        <article>
          <span className="progression-card__highlight-icon" aria-hidden="true">
            🔥
          </span>
          <div>
            <small>Current streak</small>
            <strong>{streak.currentStreak} days</strong>
          </div>
        </article>

        <article>
          <span className="progression-card__highlight-icon" aria-hidden="true">
            {featuredAchievement?.emoji ?? "🏅"}
          </span>
          <div>
            <small>{achievementLabel}</small>
            <strong>{featuredAchievement?.name ?? "First milestone awaits"}</strong>
            <span>
              {featuredAchievement?.requirement ??
                "Log your first activity to start the achievement trail."}
            </span>
          </div>
        </article>
      </div>

      <Link
        className="button button--secondary progression-card__action"
        to="/progress"
      >
        Open Progress
      </Link>
    </section>
  );
}
