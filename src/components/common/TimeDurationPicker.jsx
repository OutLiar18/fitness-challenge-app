import "./TimeDurationPicker.css";

export default function TimeDurationPicker({
  value = {},
  onChange,
  label = "Duration",
}) {
  const updateField = (field, fieldValue) => {
    const number = Math.max(0, Number(fieldValue) || 0);

    onChange({
      ...value,
      [field]: number,
    });
  };

  return (
    <div className="time-duration-picker">
      <label>{label}</label>

      <div className="time-duration-grid">
        <div>
          <span>Hours</span>

          <input
            type="number"
            min="0"
            value={value.hours ?? 0}
            onChange={(e) =>
              updateField("hours", e.target.value)
            }
          />
        </div>

        <div>
          <span>Minutes</span>

          <input
            type="number"
            min="0"
            max="59"
            value={value.minutes ?? 0}
            onChange={(e) =>
              updateField("minutes", e.target.value)
            }
          />
        </div>

        <div>
          <span>Seconds</span>

          <input
            type="number"
            min="0"
            max="59"
            value={value.seconds ?? 0}
            onChange={(e) =>
              updateField("seconds", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}