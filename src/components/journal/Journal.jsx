import EntryCard from "../entries/EntryCard";

export default function Journal({ entries, onDelete }) {
  return (
    <>
      <hr />

      <h2>📖 Today's Journal</h2>

      {entries.length === 0 ? (
        <p>No entries yet today.</p>
      ) : (
        entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
          />
        ))
      )}
    </>
  );
}