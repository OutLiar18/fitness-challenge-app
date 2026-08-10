import { useEffect, useMemo, useState } from "react";

import {
  awardSeasonBonusDirect,
  correctSeasonBonusAward,
  requestSeasonBonus,
  reviewSeasonBonusRequest,
  subscribeToSeasonBonusAwards,
  subscribeToSeasonBonusRequests,
} from "../../services/seasons/seasonBonusService";
import { SEASON_BONUS_REQUEST_STATUSES } from "../../services/seasons/seasonBonusModel";
import { toDate } from "../../services/dateService";
import { formatPoints, pluralize } from "../../utils/displayFormatters";
import "./BonusPointsWorkspace.css";

const dateTimeFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Johannesburg",
});

function formatDateTime(value) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : "Just now";
}

function sortNewest(items, field) {
  return [...items].sort(
    (first, second) =>
      (toDate(second?.[field])?.getTime() ?? 0) - (toDate(first?.[field])?.getTime() ?? 0),
  );
}

export default function BonusPointsWorkspace({
  league,
  members = [],
  actorId,
  isPlatformAdmin,
  isLeagueAdministrator,
  notify,
}) {
  const [requests, setRequests] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loadingError, setLoadingError] = useState("");
  const [memberId, setMemberId] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [working, setWorking] = useState("");
  const [reviewNotes, setReviewNotes] = useState({});
  const [correctionAwardId, setCorrectionAwardId] = useState("");
  const [correctionPoints, setCorrectionPoints] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  useEffect(() => {
    const unsubscribeRequests = subscribeToSeasonBonusRequests(
      league.id,
      setRequests,
      (error) => setLoadingError(error?.message || "Bonus requests could not be loaded."),
    );
    const unsubscribeAwards = subscribeToSeasonBonusAwards(
      league.id,
      setAwards,
      (error) => setLoadingError(error?.message || "Bonus award history could not be loaded."),
    );
    return () => {
      unsubscribeRequests();
      unsubscribeAwards();
    };
  }, [league.id]);

  const activeMembers = useMemo(
    () => members
      .filter((member) => member.status === "active" && member.currentHouseId)
      .sort((first, second) => (first.displayName || "").localeCompare(second.displayName || "")),
    [members],
  );
  const selectedMember = activeMembers.find((member) => member.userId === memberId) ?? null;
  const pendingRequests = useMemo(
    () => sortNewest(
      requests.filter((request) => request.status === SEASON_BONUS_REQUEST_STATUSES.PENDING),
      "requestedAt",
    ),
    [requests],
  );
  const recentAwards = useMemo(() => sortNewest(awards, "awardedAt").slice(0, 12), [awards]);
  const correctionAward = awards.find((award) => award.id === correctionAwardId) ?? null;
  const seasonActive = league.status === "active";
  const canUseWorkspace = Boolean(isPlatformAdmin || isLeagueAdministrator);

  if (!canUseWorkspace) return null;

  async function submitAward(event) {
    event.preventDefault();
    if (!selectedMember || working) return;
    const action = isPlatformAdmin ? "direct" : "request";
    setWorking(action);
    try {
      if (isPlatformAdmin) {
        await awardSeasonBonusDirect({ league, member: selectedMember, points, reason, actorId });
        notify?.(`Bonus points awarded to ${selectedMember.displayName}.`, "success");
      } else {
        await requestSeasonBonus({ league, member: selectedMember, points, reason, actorId });
        notify?.("Bonus request sent to Platform Administrators for review.", "success");
      }
      setPoints("");
      setReason("");
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The bonus action could not be completed.", "error");
    } finally {
      setWorking("");
    }
  }

  async function reviewRequest(request, decision) {
    if (working) return;
    const key = `review:${request.id}`;
    setWorking(key);
    try {
      await reviewSeasonBonusRequest({
        league,
        request,
        decision,
        reviewReason: reviewNotes[request.id] || "",
        actorId,
      });
      notify?.(
        decision === SEASON_BONUS_REQUEST_STATUSES.APPROVED
          ? `Approved ${formatPoints(request.points)} for ${request.displayName}.`
          : `Rejected the bonus request for ${request.displayName}.`,
        "success",
      );
      setReviewNotes((current) => ({ ...current, [request.id]: "" }));
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The bonus request could not be reviewed.", "error");
    } finally {
      setWorking("");
    }
  }

  async function submitCorrection(event) {
    event.preventDefault();
    if (!correctionAward || working) return;
    setWorking(`correct:${correctionAward.id}`);
    try {
      await correctSeasonBonusAward({
        league,
        originalAward: correctionAward,
        points: correctionPoints,
        reason: correctionReason,
        actorId,
      });
      notify?.("Historical bonus adjustment recorded without rewriting the original award.", "success");
      setCorrectionAwardId("");
      setCorrectionPoints("");
      setCorrectionReason("");
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The bonus correction could not be recorded.", "error");
    } finally {
      setWorking("");
    }
  }

  return (
    <section className="season-bonus card" aria-labelledby={`season-bonus-heading-${league.id}`}>
      <div className="community-section-heading">
        <div>
          <p className="section-kicker">League Season bonus points</p>
          <h2 id={`season-bonus-heading-${league.id}`}>Reward exceptional contributions transparently</h2>
        </div>
        <span>{recentAwards.length} recent {pluralize(recentAwards.length, "award", "awards")}</span>
      </div>

      {loadingError && <div className="inline-alert inline-alert--danger" role="alert">{loadingError}</div>}

      {isPlatformAdmin && pendingRequests.length > 0 && (
        <div className="season-bonus__review-alert" role="alert">
          <span aria-hidden="true">🔔</span>
          <div>
            <strong>{pendingRequests.length} {pluralize(pendingRequests.length, "bonus request", "bonus requests")} awaiting Platform review</strong>
            <p>League Administrator requests do not change standings until you approve them.</p>
          </div>
        </div>
      )}

      <div className="season-bonus__grid">
        <form className="season-bonus__form" onSubmit={submitAward}>
          <div>
            <h3>{isPlatformAdmin ? "Award bonus points" : "Request bonus points"}</h3>
            <p>
              {isPlatformAdmin
                ? "The same amount is credited to the player and their current House immediately."
                : "Platform Administrators must approve the request before either the player or House receives points."}
            </p>
          </div>
          {!seasonActive && (
            <div className="inline-alert inline-alert--warning">
              New bonus awards and requests are available only while the season is active.
            </div>
          )}
          <label>
            <span>Player</span>
            <select value={memberId} onChange={(event) => setMemberId(event.target.value)} disabled={!seasonActive || working !== ""} required>
              <option value="">Choose an active player</option>
              {activeMembers.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.displayName} — {member.currentHouseName || "House"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Bonus points</span>
            <input type="number" min="1" max="10000" step="1" value={points} onChange={(event) => setPoints(event.target.value)} disabled={!seasonActive || working !== ""} required />
          </label>
          <label>
            <span>Reason</span>
            <textarea rows="3" maxLength="300" value={reason} onChange={(event) => setReason(event.target.value)} disabled={!seasonActive || working !== ""} placeholder="State the factual reason for this bonus." required />
          </label>
          <button className="button button--primary" type="submit" disabled={!seasonActive || !selectedMember || working !== ""}>
            {working === "direct" || working === "request"
              ? "Saving…"
              : isPlatformAdmin
                ? "Award player + House"
                : "Send for Platform review"}
          </button>
        </form>

        <div className="season-bonus__review">
          <h3>{isPlatformAdmin ? "Pending review" : "Request status"}</h3>
          {requests.length === 0 ? (
            <div className="empty-state">No League Season bonus requests yet.</div>
          ) : (
            <div className="season-bonus__request-list">
              {(isPlatformAdmin ? pendingRequests : sortNewest(requests, "requestedAt").slice(0, 8)).map((request) => {
                const reviewing = working === `review:${request.id}`;
                return (
                  <article className="season-bonus__request" key={request.id}>
                    <div className="season-bonus__request-topline">
                      <strong>{request.displayName}</strong>
                      <b>{formatPoints(request.points)}</b>
                    </div>
                    <p>{request.reason}</p>
                    <small>{request.status} · {formatDateTime(request.requestedAt)}</small>
                    {isPlatformAdmin && request.status === SEASON_BONUS_REQUEST_STATUSES.PENDING && (
                      <div className="season-bonus__review-controls">
                        <label>
                          <span>Review note <small>(required when rejecting)</small></span>
                          <input
                            type="text"
                            maxLength="300"
                            value={reviewNotes[request.id] || ""}
                            onChange={(event) => setReviewNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                            disabled={reviewing}
                            placeholder="Optional approval note"
                          />
                        </label>
                        <div>
                          <button className="button button--primary" type="button" disabled={reviewing || !seasonActive} onClick={() => reviewRequest(request, SEASON_BONUS_REQUEST_STATUSES.APPROVED)}>
                            Approve
                          </button>
                          <button className="button button--secondary" type="button" disabled={reviewing} onClick={() => reviewRequest(request, SEASON_BONUS_REQUEST_STATUSES.REJECTED)}>
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
              {isPlatformAdmin && pendingRequests.length === 0 && (
                <div className="empty-state">No bonus requests are waiting for Platform review.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="season-bonus__history">
        <div>
          <h3>Immutable award history</h3>
          <p>Roster movement never relocates an old bonus. Corrections create a separate adjustment against the original House attribution.</p>
        </div>
        {recentAwards.length === 0 ? (
          <div className="empty-state">No bonus points have been awarded in this season yet.</div>
        ) : (
          <div className="season-bonus__award-list">
            {recentAwards.map((award) => (
              <article className="season-bonus__award" key={award.id}>
                <div>
                  <strong>{award.displayName}</strong>
                  <span>{award.houseName} · {award.kind === "correction" ? "correction" : "bonus"}</span>
                  <small>{award.reason}</small>
                </div>
                <div>
                  <b>{formatPoints(award.points)}</b>
                  <small>{formatDateTime(award.awardedAt)}</small>
                  {isPlatformAdmin && (
                    <button type="button" className="text-link" onClick={() => {
                      setCorrectionAwardId(award.id);
                      setCorrectionPoints("");
                      setCorrectionReason("");
                    }}>
                      Correct award
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {isPlatformAdmin && correctionAward && (
        <form className="season-bonus__correction" onSubmit={submitCorrection}>
          <div>
            <p className="section-kicker">Historical adjustment</p>
            <h3>Correct {correctionAward.displayName}'s award</h3>
            <p>
              This adjustment remains attached to <strong>{correctionAward.houseName}</strong>, the House recorded by the award being corrected.
            </p>
          </div>
          <label>
            <span>Adjustment</span>
            <input type="number" min="-10000" max="10000" step="1" value={correctionPoints} onChange={(event) => setCorrectionPoints(event.target.value)} required />
          </label>
          <label>
            <span>Correction reason</span>
            <textarea rows="2" maxLength="300" value={correctionReason} onChange={(event) => setCorrectionReason(event.target.value)} required />
          </label>
          <div className="season-bonus__correction-actions">
            <button className="button button--primary" type="submit" disabled={working !== ""}>Record adjustment</button>
            <button className="button button--secondary" type="button" disabled={working !== ""} onClick={() => setCorrectionAwardId("")}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
