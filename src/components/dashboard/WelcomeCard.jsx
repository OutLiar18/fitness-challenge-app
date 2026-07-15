import "./WelcomeCard.css";

export default function WelcomeCard({ profile, user }) {
  return (
    <div className="welcome-card">
      <h1>🏆 Champions Legacy Challenge</h1>

      <p className="welcome-text">Welcome back,</p>

      <h2>{profile?.displayName || profile?.fullName || user?.email}</h2>

      <p className="role">{profile?.role || "User"}</p>
    </div>
  );
}
