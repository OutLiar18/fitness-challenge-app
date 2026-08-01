import { Link } from "react-router-dom";

import {
  formatExperiencePoints,
  formatNumber,
  formatPoints,
  pluralize,
} from "../../utils/displayFormatters";
import "./ProgressionCard.css";

function getStreakMessage(streak) {
  if (streak.status === "active") {
    return "Today’s effort is keeping your streak alive.";
  }

  if (streak.status === "pending" && streak.shieldAvailable > 0) {
    return "Complete one daily goal today. Your streak shield is available if life gets dramatic.";
  }

  if (streak.status === "pending") {
    return "Complete one daily goal today to continue your streak.";
  }

  return "Complete one daily goal to begin a new streak.";
}

export default function ProgressionCard({ progression }) {
  const { xp, streak, achievements, score } = progression;
  const recentAchievements = achievements.unlocked.slice(-3).reverse();

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
        <span>{formatExperiencePoints(xp.xpIntoLevel)}</span>
        <span>{formatExperiencePoints(xp.xpForNextLevel)}</span>
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

      <div className="progression-card__metrics">
        <article>
          <span aria-hidden="true">🔥</span>
          <strong>{streak.currentStreak}</strong>
          <small>Current streak</small>
        </article>

        <article>
          <span aria-hidden="true">🏅</span>
          <strong>{streak.longestStreak}</strong>
          <small>Longest streak</small>
        </article>

        <article>
          <span aria-hidden="true">⭐</span>
          <strong>{formatNumber(score.bonusPoints, { whole: true })}</strong>
          <small>Bonus points</small>
        </article>
      </div>

      <div className="progression-card__streak-status">
        <span aria-hidden="true">🛡️</span>

        <div>
          <strong>
            {streak.shieldAvailable > 0
              ? "Streak shield ready"
              : `${streak.daysUntilShield} successful ${pluralize(
                  streak.daysUntilShield,
                  "day",
                  "days",
                )} until the next shield`}
          </strong>

          <p>{getStreakMessage(streak)}</p>
        </div>
      </div>

      <div className="progression-card__achievements">
        <div className="progression-card__achievements-header">
          <strong>Achievements</strong>
          <span>
            {achievements.unlockedCount}/{achievements.total}
          </span>
        </div>

        {recentAchievements.length === 0 ? (
          <p className="progression-card__empty">
            Your first activity will begin your achievement collection.
          </p>
        ) : (
          <ul>
            {recentAchievements.map((achievement) => (
              <li key={achievement.id} title={achievement.description}>
                <span aria-hidden="true">{achievement.emoji}</span>
                <span>{achievement.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="progression-card__bonus-note">
        <strong>{formatPoints(score.bonusPoints)}</strong> earned from goals and
        consistency.
      </div>

      <Link
        className="button button--secondary progression-card__action"
        to="/progress"
      >
        View full progress
      </Link>
    </section>
  );
}
