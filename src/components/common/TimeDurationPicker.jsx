import "./TimeDurationPicker.css";

export default function TimeDurationPicker({
  value,
  onChange,
  label = "Duration",
}) {
  const hours = value?.hours ?? 0;
  const minutes = value?.minutes ?? 0;
  const seconds = value?.seconds ?? 0;

  const update = (field, fieldValue) => {
    onChange({
      ...value,
      [field]: Number(fieldValue),
    });
  };

  return (
    <div className="time-picker">
      <label>{label}</label>

      <div className="time-picker-row">
        <div>
          <span>Hours</span>

          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => update("hours", e.target.value)}
          />
        </div>

        <div>
          <span>Minutes</span>

          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => update("minutes", e.target.value)}
          />
        </div>

        <div>
          <span>Seconds</span>

          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => update("seconds", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}