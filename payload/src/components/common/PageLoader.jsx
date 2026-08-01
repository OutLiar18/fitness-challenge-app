import "./PageLoader.css";

export default function PageLoader({ message = "Loading your legacy…" }) {
  return (
    <div className="page-loader" aria-live="polite" aria-busy="true">
      <span className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
