import DurationPicker from "../common/DurationPicker";
import FormField from "../common/Form/FormField";
import NumberInput from "../common/Form/NumberInput";
import TextArea from "../common/Form/TextArea";
import TextInput from "../common/Form/TextInput";
import LibrarySelect from "../common/Selector/LibrarySelect";

export default function ReadingForm({
  userId,
  formData,
  setFormData,
  readOnly = false,
}) {
  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleBookSelected(book) {
    setFormData((current) => ({
      ...current,
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
        placeholder="Search your library or enter a new title…"
        required
        readOnly={readOnly}
        value={formData.title ?? ""}
        onChange={(value) => updateField("title", value)}
        onSelect={handleBookSelected}
      />

      <div className="form-grid form-grid--two">
        <FormField label="Author" htmlFor="reading-author">
          <TextInput
            id="reading-author"
            name="author"
            readOnly={readOnly}
            value={formData.author}
            placeholder="Optional"
            onChange={(value) => updateField("author", value)}
          />
        </FormField>

        <FormField label="Total pages" htmlFor="reading-pages">
          <NumberInput
            id="reading-pages"
            name="totalPages"
            min={1}
            step={1}
            inputMode="numeric"
            readOnly={readOnly}
            value={formData.totalPages}
            placeholder="Optional"
            onChange={(value) => updateField("totalPages", value)}
          />
        </FormField>
      </div>

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <FormField label="Book completed?" htmlFor="reading-completed">
        <select
          id="reading-completed"
          disabled={readOnly}
          value={formData.completed === true ? "yes" : "no"}
          onChange={(event) =>
            updateField("completed", event.target.value === "yes")
          }
        >
          <option value="no">No, I am still reading it</option>
          <option value="yes">Yes, I completed it</option>
        </select>
      </FormField>

      <FormField label="Reflection" htmlFor="reading-reflection" help="Optional: capture one useful idea while it is still fresh.">
        <TextArea
          id="reading-reflection"
          name="reflection"
          rows={4}
          readOnly={readOnly}
          value={formData.reflection}
          placeholder="What did you learn or notice?"
          onChange={(value) => updateField("reflection", value)}
        />
      </FormField>
    </>
  );
}
