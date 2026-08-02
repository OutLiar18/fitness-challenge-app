import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Toast from "../components/common/Toast/Toast";
import PageHeader from "../components/layout/PageHeader";
import LegacyAvatar from "../components/profile/LegacyAvatar";
import {
  LEAGUE_MODES,
  LEAGUE_PARTICIPANT_LIMIT,
  LEAGUE_TYPES,
} from "../constants/leagues";
import useLeagues from "../hooks/useLeagues";
import usePlayerData from "../hooks/usePlayerData";
import useTeam from "../hooks/useTeam";
import useToast from "../hooks/useToast";
import { formatDateInputValue, parseDateInputValue, toDate } from "../services/dateService";
import {
  calculateLeagueStandings,
  canManageLeague,
  getLeagueStatusLabel,
} from "../services/leagues/leagueModel";
import {
  createLeague,
  joinLeague,
  leaveLeagueRegistration,
  subscribeToLeagueContributions,
  subscribeToLeagueMemberships,
  transitionLeague,
} from "../services/leagues/leagueService";
import { copyTextToClipboard } from "../utils/clipboard";
import { formatNumber, formatPoints, pluralize } from "../utils/displayFormatters";
import "./Leagues.css";

const EMPTY_ITEMS = Object.freeze([]);

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "Date unavailable";
}

function getMembershipStatusLabel(status) {
  return {
    registered: "Registered",
    active: "Active participant",
    completed: "Season completed",
  }[status] ?? "Participant";
}

function getStandingsStateLabel(status) {
  return {
    registration: "Registration",
    active: "Live",
    completed: "Final",
    archived: "Archived",
  }[status] ?? "Not started";
}

function LeagueCreationForm({ actorId, notify }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const end = new Date(tomorrow);
  end.setDate(end.getDate() + 28);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: LEAGUE_TYPES[0],
    mode: "individual",
    startDate: formatDateInputValue(tomorrow),
    endDate: formatDateInputValue(end),
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await createLeague({
        actorId,
        input: {
          ...form,
          startDate: parseDateInputValue(form.startDate),
          endDate: parseDateInputValue(form.endDate),
        },
      });
      notify("League draft created. Review it before opening registration.", "success");
      setForm((current) => ({ ...current, name: "", description: "" }));
    } catch (error) {
      console.error(error);
      notify(error.message || "The league could not be created.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="league-create card" onSubmit={handleSubmit}>
      <div>
        <p className="section-kicker">League administration</p>
        <h2>Create a season draft</h2>
        <p>The consistency rules are copied into the league and become immutable when the season activates.</p>
      </div>
      <div className="league-form-grid">
        <div className="form-field">
          <label htmlFor="league-name">League name</label>
          <input id="league-name" required minLength={4} maxLength={70} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        </div>
        <div className="form-field">
          <label htmlFor="league-type">League type</label>
          <select id="league-type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
            {LEAGUE_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="league-mode">Standings mode</label>
          <select id="league-mode" value={form.mode} onChange={(event) => setForm((current) => ({ ...current, mode: event.target.value }))}>
            {LEAGUE_MODES.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="league-start">Season starts</label>
          <input id="league-start" type="date" required value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} />
        </div>
        <div className="form-field">
          <label htmlFor="league-end">Season ends</label>
          <input id="league-end" type="date" required value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="league-description">Purpose and expectations</label>
        <textarea id="league-description" required minLength={15} maxLength={400} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      </div>
      <button className="button button--primary" type="submit" disabled={saving}>{saving ? "Creating draft…" : "Create league draft"}</button>
    </form>
  );
}

function JoinLeagueForm({ userId, profile, playerTeam, notify }) {
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setJoining(true);
    try {
      await joinLeague({ userId, profile, playerTeam, code });
      notify("League registration complete.", "success");
      setCode("");
    } catch (error) {
      console.error(error);
      notify(error.message || "The league could not be joined.", "error");
    } finally {
      setJoining(false);
    }
  }

  return (
    <form className="league-join card" onSubmit={handleSubmit}>
      <span aria-hidden="true">🎟️</span>
      <div>
        <p className="section-kicker">Invitation</p>
        <h2>Register with a league code</h2>
        <p>Your current team is captured when you register. Personal progress never resets.</p>
      </div>
      <div className="community-code-row">
        <label className="sr-only" htmlFor="league-code">League invitation code</label>
        <input
          id="league-code"
          className="community-code-input"
          inputMode="text"
          autoComplete="off"
          maxLength={8}
          placeholder="ABCD2345"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
        />
        <button className="button button--secondary" type="submit" disabled={joining}>{joining ? "Registering…" : "Join league"}</button>
      </div>
    </form>
  );
}

function StandingsTable({ rows, kind }) {
  if (rows.length === 0) {
    return <div className="empty-state">No standings are available yet.</div>;
  }

  return (
    <div className="standings-table" role="list" aria-label={`${kind} standings`}>
      {rows.map((row) => (
        <article className="standings-row" role="listitem" key={kind === "team" ? row.teamId || row.teamName : row.userId}>
          <strong className="standings-rank">{row.rank}</strong>
          {kind === "player" && <LegacyAvatar avatarId={row.avatarId} size="small" decorative />}
          <div className="standings-identity">
            <strong>{kind === "team" ? row.teamName : row.displayName}</strong>
            <span>
              {kind === "team"
                ? `${row.memberCount} ${pluralize(row.memberCount, "member", "members")} · ${row.activeDays} combined active days`
                : `${row.activeDays} active ${pluralize(row.activeDays, "day", "days")} · ${row.teamName}`}
            </span>
          </div>
          <strong className="standings-score">{formatPoints(row.totalPoints)}</strong>
        </article>
      ))}
    </div>
  );
}

function LeagueDetail({ league, membership, canManage, isPlatformAdmin, userId, notify }) {
  const [memberState, setMemberState] = useState({
    leagueId: "",
    items: [],
  });
  const [contributionState, setContributionState] = useState({
    leagueId: "",
    items: [],
  });
  const [workingAction, setWorkingAction] = useState("");
  const isManager = canManage &&
    canManageLeague(league, userId, isPlatformAdmin);
  const canViewStandings = Boolean(membership || isManager);

  useEffect(() => {
    if (!canViewStandings) {
      return undefined;
    }

    const unsubscribeMembers = subscribeToLeagueMemberships(
      league.id,
      (items) => setMemberState({ leagueId: league.id, items }),
      (error) => notify(error.message || "League members could not be loaded.", "error"),
    );
    const unsubscribeContributions = subscribeToLeagueContributions(
      league.id,
      (items) => setContributionState({ leagueId: league.id, items }),
      (error) => notify(error.message || "League standings could not be loaded.", "error"),
    );

    return () => {
      unsubscribeMembers();
      unsubscribeContributions();
    };
  }, [canViewStandings, league.id, notify]);

  const members =
    canViewStandings && memberState.leagueId === league.id
      ? memberState.items
      : EMPTY_ITEMS;
  const contributions =
    canViewStandings && contributionState.leagueId === league.id
      ? contributionState.items
      : EMPTY_ITEMS;
  const standings = useMemo(
    () => calculateLeagueStandings(contributions, members, league.ruleset),
    [contributions, league.ruleset, members],
  );
  const nextStatus = {
    draft: "registration",
    registration: "active",
    active: "completed",
    completed: "archived",
  }[league.status];
  const standingsState = getStandingsStateLabel(league.status);

  async function handleTransition() {
    if (workingAction || !nextStatus || !window.confirm(`Change this league to ${getLeagueStatusLabel(nextStatus)}?`)) {
      return;
    }

    setWorkingAction("transition");
    try {
      await transitionLeague({ league, nextStatus, actorId: userId });
      notify(`League changed to ${getLeagueStatusLabel(nextStatus)}.`, "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "The league status could not be changed.", "error");
    } finally {
      setWorkingAction("");
    }
  }

  async function handleWithdraw() {
    if (workingAction || !window.confirm("Withdraw this league registration?")) {
      return;
    }
    setWorkingAction("withdraw");
    try {
      await leaveLeagueRegistration({ leagueId: league.id, userId });
      notify("League registration withdrawn.", "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "Registration could not be withdrawn.", "error");
    } finally {
      setWorkingAction("");
    }
  }

  return (
    <div className="league-detail">
      <section className="league-hero card">
        <div>
          <span className={`league-status league-status--${league.status}`}>{getLeagueStatusLabel(league.status)}</span>
          <p className="section-kicker">{league.type} league</p>
          <h2>{league.name}</h2>
          <p>{league.description}</p>
          <div className="league-date-line"><strong>{formatDate(league.startDate)}</strong><span aria-hidden="true">→</span><strong>{formatDate(league.endDate)}</strong></div>
        </div>
        <div className="league-hero__actions">
          {membership && (
            <span className="league-membership-chip">
              ✓ {getMembershipStatusLabel(membership.status)}
            </span>
          )}
          {isManager && league.inviteCode && (
            <button
              className="button button--secondary"
              type="button"
              onClick={async () => {
                try {
                  await copyTextToClipboard(league.inviteCode);
                  notify("League invitation code copied.", "success");
                } catch (error) {
                  console.error(error);
                  notify(`Invitation code: ${league.inviteCode}`, "info");
                }
              }}
            >
              Copy invitation code
            </button>
          )}
          {isManager && nextStatus && <button className="button button--primary" type="button" disabled={Boolean(workingAction)} onClick={handleTransition}>{workingAction === "transition" ? "Updating league…" : `Move to ${getLeagueStatusLabel(nextStatus)}`}</button>}
          {membership?.status === "registered" && (
            <button
              className="button button--danger"
              type="button"
              disabled={Boolean(workingAction)}
              onClick={handleWithdraw}
            >
              {workingAction === "withdraw" ? "Withdrawing…" : "Withdraw registration"}
            </button>
          )}
        </div>
      </section>

      <section className="league-rules card">
        <div>
          <p className="section-kicker">Frozen seasonal rules</p>
          <h2>Consistency-v1</h2>
          <p>Each active day receives up to <strong>{formatPoints(league.ruleset?.dailyActivityCap ?? 20)}</strong> from activity, plus a <strong>{formatPoints(league.ruleset?.dailyParticipationBonus ?? 5)}</strong> participation bonus. Additional activity remains part of personal progress but cannot let one exceptional day overwhelm steady participation.</p>
        </div>
        <dl>
          <div><dt>Scoring engine</dt><dd>{league.ruleset?.scoringEngineVersion}</dd></div>
          <div><dt>Rules version</dt><dd>{league.rulesVersion}</dd></div>
          <div><dt>Standings</dt><dd>{league.mode === "team" ? "Team and individual" : "Individual"}</dd></div>
          <div>
            <dt>Participants</dt>
            <dd>
              {formatNumber(league.participantCount ?? members.length, { whole: true })}
              {" of "}
              {formatNumber(league.participantLimit ?? LEAGUE_PARTICIPANT_LIMIT, { whole: true })}
            </dd>
          </div>
        </dl>
      </section>

      {canViewStandings ? (
        <>
          <section className="league-standings card">
            <div className="community-section-heading"><div><p className="section-kicker">Season table</p><h2>Individual standings</h2></div><span>{standingsState}</span></div>
            <StandingsTable rows={standings.players} kind="player" />
          </section>

          {league.mode === "team" && (
            <section className="league-standings card">
              <div className="community-section-heading"><div><p className="section-kicker">Team competition</p><h2>Team standings</h2></div><span>{standingsState}</span></div>
              <StandingsTable rows={standings.teams} kind="team" />
            </section>
          )}
        </>
      ) : (
        <section className="league-standings card">
          <div className="empty-state">Join this league during registration to view its member roster and live standings.</div>
        </section>
      )}

      <section className="community-guardrail card">
        <span aria-hidden="true">🏛️</span>
        <div><p className="section-kicker">Permanent memory</p><h2>The season ends; the legacy remains</h2><p>Completed and archived seasons retain final standings and their frozen rule version. Lifetime experience points, achievements and personal records never reset.</p></div>
      </section>
    </div>
  );
}

export default function Leagues() {
  const { user, profile, isPlatformAdmin } = usePlayerData();
  const { membership: playerTeam } = useTeam();
  const { leagues, memberships, loading, error, canManageLeagues } = useLeagues();
  const { toast, showToast, dismissToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("league") || memberships[0]?.leagueId || leagues[0]?.id || "";
  const selectedLeague = leagues.find((league) => league.id === selectedId) || null;
  const selectedMembership = memberships.find((membership) => membership.leagueId === selectedId) || null;

  return (
    <div className="league-page page-stack">
      <PageHeader
        eyebrow="Seasonal competition"
        title="Leagues"
        description="Begin each season equally, reward consistent participation and preserve every completed league as part of your story."
        icon="🛡️"
      />

      {error && <div className="inline-alert inline-alert--danger" role="alert">{error}</div>}

      <div className="league-tools">
        <JoinLeagueForm userId={user?.uid} profile={profile} playerTeam={playerTeam} notify={showToast} />
        {canManageLeagues && <LeagueCreationForm actorId={user?.uid} notify={showToast} />}
      </div>

      <section className="league-browser card">
        <div className="community-section-heading"><div><p className="section-kicker">League library</p><h2>Choose a season</h2></div><span>{leagues.length} {pluralize(leagues.length, "league", "leagues")}</span></div>
        {loading ? (
          <div className="empty-state">Loading leagues…</div>
        ) : leagues.length === 0 ? (
          <div className="empty-state">No leagues are available yet.</div>
        ) : (
          <div className="league-browser__list">
            {leagues.map((league) => {
              const leagueMembership = memberships.find((membership) => membership.leagueId === league.id);
              return (
                <button key={league.id} className={selectedId === league.id ? "league-card league-card--selected" : "league-card"} type="button" onClick={() => setSearchParams({ league: league.id }, { replace: true })}>
                  <span className={`league-status league-status--${league.status}`}>{getLeagueStatusLabel(league.status)}</span>
                  <strong>{league.name}</strong>
                  <small>{formatDate(league.startDate)} – {formatDate(league.endDate)}</small>
                  {leagueMembership && <em>Registered</em>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selectedLeague && (
        <LeagueDetail
          key={selectedLeague.id}
          league={selectedLeague}
          membership={selectedMembership}
          canManage={canManageLeagues}
          isPlatformAdmin={isPlatformAdmin}
          userId={user?.uid}
          notify={showToast}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
