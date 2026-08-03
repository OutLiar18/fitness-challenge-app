import { useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import useNotifications from "../hooks/useNotifications";
import { toDate } from "../services/dateService";
import { pluralize } from "../utils/displayFormatters";
import "./Notifications.css";

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatTime(value) {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "Just now";
}

export default function Notifications() {
  const { items, unreadCount, error, markRead, markAllRead } = useNotifications();
  const [workingId, setWorkingId] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [actionError, setActionError] = useState("");

  async function handleMarkRead(notificationId) {
    if (!notificationId || workingId) return;
    setWorkingId(notificationId);
    setActionError("");

    try {
      await markRead(notificationId);
    } catch (readError) {
      console.error(readError);
      setActionError(
        readError.message || "That notification could not be marked as read.",
      );
    } finally {
      setWorkingId("");
    }
  }

  async function handleMarkAllRead() {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    setActionError("");

    try {
      await markAllRead();
    } catch (readError) {
      console.error(readError);
      setActionError(
        readError.message || "Your notifications could not all be marked as read.",
      );
    } finally {
      setMarkingAll(false);
    }
  }

  function markRelatedNotification(notificationId) {
    void handleMarkRead(notificationId);
  }

  return (
    <div className="notifications-page page-stack">
      <PageHeader
        eyebrow="Private season updates"
        title="Notifications"
        description="C.H.A.O.S. assignments, House changes, weekly leadership results and Pocket activations appear here for the relevant player only."
        icon="🔔"
        actions={unreadCount > 0 ? (
          <button
            className="button button--secondary"
            type="button"
            disabled={markingAll}
            onClick={handleMarkAllRead}
          >
            {markingAll ? "Marking all as read…" : "Mark all as read"}
          </button>
        ) : null}
      />

      {(error || actionError) && (
        <div className="inline-alert inline-alert--danger" role="alert">
          {actionError || error}
        </div>
      )}

      <section className="notification-summary card">
        <div>
          <span aria-hidden="true">✦</span>
          <strong>{unreadCount}</strong>
          <small>{pluralize(unreadCount, "unread update", "unread updates")}</small>
        </div>
        <p>
          Season notices are informational records. They cannot change your
          points, leadership role or standings by themselves.
        </p>
      </section>

      <section className="notification-list card" aria-label="Personal notifications">
        {items.length === 0 ? (
          <div className="empty-state">
            No private season notifications yet. When C.H.A.O.S. stirs, you
            will hear it here.
          </div>
        ) : (
          items.map((item) => {
            const markingThisItem = workingId === item.id;

            return (
              <article
                className={`notification-item${item.readAt ? "" : " notification-item--unread"}`}
                key={item.id}
              >
                <span className="notification-item__mark" aria-hidden="true">
                  {item.readAt ? "○" : "●"}
                </span>
                <div className="notification-item__copy">
                  <div>
                    <strong>{item.title}</strong>
                    <time>{formatTime(item.createdAt)}</time>
                  </div>
                  <p>{item.message}</p>
                  <div className="notification-item__actions">
                    {item.actionPath && (
                      <Link
                        className="text-link"
                        to={item.actionPath}
                        onClick={() => markRelatedNotification(item.id)}
                      >
                        Open related page
                      </Link>
                    )}
                    {!item.readAt && (
                      <button
                        type="button"
                        disabled={markingThisItem}
                        onClick={() => handleMarkRead(item.id)}
                      >
                        {markingThisItem ? "Marking as read…" : "Mark as read"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <section className="notification-easter card">
        <span aria-hidden="true">⚡</span>
        <div>
          <strong>The sorting thunder is currently quiet.</strong>
          <p>
            This sentence may become less accurate immediately after an
            administrator presses the red button.
          </p>
        </div>
      </section>
    </div>
  );
}
