export default function WaterForm({
  formData,
  setFormData,
  readOnly = false,
}) {
  const amount = formData.amount ?? "";

  const handleChange = (event) => {
    const value = event.target.value;

    setFormData((currentData) => ({
      ...currentData,
      amount: value === "" ? "" : Number(value),
    }));
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="water-amount">
        <strong>Water (ml) *</strong>
      </label>

      <input
        id="water-amount"
        name="amount"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        disabled={readOnly}
        value={amount}
        onChange={handleChange}
        onWheel={(event) => event.currentTarget.blur()}
        placeholder="500"
      />
    </div>
  );
}