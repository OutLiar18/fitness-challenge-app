import { useMemo } from "react";
import { Link } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import PageHeader from "../components/layout/PageHeader";
import ProgressTimeline from "../components/progression/ProgressTimeline";
import { LEVEL_CONFIGURATION } from "../constants/progression";
import usePlayerData from "../hooks/usePlayerData";
import {
  formatExperiencePoints,
  formatMeasurement,
  formatNumber,
  formatPaceLong,
  formatPoints,
  pluralize,
} from "../utils/displayFormatters";
import "./Progress.css";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime())
    ? dateFormatter.format(value)
    : "Date unavailable";
}

function formatRecordValue(record) {
  switch (record.unit) {
    case "seconds per km":
      return formatPaceLong(record.value);
    case "km":
    case "minutes":
    case "ml":
    case "steps":
    case "effective reps":
    case "points":
    case "category":
    case "categories":
      return formatMeasurement(record.value, record.unit);
    default:
      return formatMeasurement(record.value, record.unit ?? "");
  }
}

function getRecordDetail(record) {
  if (record.id === "highest-daily-points" && record.metadata?.bonusPoints > 0) {
    return `${formatPoints(
      record.metadata.activityPoints,
    )} from activities and ${formatPoints(record.metadata.bonusPoints)} in bonuses`;
  }

  if (record.id === "fastest-qualifying-run" && record.metadata?.distance) {
    return `${formatMeasurement(record.metadata.distance, "km")} qualifying run`;
  }

  if (record.id === "longest-reading-session" && record.metadata?.title) {
    return record.metadata.title;
  }

  if (record.id === "most-active-day" && record.metadata?.entryCount) {
    return `${formatNumber(record.metadata.entryCount, {
      whole: true,
    })} ${pluralize(record.metadata.entryCount, "entry", "entries")} recorded`;
  }

  return "";
}

function getStreakStatus(streak) {
  if (streak.status === "active") {
    return "Active today";
  }

  if (streak.status === "pending") {
    return "Complete one daily goal today";
  }

  return "Complete one daily goal to begin";
}

export default function Progress() {
  const { profile, user, progression, loading } = usePlayerData();
  const levelJourney = useMemo(
    () =>
      [...LEVEL_CONFIGURATION.titles].sort(
        (first, second) => first.minimumLevel - second.minimumLevel,
      ),
    [],
  );

  const displayName =
    profile?.displayName ||
    profile?.fullName ||
    user?.displayName ||
    user?.email ||
    "Player";

  if (loading) {
    return <PageLoader message="Calculating your progress…" />;
  }

  const { xp, streak, achievements, score, records, timeline } = progression;
  const personalRecords = records.personal?.records ?? [];

  return (
    <div className="progress-page page-stack">
      <PageHeader
        eyebrow="Personal progression"
        title={`${displayName}'s progress`}
        description="Experience points, streaks, achievements and records are derived from factual activity history—not stored as mysterious hidden scores."
        icon="📈"
        actions={<Link className="button button--secondary" to="/analytics">View analytics</Link>}
      />

      <section className="progress-hero card">
        <div className="progress-hero__content">
          <p className="progress-eyebrow">Current title</p>
          <h2>{xp.title}</h2>
          <p>
            <em>
              Your strongest opponent remains the version of you who said,
              “maybe tomorrow.”
            </em>
          </p>
        </div>

        <div
          className="progress-hero__level"
          aria-label={`Personal level ${xp.level}`}
        >
          <span>Level</span>
          <strong>{xp.level}</strong>
          <small>{formatExperiencePoints(xp.totalXp)} in total</small>
        </div>
      </section>

      <section className="progress-summary-grid" aria-label="Progress summary">
        {[
          ["⚡", formatNumber(xp.totalXp, { whole: true }), "Experience points"],
          ["⭐", formatNumber(score.totalPoints, { whole: true }), "Total points"],
          ["🔥", streak.currentStreak, "Current streak"],
          [
            "🏅",
            `${achievements.unlockedCount}/${achievements.total}`,
            "Achievements unlocked",
          ],
        ].map(([icon, value, label]) => (
          <article className="progress-summary-card card" key={label}>
            <span aria-hidden="true">{icon}</span>
            <strong>{value}</strong>
            <small>{label}</small>
          </article>
        ))}
      </section>

      <div className="progress-primary-grid">
        <section className="progress-section card" aria-labelledby="experience-title">
          <div className="progress-section__header">
            <div>
              <p className="progress-eyebrow">Experience</p>
              <h2 id="experience-title">Level {xp.level} progress</h2>
            </div>
            <strong>{xp.percentage}%</strong>
          </div>

          <div className="progress-xp-values">
            <span>{formatExperiencePoints(xp.xpIntoLevel)}</span>
            <span>{formatExperiencePoints(xp.xpForNextLevel)}</span>
          </div>

          <div
            className="progress-xp-track"
            role="progressbar"
            aria-label="Progress to the next level"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={xp.percentage}
          >
            <span style={{ width: `${xp.percentage}%` }} />
          </div>

          <p className="progress-muted">
            <strong>{formatExperiencePoints(xp.xpToNextLevel)}</strong> remaining
            until Level {xp.level + 1}.
          </p>

          <div className="progress-breakdown">
            <article>
              <strong>{formatNumber(xp.participationXp, { whole: true })}</strong>
              <span>Participation experience</span>
            </article>
            <article>
              <strong>{formatNumber(xp.goalXp, { whole: true })}</strong>
              <span>Goal experience</span>
            </article>
            <article>
              <strong>{formatNumber(xp.streakXp, { whole: true })}</strong>
              <span>Streak experience</span>
            </article>
          </div>
        </section>

        <section className="progress-section card" aria-labelledby="streak-title">
          <div className="progress-section__header">
            <div>
              <p className="progress-eyebrow">Consistency</p>
              <h2 id="streak-title">Streak status</h2>
            </div>
            <span className={`progress-status progress-status--${streak.status}`}>
              {getStreakStatus(streak)}
            </span>
          </div>

          <div className="progress-streak-grid">
            {[
              ["🔥", streak.currentStreak, "Current streak"],
              ["🏅", streak.longestStreak, "Longest streak"],
              ["✅", streak.successfulDays, "Successful days"],
              ["🛡️", streak.shieldAvailable, "Shields available"],
            ].map(([icon, value, label]) => (
              <article key={label}>
                <span aria-hidden="true">{icon}</span>
                <strong>{value}</strong>
                <small>{label}</small>
              </article>
            ))}
          </div>

          <div className="progress-streak-note">
            <span aria-hidden="true">
              {streak.shieldAvailable > 0 ? "🛡️" : "🌱"}
            </span>
            <p>
              {streak.shieldAvailable > 0
                ? "Your streak shield can protect one missed day."
                : `${streak.daysUntilShield} successful ${pluralize(
                    streak.daysUntilShield,
                    "day",
                    "days",
                  )} until your next shield.`}
            </p>
          </div>

          {streak.nextMilestone && (
            <div className="progress-next-milestone">
              <span>Next milestone</span>
              <strong>{streak.nextMilestone.days}-day streak</strong>
              <small>
                {formatPoints(streak.nextMilestone.points)} and{" "}
                {formatExperiencePoints(streak.nextMilestone.xp)}
              </small>
            </div>
          )}
        </section>
      </div>

      <section className="progress-section card" aria-labelledby="goal-history-title">
        <div className="progress-section__header">
          <div>
            <p className="progress-eyebrow">Goal history</p>
            <h2 id="goal-history-title">Completed goals and missions</h2>
          </div>
        </div>

        <div className="progress-history-grid">
          {[
            ["☀️", records.completedDailyGoals, "Daily goals completed"],
            ["🗓️", records.completedWeeklyGoals, "Weekly goals completed"],
            ["✨", records.perfectDays, "Perfect days"],
            ["🏆", records.perfectWeeks, "Perfect weeks"],
          ].map(([icon, value, label]) => (
            <article key={label}>
              <span aria-hidden="true">{icon}</span>
              <strong>{formatNumber(value, { whole: true })}</strong>
              <small>{label}</small>
            </article>
          ))}
        </div>
      </section>

      <ProgressTimeline timeline={timeline} />

      <section className="progress-section card" aria-labelledby="records-title">
        <div className="progress-section__header">
          <div>
            <p className="progress-eyebrow">Personal records</p>
            <h2 id="records-title">Your strongest recorded results</h2>
          </div>
          <span className="progress-section__count">
            {personalRecords.length} {pluralize(
              personalRecords.length,
              "record",
              "records",
            )}
          </span>
        </div>

        {personalRecords.length === 0 ? (
          <div className="empty-state">
            Your personal records will appear as you log activities.
          </div>
        ) : (
          <div className="personal-record-grid">
            {personalRecords.map((record) => {
              const detail = getRecordDetail(record);

              return (
                <article className="personal-record" key={record.id}>
                  <span className="personal-record__icon" aria-hidden="true">
                    🏅
                  </span>
                  <div>
                    <small>{record.name}</small>
                    <strong>{formatRecordValue(record)}</strong>
                    {detail && <p>{detail}</p>}
                    <time>{formatDate(record.date)}</time>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="progress-section card" aria-labelledby="achievements-title">
        <div className="progress-section__header">
          <div>
            <p className="progress-eyebrow">Achievements</p>
            <h2 id="achievements-title">Achievement collection</h2>
          </div>
          <span className="progress-section__count">
            {achievements.unlockedCount} of {achievements.total} unlocked
          </span>
        </div>

        <div className="achievement-grid">
          {achievements.achievements.map((achievement) => (
            <article
              key={achievement.id}
              className={`achievement-card${
                achievement.unlocked ? " achievement-card--unlocked" : ""
              }`}
            >
              <span className="achievement-card__emoji" aria-hidden="true">
                {achievement.unlocked ? achievement.emoji : "🔒"}
              </span>
              <div>
                <strong>{achievement.name}</strong>
                <p>{achievement.description}</p>
                <small>
                  {achievement.unlocked ? "Unlocked" : "Not unlocked yet"}
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="progress-section card" aria-labelledby="level-journey-title">
        <div className="progress-section__header">
          <div>
            <p className="progress-eyebrow">Level journey</p>
            <h2 id="level-journey-title">Personal titles</h2>
          </div>
        </div>

        <ol className="level-journey">
          {levelJourney.map((item) => {
            const unlocked = xp.level >= item.minimumLevel;
            const current = item.title === xp.title;

            return (
              <li
                key={item.minimumLevel}
                className={`level-journey__item${
                  unlocked ? " level-journey__item--unlocked" : ""
                }${current ? " level-journey__item--current" : ""}`}
              >
                <span>{unlocked ? "✓" : item.minimumLevel}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    Level {item.minimumLevel}
                    {current ? " · Current title" : ""}
                  </small>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
