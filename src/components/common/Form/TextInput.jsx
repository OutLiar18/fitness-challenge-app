export default function TextInput({
  value,
  onChange,
  readOnly,
  placeholder,
}) {
  return (
    <input
      type="text"
      disabled={readOnly}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}