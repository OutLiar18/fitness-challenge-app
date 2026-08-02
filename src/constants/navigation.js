export const PRIMARY_NAV_ITEMS = Object.freeze([
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
  {
    id: "announcements",
    label: "Announcements",
    shortLabel: "News",
    icon: "📣",
    to: "/announcements",
    tone: "purple",
    description: "Product news, challenge updates and notices.",
  },
  {
    id: "profile",
    label: "Profile",
    shortLabel: "Profile",
    icon: "👤",
    to: "/profile",
    tone: "cyan",
    description: "Your player identity and account overview.",
  },
]);

export const SECONDARY_NAV_ITEMS = Object.freeze([
  {
    id: "teams",
    label: "Teams",
    icon: "🤝",
    to: "/teams",
    tone: "green",
    description: "Shared identity, accountability and weekly team progress.",
  },
  {
    id: "leagues",
    label: "Leagues",
    icon: "🛡️",
    to: "/leagues",
    tone: "gold",
    description: "Consistency-weighted seasonal competition.",
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

// Retained as an alias so older tests and documentation links do not break.
export const FUTURE_NAV_ITEMS = SECONDARY_NAV_ITEMS;

export const ADMIN_NAV_ITEM = Object.freeze({
  id: "admin",
  label: "Administration",
  icon: "⚙️",
  to: "/admin",
  tone: "red",
  description: "Moderation, announcements and challenge control.",
  requiredRole: "admin",
});

// The mobile bar intentionally stays focused. Community and account areas live
// behind More so the bar remains usable on 320-pixel screens.
export const MOBILE_NAV_ITEMS = Object.freeze(
  PRIMARY_NAV_ITEMS.filter((item) =>
    ["dashboard", "log", "progress", "announcements"].includes(item.id),
  ),
);

export function getNavigationItemByPath(pathname) {
  const normalizedPath = String(pathname || "").split("?")[0];
  const items = [
    ...PRIMARY_NAV_ITEMS,
    ...SECONDARY_NAV_ITEMS,
    ...REFERENCE_NAV_ITEMS,
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
