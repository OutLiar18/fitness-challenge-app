import AppShell from "../components/layout/AppShell";
import { AnnouncementProvider } from "../context/AnnouncementProvider";
import { CoachProvider } from "../context/CoachProvider";
import { GlobalLibraryProvider } from "../context/GlobalLibraryProvider";
import { LeagueProvider } from "../context/LeagueProvider";
import { PlayerDataProvider } from "../context/PlayerDataProvider";
import { TeamProvider } from "../context/TeamProvider";
import PrivateRoute from "./PrivateRoute";

export default function ProtectedApp() {
  return (
    <PrivateRoute>
      <PlayerDataProvider>
        <GlobalLibraryProvider>
          <AnnouncementProvider>
            <TeamProvider>
              <LeagueProvider>
                <CoachProvider>
                  <AppShell />
                </CoachProvider>
              </LeagueProvider>
            </TeamProvider>
          </AnnouncementProvider>
        </GlobalLibraryProvider>
      </PlayerDataProvider>
    </PrivateRoute>
  );
}
