import { CATEGORIES } from "../../constants/categories";

export default function EntryForm({
  type,
  setType,
  value,
  setValue,
  onSave,
}) {
  return (
    <div>
      <h2>➕ Log Activity</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.emoji} {category.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter amount"
      />

      <br />
      <br />

      <button onClick={onSave}>
        Save Entry
      </button>
    </div>
  );
}