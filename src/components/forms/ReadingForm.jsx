import DurationPicker from "../common/DurationPicker";
import LibrarySelect from "../common/LibrarySelect/LibrarySelect";

export default function ReadingForm({
  userId,
  formData,
  setFormData,
  readOnly = false,
}) {
  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  function handleBookSelected(book) {
    setFormData((currentData) => ({
      ...currentData,
      title: book.title ?? "",
      author: book.author ?? "",
      totalPages: book.totalPages ?? "",
    }));
  }

  return (
    <>
      <LibrarySelect
        userId={userId}
        itemType="books"
        label="Book"
        placeholder="Search your library..."
        required
        readOnly={readOnly}
        value={formData.title ?? ""}
        onChange={(value) => updateField("title", value)}
        onSelect={handleBookSelected}
      />

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-author">
          <strong>Author</strong>
        </label>

        <input
          id="reading-author"
          type="text"
          disabled={readOnly}
          value={formData.author ?? ""}
          placeholder="Optional"
          onChange={(event) => updateField("author", event.target.value)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-pages">
          <strong>Total Pages</strong>
        </label>

        <input
          id="reading-pages"
          type="number"
          min="1"
          disabled={readOnly}
          value={formData.totalPages ?? ""}
          placeholder="Optional"
          onWheel={(event) => event.currentTarget.blur()}
          onChange={(event) => {
            const value = event.target.value;

            updateField("totalPages", value === "" ? "" : Number(value));
          }}
        />
      </div>

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-completed">
          <strong>Completed?</strong>
        </label>

        <select
          id="reading-completed"
          disabled={readOnly}
          value={formData.completed === true ? "yes" : "no"}
          onChange={(event) =>
            updateField("completed", event.target.value === "yes")
          }
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-reflection">
          <strong>Reflection</strong>
        </label>

        <textarea
          id="reading-reflection"
          rows={5}
          disabled={readOnly}
          value={formData.reflection ?? ""}
          placeholder="Optional"
          onChange={(event) => updateField("reflection", event.target.value)}
        />
      </div>
    </>
  );
}
