import { useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import AvatarPicker from "../components/profile/AvatarPicker";
import LegacyAvatar from "../components/profile/LegacyAvatar";
import { DEFAULT_AVATAR_ID, getAvatarById } from "../constants/avatars";
import usePlayerData from "../hooks/usePlayerData";
import useTeam from "../hooks/useTeam";
import {
  normalizeProfileUpdate,
  validateProfileUpdate,
} from "../services/profile/profileService";
import { getTotalEntries } from "../services/statistics";
import { updateUserProfile } from "../services/users/userRepository";
import {
  formatNumber,
  formatRole,
  pluralize,
} from "../utils/displayFormatters";
import "./Profile.css";

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

function ProfileEditor({ profile, user }) {
  const initial = normalizeProfileUpdate({
    displayName:
      profile?.displayName ||
      profile?.fullName ||
      user?.displayName ||
      "Champion",
    avatarId: profile?.avatarId || DEFAULT_AVATAR_ID,
  });

  const [displayName, setDisplayName] = useState(initial.displayName);
  const [avatarId, setAvatarId] = useState(initial.avatarId);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const changed =
    displayName.trim().replace(/\s+/g, " ") !== initial.displayName ||
    avatarId !== initial.avatarId;

  async function handleSubmit(event) {
    event.preventDefault();

    const result = validateProfileUpdate({ displayName, avatarId });

    if (!result.valid) {
      setStatus({ type: "error", message: result.errors.join(" ") });
      return;
    }

    if (!changed) {
      setStatus({
        type: "info",
        message: "No changes to save. Your profile is already looking heroic.",
      });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      await updateUserProfile(user.uid, result.value);
      setStatus({
        type: "success",
        message: "Profile updated. The trophy has approved your new identity.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: error.message || "Your profile could not be updated.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="profile-editor card" onSubmit={handleSubmit}>
      <div className="profile-editor__header">
        <div>
          <p>Personalise</p>
          <h2>Choose your player identity</h2>
          <p>
            Your display name and built-in avatar appear throughout Champions
            Legacy Challenge.
          </p>
        </div>

        <LegacyAvatar avatarId={avatarId} size="hero" />
      </div>

      <div className="profile-editor__field">
        <label htmlFor="profile-display-name">Display name</label>
        <input
          id="profile-display-name"
          type="text"
          minLength={2}
          maxLength={40}
          autoComplete="nickname"
          value={displayName}
          disabled={saving}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        <small>This can be changed without changing your sign-in email.</small>
      </div>

      <AvatarPicker
        value={avatarId}
        onChange={setAvatarId}
        disabled={saving}
      />

      {status && (
        <div
          className={`inline-alert inline-alert--${
            status.type === "error"
              ? "danger"
              : status.type === "success"
                ? "success"
                : "info"
          }`}
          role={status.type === "error" ? "alert" : "status"}
        >
          {status.message}
        </div>
      )}

      <div className="profile-editor__actions">
        <button
          className="button button--primary"
          type="submit"
          disabled={saving || !changed}
        >
          {saving ? "Saving profile…" : "Save profile"}
        </button>

        <button
          className="button button--secondary"
          type="button"
          disabled={saving || !changed}
          onClick={() => {
            setDisplayName(initial.displayName);
            setAvatarId(initial.avatarId);
            setStatus(null);
          }}
        >
          Reset changes
        </button>
      </div>
    </form>
  );
}

export default function Profile() {
  const { profile, user, entries, progression } = usePlayerData();
  const { team } = useTeam();

  const displayName =
    profile?.displayName ||
    profile?.fullName ||
    user?.displayName ||
    "Champion";
  const avatarId = profile?.avatarId || DEFAULT_AVATAR_ID;
  const avatar = getAvatarById(avatarId);
  const entryCount = getTotalEntries(entries);

  const accountDetails = [
    ["Display name", displayName],
    ["Legacy Avatar", avatar.name],
    ["Email", profile?.email || user?.email || "Not available"],
    ["Role", formatRole(profile?.role)],
    ["Team", team?.name || "No team joined"],
    ["Joined", formatTimestamp(profile?.joinedAt)],
  ];

  return (
    <div className="profile-page page-stack">
      <PageHeader
        eyebrow="Player identity"
        title={displayName}
        description="Build an identity that feels like yours while keeping account and competitive permissions secure."
        icon="👤"
        actions={
          <Link className="button button--primary" to="/progress">
            View full progress
          </Link>
        }
      />

      <section className="profile-identity card">
        <LegacyAvatar avatarId={avatarId} size="hero" />

        <div className="profile-identity__copy">
          <p>Your Legacy Avatar</p>
          <h2>{avatar.name}</h2>
          <p>
            <em>{avatar.description}</em>
          </p>

          <div className="profile-identity__chips">
            <span>Level {progression.xp.level}</span>
            <span>{progression.xp.title}</span>
            <span>
              {progression.streak.currentStreak}-day streak
            </span>
          </div>
        </div>
      </section>

      <ProfileEditor profile={profile} user={user} />

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
              <strong>{formatNumber(progression.score.totalPoints, { whole: true })}</strong>
              <span>Total points</span>
            </article>
            <article>
              <strong>{formatNumber(entryCount, { whole: true })}</strong>
              <span>{pluralize(entryCount, "entry recorded", "entries recorded")}</span>
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
          <p>Account controls</p>
          <h2>Privacy, accessibility and account management</h2>
          <p>
            Legacy Coach preferences are available now. Remaining privacy,
            accessibility and account-lifecycle controls will be added only when
            their defaults and security rules are fully designed.
          </p>
        </div>

        <div
          className="profile-preferences__chips"
          aria-label="Planned profile features"
        >
          <span>Accessibility controls</span>
          <span>League-history visibility</span>
          <span>Data export</span>
          <span>Account management</span>
        </div>
      </section>

      <section className="profile-easter-egg card">
        <span aria-hidden="true">🕵️</span>
        <div>
          <strong>Classified player intelligence</strong>
          <p>
            The avatar is decorative. The actual superpower remains showing up
            when motivation has mysteriously left the group chat.
          </p>
        </div>
      </section>
    </div>
  );
}
