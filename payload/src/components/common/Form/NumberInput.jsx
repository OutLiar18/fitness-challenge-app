export default function NumberInput({
  id,
  name,
  value,
  onChange,
  readOnly = false,
  min,
  max,
  step,
  placeholder,
  required = false,
  inputMode = "decimal",
}) {
  return (
    <input
      id={id}
      name={name}
      type="number"
      disabled={readOnly}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      value={value ?? ""}
      onWheel={(event) => event.currentTarget.blur()}
      onChange={(event) => {
        const nextValue = event.target.value;
        onChange(nextValue === "" ? "" : Number(nextValue));
      }}
    />
  );
}
