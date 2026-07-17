import "./Journal.css";
import EntryCard from "../entries/EntryCard";

export default function Journal({
  entries,
  selectedDate,
  setSelectedDate,
  onDelete,
}) {
  function previousDay() {
    const previous = new Date(selectedDate);
    previous.setDate(previous.getDate() - 1);
    setSelectedDate(previous);
  }

  function nextDay() {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);

    if (next <= new Date()) {
      setSelectedDate(next);
    }
  }

  function jumpToToday() {
    setSelectedDate(new Date());
  }

  const isToday =
    selectedDate.toDateString() ===
    new Date().toDateString();

  return (
    <div className="journal">
      <hr />

      <div className="journal-header">
        <h2>
          📖 {isToday ? "Today's Journal" : "Journal"}
        </h2>

        <div className="journal-navigation">
          <button onClick={previousDay}>
            ◀
          </button>

          <input
            className="journal-date-picker"
            type="date"
            value={selectedDate
              .toISOString()
              .split("T")[0]}
            max={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setSelectedDate(
                new Date(e.target.value)
              )
            }
          />

          <button
            onClick={nextDay}
            disabled={isToday}
          >
            ▶
          </button>

          {!isToday && (
            <button
              className="today-button"
              onClick={jumpToToday}
            >
              Today
            </button>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <p>No entries for this day.</p>
      ) : (
        entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}