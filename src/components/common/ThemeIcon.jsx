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
