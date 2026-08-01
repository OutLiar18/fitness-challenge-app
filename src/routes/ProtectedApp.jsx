import AppShell from "../components/layout/AppShell";
import { AnnouncementProvider } from "../context/AnnouncementProvider";
import { GlobalLibraryProvider } from "../context/GlobalLibraryProvider";
import { PlayerDataProvider } from "../context/PlayerDataProvider";
import PrivateRoute from "./PrivateRoute";

export default function ProtectedApp() {
  return (
    <PrivateRoute>
      <PlayerDataProvider>
        <GlobalLibraryProvider>
          <AnnouncementProvider>
            <AppShell />
          </AnnouncementProvider>
        </GlobalLibraryProvider>
      </PlayerDataProvider>
    </PrivateRoute>
  );
}
