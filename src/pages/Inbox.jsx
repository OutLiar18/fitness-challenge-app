import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import { getAnnouncementType } from "../constants/admin";
import useAnnouncements from "../hooks/useAnnouncements";
import useNotifications from "../hooks/useNotifications";
import usePlayerData from "../hooks/usePlayerData";
import { filterAnnouncements } from "../services/announcements/announcementService";
import { toDate } from "../services/dateService";
import { subscribeToPendingSeasonBonusRequests } from "../services/seasons/seasonBonusService";
import { pluralize } from "../utils/displayFormatters";
import "./Inbox.css";

const ANNOUNCEMENT_TAB = "updates";
const PRIVATE_TAB = "private";

const announcementDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const notificationDateFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatAnnouncementDate(value) {
  const date = value?.toDate?.() ?? value;
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? announcementDateFormatter.format(date)
    : "Publication date unavailable";
}

function formatNotificationTime(value) {
  const date = toDate(value);
  return date ? notificationDateFormatter.format(date) : "Just now";
}

function AnnouncementArticle({ announcement, featured = false, read, onToggleRead }) {
  const type = getAnnouncementType(announcement.type);
  const className = featured
    ? `inbox-announcement-feature card${read ? " inbox-item--read" : " inbox-item--unread"}`
    : `inbox-announcement-card card${read ? " inbox-item--read" : " inbox-item--unread"}`;

  return (
    <article className={className}>
      <div
        className={featured ? "inbox-announcement-feature__icon" : "inbox-announcement-card__icon"}
        aria-hidden="true"
      >
        {announcement.icon || type.icon}
      </div>
      <div className="inbox-announcement__content">
        <div className="inbox-meta">
          {featured && <span className="inbox-meta__featured">Featured update</span>}
          <span>{type.label}</span>
          {announcement.version && <span>Version {announcement.version}</span>}
          {!read && <span className="inbox-meta__unread">Unread</span>}
          <time>{formatAnnouncementDate(announcement.publishedAt)}</time>
        </div>
        {featured ? <h2>{announcement.title}</h2> : <h3>{announcement.title}</h3>}
        <p className="inbox-announcement__summary"><em>{announcement.summary}</em></p>
        <p>{announcement.body}</p>
        <button
          className="inbox-text-action"
          type="button"
          onClick={() => onToggleRead(announcement.id, read)}
        >
          {read ? "Mark as unread" : "Mark as read"}
        </button>
      </div>
    </article>
  );
}

function AnnouncementPanel({ announcementsState, actionError, setActionError }) {
  const {
    announcements,
    types,
    readIds,
    unreadCount,
    error,
    isRead,
    markRead,
    markUnread,
  } = announcementsState;
  const [typeFilter, setTypeFilter] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = useMemo(
    () => filterAnnouncements(announcements, { type: typeFilter, unreadOnly, readIds }),
    [announcements, readIds, typeFilter, unreadOnly],
  );
  const featured = filtered.find((announcement) => announcement.featured);
  const remaining = filtered.filter((announcement) => announcement.id !== featured?.id);

  async function handleToggleRead(announcementId, read) {
    setActionError("");
    try {
      if (read) await markUnread(announcementId);
      else await markRead(announcementId);
    } catch (readError) {
      setActionError(readError.message || "Read status could not be updated.");
    }
  }

  return (
    <div className="inbox-panel">
      {(error || actionError) && (
        <div className="inline-alert inline-alert--danger" role="alert">{actionError || error}</div>
      )}

      <section className="inbox-filters card" aria-label="Announcement filters">
        <div className="inbox-filter-row">
          {[
            "all",
            ...types,
          ].map((typeId) => {
            const type = typeId === "all" ? null : getAnnouncementType(typeId);
            return (
              <button
                key={typeId}
                className={`inbox-filter${typeFilter === typeId ? " inbox-filter--active" : ""}`}
                type="button"
                aria-pressed={typeFilter === typeId}
                onClick={() => setTypeFilter(typeId)}
              >
                {typeId === "all" ? "All updates" : `${type.icon} ${type.label}`}
              </button>
            );
          })}
        </div>
        <label className="inbox-unread-filter">
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

      {remaining.length > 0 && (
        <section className="inbox-announcement-list" aria-labelledby="inbox-updates-heading">
          <div className="inbox-section-heading">
            <p>More from the challenge</p>
            <h2 id="inbox-updates-heading">Previous updates</h2>
          </div>
          <div className="inbox-announcement-grid">
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
          <h2>No updates match these filters</h2>
          <p>Show all update types or include messages you have already read.</p>
        </section>
      )}
    </div>
  );
}

function PrivatePanel({ notificationsState, bonusReviewRequests, actionError, setActionError }) {
  const { items, unreadCount, error, markRead } = notificationsState;
  const [workingId, setWorkingId] = useState("");

  async function handleMarkRead(notificationId) {
    if (!notificationId || workingId) return;
    setWorkingId(notificationId);
    setActionError("");
    try {
      await markRead(notificationId);
    } catch (readError) {
      console.error(readError);
      setActionError(readError.message || "That notification could not be marked as read.");
    } finally {
      setWorkingId("");
    }
  }

  return (
    <div className="inbox-panel">
      {(error || actionError) && (
        <div className="inline-alert inline-alert--danger" role="alert">{actionError || error}</div>
      )}

      <section className="inbox-private-summary card">
        <div>
          <span aria-hidden="true">✦</span>
          <strong>{unreadCount}</strong>
          <small>{pluralize(unreadCount, "unread private update", "unread private updates")}</small>
        </div>
        <p>
          Private season notices record assignments, leadership results, roster moves and Pocket activity. They do not change points by themselves.
        </p>
      </section>

      {bonusReviewRequests.length > 0 && (
        <section className="inbox-private-list card" aria-label="Platform bonus reviews">
          <div className="inbox-section-heading">
            <p>Platform action required</p>
            <h2>League Season bonus reviews</h2>
          </div>
          {bonusReviewRequests.map((request) => (
            <article className="inbox-private-item inbox-private-item--unread" key={`bonus-review-${request.id}`}>
              <span className="inbox-private-item__mark" aria-hidden="true">●</span>
              <div className="inbox-private-item__copy">
                <div>
                  <strong>Bonus review required · {request.displayName}</strong>
                  <time>{formatNotificationTime(request.requestedAt)}</time>
                </div>
                <p>{request.points} points requested. {request.reason}</p>
                <div className="inbox-private-item__actions">
                  <Link className="text-link" to="/seasons">Open Seasons to review</Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
      <section className="inbox-private-list card" aria-label="Private notifications">
        {items.length === 0 ? (
          <div className="empty-state">
            No private season notifications yet. When C.H.A.O.S. stirs, you will hear it here.
          </div>
        ) : (
          items.map((item) => {
            const working = workingId === item.id;
            return (
              <article className={`inbox-private-item${item.readAt ? "" : " inbox-private-item--unread"}`} key={item.id}>
                <span className="inbox-private-item__mark" aria-hidden="true">{item.readAt ? "○" : "●"}</span>
                <div className="inbox-private-item__copy">
                  <div>
                    <strong>{item.title}</strong>
                    <time>{formatNotificationTime(item.createdAt)}</time>
                  </div>
                  <p>{item.message}</p>
                  <div className="inbox-private-item__actions">
                    {item.actionPath && (
                      <Link className="text-link" to={item.actionPath} onClick={() => void handleMarkRead(item.id)}>
                        Open related page
                      </Link>
                    )}
                    {!item.readAt && (
                      <button type="button" disabled={working} onClick={() => handleMarkRead(item.id)}>
                        {working ? "Marking as read…" : "Mark as read"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

export default function Inbox() {
  const announcementsState = useAnnouncements();
  const notificationsState = useNotifications();
  const { isPlatformAdmin } = usePlayerData();
  const [bonusReviewRequests, setBonusReviewRequests] = useState([]);

  useEffect(() => {
    if (!isPlatformAdmin) return undefined;
    return subscribeToPendingSeasonBonusRequests(
      setBonusReviewRequests,
      (error) => console.error("Platform bonus review queue could not be loaded.", error),
    );
  }, [isPlatformAdmin]);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = requestedTab === PRIVATE_TAB ? PRIVATE_TAB : ANNOUNCEMENT_TAB;
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState("");
  const visibleBonusReviewRequests = isPlatformAdmin ? bonusReviewRequests : [];
  const totalAttention = announcementsState.unreadCount + notificationsState.unreadCount + visibleBonusReviewRequests.length;
    const privateAttention = notificationsState.unreadCount + visibleBonusReviewRequests.length;
  const inboxTabs = [
    {
      id: ANNOUNCEMENT_TAB,
      label: "Updates",
      icon: "📣",
      description: "Public challenge announcements",
      badge: announcementsState.unreadCount || null,
    },
    {
      id: PRIVATE_TAB,
      label: "Private",
      icon: "🔒",
      description: "Season notices and private actions",
      badge: privateAttention || null,
    },
  ];

  function setTab(tab) {
    setActionError("");
    setSearchParams(tab === ANNOUNCEMENT_TAB ? {} : { tab }, { replace: true });
  }

  async function handleMarkAllRead() {
    const unreadCount = activeTab === ANNOUNCEMENT_TAB
      ? announcementsState.unreadCount
      : notificationsState.unreadCount;
    if (working || unreadCount === 0) return;
    setWorking(true);
    setActionError("");
    try {
      if (activeTab === ANNOUNCEMENT_TAB) await announcementsState.markAllRead();
      else await notificationsState.markAllRead();
    } catch (readError) {
      console.error(readError);
      setActionError(readError.message || "Read status could not be updated.");
    } finally {
      setWorking(false);
    }
  }

  const activeUnread = activeTab === ANNOUNCEMENT_TAB
    ? announcementsState.unreadCount
    : notificationsState.unreadCount;

  return (
    <div className="inbox-page page-stack">
      <PageHeader
        eyebrow="Challenge communications"
        title="Inbox"
        description="Public challenge announcements and private season notifications now live in one calm, organised workspace."
        icon="🔔"
        actions={activeUnread > 0 ? (
          <button className="button button--secondary" type="button" disabled={working} onClick={handleMarkAllRead}>
            {working ? "Updating read status…" : `Mark ${activeUnread} as read`}
          </button>
        ) : null}
      />

      <section className="inbox-overview card" aria-label="Inbox summary">
        <div>
          <span aria-hidden="true">📬</span>
          <strong>{totalAttention}</strong>
          <small>{pluralize(totalAttention, "message or review needing attention", "messages or reviews needing attention")}</small>
        </div>
        <p>Announcements are public to players. Private updates are visible only to the relevant account.</p>
      </section>

            <WorkspaceTabs
        idPrefix="inbox"
        label="Inbox sections"
        tabs={inboxTabs}
        activeId={activeTab}
        onChange={setTab}
      />
      <WorkspacePanel id={ANNOUNCEMENT_TAB} activeId={activeTab} idPrefix="inbox">
        <AnnouncementPanel
          announcementsState={announcementsState}
          actionError={actionError}
          setActionError={setActionError}
        />
      </WorkspacePanel>
      <WorkspacePanel id={PRIVATE_TAB} activeId={activeTab} idPrefix="inbox">
        <PrivatePanel
          notificationsState={notificationsState}
          bonusReviewRequests={visibleBonusReviewRequests}
          actionError={actionError}
          setActionError={setActionError}
        />
      </WorkspacePanel>
    </div>
  );
}
