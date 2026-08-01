import { useContext } from "react";
import { TeamContext } from "../context/TeamContext";

export default function useTeam() {
  const value = useContext(TeamContext);

  if (!value) {
    throw new Error("useTeam must be used within TeamProvider.");
  }

  return value;
}
