import { ANNOUNCEMENTS } from "../../constants/announcements";

function toPublishedTime(announcement) {
  const date = new Date(`${announcement.publishedAt}T12:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function getAnnouncements() {
  return [...ANNOUNCEMENTS].sort(
    (first, second) => toPublishedTime(second) - toPublishedTime(first),
  );
}

export function getFeaturedAnnouncement() {
  return getAnnouncements().find((announcement) => announcement.featured) ?? null;
}
