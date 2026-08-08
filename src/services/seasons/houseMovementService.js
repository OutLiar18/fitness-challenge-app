import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import {
  buildHouseBalanceCalculation,
  createCompositionProfile,
  supportsHouseMovementV1,
} from "./houseMovementModel";
import { getSeasonWeekKey } from "./seasonModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function subscribeToHouseAssignmentHistory(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }

  return onSnapshot(
    query(
      collection(db, "leagueHouseAssignmentHistory"),
      where("leagueId", "==", leagueId),
    ),
    (snapshot) => onUpdate?.(
      mapSnapshot(snapshot).sort((first, second) => {
        const firstTime = first.createdAt?.toMillis?.() ?? 0;
        const secondTime = second.createdAt?.toMillis?.() ?? 0;
        return secondTime - firstTime;
      }),
    ),
    onError,
  );
}


export function subscribeToCompositionProfile(leagueId, userId, onUpdate, onError) {
  if (!leagueId || !userId) {
    onUpdate?.(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, "leagueCompositionProfiles", `${leagueId}_${userId}`),
    (snapshot) => onUpdate?.(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null),
    onError,
  );
}

export function subscribeToLeagueCompositionProfiles(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueCompositionProfiles"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}


export function subscribeToHouseBalanceWeeks(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueHouseBalanceWeeks"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(
      mapSnapshot(snapshot).sort((first, second) => second.weekKey.localeCompare(first.weekKey)),
    ),
    onError,
  );
}

export function subscribeToHouseBalanceHouseWeeks(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueHouseBalanceHouseWeeks"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToPrivateHouseBalanceWeeks(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueHouseBalancePrivateWeeks"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(
      mapSnapshot(snapshot).sort((first, second) => second.weekKey.localeCompare(first.weekKey)),
    ),
    onError,
  );
}

export function subscribeToPrivateHouseBalanceHouseWeeks(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueHouseBalancePrivateHouseWeeks"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export async function saveCompositionProfile({ league, userId, value }) {
  if (!supportsHouseMovementV1(league)) {
    throw new Error("Private composition responses are available only for v4 seasons.");
  }
  const profile = createCompositionProfile({ leagueId: league.id, userId, value });
  const reference = doc(db, "leagueCompositionProfiles", `${league.id}_${userId}`);
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(reference);
    transaction.set(reference, {
      ...profile,
      createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function clearCompositionProfile({ leagueId, userId }) {
  if (!leagueId || !userId) return;
  await deleteDoc(doc(db, "leagueCompositionProfiles", `${leagueId}_${userId}`));
}

export async function calculateWeeklyHouseBalance({
  league,
  houses,
  memberships,
  profiles,
  actorId,
  referenceDate = new Date(),
}) {
  if (!supportsHouseMovementV1(league)) {
    throw new Error("Weekly House balance calculations require a v4 season.");
  }
  if (league.status !== "active") {
    throw new Error("Weekly House balance is calculated only during an active season.");
  }
  if (!actorId) throw new Error("An authorised season administrator is required.");
  if (houses.length < 2 || houses.length > 8) {
    throw new Error("Weekly House balance requires between two and eight Houses.");
  }

  const weekKey = getSeasonWeekKey(referenceDate);
  const resultId = `${league.id}_${weekKey}`;
  const publicReference = doc(db, "leagueHouseBalanceWeeks", resultId);
  const privateReference = doc(db, "leagueHouseBalancePrivateWeeks", resultId);
  const { publicResult, privateResult } = buildHouseBalanceCalculation({
    league,
    houses,
    memberships,
    profiles,
    weekKey,
  });

  return runTransaction(db, async (transaction) => {
    const [publicSnapshot, privateSnapshot] = await Promise.all([
      transaction.get(publicReference),
      transaction.get(privateReference),
    ]);
    if (publicSnapshot.exists() || privateSnapshot.exists()) {
      throw new Error("This week’s House balance snapshot has already been preserved.");
    }

    const auditReference = addAuditWrite(transaction, {
      actorId,
      action: "house.balance-calculated",
      entityType: "league",
      entityId: league.id,
      summary: `Calculated weekly House balance for ${league.name}`,
      details: {
        weekKey,
        houseCount: publicResult.houseCount,
        balanceStatus: publicResult.balanceStatus,
        scoringEnabled: false,
      },
    });
    const createdAt = serverTimestamp();
    const privateShared = {
      createdAt,
      createdBy: actorId,
      lastAuditId: auditReference.id,
    };

    transaction.set(privateReference, {
      ...Object.fromEntries(Object.entries(privateResult).filter(([key]) => key !== "houses")),
      publicResultId: resultId,
      ...privateShared,
    });
    transaction.set(publicReference, {
      ...Object.fromEntries(Object.entries(publicResult).filter(([key]) => key !== "houses")),
      privateResultId: resultId,
      createdAt,
    });

    privateResult.houses.forEach((house) => {
      const rowId = `${resultId}_${house.houseId}`;
      transaction.set(doc(db, "leagueHouseBalancePrivateHouseWeeks", rowId), {
        ...house,
        leagueId: league.id,
        weekKey,
        resultId,
        ...privateShared,
      });
    });
    publicResult.houses.forEach((house) => {
      const rowId = `${resultId}_${house.houseId}`;
      transaction.set(doc(db, "leagueHouseBalanceHouseWeeks", rowId), {
        ...house,
        leagueId: league.id,
        weekKey,
        resultId,
        createdAt,
      });
    });

    return { id: resultId, ...publicResult };
  });
}

