export default function Toast({
  message,
  type = "success",
}) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "15px 20px",
        borderRadius: "10px",
        color: "#fff",
        background:
          type === "success"
            ? "#28a745"
            : "#dc3545",
        boxShadow: "0 6px 18px rgba(0,0,0,.2)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}