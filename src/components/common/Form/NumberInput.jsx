export default function NumberInput({
  value,
  onChange,
  readOnly,
  min,
  max,
  step,
  placeholder,
}) {
  return (
    <input
      type="number"
      disabled={readOnly}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) =>
        onChange(Number(e.target.value))
      }
    />
  );
}