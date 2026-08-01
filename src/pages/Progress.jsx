import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { LEVEL_CONFIGURATION } from "../constants/progression";
import useAuth from "../hooks/useAuth";
import useDashboardData from "../hooks/useDashboardData";
import { logoutUser } from "../services/auth/authService";
import { getProgressionSummary } from "../services/progression";
import "./Progress.css";

const wholeNumberFormatter = new Intl.NumberFormat();

const decimalFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatWholeNumber(value) {
  return wholeNumberFormatter.format(Number(value) || 0);
}

function formatDecimal(value) {
  return decimalFormatter.format(Number(value) || 0);
}

function formatDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return "Date unavailable";
  }

  return dateFormatter.format(value);
}

function formatPace(secondsPerKm) {
  const totalSeconds = Math.max(0, Math.round(Number(secondsPerKm) || 0));

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}/km`;
}

function formatRecordValue(record) {
  switch (record.unit) {
    case "seconds per km":
      return formatPace(record.value);

    case "km":
      return `${formatDecimal(record.value)} km`;

    case "minutes":
      return `${formatDecimal(record.value)} min`;

    case "ml":
      return `${formatWholeNumber(record.value)} ml`;

    case "steps":
      return `${formatWholeNumber(record.value)} steps`;

    case "effective reps":
      return `${formatWholeNumber(record.value)} effective reps`;

    case "points":
      return `${formatWholeNumber(record.value)} points`;

    case "category":
    case "categories":
      return `${formatWholeNumber(record.value)} ${record.unit}`;

    default:
      return `${formatDecimal(record.value)} ${record.unit ?? ""}`.trim();
  }
}

function getRecordDetail(record) {
  if (
    record.id === "highest-daily-points" &&
    record.metadata?.bonusPoints > 0
  ) {
    return `${formatWholeNumber(
      record.metadata.activityPoints,
    )} activity + ${formatWholeNumber(record.metadata.bonusPoints)} bonus`;
  }

  if (record.id === "fastest-qualifying-run" && record.metadata?.distance) {
    return `${formatDecimal(record.metadata.distance)} km qualifying run`;
  }

  if (record.id === "longest-reading-session" && record.metadata?.title) {
    return record.metadata.title;
  }

  if (record.id === "most-active-day" && record.metadata?.entryCount) {
    return `${formatWholeNumber(record.metadata.entryCount)} entries recorded`;
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const { profile, entries, loading, error } = useDashboardData(user?.uid);

  const progression = useMemo(() => getProgressionSummary(entries), [entries]);

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

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (logoutError) {
      console.error(logoutError);
    }
  }

  const { xp, streak, achievements, score, records } = progression;

  const personalRecords = records.personal?.records ?? [];

  return (
    <main className="progress-page">
      <div className="progress-shell">
        <header className="progress-topbar">
          <Link className="button button--secondary" to="/dashboard">
            ← Dashboard
          </Link>

          <div className="progress-brand">
            <span aria-hidden="true">🏆</span>
            <span>Champions Legacy</span>
          </div>

          <button
            className="button button--secondary"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </header>

        {error && (
          <div className="inline-alert inline-alert--danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <section className="progress-loading card" aria-live="polite">
            <span aria-hidden="true">⏳</span>
            <p>Loading your progress...</p>
          </section>
        ) : (
          <>
            <section className="progress-hero card">
              <div className="progress-hero__content">
                <p className="progress-eyebrow">Personal progression</p>

                <h1>{displayName}&apos;s progress</h1>

                <p>
                  Your progress is calculated from your recorded activities,
                  completed goals and consistency.
                </p>
              </div>

              <div
                className="progress-hero__level"
                aria-label={`Personal level ${xp.level}`}
              >
                <span>Level</span>
                <strong>{xp.level}</strong>
                <small>{xp.title}</small>
              </div>
            </section>

            <section
              className="progress-summary-grid"
              aria-label="Progress summary"
            >
              <article className="progress-summary-card card">
                <span aria-hidden="true">⚡</span>
                <strong>{formatWholeNumber(xp.totalXp)}</strong>
                <small>Total XP</small>
              </article>

              <article className="progress-summary-card card">
                <span aria-hidden="true">⭐</span>
                <strong>{formatWholeNumber(score.totalPoints)}</strong>
                <small>Total points</small>
              </article>

              <article className="progress-summary-card card">
                <span aria-hidden="true">🔥</span>
                <strong>{streak.currentStreak}</strong>
                <small>Current streak</small>
              </article>

              <article className="progress-summary-card card">
                <span aria-hidden="true">🏅</span>
                <strong>
                  {achievements.unlockedCount}/{achievements.total}
                </strong>
                <small>Achievements</small>
              </article>
            </section>

            <div className="progress-primary-grid">
              <section
                className="progress-section card"
                aria-labelledby="xp-title"
              >
                <div className="progress-section__header">
                  <div>
                    <p className="progress-eyebrow">Experience</p>
                    <h2 id="xp-title">Level {xp.level} progress</h2>
                  </div>

                  <strong>{xp.percentage}%</strong>
                </div>

                <div className="progress-xp-values">
                  <span>{formatWholeNumber(xp.xpIntoLevel)} XP</span>

                  <span>{formatWholeNumber(xp.xpForNextLevel)} XP</span>
                </div>

                <div
                  className="progress-xp-track"
                  role="progressbar"
                  aria-label="Progress to next level"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={xp.percentage}
                >
                  <span
                    style={{
                      width: `${xp.percentage}%`,
                    }}
                  />
                </div>

                <p className="progress-muted">
                  {formatWholeNumber(xp.xpToNextLevel)} XP remaining until Level{" "}
                  {xp.level + 1}.
                </p>

                <div className="progress-breakdown">
                  <article>
                    <strong>{formatWholeNumber(xp.participationXp)}</strong>
                    <span>Participation XP</span>
                  </article>

                  <article>
                    <strong>{formatWholeNumber(xp.goalXp)}</strong>
                    <span>Goal XP</span>
                  </article>

                  <article>
                    <strong>{formatWholeNumber(xp.streakXp)}</strong>
                    <span>Streak XP</span>
                  </article>
                </div>
              </section>

              <section
                className="progress-section card"
                aria-labelledby="streak-title"
              >
                <div className="progress-section__header">
                  <div>
                    <p className="progress-eyebrow">Consistency</p>
                    <h2 id="streak-title">Streak status</h2>
                  </div>

                  <span
                    className={`progress-status progress-status--${streak.status}`}
                  >
                    {getStreakStatus(streak)}
                  </span>
                </div>

                <div className="progress-streak-grid">
                  <article>
                    <span aria-hidden="true">🔥</span>
                    <strong>{streak.currentStreak}</strong>
                    <small>Current</small>
                  </article>

                  <article>
                    <span aria-hidden="true">🏅</span>
                    <strong>{streak.longestStreak}</strong>
                    <small>Longest</small>
                  </article>

                  <article>
                    <span aria-hidden="true">✅</span>
                    <strong>{streak.successfulDays}</strong>
                    <small>Successful days</small>
                  </article>

                  <article>
                    <span aria-hidden="true">🛡️</span>
                    <strong>{streak.shieldAvailable}</strong>
                    <small>Shield available</small>
                  </article>
                </div>

                <div className="progress-streak-note">
                  {streak.shieldAvailable > 0 ? (
                    <>
                      <span aria-hidden="true">🛡️</span>
                      <p>Your streak shield can protect one missed day.</p>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🌱</span>
                      <p>
                        {streak.daysUntilShield} successful day
                        {streak.daysUntilShield === 1 ? "" : "s"} until your
                        next shield.
                      </p>
                    </>
                  )}
                </div>

                {streak.nextMilestone && (
                  <div className="progress-next-milestone">
                    <span>Next milestone</span>

                    <strong>{streak.nextMilestone.days}-day streak</strong>

                    <small>
                      +{streak.nextMilestone.points} points · +
                      {streak.nextMilestone.xp} XP
                    </small>
                  </div>
                )}
              </section>
            </div>

            <section
              className="progress-section card"
              aria-labelledby="goal-history-title"
            >
              <div className="progress-section__header">
                <div>
                  <p className="progress-eyebrow">Goal history</p>
                  <h2 id="goal-history-title">Completed goals and missions</h2>
                </div>
              </div>

              <div className="progress-history-grid">
                <article>
                  <span aria-hidden="true">☀️</span>
                  <strong>
                    {formatWholeNumber(records.completedDailyGoals)}
                  </strong>
                  <small>Daily goals completed</small>
                </article>

                <article>
                  <span aria-hidden="true">🗓️</span>
                  <strong>
                    {formatWholeNumber(records.completedWeeklyGoals)}
                  </strong>
                  <small>Weekly goals completed</small>
                </article>

                <article>
                  <span aria-hidden="true">✨</span>
                  <strong>{formatWholeNumber(records.perfectDays)}</strong>
                  <small>Perfect days</small>
                </article>

                <article>
                  <span aria-hidden="true">🏆</span>
                  <strong>{formatWholeNumber(records.perfectWeeks)}</strong>
                  <small>Perfect weeks</small>
                </article>
              </div>
            </section>

            <section
              className="progress-section card"
              aria-labelledby="records-title"
            >
              <div className="progress-section__header">
                <div>
                  <p className="progress-eyebrow">Personal records</p>
                  <h2 id="records-title">Your strongest recorded results</h2>
                </div>

                <span className="progress-section__count">
                  {personalRecords.length} recorded
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
                        <span className="personal-record__icon">🏅</span>

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

            <section
              className="progress-section card"
              aria-labelledby="achievements-title"
            >
              <div className="progress-section__header">
                <div>
                  <p className="progress-eyebrow">Achievements</p>
                  <h2 id="achievements-title">Achievement collection</h2>
                </div>

                <span className="progress-section__count">
                  {achievements.unlockedCount}/{achievements.total} unlocked
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
                    <span
                      className="achievement-card__emoji"
                      aria-hidden="true"
                    >
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

            <section
              className="progress-section card"
              aria-labelledby="level-journey-title"
            >
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
          </>
        )}
      </div>
    </main>
  );
}
