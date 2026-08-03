import AppShell from "../components/layout/AppShell";
import { AnnouncementProvider } from "../context/AnnouncementProvider";
import { CoachProvider } from "../context/CoachProvider";
import { GlobalLibraryProvider } from "../context/GlobalLibraryProvider";
import { LeagueProvider } from "../context/LeagueProvider";
import { PlayerDataProvider } from "../context/PlayerDataProvider";
import { NotificationProvider } from "../context/NotificationProvider";
import PrivateRoute from "./PrivateRoute";

export default function ProtectedApp() {
  return (
    <PrivateRoute>
      <PlayerDataProvider>
        <GlobalLibraryProvider>
          <AnnouncementProvider>
            <LeagueProvider>
              <NotificationProvider>
                <CoachProvider>
                  <AppShell />
                </CoachProvider>
              </NotificationProvider>
            </LeagueProvider>
          </AnnouncementProvider>
        </GlobalLibraryProvider>
      </PlayerDataProvider>
    </PrivateRoute>
  );
}
