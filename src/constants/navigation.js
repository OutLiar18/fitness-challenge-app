export const CORE_NAV_ITEMS = Object.freeze([
  {
    id: "dashboard",
    label: "Home",
    shortLabel: "Home",
    icon: "🏠",
    to: "/dashboard",
    tone: "blue",
    description: "Your goals, score and momentum at a glance.",
  },
  {
    id: "log",
    label: "Log activity",
    shortLabel: "Log",
    icon: "➕",
    to: "/log",
    tone: "green",
    description: "Record activities and review your journal.",
    accent: true,
  },
  {
    id: "progress",
    label: "Progress",
    shortLabel: "Progress",
    icon: "🏆",
    to: "/progress",
    tone: "gold",
    description: "Experience points, streaks, achievements and personal records.",
  },
]);

export const COMPETITION_NAV_ITEMS = Object.freeze([
  {
    id: "seasons",
    label: "Seasons",
    shortLabel: "Seasons",
    icon: "🛡️",
    to: "/seasons",
    tone: "gold",
    description: "Registration, individual standings and House competition.",
  },
  {
    id: "houses",
    label: "Houses",
    shortLabel: "Houses",
    icon: "🏰",
    to: "/houses",
    tone: "green",
    description: "Season Houses, C.H.A.O.S., leadership and roster movement.",
  },
]);

export const INBOX_NAV_ITEM = Object.freeze({
  id: "inbox",
  label: "Inbox",
  shortLabel: "Inbox",
  icon: "🔔",
  to: "/inbox",
  tone: "purple",
  description: "Public announcements and private season notifications in one place.",
});

export const PRIMARY_NAV_ITEMS = Object.freeze([
  ...CORE_NAV_ITEMS,
  ...COMPETITION_NAV_ITEMS,
  INBOX_NAV_ITEM,
]);

export const SECONDARY_NAV_ITEMS = Object.freeze([
  {
    id: "analytics",
    label: "Analytics",
    icon: "📈",
    to: "/analytics",
    tone: "blue",
    description: "Activity trends, consistency patterns and category balance.",
  },
  {
    id: "pocket",
    label: "Pocket Week",
    icon: "🧳",
    to: "/pocket",
    tone: "cyan",
    description: "Store pre-season activity and activate it when needed.",
  },
  {
    id: "coach",
    label: "Legacy Coach",
    icon: "✨",
    to: "/coach",
    tone: "purple",
    description: "Transparent guidance based on your own activity history.",
  },
]);

export const REFERENCE_NAV_ITEMS = Object.freeze([
  {
    id: "rules",
    label: "Challenge Rulebook",
    icon: "📜",
    to: "/rules",
    tone: "blue",
    description: "Current rules, season options and retired challenge mechanics.",
  },
  {
    id: "points-guide",
    label: "Points Guide",
    icon: "📊",
    to: "/points-guide",
    tone: "cyan",
    description: "Simple scoring ladders, public formulas and visible bonuses.",
  },
]);

export const SUPPORT_NAV_ITEMS = Object.freeze([
  {
    id: "help",
    label: "Help & Privacy",
    icon: "🛟",
    to: "/help",
    tone: "cyan",
    description: "Getting started, data handling, privacy and account controls.",
  },
]);

export const ADMIN_NAV_ITEM = Object.freeze({
  id: "admin",
  label: "Administration",
  icon: "⚙️",
  to: "/admin",
  tone: "red",
  description: "Moderation, announcements and season control.",
  requiredRole: "admin",
});

export const DESKTOP_NAV_GROUPS = Object.freeze([
  { id: "journey", label: "Your journey", items: CORE_NAV_ITEMS },
  { id: "competition", label: "Competition", items: COMPETITION_NAV_ITEMS },
  { id: "communications", label: "Communications", items: [INBOX_NAV_ITEM] },
]);

export const MOBILE_NAV_ITEMS = Object.freeze([
  CORE_NAV_ITEMS[0],
  CORE_NAV_ITEMS[1],
  CORE_NAV_ITEMS[2],
  INBOX_NAV_ITEM,
]);

export function getNavigationItemByPath(pathname) {
  const normalizedPath = String(pathname || "").split("?")[0];
  const items = [
    ...PRIMARY_NAV_ITEMS,
    ...SECONDARY_NAV_ITEMS,
    ...REFERENCE_NAV_ITEMS,
    ...SUPPORT_NAV_ITEMS,
    ADMIN_NAV_ITEM,
  ];

  return (
    items.find(
      (item) =>
        normalizedPath === item.to ||
        (item.to !== "/dashboard" && normalizedPath.startsWith(`${item.to}/`)),
    ) ?? null
  );
}
