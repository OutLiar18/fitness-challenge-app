import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Toast from "../components/common/Toast/Toast";
import EvidenceWorkspace from "../components/seasons/EvidenceWorkspace";
import PowerPlayWorkspace from "../components/seasons/PowerPlayWorkspace";
import SeasonCommandCentre from "../components/seasons/SeasonCommandCentre";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import LegacyAvatar from "../components/profile/LegacyAvatar";
import { DEFAULT_SEASON_EVIDENCE_POLICY } from "../constants/evidence";
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
  subscribeToLeaderboardSnapshot,
  subscribeToReviewerAssignmentsForUser,
} from "../services/evidence/evidenceService";
import { subscribeToLeaguePowerPlayWeeks } from "../services/seasons/powerPlayService";
import { resolveWorkspaceTab } from "../services/ui/workspaceModel";
import {
  formatNumber,
  formatPoints,
  pluralize,
} from "../utils/displayFormatters";
import "./Seasons.css";

const EMPTY_ITEMS = Object.freeze([]);

const SEASON_DETAIL_TABS = Object.freeze([
  {
    id: "overview",
    label: "Overview",
    icon: "🧭",
    description: "Season dates, rules and lifecycle",
  },
  {
    id: "operations",
    label: "Command centre",
    icon: "🎛️",
    description: "Operational health, next actions and downloadable reports",
  },
  {
    id: "power-plays",
    label: "Power Plays",
    icon: "⚡",
    description: "Theme-named weekly multipliers and no-repeat draw history",
  },
  {
    id: "standings",
    label: "Standings",
    icon: "📊",
    description: "Individual and House leaderboards",
  },
  {
    id: "honours",
    label: "Honours",
    icon: "🏆",
    description: "Provisional or final season champions",
  },
  {
    id: "evidence",
    label: "Evidence operations",
    icon: "✅",
    description: "Review WhatsApp proof and publish player standings",
  },
]);

const SEASONS_PAGE_TABS = Object.freeze([
  {
    id: "browse",
    label: "Browse seasons",
    icon: "🛡️",
    description: "Explore season details, standings and honours",
  },
  {
    id: "join",
    label: "Join a season",
    icon: "🎟️",
    description: "Register with a season invitation code",
  },
  {
    id: "create",
    label: "Create season",
    icon: "✨",
    description: "Build a new themed House season",
  },
]);
const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const publishedDateTimeFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Johannesburg",
});

function formatDate(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "Date unavailable";
}

function formatPublishedDateTime(value) {
  const date = toDate(value);
  return date
    ? publishedDateTimeFormatter.format(date)
    : "Waiting for the first published snapshot";
}

function getMembershipStatusLabel(status) {
  return (
    {
      registered: "Registered",
      active: "Active participant",
      completed: "Season completed",
      withdrawn: "Former participant",
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
    evidencePolicy: {
      ...DEFAULT_SEASON_EVIDENCE_POLICY,
      confirmed: false,
      running: { ...DEFAULT_SEASON_EVIDENCE_POLICY.running },
      steps: { ...DEFAULT_SEASON_EVIDENCE_POLICY.steps },
      waterBonus: { ...DEFAULT_SEASON_EVIDENCE_POLICY.waterBonus },
      fruitBonus: { ...DEFAULT_SEASON_EVIDENCE_POLICY.fruitBonus },
      leaderboardPublication: {
        ...DEFAULT_SEASON_EVIDENCE_POLICY.leaderboardPublication,
      },
    },
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
        "Season draft created. Forge its Houses and give every Power Play a unique theme name before opening registration.",
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
          seven-day Pocket window, themed no-repeat Power Plays and its own
          permanent roster history.
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
      <section className="season-evidence-config" aria-labelledby="season-evidence-heading">
        <div>
          <p className="section-kicker">WhatsApp proof workflow</p>
          <h3 id="season-evidence-heading">Configure evidence and leaderboard publication</h3>
          <p>
            The app stores structured decisions only. Players send proof in the
            season WhatsApp group using the verification ID shown on their entry.
          </p>
        </div>
        <div className="season-evidence-config__grid">
          <label className="form-field">
            <span>Proof deadline</span>
            <select
              value={form.evidencePolicy.proofDeadlineHours}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  evidencePolicy: {
                    ...current.evidencePolicy,
                    proofDeadlineHours: Number(event.target.value),
                  },
                }))
              }
            >
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
            </select>
          </label>
          <label className="form-field">
            <span>Player leaderboard publication</span>
            <input
              type="time"
              value={form.evidencePolicy.leaderboardPublication.automaticTime}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  evidencePolicy: {
                    ...current.evidencePolicy,
                    leaderboardPublication: {
                      ...current.evidencePolicy.leaderboardPublication,
                      automaticTime: event.target.value,
                    },
                  },
                }))
              }
            />
          </label>
          <label className="form-field">
            <span>Water photo target</span>
            <select
              value={form.evidencePolicy.waterBonus.thresholdMillilitres}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  evidencePolicy: {
                    ...current.evidencePolicy,
                    waterBonus: {
                      ...current.evidencePolicy.waterBonus,
                      thresholdMillilitres: Number(event.target.value),
                    },
                  },
                }))
              }
            >
              <option value={750}>750 millilitres for 3 points</option>
            </select>
          </label>
          <label className="form-field">
            <span>Fruit photo target</span>
            <select
              value={form.evidencePolicy.fruitBonus.thresholdServings}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  evidencePolicy: {
                    ...current.evidencePolicy,
                    fruitBonus: {
                      ...current.evidencePolicy.fruitBonus,
                      thresholdServings: Number(event.target.value),
                    },
                  },
                }))
              }
            >
              <option value={3}>3 servings for 3 points</option>
            </select>
          </label>
          <label className="form-field">
            <span>Daily Fruit scoring cap</span>
            <select
              value={form.evidencePolicy.fruitDailyServingCap}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  evidencePolicy: {
                    ...current.evidencePolicy,
                    fruitDailyServingCap: Number(event.target.value),
                  },
                }))
              }
            >
              <option value={5}>5 servings per day</option>
            </select>
          </label>
        </div>
        <ul className="season-evidence-config__rules">
          <li>Running proof must show the date, distance and duration; pace is calculated automatically.</li>
          <li>Steps proof must show the date, total steps and a recognisable app or device.</li>
          <li>Platform Administrators can review all categories; assigned reviewers are configured after registration opens.</li>
          <li>Players see a daily published snapshot while administrators retain live standings.</li>
        </ul>
        <label className="league-pocket-toggle">
          <input
            type="checkbox"
            checked={form.evidencePolicy.confirmed}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                evidencePolicy: {
                  ...current.evidencePolicy,
                  confirmed: event.target.checked,
                },
              }))
            }
          />
          <span>
            <strong>Confirm these season evidence rules</strong>
            <small>They are frozen when the season draft is created.</small>
          </span>
        </label>
      </section>
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
  requestedTab = "",
}) {
  const [memberState, setMemberState] = useState({ leagueId: "", items: [] });
  const [contributionState, setContributionState] = useState({
    leagueId: "",
    items: [],
  });
  const [reviewerAssignments, setReviewerAssignments] = useState([]);
  const [publishedSnapshot, setPublishedSnapshot] = useState(null);
  const [powerPlayAssignments, setPowerPlayAssignments] = useState([]);
  const [workingAction, setWorkingAction] = useState("");
  const [activeTab, setActiveTab] = useState(() => requestedTab || "overview");
  const isManager =
    canManage && canManageLeague(league, userId, isPlatformAdmin);
  const isHouseSeason =
    league.mode === "season" && String(league.ruleset?.version ?? "").startsWith("season-houses-v");
  const reviewerAssignment = reviewerAssignments.find(
    (assignment) => assignment.leagueId === league.id && assignment.status !== "inactive",
  );
  const isEvidenceReviewer = Boolean(reviewerAssignment?.categories?.length);
  const evidenceEnabled = Boolean(league.ruleset?.evidencePolicy);
  const powerPlayEnabled = Boolean(league.ruleset?.modules?.powerPlay === true);
  const canViewLiveStandings = Boolean(
    isManager
      || (evidenceEnabled && isEvidenceReviewer)
      || (!evidenceEnabled && membership),
  );
  const canViewStandings = Boolean(membership || canViewLiveStandings);
  const canOperateEvidence = Boolean(
    evidenceEnabled && (isManager || isEvidenceReviewer),
  );
  const canViewCommandCentre = Boolean(
    isHouseSeason && evidenceEnabled && (isManager || isEvidenceReviewer),
  );
  const detailTabs = SEASON_DETAIL_TABS.filter((tab) => {
    if (tab.id === "operations") return canViewCommandCentre;
    if (tab.id === "power-plays") return powerPlayEnabled;
    if (tab.id === "evidence") return canOperateEvidence;
    return true;
  });
  const resolvedDetailTab =
    resolveWorkspaceTab(detailTabs, activeTab)?.id ?? "overview";

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeToReviewerAssignmentsForUser(
      userId,
      setReviewerAssignments,
      (error) => notify(error.message || "Evidence reviewer access could not be loaded.", "error"),
    );
  }, [notify, userId]);

  useEffect(() => {
    if (!powerPlayEnabled) return undefined;
    return subscribeToLeaguePowerPlayWeeks(
      league,
      setPowerPlayAssignments,
      (error) => notify(error.message || "Power Play schedule could not be loaded.", "error"),
      { includeFuture: isManager },
    );
  }, [isManager, league, notify, powerPlayEnabled]);

  useEffect(() => {
    if (!canViewStandings) return undefined;
    const unsubscribeMembers = subscribeToLeagueMemberships(
      league.id,
      (items) => setMemberState({ leagueId: league.id, items }),
      (error) =>
        notify(error.message || "Season members could not be loaded.", "error"),
    );
    const unsubscribeContributions = canViewLiveStandings
      ? subscribeToLeagueContributions(
          league.id,
          (items) => setContributionState({ leagueId: league.id, items }),
          (error) =>
            notify(
              error.message || "Live season standings could not be loaded.",
              "error",
            ),
        )
      : () => {};
    return () => {
      unsubscribeMembers();
      unsubscribeContributions();
    };
  }, [canViewLiveStandings, canViewStandings, league.id, notify]);

  useEffect(() => {
    if (canViewLiveStandings || !canViewStandings) return undefined;
    return subscribeToLeaderboardSnapshot(
      league.publishedLeaderboardSnapshotId,
      setPublishedSnapshot,
      (error) => notify(error.message || "Published standings could not be loaded.", "error"),
    );
  }, [canViewLiveStandings, canViewStandings, league.publishedLeaderboardSnapshotId, notify]);

  const members =
    canViewStandings && memberState.leagueId === league.id
      ? memberState.items
      : EMPTY_ITEMS;
  const contributions =
    canViewLiveStandings && contributionState.leagueId === league.id
      ? contributionState.items
      : EMPTY_ITEMS;
  const liveStandings = useMemo(
    () => calculateLeagueStandings(
      contributions,
      members,
      league.ruleset,
      powerPlayAssignments,
    ),
    [contributions, league.ruleset, members, powerPlayAssignments],
  );
  const liveHonours = useMemo(
    () => calculateSeasonHonours(
      contributions,
      members,
      league.ruleset,
      powerPlayAssignments,
    ),
    [contributions, league.ruleset, members, powerPlayAssignments],
  );
  const standings = canViewLiveStandings
    ? liveStandings
    : {
        players: publishedSnapshot?.players ?? EMPTY_ITEMS,
        houses: publishedSnapshot?.houses ?? EMPTY_ITEMS,
      };
  const honours = canViewLiveStandings
    ? liveHonours
    : publishedSnapshot?.honours ?? {
        individual: EMPTY_ITEMS,
        houseChampions: EMPTY_ITEMS,
        houseOfChampions: null,
      };
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
            <Link className="button button--secondary" to={`/houses?league=${league.id}`}>
              Open Houses
            </Link>
          )}
          {isHouseSeason && league.pocketEnabled && (
            <Link className="button button--secondary" to={`/pocket?league=${league.id}`}>
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

      <WorkspaceTabs
        idPrefix={`season-${league.id}`}
        label={`${league.name} sections`}
        tabs={detailTabs.map((tab) =>
            tab.id === "standings"
              ? { ...tab, badge: members.length }
              : tab,
          )}
        activeId={resolvedDetailTab}
        onChange={setActiveTab}
      />

      <WorkspacePanel id="overview" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
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
            <strong>{league.pocketEnabled ? "Pocket enabled" : "No Pocket"}</strong>
            <small>
              {league.pocketEnabled
                ? `${formatDate(league.pocketStartDate)} – ${formatDate(league.pocketEndDate)}`
                : "Season setting"}
            </small>
          </article>
          <article>
            <span aria-hidden="true">⚡</span>
            <strong>{powerPlayEnabled ? "Power Plays active" : "Classic scoring"}</strong>
            <small>{powerPlayEnabled ? "One unique themed draw per week" : "No weekly multipliers"}</small>
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
              <strong>{formatPoints(league.ruleset?.dailyActivityCap ?? 20)}</strong>{" "}
              from activity, plus a{" "}
              <strong>{formatPoints(league.ruleset?.dailyParticipationBonus ?? 5)}</strong>{" "}
              participation bonus. Moving Houses changes only future House
              contributions. {powerPlayEnabled && "The selected themed Power Play multiplies eligible competitive activity points for its official week before the normal daily cap."}
            </p>
          </div>
          <dl>
            <div><dt>Scoring engine</dt><dd>{league.ruleset?.scoringEngineVersion}</dd></div>
            <div><dt>Rules version</dt><dd>{league.rulesVersion}</dd></div>
            <div><dt>Standings</dt><dd>Individual and House</dd></div>
            <div>
              <dt>Participants</dt>
              <dd>
                {formatNumber(league.participantCount ?? members.length, { whole: true })}{" "}
                of {formatNumber(league.participantLimit ?? LEAGUE_PARTICIPANT_LIMIT, { whole: true })}
              </dd>
            </div>
          </dl>
        </section>

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
      </WorkspacePanel>

      {canViewCommandCentre && (
        <WorkspacePanel id="operations" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
          <SeasonCommandCentre
            league={league}
            members={members}
            contributions={contributions}
            powerPlayAssignments={powerPlayAssignments}
            actorId={userId}
            isPlatformAdmin={isPlatformAdmin}
            isLeagueAdministrator={isManager}
            reviewerCategories={reviewerAssignment?.categories ?? EMPTY_ITEMS}
            notify={notify}
            onOpenEvidence={() => setActiveTab("evidence")}
            onOpenHonours={() => setActiveTab("honours")}
            onOpenPowerPlays={() => setActiveTab("power-plays")}
          />
        </WorkspacePanel>
      )}

      {powerPlayEnabled && (
        <WorkspacePanel id="power-plays" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
          <PowerPlayWorkspace
            league={league}
            assignments={powerPlayAssignments}
            actorId={userId}
            canManage={isManager}
            isPlatformAdmin={isPlatformAdmin}
            notify={notify}
          />
        </WorkspacePanel>
      )}

      <WorkspacePanel id="standings" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
        {canViewStandings ? (
          <>
            <section className="league-standings card">
              <div className="community-section-heading">
                <div><p className="section-kicker">Personal contest</p><h2>Individual leaderboard</h2></div>
                <span>
                  {canViewLiveStandings
                    ? "Live administrator view"
                    : publishedSnapshot
                      ? `Last updated ${formatPublishedDateTime(publishedSnapshot.publishedAt)}`
                      : "Waiting for the first published snapshot"}
                </span>
              </div>
              {!canViewLiveStandings && !publishedSnapshot ? (
                <div className="empty-state">
                  No player-facing leaderboard has been published yet. Your own
                  entries and proof statuses remain visible while the public table
                  stays frozen.
                </div>
              ) : (
                <StandingsTable rows={standings.players} kind="player" />
              )}
            </section>
            <section className="league-standings card">
              <div className="community-section-heading">
                <div><p className="section-kicker">Collective impact</p><h2>House leaderboard</h2></div>
                <span>
                  {canViewLiveStandings
                    ? "Live historical allocation"
                    : publishedSnapshot
                      ? "Published daily snapshot"
                      : "Waiting for the first published snapshot"}
                </span>
              </div>
              {!canViewLiveStandings && !publishedSnapshot ? (
                <div className="empty-state">
                  House standings will appear after the first daily publication.
                </div>
              ) : (
                <StandingsTable rows={standings.houses} kind="house" />
              )}
            </section>
          </>
        ) : (
          <section className="league-standings card">
            <div className="empty-state">
              Join this season during registration to view its roster and standings.
            </div>
          </section>
        )}
      </WorkspacePanel>

      <WorkspacePanel id="honours" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
        {canViewStandings ? (
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
                  : canViewLiveStandings
                    ? "Live administrator view"
                    : publishedSnapshot
                      ? "Published snapshot"
                      : "Awaiting first snapshot"}
              </span>
            </div>
            {!canViewLiveStandings && !publishedSnapshot ? (
              <div className="empty-state">
                Honours will appear after the first daily leaderboard snapshot is published.
              </div>
            ) : honours.individual.length === 0 ? (
              <div className="empty-state">Honours appear after qualifying points are earned.</div>
            ) : (
              <div className="season-honours__grid">
                {honours.individual.map((honour) => (
                  <article key={honour.id}>
                    <LegacyAvatar avatarId={honour.avatarId} size="small" decorative />
                    <div><small>{honour.title}</small><strong>{honour.displayName}</strong></div>
                    <span>{formatPoints(honour.points)}</span>
                  </article>
                ))}
              </div>
            )}
            {(honours.houseOfChampions || honours.houseChampions.length > 0) && (
              <div className="season-honours__houses">
                {honours.houseOfChampions && (
                  <article className="season-honours__winner">
                    <span aria-hidden="true">{getHouseEmblem(honours.houseOfChampions.houseEmblemId).symbol}</span>
                    <div><small>House of Champions</small><strong>{honours.houseOfChampions.houseName}</strong></div>
                    <b>{formatPoints(honours.houseOfChampions.totalPoints)}</b>
                  </article>
                )}
                {honours.houseChampions.map((champion) => (
                  <article key={champion.houseId}>
                    <LegacyAvatar avatarId={champion.avatarId} size="small" decorative />
                    <div><small>{champion.houseName} Champion</small><strong>{champion.displayName}</strong></div>
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
        ) : (
          <section className="empty-state card">Join this season to view its honours.</section>
        )}
      </WorkspacePanel>

      {canOperateEvidence && (
        <WorkspacePanel id="evidence" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
          <EvidenceWorkspace
            league={league}
            members={members}
            contributions={contributions}
            powerPlayAssignments={powerPlayAssignments}
            actorId={userId}
            isPlatformAdmin={isPlatformAdmin}
            isLeagueAdministrator={isManager}
            notify={notify}
          />
        </WorkspacePanel>
      )}
    </div>
  );
}

export default function Seasons() {
  const { user, profile, isPlatformAdmin } = usePlayerData();
  const { leagues, memberships, loading, error, canManageLeagues } =
    useLeagues();
  const { toast, showToast, dismissToast } = useToast();
  const [activePageTab, setActivePageTab] = useState("browse");
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
  const pageTabs = SEASONS_PAGE_TABS.filter((tab) =>
    tab.id !== "create" || canManageLeagues,
  );
  const resolvedPageTab = resolveWorkspaceTab(pageTabs, activePageTab)?.id ?? "browse";

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
      <WorkspaceTabs
        idPrefix="seasons"
        label="Season workspace"
        tabs={pageTabs}
        activeId={resolvedPageTab}
        onChange={setActivePageTab}
      />

      <WorkspacePanel id="browse" activeId={resolvedPageTab} idPrefix="seasons">
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
            key={`${selectedLeague.id}:${searchParams.get("tab") || ""}`}
            league={selectedLeague}
            membership={selectedMembership}
            canManage={canManageLeagues}
            isPlatformAdmin={isPlatformAdmin}
            userId={user?.uid}
            notify={showToast}
            requestedTab={searchParams.get("tab") || ""}
          />
        )}
      </WorkspacePanel>

      <WorkspacePanel id="join" activeId={resolvedPageTab} idPrefix="seasons">
        <div className="league-tools league-tools--single">
          <JoinLeagueForm userId={user?.uid} profile={profile} notify={showToast} />
        </div>
      </WorkspacePanel>

      {canManageLeagues && (
        <WorkspacePanel id="create" activeId={resolvedPageTab} idPrefix="seasons">
          <div className="league-tools league-tools--single">
            <LeagueCreationForm actorId={user?.uid} notify={showToast} />
          </div>
        </WorkspacePanel>
      )}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onDismiss={dismissToast}
      />
    </div>
  );
}
