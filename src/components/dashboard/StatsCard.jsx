export default function StatsCard({ totalEntries }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2>📊 Your Progress</h2>

      <p>Total Entries Logged</p>

      <h1>{totalEntries}</h1>
    </div>
  );
}