import {
  addDays,
  formatDateInputValue,
  isToday,
  parseDateInputValue,
} from "../../services/dateService";
import EntryCard from "../entries/EntryCard";
import "./Journal.css";

function formatJournalHeading(date) {
  if (isToday(date)) {
    return "Today’s journal";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export default function Journal({
  entries = [],
  selectedDate,
  setSelectedDate,
  onDelete,
  readOnly = false,
  loading = false,
}) {
  const viewingToday = isToday(selectedDate);
  const heading = formatJournalHeading(selectedDate);

  function changeDay(amount) {
    const nextDate = addDays(selectedDate, amount);

    if (nextDate && (amount < 0 || nextDate <= new Date())) {
      setSelectedDate(nextDate);
    }
  }

  function handleDateChange(event) {
    const date = parseDateInputValue(event.target.value);

    if (date && date <= new Date()) {
      setSelectedDate(date);
    }
  }

  return (
    <section className="journal card" aria-labelledby="journal-title">
      <div className="journal__header">
        <div>
          <p className="journal__eyebrow">Activity history</p>
          <h2 id="journal-title">{heading}</h2>
          <p className="journal__subtitle">
            {readOnly
              ? "This day is locked, but you can still review every entry and point earned."
              : "Review today’s work or move through your recent history."}
          </p>
        </div>

        {readOnly && (
          <span className="journal__lock" title="Historical day locked">
            <span aria-hidden="true">🔒</span> Read only
          </span>
        )}
      </div>

      <div className="journal__navigation" aria-label="Journal date navigation">
        <button
          className="button button--secondary button--icon"
          type="button"
          aria-label="View previous day"
          onClick={() => changeDay(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>

        <label className="journal__date-field">
          <span className="sr-only">Journal date</span>
          <input
            type="date"
            value={formatDateInputValue(selectedDate)}
            max={formatDateInputValue(new Date())}
            onChange={handleDateChange}
          />
        </label>

        <button
          className="button button--secondary button--icon"
          type="button"
          aria-label="View next day"
          disabled={viewingToday}
          onClick={() => changeDay(1)}
        >
          <span aria-hidden="true">→</span>
        </button>

        {!viewingToday && (
          <button
            className="button button--primary journal__today-button"
            type="button"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </button>
        )}
      </div>

      <div className="journal__content" aria-live="polite">
        {loading ? (
          <div className="journal__state">
            <span className="loading-spinner" aria-hidden="true" />
            <p>Loading your journal…</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="journal__state journal__state--empty">
            <span className="journal__state-icon" aria-hidden="true">📖</span>
            <h3>No entries for this day</h3>
            <p>
              {viewingToday
                ? "Choose a category above and record your first activity."
                : "There is nothing recorded on this date."}
            </p>
          </div>
        ) : (
          <div className="journal__entries">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={onDelete}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
