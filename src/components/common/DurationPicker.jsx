function parseNumberInput(value) {
  if (value === "") {
    return "";
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : "";
}

export default function DurationPicker({
  formData,
  setFormData,
  readOnly = false,
}) {
  const updateDuration = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: parseNumberInput(value),
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="duration-hours">
          <strong>Hours</strong>
        </label>

        <input
          id="duration-hours"
          name="hours"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          disabled={readOnly}
          value={formData.hours ?? ""}
          placeholder="0"
          onChange={(event) =>
            updateDuration(
              "hours",
              event.target.value,
            )
          }
          onWheel={(event) =>
            event.currentTarget.blur()
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="duration-minutes">
          <strong>Minutes</strong>
        </label>

        <input
          id="duration-minutes"
          name="minutes"
          type="number"
          min="0"
          max="59"
          step="1"
          inputMode="numeric"
          disabled={readOnly}
          value={formData.minutes ?? ""}
          placeholder="0"
          onChange={(event) =>
            updateDuration(
              "minutes",
              event.target.value,
            )
          }
          onWheel={(event) =>
            event.currentTarget.blur()
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="duration-seconds">
          <strong>Seconds</strong>
        </label>

        <input
          id="duration-seconds"
          name="seconds"
          type="number"
          min="0"
          max="59"
          step="1"
          inputMode="numeric"
          disabled={readOnly}
          value={formData.seconds ?? ""}
          placeholder="0"
          onChange={(event) =>
            updateDuration(
              "seconds",
              event.target.value,
            )
          }
          onWheel={(event) =>
            event.currentTarget.blur()
          }
        />
      </div>
    </>
  );
}