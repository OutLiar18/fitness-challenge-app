import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Toast from "../components/common/Toast/Toast";
import WorkspaceTabs, { WorkspacePanel } from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import LegacyAvatar from "../components/profile/LegacyAvatar";
import {
  HOUSE_ACCENTS,
  HOUSE_EMBLEMS,
  getHouseAccent,
  getHouseEmblem,
} from "../constants/seasons";
import useLeagues from "../hooks/useLeagues";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import {
  getChaosReadiness,
  getSeasonWeekKey,
  isHouseLeader,
} from "../services/seasons/seasonModel";
import {
  activateChaos,
  createLeagueHouse,
  finalizeLeadershipElection,
  openLeadershipElection,
  setAdditionalViceCaptain,
  submitLeadershipVote,
  subscribeToLeadershipElections,
  subscribeToLeagueHouses,
  swapHousePlayers,
  updateLeagueHouse,
} from "../services/seasons/seasonService";
import {
  subscribeToLeagueMemberships,
} from "../services/leagues/leagueService";
import { canManageLeague } from "../services/leagues/leagueModel";
import { resolveWorkspaceTab } from "../services/ui/workspaceModel";
import { pluralize } from "../utils/displayFormatters";
import "./Houses.css";

const EMPTY_HOUSE = Object.freeze({
  name: "",
  description: "",
  motto: "",
  emblemId: "springbok",
  accentId: "emerald",
});

function HouseIdentityForm({ initial = EMPTY_HOUSE, submitLabel, busy, onSubmit }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_HOUSE, ...initial }));

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(form);
    if (!initial.id) setForm(EMPTY_HOUSE);
  }

  return (
    <form className="house-form" onSubmit={handleSubmit}>
      <div className="house-form__grid">
        <div className="form-field">
          <label htmlFor={`house-name-${initial.id || "new"}`}>House name</label>
          <input
            id={`house-name-${initial.id || "new"}`}
            required
            minLength={3}
            maxLength={48}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </div>
        <div className="form-field">
          <label htmlFor={`house-motto-${initial.id || "new"}`}>House motto</label>
          <input
            id={`house-motto-${initial.id || "new"}`}
            required
            minLength={3}
            maxLength={90}
            value={form.motto}
            onChange={(event) => setForm((current) => ({ ...current, motto: event.target.value }))}
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={`house-description-${initial.id || "new"}`}>House identity</label>
        <textarea
          id={`house-description-${initial.id || "new"}`}
          required
          minLength={10}
          maxLength={220}
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
      </div>
      <div className="house-style-grid">
        <fieldset className="house-emblems">
          <legend>Emblem</legend>
          <div>
            {HOUSE_EMBLEMS.map((item) => (
              <label key={item.id} className={form.emblemId === item.id ? "house-emblem house-emblem--selected" : "house-emblem"}>
                <input className="sr-only" type="radio" name={`house-emblem-${initial.id || "new"}`} checked={form.emblemId === item.id} onChange={() => setForm((current) => ({ ...current, emblemId: item.id }))} />
                <span aria-hidden="true">{item.symbol}</span>
                <small>{item.name}</small>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="house-accents">
          <legend>House colour</legend>
          <div>
            {HOUSE_ACCENTS.map((item) => (
              <label key={item.id} className={form.accentId === item.id ? "house-accent house-accent--selected" : "house-accent"}>
                <input className="sr-only" type="radio" name={`house-accent-${initial.id || "new"}`} checked={form.accentId === item.id} onChange={() => setForm((current) => ({ ...current, accentId: item.id }))} />
                <span style={{ "--swatch": item.value }} aria-hidden="true" />
                <small>{item.label}</small>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <button className="button button--primary" type="submit" disabled={busy}>
        {busy ? "Saving House…" : submitLabel}
      </button>
    </form>
  );
}

function HouseCard({ house, members, selected, onSelect }) {
  const emblem = getHouseEmblem(house.emblemId);
  const accent = getHouseAccent(house.accentId);
  const captain = members.find((member) => member.userId === house.captainId);
  const viceCaptains = (house.viceCaptainIds ?? [])
    .map((id) => members.find((member) => member.userId === id))
    .filter(Boolean);

  return (
    <button
      type="button"
      className={selected ? "season-house-card season-house-card--selected" : "season-house-card"}
      style={{ "--house-accent": accent.value }}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="season-house-card__emblem" aria-hidden="true">{emblem.symbol}</span>
      <span className="season-house-card__copy">
        <strong>{house.name}</strong>
        <em>“{house.motto}”</em>
        <small>{members.length} {pluralize(members.length, "member", "members")}</small>
      </span>
      <span className="season-house-card__leadership">
        {captain ? `Captain: ${captain.displayName}` : "Captain pending"}
        {viceCaptains.length > 0 && ` · ${viceCaptains.length} vice ${pluralize(viceCaptains.length, "captain", "captains")}`}
      </span>
    </button>
  );
}

function HouseRoster({ house, members }) {
  const leadership = new Set([house.captainId, ...(house.viceCaptainIds ?? [])]);
  const sorted = [...members].sort((first, second) => {
    const firstRank = first.userId === house.captainId ? 0 : leadership.has(first.userId) ? 1 : 2;
    const secondRank = second.userId === house.captainId ? 0 : leadership.has(second.userId) ? 1 : 2;
    return firstRank - secondRank || first.displayName.localeCompare(second.displayName);
  });

  return (
    <section className="house-roster card">
      <div className="community-section-heading">
        <div><p className="section-kicker">Current roster</p><h2>{house.name}</h2></div>
        <span>{members.length} {pluralize(members.length, "player", "players")}</span>
      </div>
      <div className="house-roster__list">
        {sorted.map((member) => {
          const label = member.userId === house.captainId
            ? "House captain"
            : house.viceCaptainIds?.includes(member.userId)
              ? "Vice-captain"
              : "House member";
          return (
            <article className="house-member" key={member.userId}>
              <LegacyAvatar avatarId={member.avatarId} size="small" decorative />
              <div><strong>{member.displayName}</strong><span>{label}</span></div>
              {leadership.has(member.userId) && <span className="house-member__crest" aria-label={label}>{member.userId === house.captainId ? "👑" : "⭐"}</span>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LeadershipPanel({ league, house, members, membership, elections, manager, actorId, notify }) {
  const weekKey = getSeasonWeekKey(new Date());
  const election = elections.find((item) => item.houseId === house.id && item.weekKey === weekKey);
  const [candidateId, setCandidateId] = useState("");
  const [captainId, setCaptainId] = useState("");
  const [viceCaptainId, setViceCaptainId] = useState("");
  const [additionalViceId, setAdditionalViceId] = useState("");
  const [busy, setBusy] = useState(false);
  const closesAt = election?.closesAt?.toDate?.() ?? (election?.closesAt ? new Date(election.closesAt) : null);
  const closed = Boolean(election && closesAt && closesAt <= new Date());
  const isMember = membership?.currentHouseId === house.id;
  const isCaptain = house.captainId === actorId;
  const seasonActive = league.status === "active";
  const canOpenElection = seasonActive && (manager || isHouseLeader(house, actorId));

  async function act(task, success) {
    setBusy(true);
    try {
      await task();
      notify(success, "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "The leadership action could not be completed.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="leadership-panel card">
      <div className="community-section-heading">
        <div><p className="section-kicker">Weekly leadership</p><h2>Captain and vice-captain vote</h2></div>
        <span>{weekKey}</span>
      </div>
      <p>Every House receives one 24-hour leadership vote per week. Most votes appoint the captain; second-most appoints the primary vice-captain. A current leader or administrator may open the ballot. Ties and empty ballots require administrator judgement.</p>

      {!seasonActive && (
        <div className="inline-alert inline-alert--info">
          Weekly House voting begins when the season becomes active.
        </div>
      )}

      {!election && canOpenElection && (
        <button className="button button--primary" type="button" disabled={busy} onClick={() => act(() => openLeadershipElection({
        league,
        house,
        members,
        actorId,
      }), "The 24-hour House vote is open.")}>Open this week’s vote</button>
      )}

      {election && (
        <div className="leadership-panel__status">
          <strong>{election.status === "finalized" ? "Leadership confirmed" : closed ? "Voting closed" : "Voting open"}</strong>
          <span>{election.status === "finalized" ? `${election.voteCount ?? 0} votes counted` : closesAt ? `Closes ${closesAt.toLocaleString()}` : "Closing time unavailable"}</span>
        </div>
      )}

      {election?.status === "open" && !closed && isMember && (
        <div className="leadership-vote">
          <label htmlFor="leadership-candidate">Choose one House member</label>
          <select id="leadership-candidate" value={candidateId} onChange={(event) => setCandidateId(event.target.value)}>
            <option value="">Select a candidate</option>
            {members.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}
          </select>
          <button className="button button--secondary" type="button" disabled={busy || !candidateId} onClick={() => act(() => submitLeadershipVote({ election, voterId: actorId, candidateId, membership }), "Your weekly House vote has been recorded.")}>Submit my vote</button>
        </div>
      )}

      {election && election.status !== "finalized" && closed && manager && (
        <div className="leadership-resolution">
          <p className="section-kicker">Administrator resolution</p>
          <p>Use the automatic result when clear, or select leaders when no votes or a tie prevents a result.</p>
          <div className="house-form__grid">
            <label>Captain<select value={captainId} onChange={(event) => setCaptainId(event.target.value)}><option value="">Use vote result</option>{members.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}</select></label>
            <label>Primary vice-captain<select value={viceCaptainId} onChange={(event) => setViceCaptainId(event.target.value)}><option value="">Use vote result</option>{members.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}</select></label>
          </div>
          <button className="button button--primary" type="button" disabled={busy} onClick={() => act(() => finalizeLeadershipElection({ election, house, members, actorId, captainId, viceCaptainId }), "House leadership has been confirmed.")}>Finalise leadership</button>
        </div>
      )}

      {isCaptain && members.length > 2 && (
        <div className="leadership-appointment">
          <p className="section-kicker">Captain’s appointment</p>
          <p>The elected vice-captain remains primary. You may appoint one additional vice-captain for the week.</p>
          <select value={additionalViceId} onChange={(event) => setAdditionalViceId(event.target.value)}>
            <option value="">Choose an additional vice-captain</option>
            {members.filter((member) => member.userId !== house.captainId && member.userId !== house.viceCaptainIds?.[0]).map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}
          </select>
          <button className="button button--secondary" type="button" disabled={busy || !additionalViceId} onClick={() => act(() => setAdditionalViceCaptain({ house, actorId, userId: additionalViceId }), "Additional vice-captain appointed.")}>Appoint vice-captain</button>
        </div>
      )}
    </section>
  );
}

function RosterSwapPanel({ league, houses, members, actorId, manager, currentHouse, notify }) {
  const leader = currentHouse && isHouseLeader(currentHouse, actorId);
  const availableSourceHouses = useMemo(
    () => (manager ? houses : leader ? [currentHouse] : []),
    [currentHouse, houses, leader, manager],
  );
  const [sourceHouseId, setSourceHouseId] = useState("");
  const [targetHouseId, setTargetHouseId] = useState("");
  const [firstPlayerId, setFirstPlayerId] = useState("");
  const [secondPlayerId, setSecondPlayerId] = useState("");
  const [busy, setBusy] = useState(false);
  const sourceHouse =
    availableSourceHouses.find((item) => item.id === sourceHouseId) ||
    availableSourceHouses[0] ||
    null;
  const effectiveSourceHouseId = sourceHouse?.id || "";
  const targetHouse = houses.find((item) => item.id === targetHouseId) || null;
  const protectedLeaderIds = useMemo(
    () => new Set(
      houses.flatMap((house) => [house.captainId, ...(house.viceCaptainIds ?? [])]),
    ),
    [houses],
  );
  const sourceMembers = members.filter(
    (item) => item.currentHouseId === effectiveSourceHouseId && !protectedLeaderIds.has(item.userId),
  );
  const targetMembers = members.filter(
    (item) => item.currentHouseId === targetHouseId && !protectedLeaderIds.has(item.userId),
  );


  if (availableSourceHouses.length === 0 || league.status !== "active") return null;

  async function handleSwap() {
    const firstPlayer = sourceMembers.find((item) => item.userId === firstPlayerId);
    const secondPlayer = targetMembers.find((item) => item.userId === secondPlayerId);
    if (!window.confirm("Complete this week’s House roster swap? Earlier contributions will remain with each player’s previous House.")) return;
    setBusy(true);
    try {
      await swapHousePlayers({ league, firstHouse: sourceHouse, secondHouse: targetHouse, firstPlayer, secondPlayer, actorId });
      notify("The weekly House roster swap is complete.", "success");
      setFirstPlayerId("");
      setSecondPlayerId("");
    } catch (error) {
      console.error(error);
      notify(error.message || "The House roster could not be changed.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="roster-swap card">
      <div><p className="section-kicker">Weekly roster turn</p><h2>One strategic House swap</h2><p>Each House may take part in one balanced player swap per week. Captains, vice-captains and league administrators can act; current leaders must be reassigned before they move.</p></div>
      <div className="roster-swap__grid">
        <label>Source House<select value={effectiveSourceHouseId} onChange={(event) => { setSourceHouseId(event.target.value); setFirstPlayerId(""); }}><option value="">Choose House</option>{availableSourceHouses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}</select></label>
        <label>Player leaving<select value={firstPlayerId} onChange={(event) => setFirstPlayerId(event.target.value)}><option value="">Choose player</option>{sourceMembers.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}</select></label>
        <label>Other House<select value={targetHouseId} onChange={(event) => { setTargetHouseId(event.target.value); setSecondPlayerId(""); }}><option value="">Choose House</option>{houses.filter((house) => house.id !== effectiveSourceHouseId).map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}</select></label>
        <label>Player joining<select value={secondPlayerId} onChange={(event) => setSecondPlayerId(event.target.value)}><option value="">Choose player</option>{targetMembers.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}</select></label>
      </div>
      <button className="button button--danger" type="button" disabled={busy || !sourceHouse || !targetHouse || !sourceMembers.some((item) => item.userId === firstPlayerId) || !targetMembers.some((item) => item.userId === secondPlayerId)} onClick={handleSwap}>{busy ? "Changing Houses…" : "Complete roster swap"}</button>
    </section>
  );
}

export default function Houses() {
  const { user, isPlatformAdmin } = usePlayerData();
  const { leagues, memberships: myMemberships, canManageLeagues } = useLeagues();
  const { toast, showToast, dismissToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const seasonLeagues = leagues.filter((league) => league.mode === "season");
  const requestedId = searchParams.get("league") || "";
  const fallbackId = myMemberships.find((item) => item.currentHouseId)?.leagueId
    || seasonLeagues[0]?.id
    || "";
  const selectedId = seasonLeagues.some((item) => item.id === requestedId)
    ? requestedId
    : fallbackId;
  const league = seasonLeagues.find((item) => item.id === selectedId) || null;
  const [housesState, setHousesState] = useState({ leagueId: "", items: [] });
  const [membersState, setMembersState] = useState({ leagueId: "", items: [] });
  const [electionsState, setElectionsState] = useState({ leagueId: "", items: [] });
  const [selectedHouseId, setSelectedHouseId] = useState("");
  const [working, setWorking] = useState(false);
  const [editingHouseId, setEditingHouseId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const leagueId = league?.id;
    if (!leagueId) return undefined;

    const unsubHouses = subscribeToLeagueHouses(
      leagueId,
      (items) => setHousesState({ leagueId, items }),
      (error) => showToast(error.message || "Houses could not be loaded.", "error"),
    );
    const unsubMembers = subscribeToLeagueMemberships(
      leagueId,
      (items) => setMembersState({ leagueId, items }),
      (error) => showToast(error.message || "Season members could not be loaded.", "error"),
    );
    const unsubElections = subscribeToLeadershipElections(
      leagueId,
      (items) => setElectionsState({ leagueId, items }),
      (error) => showToast(error.message || "Leadership votes could not be loaded.", "error"),
    );

    return () => {
      unsubHouses();
      unsubMembers();
      unsubElections();
    };
  }, [league?.id, showToast]);

  const houses = housesState.leagueId === league?.id ? housesState.items : [];
  const members = membersState.leagueId === league?.id ? membersState.items : [];
  const elections = electionsState.leagueId === league?.id ? electionsState.items : [];
  const membership = myMemberships.find((item) => item.leagueId === league?.id) || null;
  const currentHouse = houses.find((item) => item.id === membership?.currentHouseId) || null;
  const selectedHouse = houses.find((item) => item.id === selectedHouseId)
    || currentHouse
    || houses[0]
    || null;
  const selectedMembers = members.filter((item) => item.currentHouseId === selectedHouse?.id);
  const editingHouse = houses.find((item) => item.id === editingHouseId) || null;
  const manager = Boolean(
    league
    && canManageLeagues
    && canManageLeague(league, user?.uid, isPlatformAdmin),
  );
  const chaosReadiness = getChaosReadiness({ league, houses, memberships: members });
  const completedChaosChecks = chaosReadiness.checks.filter((check) => check.complete).length;
  const chaosSummary = chaosReadiness.eligible
    ? "Every prerequisite is complete. The one-time balanced assignment is ready to run."
    : `${completedChaosChecks} of ${chaosReadiness.checks.length} prerequisites are complete.`;
  const preSeasonManagement = manager && ["draft", "registration"].includes(league?.status);
  const canUseRosterTurn = Boolean(
    league?.status === "active"
    && (manager || (currentHouse && isHouseLeader(currentHouse, user?.uid))),
  );
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "🏰",
      description: "House identities and season context",
      badge: houses.length,
    },
    ...(selectedHouse
      ? [
          {
            id: "roster",
            label: "Roster",
            icon: "🛡️",
            description: `Players representing ${selectedHouse.name}`,
            badge: selectedMembers.length,
          },
          {
            id: "leadership",
            label: "Leadership",
            icon: "👑",
            description: "Weekly captain and vice-captain voting",
          },
        ]
      : []),
    ...(canUseRosterTurn
      ? [{
          id: "roster-turn",
          label: "Roster turn",
          icon: "🔄",
          description: "Complete the weekly balanced swap",
        }]
      : []),
    ...(preSeasonManagement
      ? [{
          id: "manage",
          label: "Manage",
          icon: "⚙️",
          description: "Build Houses and prepare C.H.A.O.S.",
          badge: chaosReadiness.eligible ? "Ready" : completedChaosChecks,
        }]
      : []),
  ];
  const resolvedActiveTab = resolveWorkspaceTab(tabs, activeTab)?.id ?? "overview";



  async function handleCreateHouse(input) {
    setWorking(true);
    try {
      await createLeagueHouse({ leagueId: league.id, actorId: user.uid, input });
      showToast("House created. Its banner is ready for the season.", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "The House could not be created.", "error");
    } finally {
      setWorking(false);
    }
  }

  async function handleUpdateHouse(input) {
    const house = houses.find((item) => item.id === editingHouseId);
    setWorking(true);
    try {
      await updateLeagueHouse({ house, actorId: user.uid, input });
      showToast("House identity updated.", "success");
      setEditingHouseId("");
    } catch (error) {
      console.error(error);
      showToast(error.message || "The House could not be updated.", "error");
    } finally {
      setWorking(false);
    }
  }

  async function handleChaos() {
    const confirmed = window.confirm(
      "Activate C.H.A.O.S.? Every registered player will be assigned fairly and notified. This cannot be repeated for the season.",
    );
    if (!confirmed) return;

    setWorking(true);
    try {
      await activateChaos({ league, houses, memberships: members, actorId: user.uid });
      showToast(
        "C.H.A.O.S. activated. The Houses have claimed their players.",
        "success",
        6000,
      );
    } catch (error) {
      console.error(error);
      showToast(error.message || "C.H.A.O.S. could not be activated.", "error");
    } finally {
      setWorking(false);
    }
  }

  function selectSeason(nextLeagueId) {
    setSearchParams({ league: nextLeagueId }, { replace: true });
    setSelectedHouseId("");
    setEditingHouseId("");
    setActiveTab("overview");
  }

  function editHouse(houseId) {
    setEditingHouseId(houseId);
    setActiveTab("manage");
  }

  return (
    <div className="season-houses-page page-stack">
      <PageHeader
        eyebrow="Season Houses"
        title="Houses"
        description="Every House belongs to one season. Individual points remain personal, while every new contribution also strengthens the House you represent at that moment."
        icon="🏰"
        actions={(
          <Link
            className="button button--secondary"
            to={league ? `/pocket?league=${league.id}` : "/pocket"}
          >
            Open Pocket Week
          </Link>
        )}
      />

      <section className="season-selector card">
        <label htmlFor="house-season">Season</label>
        <select
          id="house-season"
          value={selectedId}
          onChange={(event) => selectSeason(event.target.value)}
        >
          <option value="">Choose a House season</option>
          {seasonLeagues.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {item.theme}
            </option>
          ))}
        </select>
      </section>

      {!league ? (
        <section className="empty-state card">
          No House season is available yet. A League or Platform Administrator must create one first.
        </section>
      ) : (
        <>
          <section className="season-banner card">
            <div>
              <p className="section-kicker">{league.theme}</p>
              <h2>{league.name}</h2>
              <p>{league.description}</p>
            </div>
            <div className="season-banner__status">
              <strong>{houses.length} of {league.houseCount} Houses</strong>
              <span>
                {league.chaosStatus === "activated"
                  ? "C.H.A.O.S. activated"
                  : "Awaiting C.H.A.O.S."}
              </span>
            </div>
          </section>

          <WorkspaceTabs
            tabs={tabs}
            activeId={resolvedActiveTab}
            onChange={setActiveTab}
            label="House workspace"
            idPrefix={`houses-${league.id}`}
          />

          <WorkspacePanel
            id="overview"
            activeId={resolvedActiveTab}
            idPrefix={`houses-${league.id}`}
          >
            {preSeasonManagement && (
              <section className="house-management-callout card">
                <div className="house-management-callout__icon" aria-hidden="true">
                  {chaosReadiness.eligible ? "✓" : "⚙️"}
                </div>
                <div>
                  <p className="section-kicker">Season setup</p>
                  <h2>
                    {chaosReadiness.eligible
                      ? "C.H.A.O.S. is ready"
                      : "House setup is still in progress"}
                  </h2>
                  <p>
                    {chaosSummary}
                  </p>
                </div>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => setActiveTab("manage")}
                >
                  Open management
                </button>
              </section>
            )}

            {houses.length > 0 ? (
              <section className="house-grid" aria-label="Season Houses">
                {houses.map((house) => {
                  const houseMembers = members.filter(
                    (item) => item.currentHouseId === house.id,
                  );
                  return (
                    <HouseCard
                      key={house.id}
                      house={house}
                      members={houseMembers}
                      selected={selectedHouse?.id === house.id}
                      onSelect={() => setSelectedHouseId(house.id)}
                    />
                  );
                })}
              </section>
            ) : (
              <section className="house-empty card">
                <span aria-hidden="true">🏗️</span>
                <div>
                  <p className="section-kicker">No Houses yet</p>
                  <h2>The season identities still need to be forged</h2>
                  <p>
                    Houses appear here once an authorised administrator creates them for this season.
                  </p>
                </div>
                {preSeasonManagement && (
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => setActiveTab("manage")}
                  >
                    Create the first House
                  </button>
                )}
              </section>
            )}

            {selectedHouse && (
              <section
                className="house-identity card"
                style={{ "--house-accent": getHouseAccent(selectedHouse.accentId).value }}
              >
                <span aria-hidden="true">
                  {getHouseEmblem(selectedHouse.emblemId).symbol}
                </span>
                <div>
                  <p className="section-kicker">Selected House</p>
                  <h2>{selectedHouse.name}</h2>
                  <blockquote>“{selectedHouse.motto}”</blockquote>
                  <p>{selectedHouse.description}</p>
                </div>
                <div className="house-overview-actions">
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => setActiveTab("roster")}
                  >
                    View roster
                  </button>
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => setActiveTab("leadership")}
                  >
                    Leadership
                  </button>
                  {preSeasonManagement && (
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => editHouse(selectedHouse.id)}
                    >
                      Edit identity
                    </button>
                  )}
                </div>
              </section>
            )}

            <section className="season-integrity card">
              <span aria-hidden="true">🧭</span>
              <div>
                <p className="section-kicker">Historical integrity</p>
                <h2>Your old House keeps what you earned there</h2>
                <p>
                  A roster move changes only future House contributions. Individual points remain yours,
                  and completed contribution snapshots are never rewritten to make the past look different.
                </p>
              </div>
            </section>
          </WorkspacePanel>

          {selectedHouse && (
            <WorkspacePanel
              id="roster"
              activeId={resolvedActiveTab}
              idPrefix={`houses-${league.id}`}
            >
              <HouseRoster house={selectedHouse} members={selectedMembers} />
            </WorkspacePanel>
          )}

          {selectedHouse && (
            <WorkspacePanel
              id="leadership"
              activeId={resolvedActiveTab}
              idPrefix={`houses-${league.id}`}
            >
              <LeadershipPanel
                key={`${league.id}:${selectedHouse.id}`}
                league={league}
                house={selectedHouse}
                members={selectedMembers}
                membership={membership}
                elections={elections}
                manager={manager}
                actorId={user?.uid}
                notify={showToast}
              />
            </WorkspacePanel>
          )}

          {canUseRosterTurn && (
            <WorkspacePanel
              id="roster-turn"
              activeId={resolvedActiveTab}
              idPrefix={`houses-${league.id}`}
            >
              <RosterSwapPanel
                key={league.id}
                league={league}
                houses={houses}
                members={members}
                actorId={user?.uid}
                manager={manager}
                currentHouse={currentHouse}
                notify={showToast}
              />
            </WorkspacePanel>
          )}

          {preSeasonManagement && (
            <WorkspacePanel
              id="manage"
              activeId={resolvedActiveTab}
              idPrefix={`houses-${league.id}`}
            >
              <section className="house-management-summary card">
                <div>
                  <p className="section-kicker">Management workspace</p>
                  <h2>Prepare the Houses without crowding the player view</h2>
                  <p>
                    Build and refine the season identities, then complete every prerequisite before
                    activating C.H.A.O.S.
                  </p>
                </div>
                <div className="house-management-metrics" aria-label="House setup progress">
                  <span><strong>{houses.length}/{league.houseCount}</strong> Houses</span>
                  <span><strong>{members.length}</strong> registered players</span>
                  <span><strong>{completedChaosChecks}/{chaosReadiness.checks.length}</strong> checks complete</span>
                </div>
              </section>

              {league.status === "draft" && houses.length < Number(league.houseCount) && (
                <section className="house-builder card">
                  <div>
                    <p className="section-kicker">House forge</p>
                    <h2>Create the season identities</h2>
                    <p>
                      Build exactly {league.houseCount} Houses before registration closes. Names,
                      symbols and colours may follow the season theme—or intentionally rebel against it.
                    </p>
                  </div>
                  <HouseIdentityForm
                    submitLabel="Create House"
                    busy={working}
                    onSubmit={handleCreateHouse}
                  />
                </section>
              )}

              {manager && editingHouse && (
                <section className="house-builder card">
                  <div>
                    <p className="section-kicker">House refinement</p>
                    <h2>Edit the banner</h2>
                  </div>
                  <HouseIdentityForm
                    key={editingHouse.id}
                    initial={editingHouse}
                    submitLabel="Save House"
                    busy={working}
                    onSubmit={handleUpdateHouse}
                  />
                </section>
              )}

              <section className="chaos-console card" aria-labelledby="chaos-console-title">
                <div className="chaos-console__sigil" aria-hidden="true">C.H.A.O.S.</div>
                <div className="chaos-console__content">
                  <p className="section-kicker">
                    Citizens Handpicked for Assignment via Operational Sorting
                  </p>
                  <h2 id="chaos-console-title">C.H.A.O.S. readiness</h2>
                  <p>
                    The opening assignment is seeded, balanced and permanent in season history.
                    Every registered player receives a private House notification.
                  </p>
                  <ul className="chaos-checklist" aria-label="C.H.A.O.S. prerequisites">
                    {chaosReadiness.checks.map((check) => (
                      <li
                        key={check.id}
                        className={check.complete
                          ? "chaos-checklist__item chaos-checklist__item--complete"
                          : "chaos-checklist__item"}
                      >
                        <span aria-hidden="true">{check.complete ? "✓" : "○"}</span>
                        <div>
                          <strong>{check.label}</strong>
                          <small>{check.detail}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {!chaosReadiness.registrationOpen && (
                    <Link
                      className="button button--secondary"
                      to={`/seasons?league=${league.id}`}
                    >
                      Open season controls
                    </Link>
                  )}
                </div>
                <div className="chaos-console__action">
                  <button
                    className="button button--danger"
                    type="button"
                    disabled={working || !chaosReadiness.eligible}
                    onClick={handleChaos}
                  >
                    {working ? "Destiny is calculating…" : "Activate C.H.A.O.S."}
                  </button>
                  {!chaosReadiness.eligible && (
                    <small>Complete every prerequisite to unlock assignment.</small>
                  )}
                </div>
              </section>
            </WorkspacePanel>
          )}
        </>
      )}

      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
