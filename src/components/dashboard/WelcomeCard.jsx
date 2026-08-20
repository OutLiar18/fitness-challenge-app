import { useMemo, useState } from "react";

import { getDailyMotivation } from "../../constants/motivation";
import { formatRole } from "../../utils/displayFormatters";
import ThemeIcon from "../common/ThemeIcon";
import PlayerAvatar from "../profile/PlayerAvatar";
import "./WelcomeCard.css";

export default function WelcomeCard({ profile, user, playerSeed = "champion" }) {
  const [offset, setOffset] = useState(0);
  const displayName =
    profile?.displayName || profile?.fullName || user?.email || "Champion";
  const firstName = displayName.includes("@")
    ? displayName
    : displayName.split(" ")[0];
  const motivation = useMemo(
    () => getDailyMotivation(new Date(), playerSeed, offset, profile?.mbtiType),
    [offset, playerSeed, profile?.mbtiType],
  );

  return (
    <section className="welcome-card">
      <div className="welcome-card__content">
        <p className="welcome-card__eyebrow">Today is another chance</p>
        <h1>Welcome back, {firstName}.</h1>

        <div className="welcome-card__transmission" aria-live="polite">
          <div className="welcome-card__transmission-heading">
            <div>
              <span>{motivation.profileTitle ? `${motivation.profileTitle} transmission` : "Champion transmission"}</span>
              <strong>{motivation.mythicName || "A message for today"}</strong>
            </div>
            <button
              className="welcome-card__transmission-button"
              type="button"
              aria-label="Show another Champion transmission"
              title="Show another Champion transmission"
              onClick={() => setOffset((current) => current + 1)}
            >
              <ThemeIcon name="refresh" size={19} />
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
        <PlayerAvatar profile={profile} size="large" decorative />

        <div
          className="welcome-card__badge"
          aria-label={`Role: ${formatRole(profile?.role)}`}
        >
          <ThemeIcon name="power" size={16} />
          <span>{formatRole(profile?.role)}</span>
        </div>
      </div>
    </section>
  );
}
