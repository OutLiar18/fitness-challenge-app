import {
  formatExperiencePoints,
  formatPoints,
  pluralize,
} from "../../utils/displayFormatters";
import "./ProgressTimeline.css";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return dateFormatter.format(date);
}

export default function ProgressTimeline({ timeline }) {
  const events = timeline?.events ?? [];
  const displayedEvents = events.slice(0, 50);

  return (
    <section
      className="progress-section card"
      aria-labelledby="progress-timeline-title"
    >
      <div className="progress-section__header">
        <div>
          <p className="progress-eyebrow">Progress timeline</p>
          <h2 id="progress-timeline-title">Your journey so far</h2>
        </div>

        <span className="progress-section__count">
          {timeline?.count ?? 0} {pluralize(timeline?.count ?? 0, "event", "events")}
        </span>
      </div>

      {displayedEvents.length === 0 ? (
        <div className="empty-state">
          Your timeline will begin when you record your first activity.
        </div>
      ) : (
        <>
          <ol className="progress-timeline">
            {displayedEvents.map((event) => (
              <li className="progress-timeline__item" key={event.id}>
                <span className="progress-timeline__marker" aria-hidden="true">
                  {event.icon}
                </span>

                <div className="progress-timeline__content">
                  <div className="progress-timeline__heading">
                    <strong>{event.label}</strong>
                    <time>{formatDate(event.earnedDate)}</time>
                  </div>

                  {event.description && <p>{event.description}</p>}

                  {(event.points > 0 || event.xp > 0) && (
                    <div className="progress-timeline__rewards">
                      {event.points > 0 && <span>+{formatPoints(event.points)}</span>}
                      {event.xp > 0 && (
                        <span>+{formatExperiencePoints(event.xp)}</span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {events.length > displayedEvents.length && (
            <p className="progress-timeline__limit">
              Showing your latest 50 progression events.
            </p>
          )}
        </>
      )}
    </section>
  );
}
