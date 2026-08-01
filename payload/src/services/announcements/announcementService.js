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

export function getFeaturedAnnouncement(announcements = getAnnouncements()) {
  return announcements.find((announcement) => announcement.featured) ?? null;
}

export function getAnnouncementTypes(announcements = getAnnouncements()) {
  return [...new Set(announcements.map((announcement) => announcement.type))].sort();
}

export function filterAnnouncements(
  announcements = getAnnouncements(),
  { type = "all", unreadOnly = false, readIds = [] } = {},
) {
  const readSet = new Set(readIds);

  return announcements.filter((announcement) => {
    const matchesType = type === "all" || announcement.type === type;
    const matchesUnread = !unreadOnly || !readSet.has(announcement.id);

    return matchesType && matchesUnread;
  });
}

export function getUnreadAnnouncements(
  announcements = getAnnouncements(),
  readIds = [],
) {
  const readSet = new Set(readIds);
  return announcements.filter((announcement) => !readSet.has(announcement.id));
}
