import { useContext } from "react";
import { AnnouncementContext } from "../context/AnnouncementContext";

export default function useAnnouncements() {
  const context = useContext(AnnouncementContext);

  if (!context) {
    throw new Error("useAnnouncements must be used inside AnnouncementProvider.");
  }

  return context;
}
