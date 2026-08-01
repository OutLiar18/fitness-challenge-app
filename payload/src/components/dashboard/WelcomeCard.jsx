import { formatRole } from "../../utils/displayFormatters";
import LegacyAvatar from "../profile/LegacyAvatar";
import "./WelcomeCard.css";

export default function WelcomeCard({ profile, user }) {
  const displayName =
    profile?.displayName || profile?.fullName || user?.email || "Champion";
  const firstName = displayName.includes("@")
    ? displayName
    : displayName.split(" ")[0];

  return (
    <section className="welcome-card">
      <div className="welcome-card__content">
        <p className="welcome-card__eyebrow">Today is another chance</p>
        <h1>Welcome back, {firstName}.</h1>
        <p>
          <em>Show up honestly.</em> Record the work, learn from the day and keep
          becoming better than yesterday.
        </p>
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
