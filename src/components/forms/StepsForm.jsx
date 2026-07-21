export default function StepsForm({ formData, setFormData, readOnly = false }) {
  const updateSteps = (value) => {
    setFormData((currentData) => ({
      ...currentData,
      steps: value === "" ? "" : Number(value),
    }));
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="steps-amount">
        <strong>Steps *</strong>
      </label>

      <input
        id="steps-amount"
        name="steps"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        disabled={readOnly}
        value={formData.steps ?? ""}
        placeholder="10000"
        onWheel={(event) => event.currentTarget.blur()}
        onChange={(event) => updateSteps(event.target.value)}
      />
    </div>
  );
}
