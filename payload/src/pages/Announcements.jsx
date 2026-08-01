import { useMemo, useState } from "react";

import PageHeader from "../components/layout/PageHeader";
import { getAnnouncementType } from "../constants/admin";
import useAnnouncements from "../hooks/useAnnouncements";
import { filterAnnouncements } from "../services/announcements/announcementService";
import { pluralize } from "../utils/displayFormatters";
import "./Announcements.css";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value) {
  const date = value?.toDate?.() ?? value;
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Publication date unavailable";
}

function AnnouncementArticle({ announcement, featured = false, read, onToggleRead }) {
  const type = getAnnouncementType(announcement.type);
  const className = featured
    ? `announcement-feature card${read ? " announcement--read" : " announcement--unread"}`
    : `announcement-card card${read ? " announcement--read" : " announcement--unread"}`;

  return (
    <article className={className}>
      <div
        className={featured ? "announcement-feature__icon" : "announcement-card__icon"}
        aria-hidden="true"
      >
        {announcement.icon || type.icon}
      </div>

      <div className={featured ? "announcement-feature__content" : undefined}>
        <div className="announcement-meta">
          {featured && <span className="announcement-meta__featured">Featured update</span>}
          <span>{type.label}</span>
          {announcement.version && <span>Version {announcement.version}</span>}
          {!read && <span className="announcement-meta__unread">Unread</span>}
          <time>{formatDate(announcement.publishedAt)}</time>
        </div>

        {featured ? <h2>{announcement.title}</h2> : <h3>{announcement.title}</h3>}
        <p className={featured ? "announcement-feature__summary" : "announcement-card__summary"}>
          <em>{announcement.summary}</em>
        </p>
        <p>{announcement.body}</p>

        <button
          className="announcement-read-toggle"
          type="button"
          onClick={() => onToggleRead(announcement.id, read)}
        >
          {read ? "Mark as unread" : "Mark as read"}
        </button>
      </div>
    </article>
  );
}

export default function Announcements() {
  const {
    announcements,
    types,
    readIds,
    unreadCount,
    error,
    isRead,
    markRead,
    markUnread,
    markAllRead,
  } = useAnnouncements();
  const [typeFilter, setTypeFilter] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () =>
      filterAnnouncements(announcements, {
        type: typeFilter,
        unreadOnly,
        readIds,
      }),
    [announcements, readIds, typeFilter, unreadOnly],
  );

  const featured = filtered.find((announcement) => announcement.featured);
  const remaining = filtered.filter((announcement) => announcement.id !== featured?.id);

  async function handleToggleRead(announcementId, read) {
    setActionError("");

    try {
      if (read) {
        await markUnread(announcementId);
      } else {
        await markRead(announcementId);
      }
    } catch (readError) {
      setActionError(
        readError.message || "Read status could not be updated. Please try again.",
      );
    }
  }

  async function handleMarkAllRead() {
    setBusy(true);
    setActionError("");

    try {
      await markAllRead();
    } catch (readError) {
      setActionError(
        readError.message || "Announcements could not be marked as read.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="announcements-page page-stack">
      <PageHeader
        eyebrow="Challenge communications"
        title="Announcements"
        description="Release notes, challenge notices and useful messages from a trophy with entirely reasonable confidence."
        icon="📣"
        actions={
          unreadCount > 0 ? (
            <button
              className="button button--primary"
              type="button"
              disabled={busy}
              onClick={handleMarkAllRead}
            >
              {busy
                ? "Updating read status…"
                : `Mark all ${unreadCount} ${pluralize(
                    unreadCount,
                    "announcement",
                    "announcements",
                  )} as read`}
            </button>
          ) : null
        }
      />

      {(error || actionError) && (
        <div className="inline-alert inline-alert--danger" role="alert">
          {actionError || error}
        </div>
      )}

      <section className="announcement-controls card" aria-label="Announcement filters">
        <div className="announcement-controls__types">
          {["all", ...types].map((typeId) => {
            const type = typeId === "all" ? null : getAnnouncementType(typeId);

            return (
              <button
                key={typeId}
                className={`announcement-filter${
                  typeFilter === typeId ? " announcement-filter--active" : ""
                }`}
                type="button"
                aria-pressed={typeFilter === typeId}
                onClick={() => setTypeFilter(typeId)}
              >
                {typeId === "all" ? "All announcements" : `${type.icon} ${type.label}`}
              </button>
            );
          })}
        </div>

        <label className="announcement-unread-filter">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => setUnreadOnly(event.target.checked)}
          />
          <span>Show unread announcements only</span>
          <strong>{unreadCount}</strong>
        </label>
      </section>

      {featured && (
        <AnnouncementArticle
          announcement={featured}
          featured
          read={isRead(featured.id)}
          onToggleRead={handleToggleRead}
        />
      )}

      {remaining.length > 0 && (
        <section className="announcement-list" aria-labelledby="announcement-list-title">
          <div className="announcement-list__heading">
            <p>More from the challenge</p>
            <h2 id="announcement-list-title">Previous announcements</h2>
          </div>

          <div className="announcement-list__grid">
            {remaining.map((announcement) => (
              <AnnouncementArticle
                key={announcement.id}
                announcement={announcement}
                read={isRead(announcement.id)}
                onToggleRead={handleToggleRead}
              />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section className="empty-state card">
          <span aria-hidden="true">📭</span>
          <h2>No announcements match these filters</h2>
          <p>Try showing all announcement types or include messages you have already read.</p>
        </section>
      )}
    </div>
  );
}
