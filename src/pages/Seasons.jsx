import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Toast from "../components/common/Toast/Toast";
import PageHeader from "../components/layout/PageHeader";
import LegacyAvatar from "../components/profile/LegacyAvatar";
import { LEAGUE_PARTICIPANT_LIMIT, LEAGUE_TYPES } from "../constants/leagues";
import { SEASON_HOUSE_LIMITS, getHouseEmblem } from "../constants/seasons";
import useLeagues from "../hooks/useLeagues";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import {
  formatDateInputValue,
  parseDateInputValue,
  toDate,
} from "../services/dateService";
import {
  calculateLeagueStandings,
  calculateSeasonHonours,
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
import {
  formatNumber,
  formatPoints,
  pluralize,
} from "../utils/displayFormatters";
import "./Seasons.css";

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
  return (
    {
      registered: "Registered",
      active: "Active participant",
      completed: "Season completed",
    }[status] ?? "Participant"
  );
}

function LeagueCreationForm({ actorId, notify }) {
  const start = new Date();
  start.setDate(start.getDate() + 14);
  const end = new Date(start);
  end.setDate(end.getDate() + 41);
  const [form, setForm] = useState({
    name: "",
    description: "",
    theme: "",
    type: LEAGUE_TYPES[0],
    mode: "season",
    houseCount: 6,
    pocketEnabled: true,
    startDate: formatDateInputValue(start),
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
          houseCount: Number(form.houseCount),
          startDate: parseDateInputValue(form.startDate),
          endDate: parseDateInputValue(form.endDate),
        },
      });
      notify(
        "Season draft created. Forge its Houses before opening registration.",
        "success",
        5200,
      );
      setForm((current) => ({
        ...current,
        name: "",
        description: "",
        theme: "",
      }));
    } catch (error) {
      console.error(error);
      notify(error.message || "The season could not be created.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="league-create card" onSubmit={handleSubmit}>
      <div>
        <p className="section-kicker">League administration</p>
        <h2>Create a themed House season</h2>
        <p>
          Every season receives individual standings, House standings, a
          seven-day Pocket window and its own permanent roster history.
        </p>
      </div>
      <div className="league-form-grid">
        <div className="form-field">
          <label htmlFor="league-name">Season name</label>
          <input
            id="league-name"
            required
            minLength={4}
            maxLength={70}
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="league-theme">Season theme</label>
          <input
            id="league-theme"
            required
            minLength={3}
            maxLength={80}
            placeholder="Animals, Predators, Mythic…"
            value={form.theme}
            onChange={(event) =>
              setForm((current) => ({ ...current, theme: event.target.value }))
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="league-type">Community type</label>
          <select
            id="league-type"
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
          >
            {LEAGUE_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="league-house-count">Number of Houses</label>
          <select
            id="league-house-count"
            value={form.houseCount}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                houseCount: event.target.value,
              }))
            }
          >
            {Array.from(
              {
                length:
                  SEASON_HOUSE_LIMITS.maximum - SEASON_HOUSE_LIMITS.minimum + 1,
              },
              (_, index) => index + SEASON_HOUSE_LIMITS.minimum,
            ).map((value) => (
              <option key={value} value={value}>
                {value} Houses
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="league-start">Challenge starts</label>
          <input
            id="league-start"
            type="date"
            required
            value={form.startDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
          />
        </div>
        <div className="form-field">
          <label htmlFor="league-end">Challenge ends</label>
          <input
            id="league-end"
            type="date"
            required
            value={form.endDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="league-description">
          Season purpose and expectations
        </label>
        <textarea
          id="league-description"
          required
          minLength={15}
          maxLength={400}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </div>
      <label className="league-pocket-toggle">
        <input
          type="checkbox"
          checked={form.pocketEnabled}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              pocketEnabled: event.target.checked,
            }))
          }
        />
        <span>
          <strong>Enable seven-day Pocket Week</strong>
          <small>
            Runs automatically during the seven days immediately before the
            challenge starts.
          </small>
        </span>
      </label>
      <button
        className="button button--primary"
        type="submit"
        disabled={saving}
      >
        {saving ? "Creating season…" : "Create season draft"}
      </button>
    </form>
  );
}

function JoinLeagueForm({ userId, profile, notify }) {
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setJoining(true);
    try {
      await joinLeague({ userId, profile, code });
      notify(
        "Season registration complete. C.H.A.O.S. will reveal your opening House when activated.",
        "success",
        5200,
      );
      setCode("");
    } catch (error) {
      console.error(error);
      notify(error.message || "The season could not be joined.", "error");
    } finally {
      setJoining(false);
    }
  }

  return (
    <form className="league-join card" onSubmit={handleSubmit}>
      <span aria-hidden="true">🎟️</span>
      <div>
        <p className="section-kicker">Invitation</p>
        <h2>Register with a season code</h2>
        <p>
          You register as an individual. Your opening House is revealed only
          when an administrator activates C.H.A.O.S.
        </p>
      </div>
      <div className="community-code-row">
        <label className="sr-only" htmlFor="league-code">
          Season invitation code
        </label>
        <input
          id="league-code"
          className="community-code-input"
          autoComplete="off"
          maxLength={8}
          placeholder="ABCD2345"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
        />
        <button
          className="button button--secondary"
          type="submit"
          disabled={joining}
        >
          {joining ? "Registering…" : "Join season"}
        </button>
      </div>
    </form>
  );
}

function StandingsTable({ rows, kind }) {
  if (rows.length === 0)
    return (
      <div className="empty-state">
        No scoring activity has reached this table yet.
      </div>
    );
  const houseTable = kind === "house";
  return (
    <div
      className="standings-table"
      role="list"
      aria-label={`${kind} standings`}
    >
      {rows.map((row) => (
        <article
          className="standings-row"
          role="listitem"
          key={houseTable ? row.houseId || row.houseName : row.userId}
        >
          <strong className="standings-rank">{row.rank}</strong>
          {houseTable ? (
            <span className="standings-house-emblem" aria-hidden="true">
              {getHouseEmblem(row.houseEmblemId).symbol}
            </span>
          ) : (
            <LegacyAvatar avatarId={row.avatarId} size="small" decorative />
          )}
          <div className="standings-identity">
            <strong>{houseTable ? row.houseName : row.displayName}</strong>
            <span>
              {houseTable
                ? `${row.memberCount} contributing ${pluralize(row.memberCount, "player", "players")} · ${row.activeDays} combined active days`
                : `${row.activeDays} active ${pluralize(row.activeDays, "day", "days")} · ${row.houseName}`}
            </span>
          </div>
          <strong className="standings-score">
            {formatPoints(row.totalPoints)}
          </strong>
        </article>
      ))}
    </div>
  );
}

function LeagueDetail({
  league,
  membership,
  canManage,
  isPlatformAdmin,
  userId,
  notify,
}) {
  const [memberState, setMemberState] = useState({ leagueId: "", items: [] });
  const [contributionState, setContributionState] = useState({
    leagueId: "",
    items: [],
  });
  const [workingAction, setWorkingAction] = useState("");
  const isManager =
    canManage && canManageLeague(league, userId, isPlatformAdmin);
  const isHouseSeason =
    league.mode === "season" && league.ruleset?.version === "season-houses-v1";
  const canViewStandings = Boolean(membership || isManager);

  useEffect(() => {
    if (!canViewStandings) return undefined;
    const unsubscribeMembers = subscribeToLeagueMemberships(
      league.id,
      (items) => setMemberState({ leagueId: league.id, items }),
      (error) =>
        notify(error.message || "Season members could not be loaded.", "error"),
    );
    const unsubscribeContributions = subscribeToLeagueContributions(
      league.id,
      (items) => setContributionState({ leagueId: league.id, items }),
      (error) =>
        notify(
          error.message || "Season standings could not be loaded.",
          "error",
        ),
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
  const honours = useMemo(
    () => calculateSeasonHonours(contributions, members, league.ruleset),
    [contributions, league.ruleset, members],
  );
  const nextStatus = isHouseSeason
    ? {
        draft: "registration",
        registration: "active",
        active: "completed",
        completed: "archived",
      }[league.status]
    : null;

  async function handleTransition() {
    if (
      workingAction ||
      !nextStatus ||
      !window.confirm(
        `Change this season to ${getLeagueStatusLabel(nextStatus)}?`,
      )
    )
      return;
    setWorkingAction("transition");
    try {
      await transitionLeague({ league, nextStatus, actorId: userId });
      notify(
        `Season changed to ${getLeagueStatusLabel(nextStatus)}.`,
        "success",
      );
    } catch (error) {
      console.error(error);
      notify(
        error.message || "The season status could not be changed.",
        "error",
      );
    } finally {
      setWorkingAction("");
    }
  }

  async function handleWithdraw() {
    if (workingAction || !window.confirm("Withdraw this season registration?"))
      return;
    setWorkingAction("withdraw");
    try {
      await leaveLeagueRegistration({ leagueId: league.id, userId });
      notify("Season registration withdrawn.", "success");
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
          <span className={`league-status league-status--${league.status}`}>
            {getLeagueStatusLabel(league.status)}
          </span>
          <p className="section-kicker">{league.theme || league.type}</p>
          <h2>{league.name}</h2>
          <p>{league.description}</p>
          <div className="league-date-line">
            <strong>{formatDate(league.startDate)}</strong>
            <span aria-hidden="true">→</span>
            <strong>{formatDate(league.endDate)}</strong>
          </div>
        </div>
        <div className="league-hero__actions">
          {membership && (
            <span className="league-membership-chip">
              ✓ {getMembershipStatusLabel(membership.status)}
            </span>
          )}
          {isHouseSeason && (
            <Link
              className="button button--secondary"
              to={`/houses?league=${league.id}`}
            >
              Open Houses
            </Link>
          )}
          {isHouseSeason && league.pocketEnabled && (
            <Link
              className="button button--secondary"
              to={`/pocket?league=${league.id}`}
            >
              Open Pocket
            </Link>
          )}
          {isManager && league.inviteCode && (
            <button
              className="button button--secondary"
              type="button"
              onClick={async () => {
                try {
                  await copyTextToClipboard(league.inviteCode);
                  notify("Season invitation code copied.", "success");
                } catch (error) {
                  console.error(error);
                  notify(`Invitation code: ${league.inviteCode}`, "info");
                }
              }}
            >
              Copy invitation code
            </button>
          )}
          {isManager && nextStatus && (
            <button
              className="button button--primary"
              type="button"
              disabled={Boolean(workingAction)}
              onClick={handleTransition}
            >
              {workingAction === "transition"
                ? "Updating season…"
                : `Move to ${getLeagueStatusLabel(nextStatus)}`}
            </button>
          )}
          {membership?.status === "registered" && (
            <button
              className="button button--danger"
              type="button"
              disabled={Boolean(workingAction)}
              onClick={handleWithdraw}
            >
              {workingAction === "withdraw"
                ? "Withdrawing…"
                : "Withdraw registration"}
            </button>
          )}
        </div>
      </section>

      {!isHouseSeason && (
        <section className="inline-alert card" role="status">
          This is a legacy league record from before season-scoped Houses. It
          remains readable, but its lifecycle cannot be changed through the
          current season system. Create a new themed season to use C.H.A.O.S.,
          House leadership and Pocket Week.
        </section>
      )}

      <section className="season-system card">
        <article>
          <span aria-hidden="true">🏰</span>
          <strong>{league.houseCount || 0} Houses</strong>
          <small>
            {league.chaosStatus === "activated"
              ? "C.H.A.O.S. activated"
              : "Opening roster pending"}
          </small>
        </article>
        <article>
          <span aria-hidden="true">🧳</span>
          <strong>
            {league.pocketEnabled ? "Pocket enabled" : "No Pocket"}
          </strong>
          <small>
            {league.pocketEnabled
              ? `${formatDate(league.pocketStartDate)} – ${formatDate(league.pocketEndDate)}`
              : "Season setting"}
          </small>
        </article>
        <article>
          <span aria-hidden="true">⚖️</span>
          <strong>Dual standings</strong>
          <small>Individual and House</small>
        </article>
      </section>

      <section className="league-rules card">
        <div>
          <p className="section-kicker">Frozen seasonal rules</p>
          <h2>{league.ruleset?.version || "Season rules"}</h2>
          <p>
            Each active day receives up to{" "}
            <strong>
              {formatPoints(league.ruleset?.dailyActivityCap ?? 20)}
            </strong>{" "}
            from activity, plus a{" "}
            <strong>
              {formatPoints(league.ruleset?.dailyParticipationBonus ?? 5)}
            </strong>{" "}
            participation bonus. Moving Houses changes only future House
            contributions.
          </p>
        </div>
        <dl>
          <div>
            <dt>Scoring engine</dt>
            <dd>{league.ruleset?.scoringEngineVersion}</dd>
          </div>
          <div>
            <dt>Rules version</dt>
            <dd>{league.rulesVersion}</dd>
          </div>
          <div>
            <dt>Standings</dt>
            <dd>Individual and House</dd>
          </div>
          <div>
            <dt>Participants</dt>
            <dd>
              {formatNumber(league.participantCount ?? members.length, {
                whole: true,
              })}{" "}
              of{" "}
              {formatNumber(
                league.participantLimit ?? LEAGUE_PARTICIPANT_LIMIT,
                { whole: true },
              )}
            </dd>
          </div>
        </dl>
      </section>

      {canViewStandings ? (
        <>
          <section className="league-standings card">
            <div className="community-section-heading">
              <div>
                <p className="section-kicker">Personal contest</p>
                <h2>Individual leaderboard</h2>
              </div>
              <span>{getLeagueStatusLabel(league.status)}</span>
            </div>
            <StandingsTable rows={standings.players} kind="player" />
          </section>
          <section className="league-standings card">
            <div className="community-section-heading">
              <div>
                <p className="section-kicker">Collective impact</p>
                <h2>House leaderboard</h2>
              </div>
              <span>Historical allocation</span>
            </div>
            <StandingsTable rows={standings.houses} kind="house" />
          </section>
          <section className="season-honours card">
            <div className="community-section-heading">
              <div>
                <p className="section-kicker">
                  {league.status === "completed" || league.status === "archived"
                    ? "Season honours"
                    : "Provisional honours"}
                </p>
                <h2>Champions in the making</h2>
              </div>
              <span>
                {league.status === "completed" || league.status === "archived"
                  ? "Final"
                  : "Updates live"}
              </span>
            </div>
            {honours.individual.length === 0 ? (
              <div className="empty-state">
                Honours appear after qualifying points are earned.
              </div>
            ) : (
              <div className="season-honours__grid">
                {honours.individual.map((honour) => (
                  <article key={honour.id}>
                    <LegacyAvatar
                      avatarId={honour.avatarId}
                      size="small"
                      decorative
                    />
                    <div>
                      <small>{honour.title}</small>
                      <strong>{honour.displayName}</strong>
                    </div>
                    <span>{formatPoints(honour.points)}</span>
                  </article>
                ))}
              </div>
            )}
            {(honours.houseOfChampions ||
              honours.houseChampions.length > 0) && (
              <div className="season-honours__houses">
                {honours.houseOfChampions && (
                  <article className="season-honours__winner">
                    <span aria-hidden="true">
                      {
                        getHouseEmblem(honours.houseOfChampions.houseEmblemId)
                          .symbol
                      }
                    </span>
                    <div>
                      <small>House of Champions</small>
                      <strong>{honours.houseOfChampions.houseName}</strong>
                    </div>
                    <b>{formatPoints(honours.houseOfChampions.totalPoints)}</b>
                  </article>
                )}
                {honours.houseChampions.map((champion) => (
                  <article key={champion.houseId}>
                    <LegacyAvatar
                      avatarId={champion.avatarId}
                      size="small"
                      decorative
                    />
                    <div>
                      <small>{champion.houseName} Champion</small>
                      <strong>{champion.displayName}</strong>
                    </div>
                    <span>{formatPoints(champion.totalPoints)}</span>
                  </article>
                ))}
              </div>
            )}
            <p className="season-honours__note">
              Individual titles follow the original prestige order. Once
              provisionally placed in one category, a player is not repeated in
              another individual title.
            </p>
          </section>
        </>
      ) : (
        <section className="league-standings card">
          <div className="empty-state">
            Join this season during registration to view its roster and
            standings.
          </div>
        </section>
      )}

      <section className="community-guardrail card">
        <span aria-hidden="true">🧭</span>
        <div>
          <p className="section-kicker">Permanent memory</p>
          <h2>The House you represented keeps that chapter</h2>
          <p>
            A later transfer never rewrites earlier contributions. Your
            individual points remain yours; the House points stay exactly where
            they were earned.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Seasons() {
  const { user, profile, isPlatformAdmin } = usePlayerData();
  const { leagues, memberships, loading, error, canManageLeagues } =
    useLeagues();
  const { toast, showToast, dismissToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get("league") || "";
  const fallbackId = memberships[0]?.leagueId || leagues[0]?.id || "";
  const selectedId = leagues.some((league) => league.id === requestedId)
    ? requestedId
    : fallbackId;
  const selectedLeague =
    leagues.find((league) => league.id === selectedId) || null;
  const selectedMembership =
    memberships.find((membership) => membership.leagueId === selectedId) ||
    null;

  return (
    <div className="league-page page-stack">
      <PageHeader
        eyebrow="Themed seasonal competition"
        title="Seasons"
        description="Register once, compete individually, strengthen the House you currently represent and preserve every chapter after the season ends."
        icon="🛡️"
      />
      {error && (
        <div className="inline-alert inline-alert--danger" role="alert">
          {error}
        </div>
      )}
      <div className="league-tools">
        <JoinLeagueForm
          userId={user?.uid}
          profile={profile}
          notify={showToast}
        />
        {canManageLeagues && (
          <LeagueCreationForm actorId={user?.uid} notify={showToast} />
        )}
      </div>
      <section className="league-browser card">
        <div className="community-section-heading">
          <div>
            <p className="section-kicker">Season archive</p>
            <h2>Choose a season</h2>
          </div>
          <span>
            {leagues.length} {pluralize(leagues.length, "season", "seasons")}
          </span>
        </div>
        {loading ? (
          <div className="empty-state">Loading seasons…</div>
        ) : leagues.length === 0 ? (
          <div className="empty-state">No seasons are available yet.</div>
        ) : (
          <div className="league-browser__list">
            {leagues.map((league) => {
              const leagueMembership = memberships.find(
                (item) => item.leagueId === league.id,
              );
              return (
                <button
                  key={league.id}
                  type="button"
                  aria-pressed={selectedId === league.id}
                  className={
                    selectedId === league.id
                      ? "league-browser__item league-browser__item--active"
                      : "league-browser__item"
                  }
                  onClick={() =>
                    setSearchParams({ league: league.id }, { replace: true })
                  }
                >
                  <span>{league.theme || league.type}</span>
                  <strong>{league.name}</strong>
                  <small>
                    {getLeagueStatusLabel(league.status)}
                    {leagueMembership
                      ? ` · ${getMembershipStatusLabel(leagueMembership.status)}`
                      : ""}
                  </small>
                </button>
              );
            })}
          </div>
        )}
      </section>
      {selectedLeague && (
        <LeagueDetail
          league={selectedLeague}
          membership={selectedMembership}
          canManage={canManageLeagues}
          isPlatformAdmin={isPlatformAdmin}
          userId={user?.uid}
          notify={showToast}
        />
      )}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onDismiss={dismissToast}
      />
    </div>
  );
}
