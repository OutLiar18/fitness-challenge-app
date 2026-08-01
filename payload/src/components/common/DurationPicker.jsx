import { useId } from "react";

function parseNumberInput(value) {
  if (value === "") {
    return "";
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : "";
}

export default function DurationPicker({
  formData,
  setFormData,
  readOnly = false,
  label = "Duration",
}) {
  const idPrefix = useId();

  function updateDuration(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: parseNumberInput(value),
    }));
  }

  return (
    <fieldset className="duration-picker">
      <legend>{label} <span className="form-required" aria-hidden="true">*</span></legend>

      <div className="duration-picker__grid">
        {[
          { field: "hours", label: "Hours", max: undefined },
          { field: "minutes", label: "Minutes", max: 59 },
          { field: "seconds", label: "Seconds", max: 59 },
        ].map(({ field, label: fieldLabel, max }) => {
          const inputId = `${idPrefix}-${field}`;

          return (
            <div className="form-field" key={field}>
              <label htmlFor={inputId}>{fieldLabel}</label>
              <input
                id={inputId}
                name={field}
                type="number"
                min="0"
                max={max}
                step="1"
                inputMode="numeric"
                disabled={readOnly}
                value={formData[field] ?? ""}
                placeholder="0"
                onChange={(event) => updateDuration(field, event.target.value)}
                onWheel={(event) => event.currentTarget.blur()}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
