import { useMemo, useState } from "react";

import PageHeader from "../components/layout/PageHeader";
import useAnnouncements from "../hooks/useAnnouncements";
import { filterAnnouncements } from "../services/announcements/announcementService";
import "./Announcements.css";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
}

function AnnouncementArticle({ announcement, featured = false, read, onToggleRead }) {
  const className = featured
    ? `announcement-feature card${read ? " announcement--read" : " announcement--unread"}`
    : `announcement-card card${read ? " announcement--read" : " announcement--unread"}`;

  return (
    <article className={className}>
      <div
        className={featured ? "announcement-feature__icon" : "announcement-card__icon"}
        aria-hidden="true"
      >
        {announcement.icon}
      </div>

      <div className={featured ? "announcement-feature__content" : undefined}>
        <div className="announcement-meta">
          {featured && <span>Featured</span>}
          <span>{announcement.type}</span>
          {announcement.version && <span>v{announcement.version}</span>}
          {!read && <span className="announcement-meta__unread">Unread</span>}
          <time>{formatDate(announcement.publishedAt)}</time>
        </div>

        {featured ? <h2>{announcement.title}</h2> : <h3>{announcement.title}</h3>}
        <p className={featured ? "announcement-feature__summary" : "announcement-card__summary"}>
          {announcement.summary}
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
    isRead,
    markRead,
    markUnread,
    markAllRead,
  } = useAnnouncements();

  const [typeFilter, setTypeFilter] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

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

  function handleToggleRead(announcementId, read) {
    if (read) {
      markUnread(announcementId);
    } else {
      markRead(announcementId);
    }
  }

  return (
    <div className="announcements-page page-stack">
      <PageHeader
        eyebrow="Challenge communications"
        title="Announcements"
        description="Product releases, challenge notices and the occasional message from a trophy with too much confidence."
        icon="📣"
        actions={
          unreadCount > 0 ? (
            <button className="button button--primary" type="button" onClick={markAllRead}>
              Mark all read ({unreadCount})
            </button>
          ) : null
        }
      />

      <section className="announcement-controls card" aria-label="Announcement filters">
        <div className="announcement-controls__types">
          {["all", ...types].map((type) => (
            <button
              key={type}
              className={`announcement-filter${typeFilter === type ? " announcement-filter--active" : ""}`}
              type="button"
              aria-pressed={typeFilter === type}
              onClick={() => setTypeFilter(type)}
            >
              {type === "all" ? "All updates" : type}
            </button>
          ))}
        </div>

        <label className="announcement-unread-filter">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => setUnreadOnly(event.target.checked)}
          />
          <span>Unread only</span>
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

      <section className="announcement-list" aria-labelledby="announcement-list-title">
        <div className="announcement-list__header">
          <div>
            <p>Challenge transmissions</p>
            <h2 id="announcement-list-title">
              {unreadOnly ? "Unread updates" : "Update history"}
            </h2>
          </div>
          <span>{filtered.length} shown · {announcements.length} total</span>
        </div>

        {remaining.length === 0 ? (
          <div className="announcement-empty card">
            <span aria-hidden="true">📭</span>
            <div>
              <strong>No announcements match this filter.</strong>
              <p>The trophy checked twice. It even wore its reading glasses.</p>
            </div>
          </div>
        ) : (
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
        )}
      </section>

      <section className="announcement-foundation card">
        <span aria-hidden="true">🏗️</span>
        <div>
          <strong>Ready for secure publishing later</strong>
          <p>
            Release announcements remain bundled with the app, while read status is
            remembered on this device. A future administrator workflow can replace
            the source without changing the page contract or navigation badge.
          </p>
        </div>
      </section>
    </div>
  );
}
