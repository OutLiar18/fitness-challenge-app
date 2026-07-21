import DurationPicker from "../common/DurationPicker";

export default function RunningForm({
  formData,
  setFormData,
  readOnly = false,
}) {
  const updateDistance = (value) => {
    setFormData((currentData) => ({
      ...currentData,
      distance:
        value === ""
          ? ""
          : Number(value),
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="running-distance">
          <strong>Distance (km) *</strong>
        </label>

        <input
          id="running-distance"
          name="distance"
          type="number"
          step="0.01"
          min="0.01"
          inputMode="decimal"
          disabled={readOnly}
          placeholder="5"
          value={formData.distance ?? ""}
          onChange={(event) =>
            updateDistance(event.target.value)
          }
          onWheel={(event) =>
            event.currentTarget.blur()
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