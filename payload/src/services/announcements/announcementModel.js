import {
  ANNOUNCEMENT_STATUS_IDS,
  ANNOUNCEMENT_TYPE_IDS,
  getAnnouncementType,
} from "../../constants/admin";

function toDate(value) {
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value.includes("T") ? value : `${value}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export function normalizeAnnouncement(announcement = {}) {
  const type = ANNOUNCEMENT_TYPE_IDS.includes(announcement.type)
    ? announcement.type
    : "release";
  const typeDefinition = getAnnouncementType(type);

  return {
    id: String(announcement.id ?? ""),
    title: String(announcement.title ?? "").trim(),
    summary: String(announcement.summary ?? "").trim(),
    body: String(announcement.body ?? "").trim(),
    type,
    icon: String(announcement.icon ?? typeDefinition.icon).trim() || typeDefinition.icon,
    status: ANNOUNCEMENT_STATUS_IDS.includes(announcement.status)
      ? announcement.status
      : "published",
    featured: announcement.featured === true,
    version: String(announcement.version ?? "").trim(),
    createdAt: toDate(announcement.createdAt),
    updatedAt: toDate(announcement.updatedAt),
    publishedAt: toDate(announcement.publishedAt),
    createdBy: String(announcement.createdBy ?? ""),
    updatedBy: String(announcement.updatedBy ?? ""),
    lastAuditId: String(announcement.lastAuditId ?? ""),
    source: announcement.source === "bundled" ? "bundled" : "firestore",
  };
}

export function validateAnnouncement(input = {}) {
  const value = normalizeAnnouncement(input);
  const errors = [];
  const suppliedType = String(input.type ?? "");
  const suppliedStatus = String(input.status ?? "");

  if (value.title.length < 4 || value.title.length > 90) {
    errors.push("The title must contain between 4 and 90 characters.");
  }

  if (value.summary.length < 10 || value.summary.length > 220) {
    errors.push("The summary must contain between 10 and 220 characters.");
  }

  if (value.body.length < 20 || value.body.length > 4000) {
    errors.push("The announcement body must contain between 20 and 4,000 characters.");
  }

  if (!ANNOUNCEMENT_TYPE_IDS.includes(suppliedType)) {
    errors.push("Choose a valid announcement type.");
  }

  if (!ANNOUNCEMENT_STATUS_IDS.includes(suppliedStatus)) {
    errors.push("Choose a valid announcement status.");
  }

  if (value.icon.length > 8) {
    errors.push("The announcement icon is too long.");
  }

  if (value.version.length > 20) {
    errors.push("The version label cannot exceed 20 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
    value,
  };
}

export function sortAnnouncementsNewestFirst(announcements = []) {
  return [...announcements].sort((first, second) => {
    const firstTime = first.publishedAt?.getTime?.() ?? first.updatedAt?.getTime?.() ?? 0;
    const secondTime = second.publishedAt?.getTime?.() ?? second.updatedAt?.getTime?.() ?? 0;

    return secondTime - firstTime || first.title.localeCompare(second.title);
  });
}

export function mergeAnnouncements(liveAnnouncements = [], bundledAnnouncements = []) {
  const byId = new Map();

  bundledAnnouncements.forEach((announcement) => {
    const normalized = normalizeAnnouncement({ ...announcement, source: "bundled" });
    if (normalized.id) {
      byId.set(normalized.id, normalized);
    }
  });

  liveAnnouncements.forEach((announcement) => {
    const normalized = normalizeAnnouncement(announcement);
    if (normalized.id && normalized.status === "published") {
      byId.set(normalized.id, normalized);
    }
  });

  return sortAnnouncementsNewestFirst([...byId.values()]);
}

export function getAnnouncementTypes(announcements = []) {
  return [
    ...new Set(
      announcements
        .map((announcement) => announcement.type)
        .filter(Boolean),
    ),
  ].sort();
}

export function filterAnnouncements(
  announcements = [],
  { type = "all", unreadOnly = false, readIds = [] } = {},
) {
  const readSet = new Set(readIds);

  return announcements.filter((announcement) => {
    const matchesType = type === "all" || announcement.type === type;
    const matchesUnread = !unreadOnly || !readSet.has(announcement.id);

    return matchesType && matchesUnread;
  });
}

export function getUnreadAnnouncements(announcements = [], readIds = []) {
  const readSet = new Set(readIds);
  return announcements.filter((announcement) => !readSet.has(announcement.id));
}
