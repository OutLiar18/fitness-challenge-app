export default function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <div
      style={{
        marginBottom: "18px",
      }}
    >
      <label>
        <strong>
          {label}
          {required ? " *" : ""}
        </strong>
      </label>

      <br />

      {children}
    </div>
  );
}