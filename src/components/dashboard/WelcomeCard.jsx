export default function WelcomeCard({ profile, user }) {
  const name =
    profile?.displayName ||
    profile?.fullName ||
    user?.email;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h1>🏆 Champions Legacy Challenge</h1>

      <p>Welcome back,</p>

      <h2 style={{ marginTop: 0 }}>{name}</h2>

      <p>Role: {profile?.role || "User"}</p>
    </div>
  );
}