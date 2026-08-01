import { useCallback, useEffect, useMemo, useState } from "react";

import useAuth from "../hooks/useAuth";
import {
  getAnnouncementTypes,
  getBundledAnnouncements,
  getUnreadAnnouncements,
  markAllAnnouncementsRead,
  markAnnouncementRead,
  markAnnouncementUnread,
  migrateLegacyAnnouncementReads,
  subscribeToAnnouncementReads,
  subscribeToPublishedAnnouncements,
} from "../services/announcements/announcementService";
import { AnnouncementContext } from "./AnnouncementContext";

export function AnnouncementProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid ?? "";
  const [announcements, setAnnouncements] = useState(() =>
    getBundledAnnouncements(),
  );
  const [readIds, setReadIds] = useState([]);
  const [announcementError, setAnnouncementError] = useState("");
  const [readError, setReadError] = useState("");

  useEffect(() => {
    const unsubscribeAnnouncements = subscribeToPublishedAnnouncements(
      (nextAnnouncements) => {
        setAnnouncements(nextAnnouncements);
        setAnnouncementError("");
      },
      (error) => {
        console.error(error);
        setAnnouncementError(
          "Live announcements could not be refreshed. Bundled release notes are still available.",
        );
      },
    );

    const unsubscribeReads = subscribeToAnnouncementReads(
      userId,
      (nextReadIds) => {
        setReadIds(nextReadIds);
        setReadError("");
      },
      (error) => {
        console.error(error);
        setReadError("Announcement read status could not be synchronised.");
      },
    );

    migrateLegacyAnnouncementReads(userId).catch((error) => {
      console.error(error);
      setReadError(
        "Older announcement read status could not be migrated. You can continue normally.",
      );
    });

    return () => {
      unsubscribeAnnouncements();
      unsubscribeReads();
    };
  }, [userId]);

  const markRead = useCallback(
    async (announcementId) => {
      await markAnnouncementRead(userId, announcementId);
    },
    [userId],
  );

  const markUnread = useCallback(
    async (announcementId) => {
      await markAnnouncementUnread(userId, announcementId);
    },
    [userId],
  );

  const markAllRead = useCallback(async () => {
    await markAllAnnouncementsRead(
      userId,
      announcements.map((announcement) => announcement.id),
    );
  }, [announcements, userId]);

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
      error: [announcementError, readError].filter(Boolean).join(" "),
      isRead: (announcementId) => readIds.includes(announcementId),
      markRead,
      markUnread,
      markAllRead,
    }),
    [
      announcementError,
      announcements,
      markAllRead,
      markRead,
      markUnread,
      readError,
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
