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
    description: "XP, streaks, achievements and personal records.",
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

export const FUTURE_NAV_ITEMS = Object.freeze([
  {
    id: "teams",
    label: "Teams",
    icon: "🤝",
    to: "/future/teams",
    tone: "green",
    description: "Shared goals and team challenges.",
    badge: "Preview",
  },
  {
    id: "leagues",
    label: "Leagues",
    icon: "🛡️",
    to: "/future/leagues",
    tone: "gold",
    description: "Healthy seasonal competition.",
    badge: "Preview",
  },
  {
    id: "coach",
    label: "Legacy Coach",
    icon: "✨",
    to: "/future/coach",
    tone: "purple",
    description: "Transparent, user-controlled guidance.",
    badge: "Preview",
  },
]);

export const ADMIN_NAV_ITEM = Object.freeze({
  id: "admin",
  label: "Admin",
  icon: "⚙️",
  to: "/admin",
  tone: "red",
  description: "Moderation, announcements and challenge control.",
  requiredRole: "admin",
});

// The mobile bar intentionally stays focused. Secondary and future areas live
// behind More so the bar remains usable on 320 px screens.
export const MOBILE_NAV_ITEMS = Object.freeze(
  PRIMARY_NAV_ITEMS.filter((item) =>
    ["dashboard", "log", "progress", "announcements"].includes(item.id),
  ),
);

export function getNavigationItemByPath(pathname) {
  const normalizedPath = String(pathname || "").split("?")[0];
  const items = [
    ...PRIMARY_NAV_ITEMS,
    ...FUTURE_NAV_ITEMS,
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
