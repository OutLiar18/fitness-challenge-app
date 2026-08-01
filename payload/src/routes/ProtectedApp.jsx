import AppShell from "../components/layout/AppShell";
import { PlayerDataProvider } from "../context/PlayerDataProvider";
import PrivateRoute from "./PrivateRoute";

export default function ProtectedApp() {
  return (
    <PrivateRoute>
      <PlayerDataProvider>
        <AppShell />
      </PlayerDataProvider>
    </PrivateRoute>
  );
}
