import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";

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
