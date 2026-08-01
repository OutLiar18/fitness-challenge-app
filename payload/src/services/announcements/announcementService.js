import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { ANNOUNCEMENTS as BUNDLED_ANNOUNCEMENTS } from "../../constants/announcements";
import { db } from "../../firebase";
import {
  mergeAnnouncements,
  normalizeAnnouncement,
  sortAnnouncementsNewestFirst,
} from "./announcementModel";

export {
  filterAnnouncements,
  getAnnouncementTypes,
  getUnreadAnnouncements,
} from "./announcementModel";

const LEGACY_STORAGE_PREFIX = "championsLegacyChallenge.readAnnouncements";

function getLegacyStorageKey(userId) {
  return `${LEGACY_STORAGE_PREFIX}.${userId}`;
}

function readLegacyStoredIds(userId) {
  if (typeof window === "undefined" || !userId) {
    return [];
  }

  try {
    const value = JSON.parse(
      window.localStorage.getItem(getLegacyStorageKey(userId)) || "[]",
    );

    return Array.isArray(value)
      ? value.filter((item) => typeof item === "string" && item.trim())
      : [];
  } catch {
    return [];
  }
}

export function getBundledAnnouncements() {
  return sortAnnouncementsNewestFirst(
    BUNDLED_ANNOUNCEMENTS.map((announcement) =>
      normalizeAnnouncement({
        ...announcement,
        status: "published",
        publishedAt: announcement.publishedAt,
        source: "bundled",
      }),
    ),
  );
}

export function subscribeToPublishedAnnouncements(onUpdate, onError) {
  const announcementsQuery = query(
    collection(db, "announcements"),
    where("status", "==", "published"),
  );

  return onSnapshot(
    announcementsQuery,
    (snapshot) => {
      const liveAnnouncements = snapshot.docs.map((announcementDocument) => ({
        id: announcementDocument.id,
        ...announcementDocument.data(),
      }));

      onUpdate?.(
        mergeAnnouncements(liveAnnouncements, getBundledAnnouncements()),
      );
    },
    onError,
  );
}

export function subscribeToAnnouncementReads(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "users", userId, "announcementReads"),
    (snapshot) => {
      onUpdate?.(snapshot.docs.map((readDocument) => readDocument.id));
    },
    onError,
  );
}

export async function markAnnouncementRead(userId, announcementId) {
  if (!userId || !announcementId) {
    return;
  }

  await setDoc(doc(db, "users", userId, "announcementReads", announcementId), {
    announcementId,
    readAt: serverTimestamp(),
  });
}

export async function markAnnouncementUnread(userId, announcementId) {
  if (!userId || !announcementId) {
    return;
  }

  await deleteDoc(
    doc(db, "users", userId, "announcementReads", announcementId),
  );
}

export async function markAllAnnouncementsRead(
  userId,
  announcementIds = [],
) {
  if (!userId || announcementIds.length === 0) {
    return;
  }

  const uniqueIds = [...new Set(announcementIds)].filter(Boolean);
  const maximumWritesPerBatch = 450;

  for (let index = 0; index < uniqueIds.length; index += maximumWritesPerBatch) {
    const batch = writeBatch(db);
    const batchIds = uniqueIds.slice(index, index + maximumWritesPerBatch);

    batchIds.forEach((announcementId) => {
      batch.set(
        doc(db, "users", userId, "announcementReads", announcementId),
        {
          announcementId,
          readAt: serverTimestamp(),
        },
      );
    });

    await batch.commit();
  }
}

export async function migrateLegacyAnnouncementReads(userId) {
  const legacyIds = readLegacyStoredIds(userId);

  if (!userId || legacyIds.length === 0) {
    return;
  }

  await markAllAnnouncementsRead(userId, legacyIds);

  try {
    window.localStorage.removeItem(getLegacyStorageKey(userId));
  } catch {
    // Cross-device Firestore state is authoritative. Local cleanup is optional.
  }
}
