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
import {
  createCompositionProfile,
  supportsHouseMovementV1,
} from "./houseMovementModel";

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
