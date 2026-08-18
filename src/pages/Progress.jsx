import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
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

const PROGRESS_TABS = Object.freeze([
  {
    id: "overview",
    label: "Overview",
    icon: "🧭",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: "🏅",
  },
  {
    id: "records",
    label: "Records",
    icon: "🏆",
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: "🗓️",
  },
  {
    id: "levels",
    label: "Level journey",
    icon: "⚡",
  },
]);

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

function AchievementCard({ achievement, completed = false }) {
  const reward = formatExperiencePoints(achievement.xp);

  return (
    <article
      className={`achievement-card${
        completed ? " achievement-card--unlocked" : ""
      }${achievement.hidden ? " achievement-card--hidden" : ""}`}
    >
      <span className="achievement-card__emoji" aria-hidden="true">
        {achievement.emoji}
      </span>
      <div className="achievement-card__content">
        <div className="achievement-card__heading">
          <strong>{achievement.name}</strong>
          <span className={`achievement-tier achievement-tier--${achievement.difficulty}`}>
            {achievement.difficultyLabel}
          </span>
        </div>
        <p>{achievement.description}</p>
        <small className="achievement-card__requirement">
          {achievement.requirement}
        </small>
        {!completed && (
          <>
            <div
              className="achievement-card__progress"
              role="progressbar"
              aria-label={`${achievement.name} progress`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={achievement.progressPercentage}
            >
              <span
                style={{ width: `${achievement.progressPercentage}%` }}
              />
            </div>
            <div className="achievement-card__footer">
              <small>{achievement.progressPercentage}% complete</small>
              <strong>+{reward}</strong>
            </div>
          </>
        )}
        {completed && (
          <div className="achievement-card__footer">
            <small>{achievement.hidden ? "Hidden achievement revealed" : "Completed"}</small>
            <strong>+{reward}</strong>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Progress() {
  const { profile, user, progression, loading } = usePlayerData();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = PROGRESS_TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "overview";
  const unlockedLevel = progression?.xp?.level ?? 0;
  const levelJourney = useMemo(
    () =>
      [...LEVEL_CONFIGURATION.titles]
        .filter((item) => item.minimumLevel <= unlockedLevel)
        .sort((first, second) => first.minimumLevel - second.minimumLevel),
    [unlockedLevel],
  );

  function setProgressTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "overview") next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

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
  const inProgressAchievements = achievements.inProgress ?? [];
  const availableAchievements = achievements.available ?? [];
  const completedAchievements = achievements.unlocked ?? [];
  const hiddenLockedCount = Math.max(
    0,
    (achievements.hiddenTotal ?? 0) - (achievements.hiddenUnlockedCount ?? 0),
  );
  const ringPercentage = xp.maximumLevel ? 100 : Math.max(0, Math.min(100, xp.percentage));

  return (
    <div className="progress-page page-stack">
      <PageHeader
        eyebrow="Personal progression"
        title={`${displayName}'s progress`}
        description="Every honest entry adds iron to your record. Guard the streak, claim the milestones and keep forging the champion you were meant to become."
        icon="📈"
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

        <div className="progress-hero__level-wrap">
          <div
            className="progress-hero__level-ring"
            style={{ "--progress-angle": `${ringPercentage * 3.6}deg` }}
            aria-hidden="true"
          />
          <div
            className="progress-hero__level"
            aria-label={`Current level ${xp.level}${xp.maximumLevel ? "" : `, ${xp.percentage}% to the next level`}`}
          >
            <span>Current level</span>
            <strong>{xp.level}</strong>
            <small>{xp.maximumLevel ? "Current peak" : `${xp.percentage}% to next`}</small>
          </div>
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

      <WorkspaceTabs
        idPrefix="progress"
        label="Progress sections"
        tabs={PROGRESS_TABS}
        activeId={activeTab}
        onChange={setProgressTab}
      />

      <WorkspacePanel id="overview" activeId={activeTab} idPrefix="progress">
        <div className="progress-primary-grid">
          <section className="progress-section card" aria-labelledby="experience-title">
            <div className="progress-section__header">
              <div>
                <p className="progress-eyebrow">Experience</p>
                <h2 id="experience-title">Level progress</h2>
              </div>
              <strong>{xp.percentage}%</strong>
            </div>

            <div className="progress-xp-values">
              <span>
                {xp.maximumLevel
                  ? formatExperiencePoints(xp.totalXp)
                  : `${formatExperiencePoints(xp.xpIntoLevel)} / ${formatExperiencePoints(
                      xp.xpForNextLevel,
                    )}`}
              </span>
              <strong>{xp.percentage}%</strong>
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
              {xp.maximumLevel ? (
                <strong>Current peak achieved.</strong>
              ) : (
                <>
                  <strong>{formatExperiencePoints(xp.xpToNextLevel)}</strong>{" "}
                  remaining until Level {xp.level + 1}.
                </>
              )}
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
              <article>
                <strong>{formatNumber(xp.achievementXp, { whole: true })}</strong>
                <span>Achievement experience</span>
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
      </WorkspacePanel>

      <WorkspacePanel id="achievements" activeId={activeTab} idPrefix="progress">
        <section className="progress-section card" aria-labelledby="achievements-title">
          <div className="progress-section__header">
            <div>
              <p className="progress-eyebrow">Achievements</p>
              <h2 id="achievements-title">Your next milestones</h2>
            </div>
            <span className="progress-section__count">
              {achievements.unlockedCount} / {achievements.total} ·{" "}
              {formatExperiencePoints(achievements.totalXpAwarded)} earned
            </span>
          </div>

          {inProgressAchievements.length > 0 && (
            <section className="achievement-group" aria-labelledby="achievements-active">
              <div className="achievement-group__header">
                <div>
                  <p className="progress-eyebrow">In progress</p>
                  <h3 id="achievements-active">Closest milestones</h3>
                </div>
                <span>{inProgressAchievements.length}</span>
              </div>
              <div className="achievement-grid">
                {inProgressAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </section>
          )}

          {availableAchievements.length > 0 && (
            <section className="achievement-group" aria-labelledby="achievements-next">
              <div className="achievement-group__header">
                <div>
                  <p className="progress-eyebrow">Available</p>
                  <h3 id="achievements-next">Next challenges</h3>
                </div>
                <span>{availableAchievements.length}</span>
              </div>
              <div className="achievement-grid">
                {availableAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </section>
          )}

          {inProgressAchievements.length === 0 &&
            availableAchievements.length === 0 && (
              <div className="achievement-mastered">
                <span aria-hidden="true">🏆</span>
                <div>
                  <strong>Every visible achievement is complete.</strong>
                  <p>The remaining surprises, if any, will reveal themselves when earned.</p>
                </div>
              </div>
            )}

          {hiddenLockedCount > 0 && (
            <p className="achievement-hidden-note">
              <span aria-hidden="true">🔒</span>
              {hiddenLockedCount} hidden {pluralize(
                hiddenLockedCount,
                "achievement",
                "achievements",
              )} remain undiscovered.
            </p>
          )}

          <details className="achievement-completed">
            <summary>
              <span>Completed achievements</span>
              <strong>{completedAchievements.length}</strong>
            </summary>
            {completedAchievements.length === 0 ? (
              <p className="progress-muted">
                Completed achievements will collect here without crowding your next goals.
              </p>
            ) : (
              <div className="achievement-grid">
                {completedAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    completed
                  />
                ))}
              </div>
            )}
          </details>
        </section>
      </WorkspacePanel>

      <WorkspacePanel id="records" activeId={activeTab} idPrefix="progress">
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
            <div className="empty-state progress-empty-state">
              <span aria-hidden="true">🏅</span>
              <h3>No personal records yet</h3>
              <p>Your records will appear as you build a factual activity history.</p>
              <Link className="button button--primary" to="/log">
                Log an activity
              </Link>
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
      </WorkspacePanel>

      <WorkspacePanel id="timeline" activeId={activeTab} idPrefix="progress">
        <ProgressTimeline timeline={timeline} />
      </WorkspacePanel>

      <WorkspacePanel id="levels" activeId={activeTab} idPrefix="progress">
        <section className="progress-section card" aria-labelledby="level-journey-title">
          <div className="progress-section__header">
            <div>
              <p className="progress-eyebrow">Level journey</p>
              <h2 id="level-journey-title">Unlocked titles</h2>
            </div>
          </div>

          <ol className="level-journey">
            {levelJourney.map((item) => {
              const current = item.title === xp.title;

              return (
                <li
                  key={item.minimumLevel}
                  className={`level-journey__item level-journey__item--unlocked${
                    current ? " level-journey__item--current" : ""
                  }`}
                >
                  <span>{current ? "★" : "✓"}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      Unlocked at Level {item.minimumLevel}
                      {current ? " · Current title" : ""}
                    </small>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </WorkspacePanel>
    </div>
  );
}
