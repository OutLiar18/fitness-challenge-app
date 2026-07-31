export default function TextArea({
  id,
  name,
  value,
  onChange,
  readOnly = false,
  placeholder,
  rows = 5,
}) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      disabled={readOnly}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
