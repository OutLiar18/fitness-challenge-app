import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { DEFAULT_AVATAR_ID } from "../../constants/avatars";
import { CATEGORY_MAP } from "../../constants/categories";
import {
  HOUSE_VICE_CAPTAIN_LIMIT,
  POCKET_CATEGORY_CONFIG,
} from "../../constants/seasons";
import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import { normalizeChallengeDate } from "../dateService";
import { normalizeEntry } from "../entries/normalizer";
import { calculateEntryPoints } from "../points";
import { validateEntry } from "../validation";
import { PLAYER_NOTIFICATION_TYPES } from "../notifications/notificationModel";
import {
  createHouseAssignmentHistoryId,
  getRosterRestWindow,
  supportsHouseMovementV1,
} from "./houseMovementModel";
import {
  calculateLeadershipResult,
  createElectionId,
  createPocketRedemptionData,
  createRosterSwapId,
  createVoteId,
  distributePlayersWithChaos,
  getElectionWindow,
  getPocketQuantity,
  getSeasonWeekKey,
  normalizePocketRedemptionQuantity,
  isDateWithinWindow,
  validateHouseInput,
  validatePocketRedemption,
} from "./seasonModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function createNotificationReference() {
  return doc(collection(db, "playerNotifications"));
}

function setNotification(batchOrTransaction, {
  userId,
  type,
  title,
  message,
  leagueId,
  houseId = "",
  actionPath = "/seasons",
}) {
  const reference = createNotificationReference();
  batchOrTransaction.set(reference, {
    userId,
    type,
    title,
    message,
    leagueId,
    houseId,
    actionPath,
    createdAt: serverTimestamp(),
    readAt: null,
    readBy: "",
  });
  return reference;
}

function setAudit(transaction, {
  actorId,
  action,
  entityType,
  entityId,
  summary,
  details = {},
}) {
  const reference = doc(collection(db, "auditEvents"));
  transaction.set(reference, {
    actorId,
    action,
    entityType,
    entityId,
    summary,
    details,
    createdAt: serverTimestamp(),
  });
  return reference;
}

export function subscribeToLeagueHouses(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueHouses"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot).sort((a, b) => a.name.localeCompare(b.name))),
    onError,
  );
}

export function subscribeToLeadershipElections(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leadershipElections"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToPocketActivities(leagueId, userId, onUpdate, onError) {
  if (!leagueId || !userId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(
      collection(db, "pocketActivities"),
      where("leagueId", "==", leagueId),
      where("userId", "==", userId),
    ),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export async function createLeagueHouse({ leagueId, actorId, input }) {
  const validation = validateHouseInput(input);
  if (!leagueId || !actorId) throw new Error("A valid league administrator is required.");
  if (!validation.valid) throw new Error(validation.errors.join(" "));

  const reference = doc(collection(db, "leagueHouses"));
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "house.created",
    entityType: "league",
    entityId: leagueId,
    summary: `Created House: ${validation.value.name}`,
    details: { houseId: reference.id },
  });

  batch.set(reference, {
    leagueId,
    ...validation.value,
    status: "active",
    captainId: "",
    viceCaptainIds: [],
    lastElectionId: "",
    createdAt: serverTimestamp(),
    createdBy: actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    lastAuditId: auditReference.id,
  });
  await batch.commit();
  return reference.id;
}

export async function updateLeagueHouse({ house, actorId, input }) {
  const validation = validateHouseInput(input);
  if (!house?.id || !actorId) throw new Error("A valid House is required.");
  if (!validation.valid) throw new Error(validation.errors.join(" "));

  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "house.updated",
    entityType: "league",
    entityId: house.leagueId,
    summary: `Updated House: ${validation.value.name}`,
    details: { houseId: house.id },
  });
  batch.update(doc(db, "leagueHouses", house.id), {
    ...validation.value,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    lastAuditId: auditReference.id,
  });
  await batch.commit();
}

export async function activateChaos({ league, houses, memberships, actorId }) {
  if (!league?.id || !actorId) throw new Error("A valid league is required.");
  if (league.chaosStatus === "activated") throw new Error("C.H.A.O.S. has already assigned this season.");
  const eligible = memberships.filter((item) => item.status === "registered");
  if (eligible.length === 0) throw new Error("Register players before activating C.H.A.O.S.");
  if (houses.length !== Number(league.houseCount ?? houses.length)) {
    throw new Error(`Create all ${league.houseCount} Houses before activating C.H.A.O.S.`);
  }

  const seed = `${league.id}:${league.startDate?.toMillis?.() ?? league.startDate}:${eligible.length}:${houses.length}`;
  const assignments = distributePlayersWithChaos(eligible, houses, seed);
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "league.chaos-activated",
    entityType: "league",
    entityId: league.id,
    summary: `Activated C.H.A.O.S. for ${league.name}`,
    details: { players: assignments.length, houses: houses.length },
  });

  assignments.forEach((assignment) => {
    batch.update(doc(db, "leagueMemberships", assignment.membershipId), {
      currentHouseId: assignment.houseId,
      currentHouseName: assignment.houseName,
      currentHouseEmblemId: assignment.houseEmblemId,
      currentHouseAccentId: assignment.houseAccentId,
      houseAssignedAt: serverTimestamp(),
      houseAssignmentMethod: "chaos",
      updatedAt: serverTimestamp(),
    });
    if (supportsHouseMovementV1(league)) {
      const sourceId = `${league.id}_chaos`;
      const historyId = createHouseAssignmentHistoryId(sourceId, assignment.userId);
      batch.set(doc(db, "leagueHouseAssignmentHistory", historyId), {
        leagueId: league.id,
        userId: assignment.userId,
        displayName: assignment.displayName || "Champion",
        weekKey: "",
        fromHouseId: "",
        fromHouseName: "Unassigned",
        toHouseId: assignment.houseId,
        toHouseName: assignment.houseName,
        method: "chaos",
        sourceId,
        overrideApplied: false,
        overrideReason: "",
        createdAt: serverTimestamp(),
        createdBy: actorId,
        lastAuditId: auditReference.id,
      });
    }
    setNotification(batch, {
      userId: assignment.userId,
      type: PLAYER_NOTIFICATION_TYPES.CHAOS_ASSIGNMENT,
      title: "C.H.A.O.S. has chosen your House",
      message: `You have been assigned to ${assignment.houseName} for ${league.name}. Welcome to the unpredictable part.`,
      leagueId: league.id,
      houseId: assignment.houseId,
      actionPath: `/houses?league=${league.id}`,
    });
  });

  batch.update(doc(db, "leagues", league.id), {
    chaosStatus: "activated",
    chaosActivatedAt: serverTimestamp(),
    chaosActivatedBy: actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    lastAuditId: auditReference.id,
  });
  await batch.commit();
  return assignments;
}

export async function openLeadershipElection({
  league,
  house,
  members = [],
  actorId,
  referenceDate = new Date(),
}) {
  if (!league?.id || !house?.id || !actorId) throw new Error("A House and administrator are required.");
  if (league.status !== "active") throw new Error("Weekly House voting is available only during an active season.");
  const currentMembers = members.filter(
    (member) => member.status === "active" && member.currentHouseId === house.id,
  );
  if (currentMembers.length < 2) {
    throw new Error("A House needs at least two current members before leadership voting can open.");
  }

  const leagueId = league.id;
  const weekKey = getSeasonWeekKey(referenceDate);
  const electionId = createElectionId(leagueId, house.id, weekKey);
  const reference = doc(db, "leadershipElections", electionId);
  const existing = await getDoc(reference);
  if (existing.exists()) throw new Error("This House already has a leadership vote for the current week.");
  const window = getElectionWindow(referenceDate);
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "house.election-opened",
    entityType: "league",
    entityId: leagueId,
    summary: `Opened leadership voting for ${house.name}`,
    details: { houseId: house.id, weekKey },
  });
  batch.set(reference, {
    leagueId,
    houseId: house.id,
    houseName: house.name,
    weekKey,
    status: "open",
    openedAt: Timestamp.fromDate(window.openedAt),
    closesAt: Timestamp.fromDate(window.closesAt),
    finalizedAt: null,
    finalizedBy: "",
    captainId: "",
    viceCaptainId: "",
    resultStatus: "pending",
    voteCount: 0,
    lastAuditId: auditReference.id,
  });
  currentMembers.forEach((member) => {
    setNotification(batch, {
      userId: member.userId,
      type: PLAYER_NOTIFICATION_TYPES.LEADERSHIP_VOTE_OPEN,
      title: `${house.name} leadership voting is open`,
      message: "Your House has 24 hours to vote. The most-supported player becomes Captain and the runner-up becomes primary Vice-Captain.",
      leagueId,
      houseId: house.id,
      actionPath: `/houses?league=${leagueId}`,
    });
  });
  await batch.commit();
  return electionId;
}

export async function submitLeadershipVote({ election, voterId, candidateId, membership }) {
  if (!election?.id || !voterId || !candidateId) throw new Error("Choose a House member before submitting your vote.");
  if (membership?.currentHouseId !== election.houseId) throw new Error("You may vote only in your current House.");
  const closesAt = election.closesAt?.toDate?.() ?? new Date(election.closesAt);
  if (election.status !== "open" || closesAt <= new Date()) throw new Error("This leadership vote is closed.");
  const voteId = createVoteId(election.id, voterId);
  const reference = doc(db, "leadershipVotes", voteId);
  const existing = await getDoc(reference);
  if (existing.exists()) throw new Error("You have already voted in this week’s House election.");
  await setDoc(reference, {
    electionId: election.id,
    leagueId: election.leagueId,
    houseId: election.houseId,
    weekKey: election.weekKey,
    voterId,
    candidateId,
    createdAt: serverTimestamp(),
  });
}

export async function finalizeLeadershipElection({ election, house, members, actorId, captainId = "", viceCaptainId = "" }) {
  if (!election?.id || !house?.id || !actorId) throw new Error("A valid leadership election is required.");
  const closesAt = election.closesAt?.toDate?.() ?? new Date(election.closesAt);
  if (election.status !== "open" || !closesAt || closesAt > new Date()) {
    throw new Error("The full 24-hour voting window must close before leadership is finalised.");
  }
  const voteSnapshot = await getDocs(query(collection(db, "leadershipVotes"), where("electionId", "==", election.id)));
  const votes = mapSnapshot(voteSnapshot);
  const result = calculateLeadershipResult(votes, members);
  const selectedCaptain = captainId || result.captainId;
  const selectedVice = viceCaptainId || result.viceCaptainId;
  if (!selectedCaptain || !selectedVice || selectedCaptain === selectedVice) {
    throw new Error("Choose a captain and a different vice-captain to resolve this election.");
  }
  const memberIds = new Set(members.map((item) => item.userId));
  if (!memberIds.has(selectedCaptain) || !memberIds.has(selectedVice)) {
    throw new Error("Leadership must be assigned to current House members.");
  }

  const viceCaptainIds = [selectedVice].slice(0, HOUSE_VICE_CAPTAIN_LIMIT);
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "house.election-finalized",
    entityType: "league",
    entityId: election.leagueId,
    summary: `Finalized leadership for ${house.name}`,
    details: { houseId: house.id, captainId: selectedCaptain, viceCaptainId: selectedVice, resultStatus: result.status },
  });
  batch.update(doc(db, "leadershipElections", election.id), {
    status: "finalized",
    finalizedAt: serverTimestamp(),
    finalizedBy: actorId,
    captainId: selectedCaptain,
    viceCaptainId: selectedVice,
    resultStatus: result.status,
    voteCount: votes.length,
    lastAuditId: auditReference.id,
  });
  batch.update(doc(db, "leagueHouses", house.id), {
    captainId: selectedCaptain,
    viceCaptainIds,
    lastElectionId: election.id,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    lastAuditId: auditReference.id,
  });
  members.forEach((member) => {
    setNotification(batch, {
      userId: member.userId,
      type: PLAYER_NOTIFICATION_TYPES.LEADERSHIP_RESULT,
      title: `${house.name} leadership confirmed`,
      message: `This week’s captain and vice-captain have been confirmed. House leadership may now manage the weekly roster move.`,
      leagueId: election.leagueId,
      houseId: house.id,
      actionPath: `/houses?league=${election.leagueId}`,
    });
  });
  await batch.commit();
  return { ...result, captainId: selectedCaptain, viceCaptainId: selectedVice };
}

export async function setAdditionalViceCaptain({ house, actorId, userId }) {
  if (!house?.id || !actorId || !userId) throw new Error("Choose a current House member.");
  if (house.captainId !== actorId) throw new Error("Only the current captain may appoint an additional vice-captain.");
  if (userId === house.captainId) throw new Error("The captain cannot also be a vice-captain.");
  const primary = house.viceCaptainIds?.[0] || "";
  const viceCaptainIds = [primary, userId].filter(Boolean).filter((id, index, all) => all.indexOf(id) === index).slice(0, HOUSE_VICE_CAPTAIN_LIMIT);
  await runTransaction(db, async (transaction) => {
    const reference = doc(db, "leagueHouses", house.id);
    transaction.update(reference, {
      viceCaptainIds,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
    });
  });
}

export async function swapHousePlayers({
  league,
  firstHouse,
  secondHouse,
  firstPlayer,
  secondPlayer,
  actorId,
  allowRestOverride = false,
  overrideReason = "",
}) {
  if (!league?.id || !firstHouse?.id || !secondHouse?.id || !firstPlayer?.id || !secondPlayer?.id || !actorId) {
    throw new Error("Choose two Houses and one eligible player from each House.");
  }
  if (firstHouse.id === secondHouse.id) throw new Error("Choose two different Houses.");
  const leaders = new Set([
    firstHouse.captainId,
    ...(firstHouse.viceCaptainIds ?? []),
    secondHouse.captainId,
    ...(secondHouse.viceCaptainIds ?? []),
  ]);
  const protectedPlayers = new Set(leaders);
  if (protectedPlayers.has(firstPlayer.userId) || protectedPlayers.has(secondPlayer.userId)) {
    throw new Error("Reassign House leadership before moving a captain or vice-captain.");
  }
  const weekKey = getSeasonWeekKey(new Date());
  const swapId = createRosterSwapId(league.id, [firstHouse.id, secondHouse.id], weekKey);
  const movementV1 = supportsHouseMovementV1(league);
  const restWindow = movementV1 ? getRosterRestWindow(weekKey) : null;
  const cleanedOverrideReason = String(overrideReason ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 500);

  await runTransaction(db, async (transaction) => {
    const swapReference = doc(db, "leagueRosterSwaps", swapId);
    const firstLockReference = doc(db, "leagueRosterLocks", `${league.id}_${firstHouse.id}_${weekKey}`);
    const secondLockReference = doc(db, "leagueRosterLocks", `${league.id}_${secondHouse.id}_${weekKey}`);
    const firstMembershipReference = doc(db, "leagueMemberships", firstPlayer.id);
    const secondMembershipReference = doc(db, "leagueMemberships", secondPlayer.id);
    const [swapSnapshot, firstLockSnapshot, secondLockSnapshot, firstSnapshot, secondSnapshot] = await Promise.all([
      transaction.get(swapReference),
      transaction.get(firstLockReference),
      transaction.get(secondLockReference),
      transaction.get(firstMembershipReference),
      transaction.get(secondMembershipReference),
    ]);
    if (swapSnapshot.exists() || firstLockSnapshot.exists() || secondLockSnapshot.exists()) {
      throw new Error("One of these Houses has already completed its roster move this week.");
    }
    if (!firstSnapshot.exists() || !secondSnapshot.exists()) throw new Error("One of the selected players is no longer registered.");
    if (firstSnapshot.data().currentHouseId !== firstHouse.id || secondSnapshot.data().currentHouseId !== secondHouse.id) {
      throw new Error("The House roster changed before this swap could be completed.");
    }
    const firstLive = { id: firstSnapshot.id, ...firstSnapshot.data() };
    const secondLive = { id: secondSnapshot.id, ...secondSnapshot.data() };
    const overriddenPlayerIds = [];
    if (movementV1) {
      const movedThisWeek = [firstLive, secondLive].find(
        (membership) => membership.lastRosterWeekKey === weekKey,
      );
      if (movedThisWeek) {
        throw new Error("A player who already moved this week cannot move again, even through an administrator correction.");
      }

      for (const membership of [firstLive, secondLive]) {
        const resting = Boolean(
          membership.rosterLockThroughWeekKey
            && weekKey <= membership.rosterLockThroughWeekKey,
        );
        if (resting) overriddenPlayerIds.push(membership.userId);
      }

      if (overriddenPlayerIds.length > 0) {
        if (!allowRestOverride) {
          const restingMembership = overriddenPlayerIds.includes(firstLive.userId) ? firstLive : secondLive;
          const eligibleWeek = restingMembership.rosterEligibleWeekKey;
          throw new Error(eligibleWeek
            ? `This player is resting after a House move and is eligible again in the week beginning ${eligibleWeek}.`
            : "This player is still inside the one-week post-move rest period.");
        }
        if (cleanedOverrideReason.length < 12) {
          throw new Error("A Platform Administrator correction requires a factual reason of at least 12 characters.");
        }
      }
    }
    const overrideApplied = overriddenPlayerIds.length > 0;
    const firstHistoryId = movementV1
      ? createHouseAssignmentHistoryId(swapId, firstLive.userId)
      : "";
    const secondHistoryId = movementV1
      ? createHouseAssignmentHistoryId(swapId, secondLive.userId)
      : "";

    const auditReference = setAudit(transaction, {
      actorId,
      action: overrideApplied ? "house.roster-rest-overridden" : "house.roster-swapped",
      entityType: "league",
      entityId: league.id,
      summary: overrideApplied
        ? `Corrected a post-move rest restriction between ${firstHouse.name} and ${secondHouse.name}`
        : `Swapped players between ${firstHouse.name} and ${secondHouse.name}`,
      details: {
        firstPlayerId: firstLive.userId,
        secondPlayerId: secondLive.userId,
        weekKey,
        overrideApplied,
        overrideReason: overrideApplied ? cleanedOverrideReason : "",
        overriddenPlayerIds,
      },
    });
    transaction.set(firstLockReference, {
      leagueId: league.id,
      houseId: firstHouse.id,
      weekKey,
      swapId,
      createdAt: serverTimestamp(),
      createdBy: actorId,
    });
    transaction.set(secondLockReference, {
      leagueId: league.id,
      houseId: secondHouse.id,
      weekKey,
      swapId,
      createdAt: serverTimestamp(),
      createdBy: actorId,
    });
    const swapData = {
      leagueId: league.id,
      weekKey,
      firstHouseId: firstHouse.id,
      firstHouseName: firstHouse.name,
      secondHouseId: secondHouse.id,
      secondHouseName: secondHouse.name,
      firstPlayerId: firstLive.userId,
      secondPlayerId: secondLive.userId,
      actorId,
      createdAt: serverTimestamp(),
      lastAuditId: auditReference.id,
    };
    if (movementV1) {
      Object.assign(swapData, {
        rulesVersion: league.rulesVersion,
        lockThroughWeekKey: restWindow.lockThroughWeekKey,
        eligibleWeekKey: restWindow.eligibleWeekKey,
        overrideApplied,
        overrideReason: overrideApplied ? cleanedOverrideReason : "",
        overriddenPlayerIds,
      });
    }
    transaction.set(swapReference, swapData);

    const sharedMembershipUpdate = {
      houseAssignedAt: serverTimestamp(),
      houseAssignmentMethod: "weekly-swap",
      lastRosterSwapId: swapId,
      lastRosterWeekKey: weekKey,
      updatedAt: serverTimestamp(),
    };
    if (movementV1) {
      Object.assign(sharedMembershipUpdate, {
        rosterLockThroughWeekKey: restWindow.lockThroughWeekKey,
        rosterEligibleWeekKey: restWindow.eligibleWeekKey,
      });
    }

    transaction.update(firstMembershipReference, {
      currentHouseId: secondHouse.id,
      currentHouseName: secondHouse.name,
      currentHouseEmblemId: secondHouse.emblemId,
      currentHouseAccentId: secondHouse.accentId,
      ...sharedMembershipUpdate,
    });
    transaction.update(secondMembershipReference, {
      currentHouseId: firstHouse.id,
      currentHouseName: firstHouse.name,
      currentHouseEmblemId: firstHouse.emblemId,
      currentHouseAccentId: firstHouse.accentId,
      ...sharedMembershipUpdate,
    });

    if (movementV1) {
      transaction.set(doc(db, "leagueHouseAssignmentHistory", firstHistoryId), {
        leagueId: league.id,
        userId: firstLive.userId,
        displayName: firstLive.displayName || "Champion",
        weekKey,
        fromHouseId: firstHouse.id,
        fromHouseName: firstHouse.name,
        toHouseId: secondHouse.id,
        toHouseName: secondHouse.name,
        method: "weekly-swap",
        sourceId: swapId,
        overrideApplied: overriddenPlayerIds.includes(firstLive.userId),
        overrideReason: overriddenPlayerIds.includes(firstLive.userId) ? cleanedOverrideReason : "",
        createdAt: serverTimestamp(),
        createdBy: actorId,
        lastAuditId: auditReference.id,
      });
      transaction.set(doc(db, "leagueHouseAssignmentHistory", secondHistoryId), {
        leagueId: league.id,
        userId: secondLive.userId,
        displayName: secondLive.displayName || "Champion",
        weekKey,
        fromHouseId: secondHouse.id,
        fromHouseName: secondHouse.name,
        toHouseId: firstHouse.id,
        toHouseName: firstHouse.name,
        method: "weekly-swap",
        sourceId: swapId,
        overrideApplied: overriddenPlayerIds.includes(secondLive.userId),
        overrideReason: overriddenPlayerIds.includes(secondLive.userId) ? cleanedOverrideReason : "",
        createdAt: serverTimestamp(),
        createdBy: actorId,
        lastAuditId: auditReference.id,
      });
    }

    setNotification(transaction, {
      userId: firstLive.userId,
      type: PLAYER_NOTIFICATION_TYPES.ROSTER_SWAP,
      title: overriddenPlayerIds.includes(firstLive.userId)
        ? "Your House assignment was corrected"
        : "Your House has changed",
      message: `You are now part of ${secondHouse.name}. Points already earned for ${firstHouse.name} remain with that House.`,
      leagueId: league.id,
      houseId: secondHouse.id,
      actionPath: `/houses?league=${league.id}`,
    });
    setNotification(transaction, {
      userId: secondLive.userId,
      type: PLAYER_NOTIFICATION_TYPES.ROSTER_SWAP,
      title: overriddenPlayerIds.includes(secondLive.userId)
        ? "Your House assignment was corrected"
        : "Your House has changed",
      message: `You are now part of ${firstHouse.name}. Points already earned for ${secondHouse.name} remain with that House.`,
      leagueId: league.id,
      houseId: firstHouse.id,
      actionPath: `/houses?league=${league.id}`,
    });
  });
}

export async function storePocketActivity({ league, membership, userId, category, data, activityDate }) {
  if (!league?.id || !userId) throw new Error("Join a season before storing Pocket activities.");
  if (membership?.leagueId !== league.id || membership?.userId !== userId || membership?.status !== "registered") {
    throw new Error("A valid season registration is required during Pocket Week.");
  }
  if (!league.pocketEnabled || !isDateWithinWindow(activityDate, league.pocketStartDate, league.pocketEndDate)) {
    throw new Error("Pocket activities may only be stored during this season’s seven-day Pocket Week.");
  }
  const categoryConfig = CATEGORY_MAP.get(category);
  const pocketConfig = POCKET_CATEGORY_CONFIG[category];
  if (!categoryConfig || !pocketConfig) throw new Error("That category cannot be stored in Pocket Week.");
  const normalizedData = normalizeEntry(category, data);
  const errors = validateEntry(categoryConfig, normalizedData);
  if (errors.length > 0) throw new Error(errors.join(" "));
  const quantity = getPocketQuantity(category, normalizedData);
  if (quantity <= 0) throw new Error("This activity does not contain a usable Pocket amount.");

  const reference = doc(collection(db, "pocketActivities"));
  await setDoc(reference, {
    leagueId: league.id,
    userId,
    category,
    data: normalizedData,
    mode: pocketConfig.mode,
    unit: pocketConfig.unit,
    originalQuantity: quantity,
    remainingQuantity: quantity,
    activityDate: Timestamp.fromDate(normalizeChallengeDate(activityDate)),
    status: "available",
    lastRedemptionId: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

export async function redeemPocketActivity({ league, pocket, userId, quantity, targetDate }) {
  if (!league?.id || !pocket?.id || !userId) {
    throw new Error("Choose a valid Pocket activity before redeeming it.");
  }

  const challengeDate = normalizeChallengeDate(targetDate);
  if (!challengeDate) {
    throw new Error("Choose a valid season day for this Pocket activity.");
  }

  return runTransaction(db, async (transaction) => {
    const leagueReference = doc(db, "leagues", league.id);
    const membershipReference = doc(db, "leagueMemberships", `${league.id}_${userId}`);
    const pocketReference = doc(db, "pocketActivities", pocket.id);

    const leagueSnapshot = await transaction.get(leagueReference);
    const membershipSnapshot = await transaction.get(membershipReference);
    const pocketSnapshot = await transaction.get(pocketReference);

    if (!leagueSnapshot.exists()) {
      throw new Error("This season is no longer available.");
    }
    if (!membershipSnapshot.exists()) {
      throw new Error("Your active season membership could not be found.");
    }
    if (!pocketSnapshot.exists()) {
      throw new Error("This Pocket activity is no longer available.");
    }

    const liveLeague = { id: leagueSnapshot.id, ...leagueSnapshot.data() };
    const liveMembership = { id: membershipSnapshot.id, ...membershipSnapshot.data() };
    const livePocket = { id: pocketSnapshot.id, ...pocketSnapshot.data() };

    if (
      liveMembership.leagueId !== liveLeague.id
      || liveMembership.userId !== userId
      || liveMembership.status !== "active"
    ) {
      throw new Error("An active season membership is required to redeem Pocket activities.");
    }
    if (livePocket.leagueId !== liveLeague.id || livePocket.userId !== userId) {
      throw new Error("This Pocket activity does not belong to your current season account.");
    }

    const requested = normalizePocketRedemptionQuantity(livePocket.category, quantity);
    const validation = validatePocketRedemption({
      pocket: livePocket,
      quantity: requested,
      targetDate: challengeDate,
      league: liveLeague,
    });
    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    if (!liveLeague.ruleset?.includedCategories?.includes(livePocket.category)) {
      throw new Error("This category is not included in the active season.");
    }

    if (
      String(liveLeague.rulesVersion || "").startsWith("season-houses-v2")
      && ["running", "steps"].includes(livePocket.category)
    ) {
      throw new Error(
        "Running and Steps Pocket redemptions are temporarily unavailable in evidence-enabled seasons because proof must be linked to the original activity. Other Pocket categories remain available.",
      );
    }

    const categoryConfig = CATEGORY_MAP.get(livePocket.category);
    if (!categoryConfig) {
      throw new Error("This Pocket category is no longer supported.");
    }

    const data = createPocketRedemptionData(
      livePocket.category,
      livePocket.data,
      requested,
    );
    const errors = validateEntry(categoryConfig, data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const liveRemaining = Number(livePocket.remainingQuantity ?? 0);
    if (liveRemaining < requested || liveRemaining <= 0) {
      throw new Error("That Pocket amount has already been used.");
    }

    const entryReference = doc(collection(db, "challengeEntries"));
    const redemptionReference = doc(collection(db, "pocketRedemptions"));
    const entry = {
      id: entryReference.id,
      userId,
      category: livePocket.category,
      data,
      challengeDate,
    };
    const activityPoints = calculateEntryPoints(entry);
    const remainingQuantity = Math.max(
      0,
      Math.round((liveRemaining - requested) * 1_000_000) / 1_000_000,
    );

    transaction.set(entryReference, {
      userId,
      category: livePocket.category,
      data,
      source: "pocket",
      sourceLeagueId: liveLeague.id,
      sourcePocketId: livePocket.id,
      sourceRedemptionId: redemptionReference.id,
      sourceCorrectionId: "",
      replacesEntryId: "",
      correctionRootEntryId: "",
      correctionSequence: 0,
      evidenceClaimIds: [],
      createdAt: serverTimestamp(),
      challengeDate: Timestamp.fromDate(challengeDate),
    });
    transaction.set(doc(db, "leagueContributions", `${liveLeague.id}_${entryReference.id}`), {
      leagueId: liveLeague.id,
      entryId: entryReference.id,
      userId,
      displayName: liveMembership.displayName || "Champion",
      avatarId: liveMembership.avatarId || DEFAULT_AVATAR_ID,
      houseId: liveMembership.currentHouseId || "",
      houseName: liveMembership.currentHouseName || "Unassigned",
      houseEmblemId: liveMembership.currentHouseEmblemId || "springbok",
      teamId: liveMembership.currentHouseId || "",
      teamName: liveMembership.currentHouseName || "Unassigned",
      category: livePocket.category,
      scoreCategory: livePocket.category,
      pointGroup: "activity",
      challengeDate: Timestamp.fromDate(challengeDate),
      activityPoints: Math.max(0, Math.round(activityPoints * 100) / 100),
      rulesVersion: liveLeague.rulesVersion,
      source: "pocket",
      sourceRedemptionId: redemptionReference.id,
      evidenceClaimId: "",
      evidenceDecisionId: "",
      createdAt: serverTimestamp(),
    });
    transaction.update(pocketReference, {
      remainingQuantity,
      status: remainingQuantity <= 0 ? "empty" : "available",
      lastRedemptionId: redemptionReference.id,
      updatedAt: serverTimestamp(),
    });
    transaction.set(redemptionReference, {
      leagueId: liveLeague.id,
      userId,
      pocketActivityId: livePocket.id,
      challengeEntryId: entryReference.id,
      category: livePocket.category,
      quantity: requested,
      unit: livePocket.unit,
      targetDate: Timestamp.fromDate(challengeDate),
      houseId: liveMembership.currentHouseId || "",
      createdAt: serverTimestamp(),
    });
    setNotification(transaction, {
      userId,
      type: PLAYER_NOTIFICATION_TYPES.POCKET_REDEEMED,
      title: "Pocket activity activated",
      message: `${requested} ${livePocket.unit} has been added to your selected season day.`,
      leagueId: liveLeague.id,
      houseId: liveMembership.currentHouseId || "",
      actionPath: "/log",
    });
    return entryReference.id;
  });
}
