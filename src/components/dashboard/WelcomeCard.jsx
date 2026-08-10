import { useMemo, useState } from "react";

import { getDailyMotivation } from "../../constants/motivation";
import { formatRole } from "../../utils/displayFormatters";
import LegacyAvatar from "../profile/LegacyAvatar";
import "./WelcomeCard.css";

export default function WelcomeCard({ profile, user, playerSeed = "champion" }) {
  const [offset, setOffset] = useState(0);
  const displayName =
    profile?.displayName || profile?.fullName || user?.email || "Champion";
  const firstName = displayName.includes("@")
    ? displayName
    : displayName.split(" ")[0];
  const motivation = useMemo(
    () => getDailyMotivation(new Date(), playerSeed, offset),
    [offset, playerSeed],
  );

  return (
    <section className="welcome-card">
      <div className="welcome-card__content">
        <p className="welcome-card__eyebrow">Today is another chance</p>
        <h1>Welcome back, {firstName}.</h1>
        <p className="welcome-card__intro">
          Record the work, learn from the day and keep becoming better than yesterday.
        </p>

        <div className="welcome-card__transmission" aria-live="polite">
          <div className="welcome-card__transmission-heading">
            <div>
              <span>Champion transmission</span>
              <strong>A message for today</strong>
            </div>
            <button
              className="welcome-card__transmission-button"
              type="button"
              onClick={() => setOffset((current) => current + 1)}
            >
              <span aria-hidden="true">↻</span>
              Another transmission
            </button>
          </div>

          <blockquote>
            <p>“{motivation.quote}”</p>
            <cite>— {motivation.attribution}</cite>
          </blockquote>

          <div className="welcome-card__transmission-extras">
            <p><strong>Today’s side quest:</strong> {motivation.sideQuest}</p>
            <p><strong>Coach:</strong> {motivation.coachNote}</p>
          </div>
        </div>
      </div>

      <div className="welcome-card__identity">
        <LegacyAvatar avatarId={profile?.avatarId} size="large" decorative />

        <div
          className="welcome-card__badge"
          aria-label={`Role: ${formatRole(profile?.role)}`}
        >
          <span aria-hidden="true">⚡</span>
          <span>{formatRole(profile?.role)}</span>
        </div>
      </div>
    </section>
  );
}
