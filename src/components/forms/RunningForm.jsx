import DurationPicker from "../common/DurationPicker";

export default function RunningForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Distance (km) *</strong>
        </label>

        <input
          type="number"
          step="0.01"
          min="0"
          disabled={readOnly}
          value={formData.distance || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              distance: Number(e.target.value),
            })
          }
        />
      </div>

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />
    </>
  );
}