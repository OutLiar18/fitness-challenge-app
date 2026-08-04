import { useMemo, useState } from "react";

import {
  addDays,
  formatDateInputValue,
  isToday,
  parseDateInputValue,
  getLocalDateKey,
} from "../../services/dateService";
import {
  getJournalHistoryPage,
  JOURNAL_HISTORY_PAGE_SIZE,
} from "../../services/entries/entryHistoryModel";
import { formatNumber, pluralize } from "../../utils/displayFormatters";
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

function formatHistoryDate(dateKey) {
  const date = parseDateInputValue(dateKey);
  if (!date) return dateKey;
  if (isToday(date)) return "Today";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function Journal({
  entries = [],
  selectedDate,
  setSelectedDate,
  onDelete,
  readOnly = false,
  loading = false,
  evidenceClaims = [],
  allEntries = [],
  dateSummaries = [],
}) {
  const [historyPage, setHistoryPage] = useState(0);
  const viewingToday = isToday(selectedDate);
  const heading = formatJournalHeading(selectedDate);
  const history = useMemo(
    () =>
      getJournalHistoryPage({
        entries: allEntries,
        page: historyPage,
        pageSize: JOURNAL_HISTORY_PAGE_SIZE,
      }),
    [allEntries, historyPage],
  );
  const summaryByDate = useMemo(
    () => new Map(dateSummaries.map((summary) => [summary.dateKey, summary])),
    [dateSummaries],
  );


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

  function openHistoryDate(dateKey) {
    const date = parseDateInputValue(dateKey);
    if (date) setSelectedDate(date);
  }

  return (
    <section className="journal card" aria-labelledby="journal-title">
      <div className="journal__header">
        <div>
          <p className="journal__eyebrow">Activity history</p>
          <h2 id="journal-title">{heading}</h2>
          <p className="journal__subtitle">
            {readOnly
              ? "This day is locked, but you can still review current entries and preserved corrected versions."
              : "Review today’s work, including any preserved factual correction history."}
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
                evidenceClaims={evidenceClaims.filter((claim) => {
                  if (claim.entryId === entry.id) return true;
                  if (entry.correction?.isSuperseded) return false;
                  return (
                    claim.entryIds?.includes(entry.id) ||
                    (claim.claimType === "daily-bonus" &&
                      claim.category === entry.category &&
                      getLocalDateKey(claim.challengeDate) === getLocalDateKey(entry.challengeDate))
                  );
                })}
              />
            ))}
          </div>
        )}
      </div>

      <section className="journal-history" aria-labelledby="journal-history-title">
        <div className="journal-history__heading">
          <div>
            <p className="journal__eyebrow">Paginated history</p>
            <h3 id="journal-history-title">Recorded days</h3>
            <p>
              Only {JOURNAL_HISTORY_PAGE_SIZE} recorded days are rendered at a time,
              while goals and personal statistics still use your complete active history.
            </p>
          </div>
          <span>
            {formatNumber(history.totalRecordedDays, { whole: true })}{" "}
            {pluralize(history.totalRecordedDays, "day", "days")}
          </span>
        </div>

        {history.items.length === 0 ? (
          <p className="journal-history__empty">Recorded days will appear here after your first entry.</p>
        ) : (
          <div className="journal-history__list">
            {history.items.map((item) => {
              const summary = summaryByDate.get(item.dateKey) ?? item;
              const selected = item.dateKey === getLocalDateKey(selectedDate);
              return (
                <button
                  className={`journal-history__day${selected ? " journal-history__day--selected" : ""}`}
                  type="button"
                  key={item.dateKey}
                  onClick={() => openHistoryDate(item.dateKey)}
                  aria-current={selected ? "date" : undefined}
                >
                  <span>{formatHistoryDate(item.dateKey)}</span>
                  <small>
                    {summary.entryCount}{" "}
                    {pluralize(summary.entryCount, "entry", "entries")} ·{" "}
                    {formatNumber(summary.pointTotal)} points
                  </small>
                </button>
              );
            })}
          </div>
        )}

        {history.pageCount > 1 && (
          <div className="journal-history__pagination" aria-label="Recorded day pages">
            <button
              className="button button--secondary"
              type="button"
              disabled={!history.hasNewer}
              onClick={() => setHistoryPage(Math.max(0, history.page - 1))}
            >
              Newer days
            </button>
            <span>
              Page {history.page + 1} of {history.pageCount}
            </span>
            <button
              className="button button--secondary"
              type="button"
              disabled={!history.hasOlder}
              onClick={() => setHistoryPage(history.page + 1)}
            >
              Older days
            </button>
          </div>
        )}
      </section>
    </section>
  );
}
