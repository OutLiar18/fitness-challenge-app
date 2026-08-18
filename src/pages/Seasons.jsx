import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ConfirmDialog from "../components/common/ConfirmDialog";
import ThemeIcon from "../components/common/ThemeIcon";
import Toast from "../components/common/Toast/Toast";
import EvidenceWorkspace from "../components/seasons/EvidenceWorkspace";
import PowerPlayWorkspace from "../components/seasons/PowerPlayWorkspace";
import SeasonCommandCentre from "../components/seasons/SeasonCommandCentre";
import SeasonStandingsTable from "../components/seasons/SeasonStandingsTable";
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
  deleteDraftLeague,
  joinLeague,
  leaveLeagueRegistration,
  subscribeToLeagueContributions,
  subscribeToLeagueMemberships,
  transitionLeague,
} from "../services/leagues/leagueService";
import { copyTextToClipboard } from "../utils/clipboard";
import { subscribeToLeaderboardSnapshot } from "../services/evidence/evidenceService";
import { summarizeCurrentPowerPlay } from "../services/seasons/powerPlayModel";
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
    icon: <ThemeIcon name="compass" />,
  },
  {
    id: "operations",
    label: "Command centre",
    icon: <ThemeIcon name="command" />,
  },
  {
    id: "power-plays",
    label: "Power Plays",
    icon: <ThemeIcon name="power" />,
  },
  {
    id: "standings",
    label: "Standings",
    icon: <ThemeIcon name="standings" />,
  },
  {
    id: "honours",
    label: "Honours",
    icon: <ThemeIcon name="trophy" />,
  },
  {
    id: "evidence",
    label: "Evidence",
    icon: <ThemeIcon name="evidence" />,
  },
]);

const SEASONS_PAGE_TABS = Object.freeze([
  {
    id: "browse",
    label: "Browse seasons",
    icon: <ThemeIcon name="seasons" />,
  },
  {
    id: "join",
    label: "Join a season",
    icon: <ThemeIcon name="ticket" />,
  },
  {
    id: "create",
    label: "Create season",
    icon: <ThemeIcon name="add" />,
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
      <ol className="season-create-roadmap" aria-label="Season creation stages">
        <li><span>1</span><div><strong>Season foundations</strong><small>Name, theme, dates and House count</small></div></li>
        <li><span>2</span><div><strong>Competition format</strong><small>Pocket Week and season structure</small></div></li>
        <li><span>3</span><div><strong>Evidence policy</strong><small>Proof and leaderboard publication</small></div></li>
        <li><span>4</span><div><strong>Review and create</strong><small>Freeze the agreed draft settings</small></div></li>
      </ol>
      <div className="season-create-stage-heading">
        <span>1</span>
        <div><p className="section-kicker">Season foundations</p><h3>Build the competition shell</h3></div>
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
      <div className="season-create-stage-heading">
        <span>2</span>
        <div><p className="section-kicker">Competition format</p><h3>Set the pre-season structure</h3></div>
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
        <div className="season-create-stage-heading">
          <span>3</span>
          <div>
            <p className="section-kicker">Evidence policy</p>
            <h3 id="season-evidence-heading">Configure proof and leaderboard publication</h3>
          </div>
        </div>
        <div>
          <p className="section-kicker">WhatsApp proof workflow</p>
          <h4>Proof stays external; decisions stay auditable</h4>
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
          <li>Only Platform Administrators can accept, reject or reverse evidence decisions.</li>
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
      <div className="season-create-stage-heading">
        <span>4</span>
        <div><p className="section-kicker">Review and create</p><h3>Freeze the draft settings</h3></div>
      </div>
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


function LeagueDetail({
  league,
  membership,
  canManage,
  isPlatformAdmin,
  userId,
  notify,
  onDeleted,
  onBack,
  onTabChange,
  requestedTab = "",
}) {
  const [memberState, setMemberState] = useState({ leagueId: "", items: [] });
  const [contributionState, setContributionState] = useState({
    leagueId: "",
    items: [],
  });
  const [publishedSnapshot, setPublishedSnapshot] = useState(null);
  const [powerPlayAssignments, setPowerPlayAssignments] = useState([]);
  const [workingAction, setWorkingAction] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [standingsView, setStandingsView] = useState("player");
  const isManager =
    canManage && canManageLeague(league, userId, isPlatformAdmin);
  const isHouseSeason =
    league.mode === "season" && String(league.ruleset?.version ?? "").startsWith("season-houses-v");
  const evidenceEnabled = Boolean(league.ruleset?.evidencePolicy);
  const powerPlayEnabled = Boolean(league.ruleset?.modules?.powerPlay === true);
  const canViewLiveStandings = Boolean(
    isManager || (!evidenceEnabled && membership),
  );
  const canViewStandings = Boolean(membership || canViewLiveStandings);
  const canOperateEvidence = Boolean(evidenceEnabled && isManager);
  const canViewCommandCentre = Boolean(
    isHouseSeason && evidenceEnabled && isManager,
  );
  const detailTabs = SEASON_DETAIL_TABS.filter((tab) => {
    if (tab.id === "operations") return canViewCommandCentre;
    if (tab.id === "power-plays") return powerPlayEnabled;
    if (tab.id === "evidence") return canOperateEvidence;
    return true;
  });
    const resolvedDetailTab =
    resolveWorkspaceTab(detailTabs, requestedTab)?.id ?? "overview";
  const setActiveTab = (tabId) => onTabChange?.(tabId);

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
  const currentPowerPlay = useMemo(
    () =>
      summarizeCurrentPowerPlay({
        league,
        assignments: powerPlayAssignments,
      }),
    [league, powerPlayAssignments],
  );
  const currentPowerPlayLabel = !powerPlayEnabled
    ? "Classic scoring"
    : currentPowerPlay.powerPlay
      ? `${currentPowerPlay.powerPlay.multiplier}× ${currentPowerPlay.powerPlay.name}`
      : currentPowerPlay.status === "outside-season"
        ? ["completed", "archived"].includes(league.status)
          ? "Season complete"
          : "Begins with the season"
        : currentPowerPlay.status === "unselected"
          ? "Awaiting draw"
          : "Awaiting reveal";
  const currentPowerPlayDetail = currentPowerPlay.week
    ? `Week ${currentPowerPlay.week.weekIndex}`
    : powerPlayEnabled
      ? ["completed", "archived"].includes(league.status)
        ? "Season ended"
        : "Weekly multiplier"
      : "No weekly multipliers";
  const playerStanding =
    standings.players.find((row) => row.userId === userId) ?? null;
  const currentHouseName =
    membership?.currentHouseName ||
    membership?.houseName ||
    membership?.teamName ||
    (league.chaosStatus === "activated" ? "Unassigned" : "Awaiting C.H.A.O.S.");
  const summaryMetrics = isManager
    ? [
        { label: "Season phase", value: getLeagueStatusLabel(league.status) },
        {
          label: "Players",
          value: formatNumber(league.participantCount ?? members.length, { whole: true }),
        },
        { label: "Houses", value: String(league.houseCount || 0) },
        { label: "Current Power Play", value: currentPowerPlayLabel },
      ]
    : membership
      ? [
          { label: "Your House", value: currentHouseName },
          {
            label: "Individual rank",
            value: playerStanding ? `#${playerStanding.rank}` : "Awaiting publication",
          },
          {
            label: "Your points",
            value: playerStanding ? formatPoints(playerStanding.totalPoints) : "Awaiting publication",
          },
          { label: "Current Power Play", value: currentPowerPlayLabel },
        ]
      : [
          { label: "Season phase", value: getLeagueStatusLabel(league.status) },
          { label: "Membership", value: "Not joined" },
          { label: "Houses", value: String(league.houseCount || 0) },
          { label: "Current Power Play", value: currentPowerPlayLabel },
        ];
  const nextStatus = isHouseSeason
    ? {
        draft: "registration",
        registration: "active",
        active: "completed",
        completed: "archived",
      }[league.status]
    : null;

  async function handleTransition() {
    if (workingAction || !nextStatus) return;
    setWorkingAction("transition");
    try {
      await transitionLeague({ league, nextStatus, actorId: userId });
      notify(
        `Season changed to ${getLeagueStatusLabel(nextStatus)}.`,
        "success",
      );
      setPendingAction("");
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

    async function handleDeleteDraft() {
    if (workingAction || !isPlatformAdmin || league.status !== "draft") return;
    setWorkingAction("delete-draft");
    try {
      await deleteDraftLeague({ league, actorId: userId });
      notify("Unused draft season permanently deleted. Historical seasons remain protected.", "success");
      setPendingAction("");
      onDeleted?.();
    } catch (error) {
      console.error(error);
      notify(error.message || "The draft season could not be deleted.", "error");
    } finally {
      setWorkingAction("");
    }
  }

  async function handleWithdraw() {
    if (workingAction) return;
    setWorkingAction("withdraw");
    try {
      await leaveLeagueRegistration({ leagueId: league.id, userId });
      notify("Season registration withdrawn.", "success");
      setPendingAction("");
    } catch (error) {
      console.error(error);
      notify(error.message || "Registration could not be withdrawn.", "error");
    } finally {
      setWorkingAction("");
    }
  }

  return (
    <div className="league-detail">
      <button className="season-detail-back" type="button" onClick={onBack}>
        <ThemeIcon name="back" />
        Back to seasons
      </button>
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
              onClick={() => setPendingAction("transition")}
            >
              {workingAction === "transition"
                ? "Updating season…"
                : `Move to ${getLeagueStatusLabel(nextStatus)}`}
            </button>
          )}
          {isPlatformAdmin && league.status === "draft" && (
            <button
              className="button button--danger"
              type="button"
              disabled={Boolean(workingAction)}
              onClick={() => setPendingAction("delete-draft")}
            >
              {workingAction === "delete-draft"
                ? "Deleting draft…"
                : "Delete unused draft"}
            </button>
          )}
          {membership?.status === "registered" && (
            <button
              className="button button--danger"
              type="button"
              disabled={Boolean(workingAction)}
              onClick={() => setPendingAction("withdraw")}
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
        tabs={detailTabs}
        activeId={resolvedDetailTab}
        onChange={setActiveTab}
      />

      <WorkspacePanel id="overview" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
        <section className="season-at-glance card">
          <div className="community-section-heading">
            <div>
              <p className="section-kicker">{isManager ? "Season command" : membership ? "Your campaign" : "Season preview"}</p>
              <h2>Season at a glance</h2>
            </div>
          </div>
          <div className="season-at-glance__metrics">
            {summaryMetrics.map((metric) => (
              <article key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
          <div className="season-at-glance__actions">
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
            <span aria-hidden="true"><ThemeIcon name="houses" /></span>
            <strong>{league.houseCount || 0} Houses</strong>
            <small>
              {league.chaosStatus === "activated"
                ? "C.H.A.O.S. activated"
                : "Opening roster pending"}
            </small>
          </article>
          <article>
            <span aria-hidden="true"><ThemeIcon name="pocket" /></span>
            <strong>{league.pocketEnabled ? "Pocket enabled" : "No Pocket"}</strong>
            <small>
              {league.pocketEnabled
                ? `${formatDate(league.pocketStartDate)} – ${formatDate(league.pocketEndDate)}`
                : "Season setting"}
            </small>
          </article>
          <article>
            <span aria-hidden="true"><ThemeIcon name="power" /></span>
            <strong>{currentPowerPlayLabel}</strong>
            <small>{currentPowerPlayDetail}</small>
          </article>
          <article>
            <span aria-hidden="true"><ThemeIcon name="standings" /></span>
            <strong>{canViewStandings ? "Standings available" : "Standings locked"}</strong>
            <small>{canViewStandings ? "Individual and House" : "Join to unlock"}</small>
          </article>
        </section>

        <section className="league-rules card">
          <div>
            <p className="section-kicker">Season rules</p>
            <h2>How this season scores</h2>
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
            <div><dt>Standings</dt><dd>Individual and House</dd></div>
            <div>
              <dt>Participants</dt>
              <dd>
                {formatNumber(league.participantCount ?? members.length, { whole: true })}{" "}
                of {formatNumber(league.participantLimit ?? LEAGUE_PARTICIPANT_LIMIT, { whole: true })}
              </dd>
            </div>
            {isManager && (
              <>
                <div><dt>Scoring engine</dt><dd>{league.ruleset?.scoringEngineVersion}</dd></div>
                <div><dt>Rules version</dt><dd>{league.rulesVersion}</dd></div>
              </>
            )}
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
            <section className="season-standings-switch card" aria-label="Standings view">
              <button
                type="button"
                className={standingsView === "player" ? "is-active" : ""}
                aria-pressed={standingsView === "player"}
                onClick={() => setStandingsView("player")}
              >
                <ThemeIcon name="profile" />
                Individual
              </button>
              <button
                type="button"
                className={standingsView === "house" ? "is-active" : ""}
                aria-pressed={standingsView === "house"}
                onClick={() => setStandingsView("house")}
              >
                <ThemeIcon name="houses" />
                Houses
              </button>
            </section>
            <section className="league-standings card">
              <div className="community-section-heading">
                <div>
                  <p className="section-kicker">{standingsView === "player" ? "Personal contest" : "Collective impact"}</p>
                  <h2>{standingsView === "player" ? "Individual leaderboard" : "House leaderboard"}</h2>
                </div>
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
                  {standingsView === "player"
                    ? "No player-facing leaderboard has been published yet. Your entries and proof statuses remain visible while the public table stays frozen."
                    : "House standings will appear after the first daily publication."}
                </div>
              ) : (
                <SeasonStandingsTable
                  rows={standingsView === "player" ? standings.players : standings.houses}
                  kind={standingsView}
                  highlightPlayerId={userId}
                  highlightHouseName={currentHouseName}
                />
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
      </WorkspacePanel>      <WorkspacePanel id="honours" activeId={resolvedDetailTab} idPrefix={`season-${league.id}`}>
        {canViewStandings ? (
          <section className={`season-honours card${["completed", "archived"].includes(league.status) ? " season-honours--final" : ""}`}>
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
            <div className="season-honours__subheading">
              <ThemeIcon name="trophy" />
              <strong>Individual honours</strong>
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
              <>
                <div className="season-honours__subheading">
                  <ThemeIcon name="houses" />
                  <strong>House honours</strong>
                </div>
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
              </>
            )}
            <details className="season-honours__note">
              <summary>How individual honours are assigned</summary>
              <p>
                Individual titles follow the original prestige order. Once
                provisionally placed in one category, a player is not repeated in
                another individual title.
              </p>
            </details>
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
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction === "transition"
          ? `Move season to ${getLeagueStatusLabel(nextStatus)}?`
          : pendingAction === "delete-draft"
            ? `Permanently delete ${league.name}?`
            : "Withdraw this season registration?"}
        description={pendingAction === "transition"
          ? "Season lifecycle only moves forward. Confirm this audited stage transition when the current stage is complete."
          : pendingAction === "delete-draft"
            ? "This permanently deletes only the unused draft season and its draft Houses. Registration, active and historical seasons remain protected."
            : "Your registration will be withdrawn before the season starts. This does not delete the season or any other player."}
        confirmLabel={pendingAction === "transition"
          ? `Move to ${getLeagueStatusLabel(nextStatus)}`
          : pendingAction === "delete-draft"
            ? "Delete unused draft"
            : "Withdraw registration"}
        loading={Boolean(workingAction)}
        loadingLabel={pendingAction === "transition"
          ? "Updating season…"
          : pendingAction === "delete-draft"
            ? "Deleting draft…"
            : "Withdrawing…"}
        confirmationPhrase={pendingAction === "delete-draft" ? "DELETE" : ""}
        confirmationPrompt={pendingAction === "delete-draft" ? "Type DELETE to permanently remove this unused draft season." : ""}
        onConfirm={() => {
          if (pendingAction === "transition") handleTransition();
          else if (pendingAction === "delete-draft") handleDeleteDraft();
          else if (pendingAction === "withdraw") handleWithdraw();
        }}
        onCancel={() => !workingAction && setPendingAction("")}
      />
    </div>
  );
}

export default function Seasons() {
  const { user, profile, isPlatformAdmin } = usePlayerData();
  const { leagues, memberships, loading, error, canManageLeagues } =
    useLeagues();
  const { toast, showToast, dismissToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPageTab = searchParams.get("workspace") || "browse";
  const requestedId = searchParams.get("league") || "";
  const selectedId = leagues.some((league) => league.id === requestedId)
    ? requestedId
    : "";
  const selectedLeague =
    leagues.find((league) => league.id === selectedId) || null;
  const selectedMembership =
    memberships.find((membership) => membership.leagueId === selectedId) ||
    null;
  const pageTabs = SEASONS_PAGE_TABS.filter((tab) =>
    tab.id !== "create" || canManageLeagues,
  );
  const resolvedPageTab = resolveWorkspaceTab(pageTabs, requestedPageTab)?.id ?? "browse";
  const focusedLeague = resolvedPageTab === "browse" ? selectedLeague : null;
  const seasonGroups = [
    {
      id: "live",
      label: "Live now",
      items: leagues.filter((league) => league.status === "active"),
    },
    {
      id: "upcoming",
      label: "Upcoming",
      items: leagues.filter((league) => ["draft", "registration"].includes(league.status)),
    },
    {
      id: "history",
      label: "Completed seasons",
      items: leagues.filter((league) => ["completed", "archived"].includes(league.status)),
    },
  ].filter((group) => group.items.length > 0);

  function setActivePageTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "browse") next.delete("workspace");
    else next.set("workspace", tabId);
    setSearchParams(next, { replace: true });
  }

  function selectLeague(leagueId) {
    const next = new URLSearchParams(searchParams);
    next.set("league", leagueId);
    next.delete("workspace");
    next.delete("tab");
    setSearchParams(next, { replace: true });
  }

  function setDetailTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "overview") next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

  function clearSelectedLeague() {
    const next = new URLSearchParams(searchParams);
    next.delete("league");
    next.delete("tab");
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="league-page page-stack">
      <PageHeader
        eyebrow="Seasonal competition"
        title="Seasons"
        description="Enter the season. Climb the ranks, carry your House and make every week worthy of the legacy you leave behind."
        icon="🛡️"
      />
      {error && (
        <div className="inline-alert inline-alert--danger" role="alert">
          {error}
        </div>
      )}
      {!focusedLeague && (
        <WorkspaceTabs
          idPrefix="seasons"
          label="Season workspace"
          tabs={pageTabs}
          activeId={resolvedPageTab}
          onChange={setActivePageTab}
        />
      )}
      {focusedLeague ? (
        <LeagueDetail
          key={`${focusedLeague.id}:${searchParams.get("tab") || ""}`}
          league={focusedLeague}
          membership={selectedMembership}
          canManage={canManageLeagues}
          isPlatformAdmin={isPlatformAdmin}
          userId={user?.uid}
          notify={showToast}
          onDeleted={clearSelectedLeague}
          onBack={clearSelectedLeague}
          onTabChange={setDetailTab}
          requestedTab={searchParams.get("tab") || ""}
        />
      ) : (
        <WorkspacePanel id="browse" activeId={resolvedPageTab} idPrefix="seasons">
          <section className="league-browser card">
            <div className="community-section-heading">
              <div>
                <p className="section-kicker">Season roster</p>
                <h2>Choose your arena</h2>
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
              <div className="league-browser__groups">
                {seasonGroups.map((group) => (
                  <section className="league-browser__group" key={group.id}>
                    <div className="league-browser__group-heading">
                      <h3>{group.label}</h3>
                      <span>{group.items.length}</span>
                    </div>
                    <div className="league-browser__list">
                      {group.items.map((league) => {
                        const leagueMembership = memberships.find(
                          (item) => item.leagueId === league.id,
                        );
                        return (
                          <button
                            key={league.id}
                            type="button"
                            className={`league-browser__item${league.status === "active" ? " league-browser__item--live" : ""}`}
                            onClick={() => selectLeague(league.id)}
                          >
                            <span className="league-browser__theme">{league.theme || league.type}</span>
                            <strong>{league.name}</strong>
                            <span className="league-browser__dates">
                              {formatDate(league.startDate)} – {formatDate(league.endDate)}
                            </span>
                            <span className="league-browser__meta">
                              <small>{getLeagueStatusLabel(league.status)}</small>
                              {leagueMembership && (
                                <em>{getMembershipStatusLabel(leagueMembership.status)}</em>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </WorkspacePanel>
      )}      <WorkspacePanel id="join" activeId={resolvedPageTab} idPrefix="seasons">
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
