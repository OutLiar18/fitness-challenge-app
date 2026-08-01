import { useMemo, useState } from "react";

import Toast from "../components/common/Toast/Toast";
import PageHeader from "../components/layout/PageHeader";
import LegacyAvatar from "../components/profile/LegacyAvatar";
import { TEAM_EMBLEMS, getTeamEmblem } from "../constants/teams";
import usePlayerData from "../hooks/usePlayerData";
import useTeam from "../hooks/useTeam";
import useToast from "../hooks/useToast";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  transferTeamCaptain,
  updateTeam,
} from "../services/teams/teamService";
import { getTeamSummary } from "../services/teams/teamModel";
import {
  formatNumber,
  formatPoints,
  pluralize,
} from "../utils/displayFormatters";
import "./Teams.css";

const EMPTY_TEAM_FORM = Object.freeze({
  name: "",
  description: "",
  motto: "",
  emblemId: "legacy-banner",
});

function TeamForm({ profile, userId, notify }) {
  const [form, setForm] = useState(EMPTY_TEAM_FORM);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await createTeam({ userId, profile, input: form });
      notify("Team created. Your invitation code is ready.", "success");
      setForm(EMPTY_TEAM_FORM);
    } catch (error) {
      console.error(error);
      notify(error.message || "The team could not be created.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="community-form card" onSubmit={handleSubmit}>
      <div>
        <p className="section-kicker">Create a team</p>
        <h2>Build a shared identity</h2>
        <p>One team can hold up to 25 players. Team progress encourages accountability without changing personal points.</p>
      </div>

      <div className="community-form__grid">
        <div className="form-field">
          <label htmlFor="team-name">Team name</label>
          <input
            id="team-name"
            minLength={3}
            maxLength={48}
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </div>

        <div className="form-field">
          <label htmlFor="team-motto">Team motto</label>
          <input
            id="team-motto"
            minLength={3}
            maxLength={90}
            required
            value={form.motto}
            onChange={(event) => setForm((current) => ({ ...current, motto: event.target.value }))}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="team-description">What are you building together?</label>
        <textarea
          id="team-description"
          minLength={10}
          maxLength={240}
          required
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
      </div>

      <fieldset className="emblem-picker">
        <legend>Team emblem</legend>
        <div>
          {TEAM_EMBLEMS.map((emblem) => (
            <label key={emblem.id} className={form.emblemId === emblem.id ? "emblem-option emblem-option--selected" : "emblem-option"}>
              <input
                className="sr-only"
                type="radio"
                name="team-emblem"
                value={emblem.id}
                checked={form.emblemId === emblem.id}
                onChange={() => setForm((current) => ({ ...current, emblemId: emblem.id }))}
              />
              <span aria-hidden="true">{emblem.symbol}</span>
              <strong>{emblem.name}</strong>
            </label>
          ))}
        </div>
      </fieldset>

      <button className="button button--primary" type="submit" disabled={saving}>
        {saving ? "Creating team…" : "Create team"}
      </button>
    </form>
  );
}

function JoinTeamForm({ profile, userId, notify }) {
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setJoining(true);

    try {
      await joinTeam({ userId, profile, code });
      notify("Welcome to the team. Your roster has been updated.", "success");
      setCode("");
    } catch (error) {
      console.error(error);
      notify(error.message || "The team could not be joined.", "error");
    } finally {
      setJoining(false);
    }
  }

  return (
    <form className="community-join card" onSubmit={handleSubmit}>
      <span className="community-join__icon" aria-hidden="true">🤝</span>
      <div>
        <p className="section-kicker">Join a team</p>
        <h2>Enter an invitation code</h2>
        <p>Ask the team captain for the 8-character code.</p>
      </div>
      <div className="community-code-row">
        <label className="sr-only" htmlFor="team-code">Team invitation code</label>
        <input
          id="team-code"
          className="community-code-input"
          inputMode="text"
          autoComplete="off"
          maxLength={8}
          placeholder="ABCD2345"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
        />
        <button className="button button--secondary" type="submit" disabled={joining}>
          {joining ? "Joining…" : "Join team"}
        </button>
      </div>
    </form>
  );
}

function TeamRoster({ members }) {
  const sortedMembers = [...members].sort(
    (first, second) =>
      (first.role === "captain" ? -1 : 0) - (second.role === "captain" ? -1 : 0) ||
      Number(second.weeklyPoints ?? 0) - Number(first.weeklyPoints ?? 0) ||
      String(first.displayName).localeCompare(String(second.displayName)),
  );

  return (
    <section className="team-roster card">
      <div className="community-section-heading">
        <div>
          <p className="section-kicker">Roster</p>
          <h2>People showing up together</h2>
        </div>
        <span>{members.length} {pluralize(members.length, "member", "members")}</span>
      </div>

      <div className="team-roster__list">
        {sortedMembers.map((member) => (
          <article key={member.userId} className="team-member">
            <LegacyAvatar avatarId={member.avatarId} size="small" decorative />
            <div className="team-member__identity">
              <strong>{member.displayName}</strong>
              <span>{member.role === "captain" ? "Team captain" : "Team member"}</span>
            </div>
            <div className="team-member__stats">
              <strong>{formatPoints(member.weeklyPoints ?? 0)}</strong>
              <span>{member.activeDays ?? 0} active {pluralize(member.activeDays ?? 0, "day", "days")}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeamDashboard({ team, membership, members, userId, notify }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    name: team.name,
    description: team.description,
    motto: team.motto,
    emblemId: team.emblemId,
  }));
  const [saving, setSaving] = useState(false);
  const [nextCaptainId, setNextCaptainId] = useState("");
  const summary = useMemo(() => getTeamSummary(members), [members]);
  const emblem = getTeamEmblem(team.emblemId);
  const isCaptain = membership.role === "captain";

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(team.inviteCode);
      notify("Team invitation code copied.", "success");
    } catch (error) {
      console.error(error);
      notify(`Invitation code: ${team.inviteCode}`, "info");
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateTeam({ teamId: team.id, userId, input: form });
      notify("Team details updated.", "success");
      setEditing(false);
    } catch (error) {
      console.error(error);
      notify(error.message || "Team details could not be updated.", "error");
    } finally {
      setSaving(false);
    }
  }


  async function handleCaptainTransfer() {
    if (!nextCaptainId) {
      notify("Choose the next team captain.", "error");
      return;
    }

    const nextCaptain = members.find((member) => member.userId === nextCaptainId);
    if (!window.confirm(`Make ${nextCaptain?.displayName || "this player"} the new team captain?`)) {
      return;
    }

    setSaving(true);
    try {
      await transferTeamCaptain({
        teamId: team.id,
        currentCaptainId: userId,
        nextCaptainId,
      });
      notify("Team captain transferred successfully.", "success");
      setNextCaptainId("");
      setEditing(false);
    } catch (error) {
      console.error(error);
      notify(error.message || "Captaincy could not be transferred.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleLeave() {
    if (!window.confirm("Leave this team? Your personal progress will remain unchanged.")) {
      return;
    }

    try {
      await leaveTeam({ teamId: team.id, userId, role: membership.role });
      notify("You left the team. Your personal legacy is unchanged.", "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "The team could not be left.", "error");
    }
  }

  return (
    <>
      <section className="team-hero card">
        <span className="team-hero__emblem" aria-hidden="true">{emblem.symbol}</span>
        <div>
          <p className="section-kicker">Your team</p>
          <h2>{team.name}</h2>
          <blockquote>“{team.motto}”</blockquote>
          <p>{team.description}</p>
        </div>
        <div className="team-hero__actions">
          <button className="button button--primary" type="button" onClick={copyCode}>Copy invitation code</button>
          {isCaptain && (
            <button className="button button--secondary" type="button" onClick={() => setEditing((current) => !current)}>
              {editing ? "Close editor" : "Edit team"}
            </button>
          )}
          {!isCaptain && <button className="button button--danger" type="button" onClick={handleLeave}>Leave team</button>}
        </div>
      </section>

      <section className="community-metrics" aria-label="Team weekly summary">
        {[
          [summary.memberCount, "Members"],
          [formatPoints(summary.weeklyPoints), "Team points this week"],
          [summary.activeDays, "Combined active days"],
          [summary.entriesRecorded, "Entries recorded this week"],
        ].map(([value, label]) => (
          <article className="card" key={label}>
            <strong>{typeof value === "number" ? formatNumber(value, { whole: true }) : value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      {editing && (
        <form className="community-form card" onSubmit={handleSave}>
          <p className="section-kicker">Captain controls</p>
          <h2>Refine the team identity</h2>
          <div className="form-field">
            <label htmlFor="edit-team-description">Team description</label>
            <textarea id="edit-team-description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </div>
          <div className="form-field">
            <label htmlFor="edit-team-motto">Team motto</label>
            <input id="edit-team-motto" value={form.motto} onChange={(event) => setForm((current) => ({ ...current, motto: event.target.value }))} />
          </div>
          <fieldset className="emblem-picker">
            <legend>Team emblem</legend>
            <div>
              {TEAM_EMBLEMS.map((option) => (
                <label key={option.id} className={form.emblemId === option.id ? "emblem-option emblem-option--selected" : "emblem-option"}>
                  <input className="sr-only" type="radio" checked={form.emblemId === option.id} onChange={() => setForm((current) => ({ ...current, emblemId: option.id }))} />
                  <span aria-hidden="true">{option.symbol}</span>
                  <strong>{option.name}</strong>
                </label>
              ))}
            </div>
          </fieldset>
          <button className="button button--primary" type="submit" disabled={saving}>{saving ? "Saving team…" : "Save team"}</button>

          {members.length > 1 && (
            <section className="captain-transfer">
              <div>
                <p className="section-kicker">Leadership handover</p>
                <h3>Transfer team captaincy</h3>
                <p>Captaincy moves atomically. The new captain receives leadership immediately and you remain a team member.</p>
              </div>
              <div className="community-code-row">
                <label htmlFor="next-captain">Next team captain</label>
                <select id="next-captain" value={nextCaptainId} onChange={(event) => setNextCaptainId(event.target.value)}>
                  <option value="">Choose a team member</option>
                  {members.filter((member) => member.userId !== userId).map((member) => (
                    <option key={member.userId} value={member.userId}>{member.displayName}</option>
                  ))}
                </select>
                <button className="button button--danger" type="button" disabled={saving || !nextCaptainId} onClick={handleCaptainTransfer}>Transfer captaincy</button>
              </div>
            </section>
          )}
        </form>
      )}

      <TeamRoster members={members} />

      <section className="community-guardrail card">
        <span aria-hidden="true">🛡️</span>
        <div>
          <p className="section-kicker">Healthy teamwork</p>
          <h2>Shared progress without shared pressure</h2>
          <p>Team summaries use each member’s factual activity history. They do not change personal points, levels or achievements, and the roster never labels a lower result as failure.</p>
        </div>
      </section>
    </>
  );
}

export default function Teams() {
  const { user, profile } = usePlayerData();
  const { membership, team, members, loading, error } = useTeam();
  const { toast, showToast, dismissToast } = useToast();

  return (
    <div className="community-page page-stack">
      <PageHeader
        eyebrow="Community"
        title="Teams"
        description="Build accountability with people who want one another to improve—without turning friendship into pressure."
        icon="🤝"
      />

      {error && <div className="inline-alert inline-alert--danger" role="alert">{error}</div>}

      {loading ? (
        <section className="empty-state">Loading your team…</section>
      ) : membership && team ? (
        <TeamDashboard team={team} membership={membership} members={members} userId={user?.uid} notify={showToast} />
      ) : (
        <div className="community-onboarding">
          <TeamForm profile={profile} userId={user?.uid} notify={showToast} />
          <JoinTeamForm profile={profile} userId={user?.uid} notify={showToast} />
        </div>
      )}

      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
