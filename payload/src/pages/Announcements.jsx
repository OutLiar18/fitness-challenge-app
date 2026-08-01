import { useMemo } from "react";

import PageHeader from "../components/layout/PageHeader";
import { getAnnouncements } from "../services/announcements/announcementService";
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

export default function Announcements() {
  const announcements = useMemo(() => getAnnouncements(), []);
  const featured = announcements.find((announcement) => announcement.featured);
  const remaining = announcements.filter((announcement) => !announcement.featured);

  return (
    <div className="announcements-page page-stack">
      <PageHeader
        eyebrow="Challenge communications"
        title="Announcements"
        description="Product releases, challenge notices and the occasional message from a trophy with too much confidence."
        icon="📣"
      />

      {featured && (
        <article className="announcement-feature card">
          <div className="announcement-feature__icon" aria-hidden="true">
            {featured.icon}
          </div>

          <div>
            <div className="announcement-meta">
              <span>Featured</span>
              {featured.version && <span>v{featured.version}</span>}
              <time>{formatDate(featured.publishedAt)}</time>
            </div>

            <h2>{featured.title}</h2>
            <p className="announcement-feature__summary">{featured.summary}</p>
            <p>{featured.body}</p>
          </div>
        </article>
      )}

      <section className="announcement-list" aria-labelledby="announcement-list-title">
        <div className="announcement-list__header">
          <div>
            <p>Earlier transmissions</p>
            <h2 id="announcement-list-title">Update history</h2>
          </div>
          <span>{announcements.length} announcements</span>
        </div>

        <div className="announcement-list__grid">
          {remaining.map((announcement) => (
            <article className="announcement-card card" key={announcement.id}>
              <span className="announcement-card__icon" aria-hidden="true">
                {announcement.icon}
              </span>

              <div className="announcement-meta">
                <span>{announcement.type}</span>
                {announcement.version && <span>v{announcement.version}</span>}
              </div>

              <h3>{announcement.title}</h3>
              <p className="announcement-card__summary">{announcement.summary}</p>
              <p>{announcement.body}</p>
              <time>{formatDate(announcement.publishedAt)}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="announcement-foundation card">
        <span aria-hidden="true">🏗️</span>
        <div>
          <strong>Future-ready structure</strong>
          <p>
            Announcements are currently bundled with the release. A secure admin
            publishing workflow can replace the data source later without changing
            this page’s presentation contract.
          </p>
        </div>
      </section>
    </div>
  );
}
