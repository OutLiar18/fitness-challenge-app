import { useContext } from "react";

import { PlayerDataContext } from "../context/PlayerDataContext";

export default function usePlayerData() {
  const context = useContext(PlayerDataContext);

  if (!context) {
    throw new Error("usePlayerData must be used inside PlayerDataProvider.");
  }

  return context;
}
