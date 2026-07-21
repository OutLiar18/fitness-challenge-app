export default function StepsForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label>
        <strong>Steps *</strong>
      </label>

      <input
        type="number"
        min="0"
        disabled={readOnly}
        value={formData.steps || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            steps: Number(e.target.value),
          })
        }
      />
    </div>
  );
}