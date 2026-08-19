const HOUSE_EMBLEM_PATHS = Object.freeze({
  springbok: (<><path d="M8 3c-1 3 0 5 2 7M16 3c1 3 0 5-2 7"/><path d="M8 7c1-2 2-3 4-3s3 1 4 3l1 5-5 8-5-8z"/><path d="M9.5 11h.01M14.5 11h.01"/></>),
  lion: (<><circle cx="12" cy="12" r="8"/><path d="M8 9 6 6M16 9l2-3M9 14c2 2 4 2 6 0"/><path d="M10 11h.01M14 11h.01"/></>),
  leopard: (<><path d="m7 7-2-3 4 1M17 7l2-3-4 1"/><path d="M7 7c0-3 10-3 10 0v8c-2 4-8 4-10 0z"/><circle cx="10" cy="10" r=".7"/><circle cx="14.5" cy="9" r=".7"/><circle cx="12" cy="14" r=".7"/></>),
  rhino: (<><path d="M4 14c1-5 5-8 11-7l5 3-4 2 2 5H8z"/><path d="m16 8 2-5 1 6M8 13h.01"/></>),
  elephant: (<><path d="M6 8c0-5 12-5 12 0v6c0 3-2 5-4 5v-7h-4v7c-2 0-4-2-4-5z"/><path d="M6 9 3 12l3 3M18 9l3 3-3 3"/><path d="M12 12v9"/></>),
  buffalo: (<><path d="M8 8C5 4 2 5 3 9c1 3 4 3 6 2M16 8c3-4 6-3 5 1-1 3-4 3-6 2"/><path d="M8 8c2-2 6-2 8 0v7c-2 4-6 4-8 0z"/><path d="M10 12h.01M14 12h.01"/></>),
  eagle: (<><path d="M12 5c-4 0-7 3-9 7 4-2 6-1 9 2 3-3 5-4 9-2-2-4-5-7-9-7z"/><path d="M12 14v6M9 18l3 2 3-2"/><path d="m11 8 4 1-3 2"/></>),
  wolf: (<><path d="m7 8-2-5 5 3M17 8l2-5-5 3"/><path d="M7 8c1-3 9-3 10 0l-1 7-4 5-4-5z"/><path d="M9.5 11h.01M14.5 11h.01M10 15h4"/></>),
  shark: (<><path d="M3 13c5-6 11-6 17-2l2-3v8l-2-3c-6 4-12 4-17-2z"/><path d="m10 9 2-4 2 5M8 12h.01"/></>),
  phoenix: (<><path d="M12 3c4 5 4 9 0 13-4-4-4-8 0-13z"/><path d="M10 9 4 6l3 6-4 3 7 1M14 9l6-3-3 6 4 3-7 1"/><path d="m10 20 2-4 2 4"/></>),
  dragon: (<><path d="M6 17c0-8 4-13 10-13l-2 4 4 1-3 3 3 3-5 1-2 4z"/><path d="M6 17c3-1 5 0 7 3M13 9h.01"/></>),
  storm: (<><path d="M8 16H6a4 4 0 0 1 0-8 6 6 0 0 1 11-1 4 4 0 0 1 1 8h-2"/><path d="m12 11-3 6h3l-1 4 5-7h-3l2-3z"/></>),
  mountain: (<><path d="m3 20 7-13 3 5 2-3 6 11z"/><path d="m8 11 2 2 2-2M15 14l1 1 1-1"/></>),
  shield: (<><path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6z"/><path d="M12 7v10M8 11h8"/></>),
  crown: (<><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6z"/><path d="M7 20h10"/></>),
  compass: (<><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/><circle cx="12" cy="12" r="1"/></>),
  cobra: (<><path d="M12 3c4 2 5 5 3 8l3 3-3 2c-1 4-5 5-8 2 3-1 5-3 5-6V3z"/><path d="M12 8h.01M12 18c2 1 3 2 3 3"/></>),
  tiger: (<><path d="m7 7-2-3 4 1M17 7l2-3-4 1"/><path d="M7 7c0-3 10-3 10 0v8c-2 4-8 4-10 0z"/><path d="m9 8 2 2M15 8l-2 2M12 6v4M10 15h4"/></>),
  scorpion: (<><circle cx="12" cy="13" r="3"/><path d="M9 12 5 9 3 11M15 12l4-3 2 2M12 10V6c0-3 5-3 5 0 0 2-2 2-2 4"/><path d="M10 16 8 20M14 16l2 4"/></>),
  bear: (<><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><path d="M6 9c0-5 12-5 12 0v6c-2 5-10 5-12 0z"/><path d="M10 12h.01M14 12h.01"/><path d="M10 15h4"/></>),
  orca: (<><path d="M3 13c4-6 10-7 16-3l2-2v6l-3-1c-4 5-10 6-15 2z"/><path d="m10 10 2-4 2 4M9 13c1 1 2 1 3 0"/></>),
  wave: (<><path d="M3 15c3-4 6-4 9 0s6 4 9 0"/><path d="M3 10c3-4 6-4 9 0s6 4 9 0"/></>),
  volcano: (<><path d="m4 20 6-12 2 3 2-3 6 12z"/><path d="M10 8c-2-2-1-4 1-5M14 8c2-2 1-4-1-5"/><path d="m9 14 3 2 3-2"/></>),
  moon: (<><path d="M18 17a8 8 0 1 1-8-12 6 6 0 0 0 8 12z"/></>),
  planet: (<><circle cx="12" cy="12" r="5"/><path d="M3 15c4 2 13-1 18-6M4 9c5 4 13 5 17 4"/></>),
  comet: (<><path d="m15 5 1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/><path d="M12 12 4 20M10 9 3 14M15 14l-5 7"/></>),
  rocket: (<><path d="M14 4c4 0 6 1 6 1s0 5-5 10l-5-5c1-3 2-5 4-6z"/><path d="m10 10-4 1-2 4 6-1M15 15l-1 6 4-2 1-4"/><circle cx="15" cy="8" r="1.5"/></>),
  diamond: (<><path d="m4 9 4-5h8l4 5-8 11z"/><path d="M4 9h16M8 4l4 5 4-5M8 9l4 11 4-11"/></>),
  anchor: (<><path d="M12 3v15M8 7h8"/><circle cx="12" cy="5" r="2"/><path d="M5 13c0 5 3 8 7 8s7-3 7-8M5 13l-2 2M19 13l2 2"/></>),
  swords: (<><path d="m5 4 8 8M11 14l2-2 6 6-2 2z"/><path d="m19 4-8 8M13 14l-2-2-6 6 2 2z"/></>),
  oak: (<><path d="M12 21v-7M9 21h6"/><path d="M12 4a4 4 0 0 0-4 4 3 3 0 0 0-2 5c1 2 3 2 6 1 3 1 5 1 6-1a3 3 0 0 0-2-5 4 4 0 0 0-4-4z"/></>),
  mask: (<><path d="M4 6c5-2 11-2 16 0l-2 10c-4 5-8 5-12 0z"/><path d="M7 10c1-1 2-1 3 0M14 10c1-1 2-1 3 0M9 15c2 2 4 2 6 0"/></>),
  raven: (<><path d="M5 15c4-8 9-10 14-7l-4 3 3 3-5 1-2 5z"/><path d="M5 15c3-1 5 0 7 3M15 9h.01"/><path d="M8 18 6 21M11 18l1 3"/></>),
  owl: (<><path d="M6 7 4 4l5 2M18 7l2-3-5 2"/><path d="M6 7c1-3 11-3 12 0v8l-6 6-6-6z"/><circle cx="9" cy="11" r="2"/><circle cx="15" cy="11" r="2"/><path d="m11 14 1 1 1-1"/></>),
  fox: (<><path d="m7 8-2-5 5 3M17 8l2-5-5 3"/><path d="M7 8c2-3 8-3 10 0l-2 7-3 4-3-4z"/><path d="m8 11 4 4 4-4M10 10h.01M14 10h.01"/></>),
  boar: (<><path d="M6 9c1-4 11-4 12 0v6c-3 4-9 4-12 0z"/><path d="M8 13c-3 0-4 2-3 4M16 13c3 0 4 2 3 4"/><path d="M9 11h.01M15 11h.01M10 15h4"/></>),
  crocodile: (<><path d="M3 13 7 8h8l6 4-6 4H7z"/><path d="m8 8 1-3 2 3M12 8l1-3 2 3"/><path d="M6 13h12M9 13l1 2M13 13l1 2"/></>),
  gorilla: (<><path d="M8 6c2-3 6-3 8 0l2 5-2 7H8l-2-7z"/><path d="M8 9 4 13l2 6M16 9l4 4-2 6"/><path d="M10 9h.01M14 9h.01M10 14h4"/></>),
  kraken: (<><path d="M7 10c0-6 10-6 10 0v4H7z"/><path d="M8 14c0 5-4 4-4 1M11 14c0 6-3 7-4 5M14 14c0 6 3 7 4 5M17 14c0 5 4 4 4 1"/><path d="M10 9h.01M14 9h.01"/></>),
  bat: (<><path d="M12 10 9 6 7 9 3 7l2 8 7 4 7-4 2-8-4 2-2-3z"/><path d="M10 12h.01M14 12h.01"/></>),
  ram: (<><path d="M8 10C3 9 3 3 8 4c3 1 2 5 0 6M16 10c5-1 5-7 0-6-3 1-2 5 0 6"/><path d="M8 9c2-2 6-2 8 0v6c-2 4-6 4-8 0z"/><path d="M10 12h.01M14 12h.01"/></>),
  bull: (<><path d="M8 8C6 5 3 4 2 6c2 4 4 4 7 3M16 8c2-3 5-4 6-2-2 4-4 4-7 3"/><path d="M8 8c2-2 6-2 8 0v7c-2 4-6 4-8 0z"/><path d="M10 12h.01M14 12h.01"/></>),
  stallion: (<><path d="M8 4c6 0 9 4 8 9l-3 7H8l2-6-3-4z"/><path d="M8 4 6 2M15 7l3-2M11 9h.01"/><path d="m9 14 4 1"/></>),
  spider: (<><circle cx="12" cy="12" r="3"/><path d="M9 10 5 7M9 12H4M9 14l-4 3M15 10l4-3M15 12h5M15 14l4 3"/><path d="M11 9 9 5M13 9l2-4M11 15l-2 4M13 15l2 4"/></>),
  trident: (<><path d="M12 3v18M12 7c-4 0-6-2-6-5M12 7c4 0 6-2 6-5M6 2v4M18 2v4M9 20h6"/></>),
  axe: (<><path d="M13 4 7 20M11 6c3-3 6-3 9-1l-2 5c-3-1-5-2-7-4z"/><path d="M5 20h5"/></>),
  hammer: (<><path d="m8 5 4-3 5 5-3 4z"/><path d="m11 9-7 9 2 2 9-7"/></>),
  castle: (<><path d="M4 21V8h4V5h3v3h2V5h3v3h4v13z"/><path d="M8 8v3M16 8v3M10 21v-6h4v6M4 12h16"/></>),
  fleur: (<><path d="M12 3c-3 3-3 6 0 8 3-2 3-5 0-8z"/><path d="M12 11c-3-4-8-3-8 1 0 3 3 4 6 2M12 11c3-4 8-3 8 1 0 3-3 4-6 2"/><path d="M12 11v10M8 18h8"/></>),
  sun: (<><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>),
  star: (<><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></>),
  snowflake: (<><path d="M12 2v20M4 6l16 12M20 6 4 18"/><path d="m9 4 3 3 3-3M9 20l3-3 3 3M4 10l4 1-1-4M20 14l-4-1 1 4"/></>),
  tornado: (<><path d="M4 5h16M6 9h12M8 13h8M10 17h4M11 21h2"/></>),
  lotus: (<><path d="M12 19c-4-4-4-9 0-14 4 5 4 10 0 14z"/><path d="M12 19c-5 0-8-3-9-8 5 0 8 2 9 8M12 19c5 0 8-3 9-8-5 0-8 2-9 8"/><path d="M7 20h10"/></>),
  skull: (<><path d="M6 11c0-5 3-8 6-8s6 3 6 8c0 3-1 5-3 6v4H9v-4c-2-1-3-3-3-6z"/><circle cx="9.5" cy="11" r="1.5"/><circle cx="14.5" cy="11" r="1.5"/><path d="m12 13-1 2h2M10 18v3M14 18v3"/></>),
  feather: (<><path d="M5 20c6-2 11-7 14-16-8 2-13 7-14 16z"/><path d="M6 18 17 7M8 14h5M10 10h5M7 17l-3 4"/></>),
});

export default function HouseEmblem({
  id,
  size = 32,
  strokeWidth = 1.8,
  className = "",
  decorative = true,
  label,
}) {
  const paths = HOUSE_EMBLEM_PATHS[id] ?? HOUSE_EMBLEM_PATHS.springbok;
  const accessibleLabel = label || id || "House emblem";

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
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      role={decorative ? undefined : "img"}
      focusable="false"
    >
      {paths}
    </svg>
  );
}
