import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import {
  getUnreadNotifications,
  sortNotificationsNewestFirst,
} from "./notificationModel";


export function createPlayerNotificationWrite(batchOrTransaction, {
  userId,
  type,
  title,
  message,
  leagueId,
  houseId = "",
  actionPath = "/inbox",
  evidenceClaimId = "",
}) {
  const reference = doc(collection(db, "playerNotifications"));
  batchOrTransaction.set(reference, {
    userId,
    type,
    title,
    message,
    leagueId,
    houseId,
    actionPath,
    ...(evidenceClaimId ? { evidenceClaimId } : {}),
    createdAt: serverTimestamp(),
    readAt: null,
    readBy: "",
  });
  return reference;
}

export function subscribeToPlayerNotifications(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }

  return onSnapshot(
    query(collection(db, "playerNotifications"), where("userId", "==", userId)),
    (snapshot) => {
      onUpdate?.(
        sortNotificationsNewestFirst(
          snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        ),
      );
    },
    onError,
  );
}

export async function markPlayerNotificationRead(notificationId, userId) {
  if (!notificationId || !userId) return;
  await updateDoc(doc(db, "playerNotifications", notificationId), {
    readAt: serverTimestamp(),
    readBy: userId,
  });
}

export async function markAllPlayerNotificationsRead(items = [], userId) {
  const unread = getUnreadNotifications(items).filter((item) => item.userId === userId);
  if (!userId || unread.length === 0) return;
  const batch = writeBatch(db);
  unread.slice(0, 450).forEach((item) => {
    batch.update(doc(db, "playerNotifications", item.id), {
      readAt: serverTimestamp(),
      readBy: userId,
    });
  });
  await batch.commit();
}
