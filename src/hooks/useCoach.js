import { useContext } from "react";
import { CoachContext } from "../context/CoachContext";

export default function useCoach() {
  const value = useContext(CoachContext);

  if (!value) {
    throw new Error("useCoach must be used within CoachProvider.");
  }

  return value;
}
