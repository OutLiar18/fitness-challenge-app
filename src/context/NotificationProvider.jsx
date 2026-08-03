import { useCallback, useEffect, useMemo, useState } from "react";

import useAuth from "../hooks/useAuth";
import {
  markAllPlayerNotificationsRead,
  markPlayerNotificationRead,
  subscribeToPlayerNotifications,
} from "../services/notifications/notificationService";
import { getUnreadNotifications } from "../services/notifications/notificationModel";
import { NotificationContext } from "./NotificationContext";

const EMPTY_ITEMS = Object.freeze([]);

function createNotificationState() {
  return {
    ownerId: "",
    items: [],
    error: "",
  };
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || "";
  const [state, setState] = useState(createNotificationState);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    return subscribeToPlayerNotifications(
      userId,
      (nextItems) => {
        setState({
          ownerId: userId,
          items: nextItems,
          error: "",
        });
      },
      (subscriptionError) => {
        console.error(subscriptionError);
        setState({
          ownerId: userId,
          items: [],
          error: "Personal season notifications could not be refreshed.",
        });
      },
    );
  }, [userId]);

  const items = state.ownerId === userId ? state.items : EMPTY_ITEMS;
  const error = state.ownerId === userId ? state.error : "";

  const markRead = useCallback(
    (notificationId) => markPlayerNotificationRead(notificationId, userId),
    [userId],
  );

  const markAllRead = useCallback(
    () => markAllPlayerNotificationsRead(items, userId),
    [items, userId],
  );

  const unreadItems = useMemo(() => getUnreadNotifications(items), [items]);
  const value = useMemo(
    () => ({
      items,
      unreadItems,
      unreadCount: unreadItems.length,
      error,
      markRead,
      markAllRead,
    }),
    [error, items, markAllRead, markRead, unreadItems],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
