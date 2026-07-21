export default function TextArea({
  value,
  onChange,
  readOnly,
  placeholder,
  rows = 5,
}) {
  return (
    <textarea
      rows={rows}
      disabled={readOnly}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}