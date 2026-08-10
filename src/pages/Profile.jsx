import { useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import MbtiProfileChooser from "../components/profile/MbtiProfileChooser";
import PlayerAvatar from "../components/profile/PlayerAvatar";
import { DEFAULT_AVATAR_ID } from "../constants/avatars";
import {
  getMbtiProfileByType,
  isValidMbtiType,
} from "../constants/mbtiProfiles";
import usePlayerData from "../hooks/usePlayerData";
import useLeagues from "../hooks/useLeagues";
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

const PROFILE_TABS = Object.freeze([
  {
    id: "overview",
    label: "Overview",
    icon: "⚡",
    description: "Account details, current legacy and personality guidance",
  },
  {
    id: "personalise",
    label: "Personalise",
    icon: "🧭",
    description: "Change your display name and choose your Legacy Profile",
  },
  {
    id: "protections",
    label: "Protections",
    icon: "🔐",
    description: "How identity, permissions and history stay safe",
  },
]);

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
      profile?.displayName
      || profile?.fullName
      || user?.displayName
      || "Champion",
    avatarId: profile?.avatarId || DEFAULT_AVATAR_ID,
    mbtiType: profile?.mbtiType || "",
  });

  const [displayName, setDisplayName] = useState(initial.displayName);
  const [mbtiType, setMbtiType] = useState(initial.mbtiType);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const changed =
    displayName.trim().replace(/\s+/g, " ") !== initial.displayName
    || mbtiType !== initial.mbtiType;

  async function handleSubmit(event) {
    event.preventDefault();

    const result = validateProfileUpdate({
      displayName,
      avatarId: initial.avatarId,
      mbtiType,
    });

    if (!result.valid) {
      setStatus({ type: "error", message: result.errors.join(" ") });
      return;
    }

    if (!changed) {
      setStatus({
        type: "info",
        message: "No changes to save. Your profile is already up to date.",
      });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await updateUserProfile(user.uid, result.value);
      setStatus({
        type: "success",
        message: result.value.mbtiType
          ? `Profile updated. ${result.value.mbtiType} is now your Legacy Profile.`
          : "Profile updated successfully.",
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

  const previewProfile = {
    ...profile,
    avatarId: initial.avatarId,
    mbtiType,
  };

  return (
    <form className="profile-editor card" onSubmit={handleSubmit}>
      <div className="profile-editor__header">
        <div>
          <p>Personalise</p>
          <h2>Choose your player identity</h2>
          <p>
            Your Legacy Profile gives you a built-in identity and reflective guidance
            without changing scoring, permissions or competitive history.
          </p>
        </div>
        <PlayerAvatar profile={previewProfile} size="hero" />
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

      <MbtiProfileChooser value={mbtiType} onChange={setMbtiType} disabled={saving} />

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
            setMbtiType(initial.mbtiType);
            setStatus(null);
          }}
        >
          Reset changes
        </button>
      </div>
    </form>
  );
}

function PersonalityGuidance({ personality }) {
  if (!personality) return null;

  return (
    <section className="profile-personality card" aria-labelledby="personality-guidance-title">
      <div className="profile-personality__heading">
        <div>
          <p>Legacy Profile guidance</p>
          <h2 id="personality-guidance-title">How {personality.title} may thrive</h2>
          <p>
            Use these ideas as prompts, not rules. Personality frameworks describe tendencies;
            your habits, circumstances and choices matter more than four letters.
          </p>
        </div>
        <span className="profile-personality__code">{personality.type}</span>
      </div>

      <div className="profile-personality__grid">
        <article>
          <h3>Natural advantages</h3>
          <div className="profile-personality__chips">
            {personality.strengths.map((strength) => <span key={strength}>{strength}</span>)}
          </div>
        </article>
        <article>
          <h3>Watch for</h3>
          <ul>{personality.watchouts.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="profile-personality__wide">
          <h3>Challenge approaches that may help</h3>
          <ul>{personality.thrive.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>

      <div className="profile-personality__connections">
        <div>
          <p>Potentially complementary profiles</p>
          <small>
            These are conversation starters for teamwork, not compatibility predictions.
          </small>
        </div>
        <div>
          {personality.connections.map((type) => {
            const profile = getMbtiProfileByType(type);
            return <span key={type}>{type} · {profile?.title}</span>;
          })}
        </div>
      </div>
    </section>
  );
}

export default function Profile() {
  const { profile, user, entries, progression } = usePlayerData();
  const [activeTab, setActiveTab] = useState("overview");
  const { leagues, memberships } = useLeagues();
  const currentMembership = memberships.find((item) => item.status === "active")
    || memberships.find((item) => item.status === "registered")
    || memberships[0]
    || null;
  const currentSeason = leagues.find((item) => item.id === currentMembership?.leagueId) || null;
  const displayName =
    profile?.displayName
    || profile?.fullName
    || user?.displayName
    || "Champion";
  const personality = getMbtiProfileByType(profile?.mbtiType);
  const hasPersonality = isValidMbtiType(profile?.mbtiType);
  const entryCount = getTotalEntries(entries);
  const accountDetails = [
    ["Display name", displayName],
    ["Legacy Profile", hasPersonality ? `${personality.type} · ${personality.title}` : "Not selected"],
    ["Email", profile?.email || user?.email || "Not available"],
    ["Role", formatRole(profile?.role)],
    ["Current season", currentSeason?.name || "No season joined"],
    ["Current House", currentMembership?.currentHouseName || "Not assigned"],
    ["Joined", formatTimestamp(profile?.joinedAt)],
  ];

  return (
    <div className="profile-page page-stack">
      <PageHeader
        eyebrow="Player identity"
        title={displayName}
        description="Build an identity that feels like yours while keeping account and competitive permissions secure."
        icon={null}
        actions={
          <Link className="button button--primary" to="/progress">
            View full progress
          </Link>
        }
      />

      <section className="profile-identity card">
        <PlayerAvatar profile={profile} size="hero" />
        <div className="profile-identity__copy">
          <p>Your Legacy Profile</p>
          <h2>{personality ? `${personality.type} · ${personality.title}` : "Choose the profile that feels most like you"}</h2>
          <p>
            <em>
              {personality?.tagline
                || "Know your MBTI type? Select it directly. Unsure? Use the 12-question quick estimate or a longer external test."}
            </em>
          </p>
          <div className="profile-identity__chips">
            <span>Level {progression.xp.level}</span>
            <span>{progression.xp.title}</span>
            <span>{progression.streak.currentStreak}-day streak</span>
            {personality && <span>{personality.type}</span>}
          </div>
          {!personality && (
            <button className="button button--primary profile-identity__choose" type="button" onClick={() => setActiveTab("personalise")}>
              Choose my Legacy Profile
            </button>
          )}
        </div>
      </section>

      <WorkspaceTabs
        idPrefix="profile"
        label="Profile sections"
        tabs={PROFILE_TABS}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      <WorkspacePanel id="overview" activeId={activeTab} idPrefix="profile">
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
        <PersonalityGuidance personality={personality} />
      </WorkspacePanel>

      <WorkspacePanel id="personalise" activeId={activeTab} idPrefix="profile">
        <ProfileEditor profile={profile} user={user} />
      </WorkspacePanel>

      <WorkspacePanel id="protections" activeId={activeTab} idPrefix="profile">
        <section className="profile-preferences card">
          <div>
            <p>Account protections</p>
            <h2>Your identity and permissions stay separate</h2>
            <p>
              Changing your display name or Legacy Profile cannot change your email,
              trusted role, season membership, scoring or competitive history. Personality
              guidance remains a reflective frontend feature and is not used to calculate points.
            </p>
          </div>
          <div className="profile-preferences__chips" aria-label="Current account protections">
            <span>Protected role</span>
            <span>No personality scoring</span>
            <span>Immutable league history</span>
            <span>Local profile artwork</span>
          </div>
          <Link className="button button--secondary" to="/help">
            Open Help & Privacy
          </Link>
        </section>

        <section className="profile-easter-egg card">
          <span aria-hidden="true">🧭</span>
          <div>
            <strong>Personality is a lens, not a limit</strong>
            <p>
              The quick test only estimates a four-letter profile from 12 answers. You choose
              the final type, and nothing in Champions Legacy Challenge treats it as a diagnosis
              or a prediction of what you can achieve.
            </p>
          </div>
        </section>
      </WorkspacePanel>
    </div>
  );
}
