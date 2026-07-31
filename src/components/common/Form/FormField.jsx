export default function FormField({
  label,
  htmlFor,
  required = false,
  help = "",
  className = "",
  children,
}) {
  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {required && <span className="form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {help && <span className="form-help">{help}</span>}
    </div>
  );
}
