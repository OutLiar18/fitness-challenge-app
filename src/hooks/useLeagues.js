import { useContext } from "react";
import { LeagueContext } from "../context/LeagueContext";

export default function useLeagues() {
  const value = useContext(LeagueContext);

  if (!value) {
    throw new Error("useLeagues must be used within LeagueProvider.");
  }

  return value;
}
