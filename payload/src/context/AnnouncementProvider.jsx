import { useCallback, useMemo, useState } from "react";

import useAuth from "../hooks/useAuth";
import {
  getAnnouncementTypes,
  getAnnouncements,
  getUnreadAnnouncements,
} from "../services/announcements/announcementService";
import { AnnouncementContext } from "./AnnouncementContext";

const STORAGE_PREFIX = "championsLegacyChallenge.readAnnouncements";

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}.${userId || "anonymous"}`;
}

function readStoredIds(userId) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = JSON.parse(window.localStorage.getItem(getStorageKey(userId)) || "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStoredIds(userId, ids) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(ids));
  } catch {
    // Read status is a convenience feature. The app should still work if storage is blocked.
  }
}

export function AnnouncementProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || "anonymous";
  const announcements = useMemo(() => getAnnouncements(), []);
  const [state, setState] = useState(() => ({
    ownerId: userId,
    readIds: readStoredIds(userId),
  }));

  const readIds = state.ownerId === userId ? state.readIds : readStoredIds(userId);

  const commitReadIds = useCallback(
    (nextIds) => {
      const uniqueIds = [...new Set(nextIds)];
      writeStoredIds(userId, uniqueIds);
      setState({ ownerId: userId, readIds: uniqueIds });
    },
    [userId],
  );

  const markRead = useCallback(
    (announcementId) => {
      if (!announcementId || readIds.includes(announcementId)) {
        return;
      }

      commitReadIds([...readIds, announcementId]);
    },
    [commitReadIds, readIds],
  );

  const markUnread = useCallback(
    (announcementId) => {
      commitReadIds(readIds.filter((id) => id !== announcementId));
    },
    [commitReadIds, readIds],
  );

  const markAllRead = useCallback(() => {
    commitReadIds(announcements.map((announcement) => announcement.id));
  }, [announcements, commitReadIds]);

  const unreadAnnouncements = useMemo(
    () => getUnreadAnnouncements(announcements, readIds),
    [announcements, readIds],
  );

  const value = useMemo(
    () => ({
      announcements,
      types: getAnnouncementTypes(announcements),
      readIds,
      unreadAnnouncements,
      unreadCount: unreadAnnouncements.length,
      isRead: (announcementId) => readIds.includes(announcementId),
      markRead,
      markUnread,
      markAllRead,
    }),
    [
      announcements,
      markAllRead,
      markRead,
      markUnread,
      readIds,
      unreadAnnouncements,
    ],
  );

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}
