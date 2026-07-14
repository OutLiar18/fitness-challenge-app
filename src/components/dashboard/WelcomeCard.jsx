import { auth } from "../../firebase";

export default function WelcomeCard() {
  const user = auth.currentUser;

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

      <p>
        Welcome back,
        <strong> {user?.email}</strong>
      </p>
    </div>
  );
}