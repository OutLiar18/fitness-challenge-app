const ICON_PATHS = Object.freeze({
  add: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  progress: (
    <>
      <path d="M5 16l4-4 3 3 7-8" />
      <path d="M14 7h5v5" />
    </>
  ),
  journal: (
    <>
      <path d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v12H8.5A2.5 2.5 0 0 1 6 16.5z" />
      <path d="M6 16.5A2.5 2.5 0 0 1 8.5 14H18" />
      <path d="M9 8h5" />
    </>
  ),
  refresh: (
    <>
      <path d="M19 8a7 7 0 1 0 1.2 6" />
      <path d="M19 4v4h-4" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M9.5 20v-6h5v6" />
    </>
  ),
  seasons: (
    <>
      <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  houses: (
    <>
      <path d="M4 20V9l3-2 2 2 3-4 3 4 2-2 3 2v11" />
      <path d="M2.5 20h19" />
      <path d="M9.5 20v-5h5v5" />
      <path d="M7 7V4M17 7V4" />
    </>
  ),
  inbox: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 20h4" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 19V10" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </>
  ),
  pocket: (
    <>
      <path d="M5 8h14l1 12H4z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9 12h6" />
    </>
  ),
  coach: (
    <>
      <path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2z" />
      <path d="m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8z" />
      <path d="M5 14v5M2.5 16.5h5" />
    </>
  ),
  rulebook: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z" />
    </>
  ),
  points: (
    <>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-6" />
      <path d="M3 19h18" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.7 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1-2.1 1.5-2.1 3" />
      <path d="M12 17h.01" />
    </>
  ),
  admin: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.2v4H21a1.7 1.7 0 0 0-1.6 1z" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  signout: (
    <>
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M8 12h10" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  command: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h5M8 17h3" />
    </>
  ),
  power: (
    <>
      <path d="m13 2-7 11h6l-1 9 7-12h-6z" />
    </>
  ),
  standings: (
    <>
      <path d="M5 20v-6h4v6M10 20V8h4v12M15 20V4h4v16" />
      <path d="M3 20h18" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v4a4 4 0 0 1-8 0z" />
      <path d="M8 6H5v1a4 4 0 0 0 4 4M16 6h3v1a4 4 0 0 1-4 4" />
      <path d="M12 12v4M8 20h8M10 16h4v4" />
    </>
  ),
  evidence: (
    <>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v5h5" />
      <path d="m8 14 2 2 5-5" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" />
      <path d="M12 8v2M12 14v2M12 18v1" />
    </>
  ),
  back: (
    <>
      <path d="m11 6-6 6 6 6" />
      <path d="M5 12h14" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l11-11-4-4L4 16z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
});

export default function ThemeIcon({
  name,
  size = 20,
  strokeWidth = 2,
  className = "",
}) {
  const paths = ICON_PATHS[name];

  if (!paths) {
    return null;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );
}
