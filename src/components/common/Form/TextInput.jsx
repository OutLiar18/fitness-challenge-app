export default function TextInput({
  id,
  name,
  value,
  onChange,
  readOnly = false,
  placeholder,
  required = false,
  autoComplete,
}) {
  return (
    <input
      id={id}
      name={name}
      type="text"
      disabled={readOnly}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
