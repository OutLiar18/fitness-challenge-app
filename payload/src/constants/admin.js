export const USER_ROLES = Object.freeze([
  {
    id: "user",
    label: "Player",
    description: "Records activities and manages personal progress.",
  },
  {
    id: "leagueAdmin",
    label: "League Administrator",
    description: "A future role for managing individual leagues and communities.",
  },
  {
    id: "admin",
    label: "Platform Administrator",
    description: "Manages platform announcements, moderation and trusted roles.",
  },
]);

export const USER_ROLE_IDS = Object.freeze(
  USER_ROLES.map((role) => role.id),
);

export const ANNOUNCEMENT_TYPES = Object.freeze([
  { id: "release", label: "Release", icon: "🚀" },
  { id: "feature", label: "Feature", icon: "✨" },
  { id: "challenge", label: "Challenge", icon: "🏆" },
  { id: "community", label: "Community", icon: "🤝" },
  { id: "maintenance", label: "Maintenance", icon: "🛠️" },
]);

export const ANNOUNCEMENT_TYPE_IDS = Object.freeze(
  ANNOUNCEMENT_TYPES.map((type) => type.id),
);

export const ANNOUNCEMENT_STATUSES = Object.freeze([
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "archived", label: "Archived" },
]);

export const ANNOUNCEMENT_STATUS_IDS = Object.freeze(
  ANNOUNCEMENT_STATUSES.map((status) => status.id),
);

export const SUGGESTION_STATUSES = Object.freeze([
  { id: "pending", label: "Pending review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
]);

export function getRoleLabel(roleId) {
  return USER_ROLES.find((role) => role.id === roleId)?.label ?? "Player";
}

export function getAnnouncementType(typeId) {
  return (
    ANNOUNCEMENT_TYPES.find((type) => type.id === typeId) ??
    ANNOUNCEMENT_TYPES[0]
  );
}
