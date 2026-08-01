import { useMemo } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import usePlayerData from "../hooks/usePlayerData";
import { getProgressionSummary } from "../services/progression";
import { getTotalEntries } from "../services/statistics";
import "./Profile.css";

const numberFormatter = new Intl.NumberFormat();
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatTimestamp(value) {
  const date = typeof value?.toDate === "function" ? value.toDate() : value;

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateFormatter.format(date);
}

export default function Profile() {
  const { profile, user, entries } = usePlayerData();
  const progression = useMemo(() => getProgressionSummary(entries), [entries]);

  const displayName =
    profile?.displayName || profile?.fullName || user?.displayName || "Champion";

  const accountDetails = [
    ["Display name", displayName],
    ["Email", profile?.email || user?.email || "Not available"],
    ["Role", profile?.role || "user"],
    ["Team", profile?.team || "No team yet"],
    ["Joined", formatTimestamp(profile?.joinedAt)],
  ];

  return (
    <div className="profile-page page-stack">
      <PageHeader
        eyebrow="Player identity"
        title={displayName}
        description="Your account details and personal progression snapshot. Profile editing will arrive through a secure, deliberate workflow."
        icon="👤"
        actions={
          <Link className="button button--primary" to="/progress">
            View full progress
          </Link>
        }
      />

      <div className="profile-grid">
        <section className="profile-card card" aria-labelledby="account-title">
          <div className="profile-card__header">
            <span aria-hidden="true">🪪</span>
            <div>
              <p>Account</p>
              <h2 id="account-title">Player details</h2>
            </div>
          </div>

          <dl className="profile-details">
            {accountDetails.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="profile-card card" aria-labelledby="snapshot-title">
          <div className="profile-card__header">
            <span aria-hidden="true">⚡</span>
            <div>
              <p>Snapshot</p>
              <h2 id="snapshot-title">Current legacy</h2>
            </div>
          </div>

          <div className="profile-metrics">
            <article>
              <strong>Level {progression.xp.level}</strong>
              <span>{progression.xp.title}</span>
            </article>
            <article>
              <strong>{numberFormatter.format(progression.score.totalPoints)}</strong>
              <span>Total points</span>
            </article>
            <article>
              <strong>{numberFormatter.format(getTotalEntries(entries))}</strong>
              <span>Entries recorded</span>
            </article>
            <article>
              <strong>{progression.streak.longestStreak}</strong>
              <span>Longest streak</span>
            </article>
          </div>
        </section>
      </div>

      <section className="profile-preferences card">
        <div>
          <p>Future profile controls</p>
          <h2>Preferences and privacy</h2>
          <p>
            Notification choices, accessibility preferences, profile editing and
            visibility controls will live here. They are intentionally not simulated
            before their data and security rules are designed.
          </p>
        </div>

        <div className="profile-preferences__chips" aria-label="Planned profile features">
          <span>Notification settings</span>
          <span>Accessibility controls</span>
          <span>Profile visibility</span>
          <span>Account management</span>
        </div>
      </section>

      <section className="profile-easter-egg card">
        <span aria-hidden="true">🕵️</span>
        <div>
          <strong>Classified player intelligence</strong>
          <p>
            Your most powerful equipment remains the suspiciously reusable ability
            to try again tomorrow.
          </p>
        </div>
      </section>
    </div>
  );
}
