import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import CategoryGrid from "../components/categories/CategoryGrid";
import Toast from "../components/common/Toast/Toast";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import EntryForm from "../components/entries/EntryForm";
import PageHeader from "../components/layout/PageHeader";
import { CATEGORY_MAP } from "../constants/categories";
import useLeagues from "../hooks/useLeagues";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import {
  formatDateInputValue,
  normalizeChallengeDate,
  parseDateInputValue,
  toDate,
} from "../services/dateService";
import {
  getPocketCategoryConfig,
  getSeasonPhase,
} from "../services/seasons/seasonModel";
import {
  redeemPocketActivity,
  storePocketActivity,
  subscribeToPocketActivities,
} from "../services/seasons/seasonService";
import { resolveWorkspaceTab } from "../services/ui/workspaceModel";
import { formatMeasurement, formatNumber } from "../utils/displayFormatters";
import "./PocketWeek.css";

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getInitialFormData(categoryId) {
  return categoryId === "reading" ? { completed: false } : {};
}

function getSafeCategory(value) {
  return CATEGORY_MAP.has(value) ? value : "water";
}

function formatDate(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "Date unavailable";
}

function formatPocketQuantity(pocket) {
  const config = getPocketCategoryConfig(pocket.category);
  const value = Number(pocket.remainingQuantity ?? 0);
  if (config?.mode === "whole") {
    return `${formatNumber(value, { whole: true })} ${value === 1 ? "session" : "sessions"}`;
  }
  return formatMeasurement(value, config?.unit || pocket.unit || "units", {
    whole: Number.isInteger(value),
  });
}

function PocketCard({ pocket, league, userId, notify, canRedeem }) {
  const config = getPocketCategoryConfig(pocket.category);
  const category = CATEGORY_MAP.get(pocket.category);
  const available = Number(pocket.remainingQuantity ?? 0);
  const whole = config?.mode === "whole";
  const [quantity, setQuantity] = useState(whole ? 1 : Math.min(config?.step || 1, available));
  const [targetDate, setTargetDate] = useState(() =>
    formatDateInputValue(normalizeChallengeDate(new Date())),
  );
  const [redeeming, setRedeeming] = useState(false);
  const empty = pocket.status === "empty" || available <= 0;
  const requestedQuantity = whole ? 1 : Number(quantity);
  const validQuantity = Number.isFinite(requestedQuantity)
    && requestedQuantity > 0
    && requestedQuantity <= available;
  const latestTarget = normalizeChallengeDate(new Date()) < normalizeChallengeDate(league.endDate)
    ? normalizeChallengeDate(new Date())
    : normalizeChallengeDate(league.endDate);

  async function handleRedeem() {
    if (redeeming || empty || !canRedeem || !validQuantity) return;
    setRedeeming(true);
    try {
      await redeemPocketActivity({
        league,
        pocket,
        userId,
        quantity: requestedQuantity,
        targetDate: parseDateInputValue(targetDate),
      });
      const nextAvailable = Math.max(0, available - requestedQuantity);
      if (!whole && nextAvailable > 0) {
        setQuantity(Math.min(config?.step || 1, nextAvailable));
      }
      notify("Pocket activity activated. Its normal points now belong to the selected day.", "success", 5200);
    } catch (error) {
      console.error(error);
      notify(error.message || "The Pocket activity could not be activated.", "error");
    } finally {
      setRedeeming(false);
    }
  }

  return (
    <article className={`pocket-card${empty ? " pocket-card--empty" : ""}`}>
      <div className="pocket-card__icon" aria-hidden="true">{category?.emoji || "🧳"}</div>
      <div className="pocket-card__copy">
        <p>{category?.name || pocket.category}</p>
        <h3>{formatPocketQuantity(pocket)} remaining</h3>
        <span>Stored {formatDate(pocket.activityDate)}</span>
      </div>
      {empty ? (
        <div className="pocket-card__empty"><span aria-hidden="true">✓</span> Pocket empty</div>
      ) : (
        <div className="pocket-card__controls">
          {!whole && (
            <label>
              Amount to activate
              <input
                type="number"
                min={config?.step || 1}
                max={available}
                step={config?.step || 1}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                disabled={!canRedeem}
              />
            </label>
          )}
          <label>
            Apply to day
            <input
              type="date"
              min={formatDateInputValue(league.startDate)}
              max={formatDateInputValue(latestTarget)}
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              disabled={!canRedeem}
            />
          </label>
          <button className="button button--primary" type="button" disabled={redeeming || !canRedeem || !validQuantity} onClick={handleRedeem}>
            {redeeming ? "Activating…" : whole ? "Activate session" : "Activate amount"}
          </button>
        </div>
      )}
    </article>
  );
}

export default function PocketWeek() {
  const { user } = usePlayerData();
  const { leagues, memberships } = useLeagues();
  const { toast, showToast, dismissToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const seasonLeagues = leagues.filter((league) => league.mode === "season" && league.pocketEnabled);
  const requestedId = searchParams.get("league") || "";
  const fallbackId = memberships.find((item) =>
    seasonLeagues.some((league) => league.id === item.leagueId),
  )?.leagueId || seasonLeagues[0]?.id || "";
  const selectedId = seasonLeagues.some((item) => item.id === requestedId)
    ? requestedId
    : fallbackId;
  const league = seasonLeagues.find((item) => item.id === selectedId) || null;
  const membership = memberships.find((item) => item.leagueId === selectedId) || null;
  const [pocketState, setPocketState] = useState({ key: "", items: [] });
  const [categoryId, setCategoryId] = useState("water");
  const [formData, setFormData] = useState(() => getInitialFormData("water"));
  const [activityDate, setActivityDate] = useState(() => formatDateInputValue(new Date()));
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tabState, setTabState] = useState({ leagueId: "", activeId: "wallet" });
  const phase = league ? getSeasonPhase(league) : "draft";
  const canStore = Boolean(league && membership && phase === "pocket");
  const canRedeem = Boolean(league && membership?.status === "active" && phase === "active");


  const pocketKey = league?.id && user?.uid ? `${league.id}:${user.uid}` : "";

  useEffect(() => {
    if (!league?.id || !user?.uid) {
      return undefined;
    }

    const currentKey = `${league.id}:${user.uid}`;
    return subscribeToPocketActivities(
      league.id,
      user.uid,
      (items) => setPocketState({ key: currentKey, items }),
      (error) => showToast(error.message || "Your Pocket could not be loaded.", "error"),
    );
  }, [league?.id, showToast, user?.uid]);

  const availablePockets = useMemo(() => {
    const pockets = pocketState.key === pocketKey ? pocketState.items : [];
    return [...pockets].sort((first, second) => {
      const emptyDifference = Number(first.remainingQuantity <= 0) - Number(second.remainingQuantity <= 0);
      return emptyDifference || String(first.category).localeCompare(String(second.category));
    });
  }, [pocketKey, pocketState.items, pocketState.key]);

  const pocketTabs = [
    ...(canStore
      ? [{
          id: "store",
          label: "Store activity",
          icon: "➕",
          description: "Record work during the official Pocket window",
        }]
      : []),
    {
      id: "wallet",
      label: "Your Pocket",
      icon: "🧳",
      description: "Review balances and activate them in-season",
      badge: availablePockets.filter((item) => Number(item.remainingQuantity) > 0).length,
    },
    {
      id: "guide",
      label: "How it works",
      icon: "🔎",
      description: "Storage, activation and integrity rules",
    },
  ];
  const requestedTab = tabState.leagueId === selectedId
    ? tabState.activeId
    : canStore ? "store" : "wallet";
  const activeTab = resolveWorkspaceTab(pocketTabs, requestedTab)?.id ?? "wallet";

  function selectPocketTab(nextTab) {
    setTabState({ leagueId: selectedId, activeId: nextTab });
  }

  function selectSeason(nextLeagueId) {
    setSearchParams({ league: nextLeagueId }, { replace: true });
    setTabState({ leagueId: nextLeagueId, activeId: "wallet" });
  }

  function handleCategorySelect(nextCategory) {
    const safeCategory = getSafeCategory(nextCategory);
    setCategoryId(safeCategory);
    setFormData(getInitialFormData(safeCategory));
    setErrors([]);
  }

  async function handleStore() {
    if (!canStore || saving) return;
    setSaving(true);
    setErrors([]);
    try {
      await storePocketActivity({
        league,
        membership,
        userId: user.uid,
        category: categoryId,
        data: formData,
        activityDate: parseDateInputValue(activityDate),
      });
      setFormData(getInitialFormData(categoryId));
      showToast("Activity stored. It remains worth zero points until you activate it during the season.", "success", 5600);
    } catch (error) {
      console.error(error);
      const message = error.message || "The activity could not be stored.";
      setErrors([message]);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pocket-page page-stack">
      <PageHeader
        eyebrow="Seven-day safety net"
        title="Pocket Week"
        description="Store real activities before the season, then activate only what you need when unforeseen circumstances interrupt a category. Stored work earns no points until you use it."
        icon="🧳"
        actions={<Link className="button button--secondary" to={league ? `/houses?league=${league.id}` : "/houses"}>View Houses</Link>}
      />

      <section className="pocket-season card">
        <label htmlFor="pocket-season">Season</label>
        <select id="pocket-season" value={selectedId} onChange={(event) => selectSeason(event.target.value)}>
          <option value="">Choose a season</option>
          {seasonLeagues.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.theme}</option>)}
        </select>
        {league && (
          <div className="pocket-season__window">
            <span>Pocket window</span>
            <strong>{formatDate(league.pocketStartDate)} – {formatDate(league.pocketEndDate)}</strong>
            <em className={`pocket-phase pocket-phase--${phase}`}>{phase === "pocket" ? "Pocket open" : phase === "active" ? "Season active" : phase}</em>
          </div>
        )}
      </section>

      {!league ? (
        <section className="empty-state card">No Pocket-enabled season is available.</section>
      ) : !membership ? (
        <section className="empty-state card">Register for this season before using its Pocket.</section>
      ) : (
        <>
          <WorkspaceTabs
            idPrefix="pocket"
            label="Pocket Week sections"
            tabs={pocketTabs}
            activeId={activeTab}
            onChange={selectPocketTab}
          />

          <WorkspacePanel id="store" activeId={activeTab} idPrefix="pocket">
            {canStore ? (
              <div className="pocket-workspace">
                <CategoryGrid
                  selected={categoryId}
                  onSelect={handleCategorySelect}
                  eyebrow="Pocket category"
                  title="Store an activity"
                  description="Record work completed inside the official seven-day Pocket window."
                />
                <div className="pocket-entry-column">
                  <label className="pocket-date card">
                    Activity date
                    <input
                      type="date"
                      min={formatDateInputValue(league.pocketStartDate)}
                      max={formatDateInputValue(league.pocketEndDate)}
                      value={activityDate}
                      onChange={(event) => setActivityDate(event.target.value)}
                    />
                  </label>
                  <EntryForm
                    userId={user.uid}
                    type={categoryId}
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleStore}
                    saving={saving}
                    errors={errors}
                    eyebrow="Pocket deposit"
                    title={CATEGORY_MAP.get(categoryId)?.name}
                    description="This deposit is recorded but deliberately receives no points yet."
                    notice="🧳 Store only activities completed during this season’s Pocket Week. Integrity rules still apply."
                    submitLabel="Store in Pocket"
                    savingLabel="Storing activity…"
                  />
                </div>
              </div>
            ) : (
              <section className="empty-state card">Pocket deposits are closed for this season.</section>
            )}
          </WorkspacePanel>

          <WorkspacePanel id="wallet" activeId={activeTab} idPrefix="pocket">
            {!canStore && phase !== "active" && (
              <section className="inline-alert card">Pocket deposits are closed for this season. Existing balances remain visible and become usable when the active season begins.</section>
            )}

            <section className="pocket-wallet card">
              <div className="community-section-heading">
                <div><p className="section-kicker">Personal reserve</p><h2>Your Pocket</h2></div>
                <span>{availablePockets.filter((item) => Number(item.remainingQuantity) > 0).length} available</span>
              </div>
              {availablePockets.length === 0 ? (
                <div className="empty-state">This Pocket is empty. Categories not recorded during Pocket Week cannot be used later.</div>
              ) : (
                <div className="pocket-wallet__grid">
                  {availablePockets.map((pocket) => (
                    <PocketCard
                      key={pocket.id}
                      pocket={pocket}
                      league={league}
                      userId={user.uid}
                      notify={showToast}
                      canRedeem={canRedeem}
                    />
                  ))}
                </div>
              )}
              {!canRedeem && phase !== "active" && <p className="pocket-wallet__notice">Balances unlock for activation when the season becomes active.</p>}
            </section>
          </WorkspacePanel>

          <WorkspacePanel id="guide" activeId={activeTab} idPrefix="pocket">
            <section className="pocket-principles">
              <article className="card"><span aria-hidden="true">0</span><strong>Zero points while stored</strong><p>The activity exists in your Pocket, not in the daily score.</p></article>
              <article className="card"><span aria-hidden="true">↗</span><strong>You choose when to use it</strong><p>Activate part of a simple balance or an entire stored session.</p></article>
              <article className="card"><span aria-hidden="true">🔒</span><strong>Activation is final</strong><p>Once used, that amount leaves your Pocket and cannot be returned.</p></article>
            </section>

            <section className="pocket-easter card">
              <span aria-hidden="true">🦓</span>
              <div><strong>Pocket inspection complete</strong><p>No prison zebras were inconvenienced. Stored activities remain non-transferable, carefully counted and entirely yours.</p></div>
            </section>
          </WorkspacePanel>
        </>
      )}

      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
