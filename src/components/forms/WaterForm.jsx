export default function WaterForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label>
        <strong>Water (ml) *</strong>
      </label>

      <input
        type="number"
        min="0"
        disabled={readOnly}
        value={formData.amount || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            amount: Number(e.target.value),
          })
        }
      />
    </div>
  );
}