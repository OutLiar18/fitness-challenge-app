import "./Toast.css";

const TOAST_ICONS = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

export default function Toast({ message, type = "success", onDismiss }) {
  if (!message) {
    return null;
  }

  const safeType = TOAST_ICONS[type] ? type : "info";
  const isUrgent = safeType === "error" || safeType === "warning";

  return (
    <div
      className={`toast toast--${safeType}`}
      role={isUrgent ? "alert" : "status"}
      aria-live={isUrgent ? "assertive" : "polite"}
    >
      <span className="toast__icon" aria-hidden="true">
        {TOAST_ICONS[safeType]}
      </span>
      <p>{message}</p>
      <button
        className="toast__dismiss"
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}
