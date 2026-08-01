export const PRIMARY_NAV_ITEMS = Object.freeze([
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    icon: "⌂",
    to: "/dashboard",
    description: "Your goals, score and momentum at a glance.",
  },
  {
    id: "log",
    label: "Log & Journal",
    shortLabel: "Log",
    icon: "＋",
    to: "/log",
    description: "Record activities and review your history.",
    accent: true,
  },
  {
    id: "progress",
    label: "Progress",
    shortLabel: "Progress",
    icon: "↗",
    to: "/progress",
    description: "XP, streaks, achievements and personal records.",
  },
  {
    id: "announcements",
    label: "Announcements",
    shortLabel: "News",
    icon: "◉",
    to: "/announcements",
    description: "Product news, challenge updates and notices.",
    badge: "New",
  },
  {
    id: "profile",
    label: "Profile",
    shortLabel: "Profile",
    icon: "☺",
    to: "/profile",
    description: "Your player identity and account overview.",
  },
]);

export const FUTURE_NAV_ITEMS = Object.freeze([
  {
    id: "teams",
    label: "Teams",
    icon: "⚑",
    to: "/future/teams",
    description: "Shared goals and team challenges.",
    badge: "Preview",
  },
  {
    id: "leagues",
    label: "Leagues",
    icon: "♛",
    to: "/future/leagues",
    description: "Healthy seasonal competition.",
    badge: "Preview",
  },
  {
    id: "coach",
    label: "Legacy Coach",
    icon: "✦",
    to: "/future/coach",
    description: "Transparent, user-controlled guidance.",
    badge: "Preview",
  },
]);

export const ADMIN_NAV_ITEM = Object.freeze({
  id: "admin",
  label: "Admin",
  icon: "⚙",
  to: "/admin",
  description: "Moderation, announcements and challenge control.",
  requiredRole: "admin",
});

export const MOBILE_NAV_ITEMS = Object.freeze(
  PRIMARY_NAV_ITEMS.filter((item) =>
    ["dashboard", "log", "progress", "announcements", "profile"].includes(
      item.id,
    ),
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
