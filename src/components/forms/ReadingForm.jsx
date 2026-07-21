import DurationPicker from "../common/DurationPicker";

export default function ReadingForm({
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

  return (
    <>
      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-book">
          <strong>Book Name *</strong>
        </label>

        <input
          id="reading-book"
          name="book"
          type="text"
          disabled={readOnly}
          placeholder="What book did you read?"
          value={formData.book ?? ""}
          onChange={(event) =>
            updateField("book", event.target.value)
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-completed-book">
          <strong>Did you complete the book? *</strong>
        </label>

        <select
          id="reading-completed-book"
          name="completedBook"
          disabled={readOnly}
          value={
            formData.completedBook === true
              ? "yes"
              : formData.completedBook === false
                ? "no"
                : ""
          }
          onChange={(event) => {
            const value = event.target.value;

            updateField(
              "completedBook",
              value === ""
                ? ""
                : value === "yes",
            );
          }}
        >
          <option value="">
            Select an option
          </option>

          <option value="no">
            No
          </option>

          <option value="yes">
            Yes
          </option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reading-reflection">
          <strong>Reflection</strong>
        </label>

        <textarea
          id="reading-reflection"
          name="reflection"
          rows={5}
          disabled={readOnly}
          placeholder="Optional: What did you learn from today's reading?"
          value={formData.reflection ?? ""}
          onChange={(event) =>
            updateField(
              "reflection",
              event.target.value,
            )
          }
        />
      </div>
    </>
  );
}