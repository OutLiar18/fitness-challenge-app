import DurationPicker from "../common/DurationPicker";

export default function ReadingForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Reflection *</strong>
        </label>

        <textarea
          rows={5}
          disabled={readOnly}
          placeholder="What did you learn from today's reading?"
          value={formData.reflection || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              reflection: e.target.value,
            })
          }
        />
      </div>
    </>
  );
}