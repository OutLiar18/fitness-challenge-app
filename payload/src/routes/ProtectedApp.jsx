import AppShell from "../components/layout/AppShell";
import { AnnouncementProvider } from "../context/AnnouncementProvider";
import { PlayerDataProvider } from "../context/PlayerDataProvider";
import PrivateRoute from "./PrivateRoute";

export default function ProtectedApp() {
  return (
    <PrivateRoute>
      <PlayerDataProvider>
        <AnnouncementProvider>
          <AppShell />
        </AnnouncementProvider>
      </PlayerDataProvider>
    </PrivateRoute>
  );
}
