import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ConfirmDialog from "../components/common/ConfirmDialog";
import ThemeIcon from "../components/common/ThemeIcon";
import Toast from "../components/common/Toast/Toast";
import WorkspaceTabs, { WorkspacePanel } from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import CompetitionWorkspaceSummary from "../components/seasons/CompetitionWorkspaceSummary";
import {
  HouseCard,
  HouseRoster,
} from "../components/seasons/HouseRosterWorkspace";
import {
  HOUSE_ACCENTS,
  HOUSE_COMPOSITION_OPTIONS,
  HOUSE_EMBLEMS,
  getHouseEmblem,
  getHouseThemeStyle,
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
  getBalanceStatusCopy,
  supportsHouseMovementV1,
} from "../services/seasons/houseMovementModel";
import {
  calculateWeeklyHouseBalance,
  clearCompositionProfile,
  saveCompositionProfile,
  subscribeToCompositionProfile,
  subscribeToHouseAssignmentHistory,
  subscribeToHouseBalanceHouseWeeks,
  subscribeToHouseBalanceWeeks,
  subscribeToLeagueCompositionProfiles,
  subscribeToPrivateHouseBalanceHouseWeeks,
  subscribeToPrivateHouseBalanceWeeks,
} from "../services/seasons/houseMovementService";
import {
  activateChaos,
  createLeagueHouse,
  deleteDraftLeagueHouse,
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
          <legend>Emblem library <span>{HOUSE_EMBLEMS.length} choices</span></legend>
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
          <legend>House colour theme <span>{HOUSE_ACCENTS.length} palettes</span></legend>
          <div>
            {HOUSE_ACCENTS.map((item) => (
              <label key={item.id} className={form.accentId === item.id ? "house-accent house-accent--selected" : "house-accent"}>
                <input className="sr-only" type="radio" name={`house-accent-${initial.id || "new"}`} checked={form.accentId === item.id} onChange={() => setForm((current) => ({ ...current, accentId: item.id }))} />
                <span
                  style={{
                    "--swatch": item.value,
                    "--swatch-secondary": item.secondary,
                  }}
                  aria-hidden="true"
                />
                <small>{item.label}</small>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div
        className="house-theme-preview"
        style={getHouseThemeStyle(form)}
        aria-label="House identity preview"
      >
        <span className="house-theme-preview__emblem" aria-hidden="true">
          {getHouseEmblem(form.emblemId).symbol}
        </span>
        <div>
          <small>{HOUSE_ACCENTS.find((item) => item.id === form.accentId)?.label || "House"} theme</small>
          <strong>{form.name || "House preview"}</strong>
          <em>“{form.motto || "Your motto will appear here."}”</em>
        </div>
      </div>
      <button className="button button--primary" type="submit" disabled={busy}>
        {busy ? "Saving House…" : submitLabel}
      </button>
    </form>
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

function RosterSwapPanel({ league, houses, members, actorId, manager, platformAdmin, currentHouse, notify }) {
  const leader = currentHouse && isHouseLeader(currentHouse, actorId);
  const availableSourceHouses = useMemo(
    () => (manager ? houses : leader ? [currentHouse] : []),
    [currentHouse, houses, leader, manager],
  );
  const [sourceHouseId, setSourceHouseId] = useState("");
  const [targetHouseId, setTargetHouseId] = useState("");
  const [firstPlayerId, setFirstPlayerId] = useState("");
  const [secondPlayerId, setSecondPlayerId] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
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
  const weekKey = getSeasonWeekKey(new Date());
  const selectedFirst = sourceMembers.find((item) => item.userId === firstPlayerId) || null;
  const selectedSecond = targetMembers.find((item) => item.userId === secondPlayerId) || null;
  const movedThisWeek = (member) => Boolean(member?.lastRosterWeekKey === weekKey);
  const resting = (member) => Boolean(
    supportsHouseMovementV1(league)
      && member?.rosterLockThroughWeekKey
      && weekKey <= member.rosterLockThroughWeekKey,
  );
  const overrideCandidates = [selectedFirst, selectedSecond].filter(
    (member) => resting(member) && !movedThisWeek(member),
  );
  const overrideRequired = overrideCandidates.length > 0;
  const invalidSameWeek = [selectedFirst, selectedSecond].some(movedThisWeek);
  const optionLabel = (member) => {
    if (movedThisWeek(member)) return `${member.displayName} — already moved this week`;
    if (resting(member)) {
      const suffix = member.rosterEligibleWeekKey ? ` until ${member.rosterEligibleWeekKey}` : "";
      return `${member.displayName} — resting${suffix}`;
    }
    return member.displayName;
  };

  if (availableSourceHouses.length === 0 || league.status !== "active") return null;

  async function handleSwap() {
    const firstPlayer = sourceMembers.find((item) => item.userId === firstPlayerId);
    const secondPlayer = targetMembers.find((item) => item.userId === secondPlayerId);
    setBusy(true);
    try {
      await swapHousePlayers({
        league,
        firstHouse: sourceHouse,
        secondHouse: targetHouse,
        firstPlayer,
        secondPlayer,
        actorId,
        allowRestOverride: platformAdmin && overrideRequired,
        overrideReason,
      });
      notify(overrideRequired ? "The audited House movement correction is complete." : "The weekly House roster swap is complete.", "success");
      setFirstPlayerId("");
      setSecondPlayerId("");
      setOverrideReason("");
      setConfirming(false);
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
        <label>Player leaving<select value={firstPlayerId} onChange={(event) => setFirstPlayerId(event.target.value)}><option value="">Choose player</option>{sourceMembers.map((member) => <option key={member.userId} value={member.userId} disabled={movedThisWeek(member) || (resting(member) && !platformAdmin)}>{optionLabel(member)}</option>)}</select></label>
        <label>Other House<select value={targetHouseId} onChange={(event) => { setTargetHouseId(event.target.value); setSecondPlayerId(""); }}><option value="">Choose House</option>{houses.filter((house) => house.id !== effectiveSourceHouseId).map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}</select></label>
        <label>Player joining<select value={secondPlayerId} onChange={(event) => setSecondPlayerId(event.target.value)}><option value="">Choose player</option>{targetMembers.map((member) => <option key={member.userId} value={member.userId} disabled={movedThisWeek(member) || (resting(member) && !platformAdmin)}>{optionLabel(member)}</option>)}</select></label>
      </div>
      {platformAdmin && overrideRequired && (
        <div className="roster-override">
          <div>
            <p className="section-kicker">Platform Administrator factual correction</p>
            <strong>Post-move rest override required</strong>
            <p>This bypass applies only to the one-week rest restriction. Same-week movement, House weekly locks and current leadership remain protected.</p>
          </div>
          <label htmlFor="roster-override-reason">Correction reason
            <textarea
              id="roster-override-reason"
              minLength={12}
              maxLength={500}
              required
              value={overrideReason}
              onChange={(event) => setOverrideReason(event.target.value)}
              placeholder="Describe the factual error or exceptional correction being made."
            />
          </label>
        </div>
      )}
      <button className="button button--danger" type="button" disabled={busy || invalidSameWeek || (overrideRequired && (!platformAdmin || overrideReason.trim().length < 12)) || !sourceHouse || !targetHouse || !sourceMembers.some((item) => item.userId === firstPlayerId) || !targetMembers.some((item) => item.userId === secondPlayerId)} onClick={() => setConfirming(true)}>{busy ? "Changing Houses…" : overrideRequired ? "Complete audited correction" : "Complete roster swap"}</button>
      <ConfirmDialog
        open={confirming}
        title={overrideRequired ? "Complete audited House correction?" : "Complete this week’s House swap?"}
        description="Future House contributions will follow the new roster. Earlier contributions remain permanently attributed to the House represented when they were earned."
        confirmLabel={overrideRequired ? "Complete correction" : "Complete roster swap"}
        loading={busy}
        loadingLabel="Changing Houses…"
        onConfirm={handleSwap}
        onCancel={() => !busy && setConfirming(false)}
      />
    </section>
  );
}

function AssignmentHistoryPanel({ history }) {
  return (
    <section className="assignment-history card">
      <div className="assignment-history__heading">
        <div>
          <p className="section-kicker">Immutable roster history</p>
          <h2>House assignment timeline</h2>
          <p>Opening C.H.A.O.S. assignments and v4 weekly moves are preserved as append-only season records.</p>
        </div>
        <span>{history.length} records</span>
      </div>
      {history.length === 0 ? (
        <div className="empty-state">Assignment history will appear after C.H.A.O.S. or the first v4 roster swap.</div>
      ) : (
        <div className="assignment-history__list">
          {history.slice(0, 60).map((record) => (
            <article key={record.id}>
              <span className="assignment-history__icon" aria-hidden="true">
                <ThemeIcon name={record.method === "chaos" ? "power" : "swap"} size={20} />
              </span>
              <div>
                <strong>{record.displayName}</strong>
                <p>
                  {record.method === "chaos"
                    ? `Assigned to ${record.toHouseName} by C.H.A.O.S.`
                    : `${record.fromHouseName} → ${record.toHouseName}`}
                </p>
                {record.overrideApplied && (
                  <small className="assignment-history__override">Administrator correction · {record.overrideReason}</small>
                )}
              </div>
              <time>{record.weekKey || "Opening assignment"}</time>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function CompositionBalancePanel({
  league,
  actorId,
  membership,
  profile,
  manager,
  adminProfiles,
  members,
  houses,
  balanceWeeks,
  balanceHouseWeeks,
  privateBalanceWeeks,
  privateBalanceHouseWeeks,
  notify,
}) {
  const [value, setValue] = useState(profile?.value || "");
  const [busy, setBusy] = useState(false);
  const weekKey = getSeasonWeekKey(new Date());
  const currentResult = balanceWeeks.find((item) => item.weekKey === weekKey) || null;
  const latestResult = currentResult || balanceWeeks[0] || null;
  const latestResultId = latestResult?.id || "";
  const publicRows = balanceHouseWeeks.filter((item) => item.resultId === latestResultId);
  const privateResult = manager
    ? privateBalanceWeeks.find((item) => item.id === latestResultId) || null
    : null;
  const privateRows = manager
    ? privateBalanceHouseWeeks.filter((item) => item.resultId === latestResultId)
    : [];
  const statusCopy = getBalanceStatusCopy(latestResult?.balanceStatus);
  const optionLabels = new Map(HOUSE_COMPOSITION_OPTIONS.map((option) => [option.id, option.label]));
  const activeUserIds = new Set(
    members.filter((item) => item.status === "active").map((item) => item.userId),
  );
  const activeProfiles = adminProfiles.filter((item) => activeUserIds.has(item.userId));
  const disclosedCount = activeProfiles.filter(
    (item) => item.value && item.value !== "prefer-not-to-say",
  ).length;
  const canRespond = Boolean(membership && ["registered", "active"].includes(membership.status));

  async function saveResponse() {
    if (!value) {
      notify("Choose a response or remove your existing response.", "error");
      return;
    }
    setBusy(true);
    try {
      await saveCompositionProfile({ league, userId: actorId, value });
      notify("Your private season composition response has been saved.", "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "Your private response could not be saved.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function removeResponse() {
    setBusy(true);
    try {
      await clearCompositionProfile({ leagueId: league.id, userId: actorId });
      setValue("");
      notify("Your private season composition response has been removed.", "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "Your private response could not be removed.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function calculateBalance() {
    setBusy(true);
    try {
      await calculateWeeklyHouseBalance({
        league,
        houses,
        memberships: members,
        profiles: adminProfiles,
        actorId,
      });
      notify("This week’s informational House balance snapshot has been preserved.", "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "The weekly House balance could not be calculated.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="composition-foundation">
      <section className="composition-privacy card">
        <div>
          <p className="section-kicker">Private season data</p>
          <h2>Optional composition response</h2>
          <p>
            This answer belongs only to {league.name}. It is self-declared, optional and removable.
            Individual responses are not shown to House leaders or ordinary players and never change your points.
          </p>
        </div>

        {canRespond ? (
          <div className="composition-response">
            <label htmlFor={`season-composition-${league.id}`}>My private response</label>
            <select
              id={`season-composition-${league.id}`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={busy}
            >
              <option value="">Choose a response</option>
              {HOUSE_COMPOSITION_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <div className="composition-response__actions">
              <button className="button button--primary" type="button" disabled={busy || !value} onClick={saveResponse}>
                {busy ? "Saving…" : "Save private response"}
              </button>
              {profile && (
                <button className="button button--ghost" type="button" disabled={busy} onClick={removeResponse}>
                  Remove my response
                </button>
              )}
            </div>
            <small>
              “Prefer not to say” records that choice without treating it as disclosed composition data.
            </small>
          </div>
        ) : (
          <div className="inline-alert inline-alert--info">
            Only registered season members can submit a composition response.
          </div>
        )}
      </section>

      <section className="house-balance card">
        <div className="community-section-heading">
          <div>
            <p className="section-kicker">Weekly House balance</p>
            <h2>{latestResult ? statusCopy.label : "No weekly snapshot yet"}</h2>
          </div>
          <span>{latestResult?.weekKey || weekKey}</span>
        </div>
        <p>
          {latestResult
            ? statusCopy.detail
            : "An authorised administrator can preserve one privacy-safe snapshot for each official season week."}
        </p>

        {manager && (
          <div className="house-balance__admin">
            <div>
              <strong>{activeProfiles.length} private responses available</strong>
              <span>{disclosedCount} disclosed for calculation · {activeUserIds.size} active players</span>
            </div>
            <button
              className="button button--primary"
              type="button"
              disabled={busy || league.status !== "active" || Boolean(currentResult)}
              onClick={calculateBalance}
            >
              {currentResult ? "This week preserved" : busy ? "Calculating…" : "Preserve this week’s snapshot"}
            </button>
          </div>
        )}

        {latestResult && (
          <>
            <div className="house-balance__metrics">
              <span><strong>{latestResult.rosterSizeDifference}</strong> roster-size spread</span>
              <span><strong>{latestResult.minimumDisclosureCount}</strong> minimum disclosed per House</span>
              <span><strong>{latestResult.scoringEnabled ? "On" : "Off"}</strong> scoring effect</span>
            </div>

            {latestResult.seasonDistributionVisible ? (
              <div className="house-balance__season-distribution">
                <strong>Season disclosed distribution</strong>
                <dl>
                  {Object.entries(latestResult.seasonCompositionDistribution || {}).map(([id, percentage]) => (
                    <div key={id}><dt>{optionLabels.get(id) || id}</dt><dd>{percentage}%</dd></div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="inline-alert inline-alert--info">
                Season composition distribution is suppressed until the minimum disclosure threshold is met.
              </div>
            )}

            <div className="house-balance__houses">
              {publicRows.map((house) => (
                <article key={house.id}>
                  <div>
                    <strong>{house.houseName}</strong>
                    <span>{house.rosterSize} players</span>
                  </div>
                  {house.compositionVisible ? (
                    <dl>
                      {Object.entries(house.compositionDistribution || {}).map(([id, percentage]) => (
                        <div key={id}><dt>{optionLabels.get(id) || id}</dt><dd>{percentage}%</dd></div>
                      ))}
                      <div><dt>Season deviation</dt><dd>{house.deviationPercentagePoints} points</dd></div>
                    </dl>
                  ) : (
                    <small>
                      Composition hidden because fewer than {latestResult.minimumDisclosureCount} disclosed responses protect this House.
                    </small>
                  )}
                </article>
              ))}
            </div>

            <div className="inline-alert inline-alert--info">
              Weekly balance is informational only. It cannot add, remove, reduce or multiply individual or House points.
            </div>
          </>
        )}
      </section>

      {manager && privateResult && (
        <section className="composition-coverage card">
          <div>
            <p className="section-kicker">Administrator-only exact snapshot</p>
            <h2>Private calculation record</h2>
            <p>
              These counts are retained only for authorised balancing operations. Member-facing House summaries never expose these exact counts.
            </p>
          </div>
          <div className="composition-coverage__metrics">
            <span><strong>{privateResult.activeMemberCount}</strong> active players</span>
            <span><strong>{privateResult.responseCount}</strong> responses</span>
            <span><strong>{privateResult.disclosedCount}</strong> disclosed</span>
            <span><strong>{privateResult.preferNotToSayCount}</strong> prefer not to say</span>
          </div>
          <div className="house-balance__private-houses">
            {privateRows.map((house) => (
              <article key={house.id}>
                <strong>{house.houseName}</strong>
                <span>{house.disclosedCount} disclosed · {house.undisclosedCount} undisclosed</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
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
  const movementV1 = supportsHouseMovementV1(league);
  const canViewAssignmentHistory = Boolean(
    movementV1
    && (
      myMemberships.some((item) => item.leagueId === league?.id)
      || (canManageLeagues && canManageLeague(league, user?.uid, isPlatformAdmin))
    )
  );
  const [housesState, setHousesState] = useState({ leagueId: "", items: [] });
  const [membersState, setMembersState] = useState({ leagueId: "", items: [] });
  const [electionsState, setElectionsState] = useState({ leagueId: "", items: [] });
  const [historyState, setHistoryState] = useState({ leagueId: "", items: [] });
  const [compositionState, setCompositionState] = useState({ leagueId: "", item: null });
  const [compositionAdminState, setCompositionAdminState] = useState({ leagueId: "", items: [] });
  const [balanceState, setBalanceState] = useState({ leagueId: "", items: [] });
  const [balanceHouseState, setBalanceHouseState] = useState({ leagueId: "", items: [] });
  const [privateBalanceState, setPrivateBalanceState] = useState({ leagueId: "", items: [] });
  const [privateBalanceHouseState, setPrivateBalanceHouseState] = useState({ leagueId: "", items: [] });
  const requestedHouseId = searchParams.get("house") || "";
  const requestedTab = searchParams.get("tab") || "overview";
  const [working, setWorking] = useState(false);
  const [editingHouseId, setEditingHouseId] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

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
    const unsubHistory = canViewAssignmentHistory
      ? subscribeToHouseAssignmentHistory(
          leagueId,
          (items) => setHistoryState({ leagueId, items }),
          (error) => showToast(error.message || "House assignment history could not be loaded.", "error"),
        )
      : () => {};

    return () => {
      unsubHouses();
      unsubMembers();
      unsubElections();
      unsubHistory();
    };
  }, [league?.id, canViewAssignmentHistory, showToast]);

  const houses = housesState.leagueId === league?.id ? housesState.items : [];
  const members = membersState.leagueId === league?.id ? membersState.items : [];
  const elections = electionsState.leagueId === league?.id ? electionsState.items : [];
  const assignmentHistory = historyState.leagueId === league?.id ? historyState.items : [];
  const membership = myMemberships.find((item) => item.leagueId === league?.id) || null;
  const membershipUserId = membership?.userId || "";
  const currentHouse = houses.find((item) => item.id === membership?.currentHouseId) || null;
  const selectedHouse = houses.find((item) => item.id === requestedHouseId)
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
  const canUseComposition = Boolean(movementV1 && (membership || manager));

  useEffect(() => {
    const leagueId = league?.id;
    if (!leagueId || !movementV1) return undefined;

    const unsubOwn = membershipUserId && user?.uid
      ? subscribeToCompositionProfile(
          leagueId,
          user.uid,
          (item) => setCompositionState({ leagueId, item }),
          (error) => showToast(error.message || "Your private composition response could not be loaded.", "error"),
        )
      : () => {};
    const unsubAdmin = manager
      ? subscribeToLeagueCompositionProfiles(
          leagueId,
          (items) => setCompositionAdminState({ leagueId, items }),
          (error) => showToast(error.message || "Private composition coverage could not be loaded.", "error"),
        )
      : () => {};
    const unsubBalance = canUseComposition
      ? subscribeToHouseBalanceWeeks(
          leagueId,
          (items) => setBalanceState({ leagueId, items }),
          (error) => showToast(error.message || "Weekly House balance could not be loaded.", "error"),
        )
      : () => {};
    const unsubBalanceHouses = canUseComposition
      ? subscribeToHouseBalanceHouseWeeks(
          leagueId,
          (items) => setBalanceHouseState({ leagueId, items }),
          (error) => showToast(error.message || "Weekly House summaries could not be loaded.", "error"),
        )
      : () => {};
    const unsubPrivateBalance = manager
      ? subscribeToPrivateHouseBalanceWeeks(
          leagueId,
          (items) => setPrivateBalanceState({ leagueId, items }),
          (error) => showToast(error.message || "Private weekly balance could not be loaded.", "error"),
        )
      : () => {};
    const unsubPrivateBalanceHouses = manager
      ? subscribeToPrivateHouseBalanceHouseWeeks(
          leagueId,
          (items) => setPrivateBalanceHouseState({ leagueId, items }),
          (error) => showToast(error.message || "Private House balance details could not be loaded.", "error"),
        )
      : () => {};

    return () => {
      unsubOwn();
      unsubAdmin();
      unsubBalance();
      unsubBalanceHouses();
      unsubPrivateBalance();
      unsubPrivateBalanceHouses();
    };
  }, [league?.id, movementV1, membershipUserId, manager, canUseComposition, user?.uid, showToast]);

  const compositionProfile = compositionState.leagueId === league?.id ? compositionState.item : null;
  const compositionAdminProfiles = compositionAdminState.leagueId === league?.id
    ? compositionAdminState.items
    : [];
  const balanceWeeks = balanceState.leagueId === league?.id ? balanceState.items : [];
  const balanceHouseWeeks = balanceHouseState.leagueId === league?.id ? balanceHouseState.items : [];
  const privateBalanceWeeks = privateBalanceState.leagueId === league?.id ? privateBalanceState.items : [];
  const privateBalanceHouseWeeks = privateBalanceHouseState.leagueId === league?.id ? privateBalanceHouseState.items : [];
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
  const selectedCaptain = members.find((item) => item.userId === selectedHouse?.captainId) || null;
  const selectedViceCaptains = (selectedHouse?.viceCaptainIds ?? [])
    .map((id) => members.find((item) => item.userId === id))
    .filter(Boolean);
  const selectedIsCurrentHouse = Boolean(
    selectedHouse && currentHouse && selectedHouse.id === currentHouse.id,
  );
  const currentHouseRole = !currentHouse
    ? membership ? "Awaiting assignment" : "Observer"
    : currentHouse.captainId === user?.uid
      ? "Captain"
      : currentHouse.viceCaptainIds?.includes(user?.uid)
        ? "Vice-captain"
        : "House member";
  const orderedHouses = [...houses].sort((first, second) => {
    if (first.id === currentHouse?.id) return -1;
    if (second.id === currentHouse?.id) return 1;
    return String(first.name).localeCompare(String(second.name));
  });
  const houseThemeStyle = selectedHouse ? getHouseThemeStyle(selectedHouse) : undefined;
  const summaryMetrics = manager
    ? [
        { label: "Selected House", value: selectedHouse?.name || "None" },
        { label: "Roster", value: selectedMembers.length },
        { label: "Captain", value: selectedCaptain?.displayName || "Pending" },
        { label: "Season phase", value: league.status },
      ]
    : membership
      ? [
          { label: "Your House", value: currentHouse?.name || "Pending" },
          { label: "Your role", value: currentHouseRole },
          { label: "Selected roster", value: selectedMembers.length },
          { label: "Selected captain", value: selectedCaptain?.displayName || "Pending" },
        ]
      : [
          { label: "Selected House", value: selectedHouse?.name || "None" },
          { label: "Roster", value: selectedMembers.length },
          { label: "Captain", value: selectedCaptain?.displayName || "Pending" },
          { label: "Season phase", value: league.status },
        ];
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <ThemeIcon name="houses" />,
    },
    ...(selectedHouse
      ? [
          {
            id: "roster",
            label: "Roster",
            icon: <ThemeIcon name="roster" />,
          },
          {
            id: "leadership",
            label: "Leadership",
            icon: <ThemeIcon name="crown" />,
          },
        ]
      : []),
    ...(canViewAssignmentHistory
      ? [{
          id: "history",
          label: "History",
          icon: <ThemeIcon name="compass" />,
        }]
      : []),
    ...(canUseComposition
      ? [{
          id: "balance",
          label: "Balance",
          icon: <ThemeIcon name="balance" />,
        }]
      : []),
    ...(canUseRosterTurn
      ? [{
          id: "roster-turn",
          label: "Roster turn",
          icon: <ThemeIcon name="swap" />,
        }]
      : []),
    ...(preSeasonManagement
      ? [{
          id: "manage",
          label: "Manage",
          icon: <ThemeIcon name="admin" />,
        }]
      : []),
  ];
    const resolvedActiveTab = resolveWorkspaceTab(tabs, requestedTab)?.id ?? "overview";

  function setActiveTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "overview") next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

  function selectHouse(houseId) {
    const next = new URLSearchParams(searchParams);
    if (houseId) next.set("house", houseId);
    else next.delete("house");
    setSearchParams(next, { replace: true });
  }

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

    async function handleDeleteHouse(house) {
    if (working || !isPlatformAdmin || league?.status !== "draft" || !house?.id) return;
    setWorking(true);
    try {
      await deleteDraftLeagueHouse({ league, house, actorId: user.uid });
      showToast("Unused draft House permanently deleted.", "success");
      selectHouse("");
      setPendingAction(null);
      if (editingHouseId === house.id) setEditingHouseId("");
    } catch (error) {
      console.error(error);
      showToast(error.message || "The draft House could not be deleted.", "error");
    } finally {
      setWorking(false);
    }
  }

    async function handleChaos() {
    setWorking(true);
    try {
      await activateChaos({ league, houses, memberships: members, actorId: user.uid });
      showToast(
        "C.H.A.O.S. activated. The Houses have claimed their players.",
        "success",
        6000,
      );
      setPendingAction(null);
    } catch (error) {
      console.error(error);
      showToast(error.message || "C.H.A.O.S. could not be activated.", "error");
    } finally {
      setWorking(false);
    }
  }

  function selectSeason(nextLeagueId) {
    setSearchParams({ league: nextLeagueId }, { replace: true });
    setEditingHouseId("");
  }

  function editHouse(houseId) {
    selectHouse(houseId);
    setEditingHouseId(houseId);
    setActiveTab("manage");
  }

  return (
    <div
      className={selectedHouse
        ? "season-houses-page page-stack house-theme-scope house-theme-scope--active"
        : "season-houses-page page-stack"}
      style={houseThemeStyle}
    >
      <PageHeader
        eyebrow="Season Houses"
        title="Houses"
        description="Your House is more than a roster. Carry its banner, back its leaders and make every contribution add weight to the name you represent."
        icon={<ThemeIcon name="houses" size={26} />}
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
          <CompetitionWorkspaceSummary
            eyebrow={selectedIsCurrentHouse ? "Your House" : manager ? "House command" : "House context"}
            title={selectedIsCurrentHouse
              ? "Your banner: " + selectedHouse.name
              : selectedHouse
                ? "Inspecting " + selectedHouse.name
                : membership
                  ? "Opening House assignment pending"
                  : "Explore the season Houses"}
            description={manager
              ? "Inspect the selected House here. Setup, balance and roster operations stay in their dedicated workspaces."
              : selectedIsCurrentHouse
                ? "This is your competition home for the current roster state. Know the people beside you, the leaders carrying the banner and the history you are building."
                : currentHouse
                  ? "You still represent " + currentHouse.name + ". Inspecting another House never changes your allegiance."
                  : "Choose a House to inspect its identity, roster and leadership."}
            metrics={summaryMetrics}
          />
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
                  <ThemeIcon name={chaosReadiness.eligible ? "check" : "admin"} size={22} />
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
                {orderedHouses.map((house) => {
                  const houseMembers = members.filter(
                    (item) => item.currentHouseId === house.id,
                  );
                  return (
                    <HouseCard
                      key={house.id}
                      house={house}
                      members={houseMembers}
                      selected={selectedHouse?.id === house.id}
                      current={currentHouse?.id === house.id}
                      onSelect={() => selectHouse(house.id)}
                    />
                  );
                })}
              </section>
            ) : (
              <section className="house-empty card">
                <span aria-hidden="true"><ThemeIcon name="houses" size={28} /></span>
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
                style={getHouseThemeStyle(selectedHouse)}
              >
                <span aria-hidden="true">
                  {getHouseEmblem(selectedHouse.emblemId).symbol}
                </span>
                <div>
                  <p className="section-kicker">{selectedIsCurrentHouse ? "Your House" : "Selected House"}</p>
                  <h2>{selectedHouse.name}</h2>
                  <blockquote>“{selectedHouse.motto}”</blockquote>
                  <p>{selectedHouse.description}</p>
                  <div className="house-identity__meta">
                    <span><small>Captain</small><strong>{selectedCaptain?.displayName || "Pending"}</strong></span>
                    <span><small>Vice-captains</small><strong>{selectedViceCaptains.length || "Pending"}</strong></span>
                    <span><small>Roster</small><strong>{selectedMembers.length} players</strong></span>
                  </div>
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
                  {isPlatformAdmin && league.status === "draft" && (
                    <button
                      className="button button--danger"
                      type="button"
                      disabled={working}
                      onClick={() => setPendingAction({ type: "delete-house", house: selectedHouse })}
                    >
                      {working ? "Working…" : "Delete draft House"}
                    </button>
                  )}
                </div>
              </section>
            )}

            <section className="season-integrity card">
              <span aria-hidden="true"><ThemeIcon name="compass" size={26} /></span>
              <div>
                <p className="section-kicker">Historical integrity</p>
                <h2>The banner keeps its history</h2>
                <p>
                  What you earned under a banner stays with that House. Changing Houses only changes where
                  your future House points go; your individual points remain yours.
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

          {canViewAssignmentHistory && (
            <WorkspacePanel
              id="history"
              activeId={resolvedActiveTab}
              idPrefix={`houses-${league.id}`}
            >
              <AssignmentHistoryPanel history={assignmentHistory} />
            </WorkspacePanel>
          )}

          {canUseComposition && (
            <WorkspacePanel
              id="balance"
              activeId={resolvedActiveTab}
              idPrefix={`houses-${league.id}`}
            >
              <CompositionBalancePanel
                key={`${league.id}:${compositionProfile?.value || "unset"}`}
                league={league}
                actorId={user?.uid}
                membership={membership}
                profile={compositionProfile}
                manager={manager}
                adminProfiles={compositionAdminProfiles}
                members={members}
                houses={houses}
                balanceWeeks={balanceWeeks}
                balanceHouseWeeks={balanceHouseWeeks}
                privateBalanceWeeks={privateBalanceWeeks}
                privateBalanceHouseWeeks={privateBalanceHouseWeeks}
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
                platformAdmin={isPlatformAdmin}
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
                    onClick={() => setPendingAction({ type: "chaos" })}
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

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "chaos"
          ? "Activate C.H.A.O.S. for this season?"
          : `Permanently delete ${pendingAction?.house?.name || "this draft House"}?`}
        description={pendingAction?.type === "chaos"
          ? "Every registered player will receive the one-time balanced opening assignment. The assignment is preserved in season history and C.H.A.O.S. cannot be repeated."
          : "Only an unused draft House can be deleted. Once registration opens, House history is protected."}
        confirmLabel={pendingAction?.type === "chaos" ? "Activate C.H.A.O.S." : "Delete draft House"}
        loading={working}
        loadingLabel={pendingAction?.type === "chaos" ? "Assigning Houses…" : "Deleting House…"}
        onConfirm={() => pendingAction?.type === "chaos"
          ? handleChaos()
          : handleDeleteHouse(pendingAction?.house)}
        onCancel={() => !working && setPendingAction(null)}
      />
      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
