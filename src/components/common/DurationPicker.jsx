export default function DurationPicker({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Hours</strong>
        </label>

        <input
          type="number"
          min="0"
          disabled={readOnly}
          value={formData.hours || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              hours: Number(e.target.value),
            })
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Minutes</strong>
        </label>

        <input
          type="number"
          min="0"
          max="59"
          disabled={readOnly}
          value={formData.minutes || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              minutes: Number(e.target.value),
            })
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Seconds</strong>
        </label>

        <input
          type="number"
          min="0"
          max="59"
          disabled={readOnly}
          value={formData.seconds || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              seconds: Number(e.target.value),
            })
          }
        />
      </div>
    </>
  );
}