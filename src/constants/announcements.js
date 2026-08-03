export const ANNOUNCEMENTS = Object.freeze([
  {
    id: "v0-15-navigation-analytics",
    type: "release",
    icon: "🧭",
    title: "A clearer journey and honest personal analytics",
    summary:
      "Navigation is calmer, updates and private notifications share one Inbox, C.H.A.O.S. prerequisites stay visible, and personal trends are easier to understand.",
    body:
      "The desktop sidebar is grouped around the player journey, competition and communications without repeating Profile. Announcements and private season messages now meet in one Inbox while keeping their security boundaries separate. Personal Analytics reuses factual entries and the existing Points Engine to show weekly activity, consistency and category balance without changing Points or Experience Points. Administrators can also see exactly what C.H.A.O.S. still needs before activation.",
    publishedAt: "2026-08-03",
    featured: true,
    version: "0.15.0",
  },
  {
    id: "v0-14-season-houses-pocket",
    type: "release",
    icon: "⚡",
    title: "C.H.A.O.S. has entered the season system",
    summary:
      "Seasons now contain themed Houses, dual leaderboards, weekly leadership voting, roster movement, Pocket Week reserves and private player notifications.",
    body:
      "C.H.A.O.S. assigns registered players fairly when an administrator activates it. House leadership is elected through a 24-hour weekly ballot, earlier House contributions remain historically permanent after roster changes, and Pocket Week activities stay worth zero points until the player deliberately activates an available amount during the season. Power Plays, Diamonds, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are confirmed.",
    publishedAt: "2026-08-03",
    featured: false,
    version: "0.14.0",
  },
  {
    id: "v0-13-1-rulebook-installation-hotfix",
    type: "release",
    icon: "🧰",
    title: "The Rulebook release has been stabilised",
    summary:
      "The pre-review reference release now installs cleanly, validates all current league fixtures and keeps React memo dependencies stable.",
    body:
      "This patch replaces managed source folders instead of nesting them, restores the complete 54-test domain suite and aligns the 15 Firestore Rules fixtures with the hardened league model. No challenge scoring or player data has been changed.",
    publishedAt: "2026-08-02",
    featured: false,
    version: "0.13.1",
  },
  {
    id: "v0-13-rulebook-points-guide",
    type: "release",
    icon: "📜",
    title: "The Rulebook and Points Guide are now in the app",
    summary:
      "Players can search the current challenge rules, distinguish inactive 2025 mechanics and inspect every public scoring ladder from one accessible reference area.",
    body:
      "The Rulebook preserves the original challenge spirit while clearly separating current rules, season options and unsupported legacy mechanics. The Points Guide is generated from the live scoring constants, including activity thresholds, difficulty multipliers, visible goal bonuses and league-day scoring. Hidden progression surprises remain intentionally undisclosed.",
    publishedAt: "2026-08-02",
    featured: false,
    version: "0.13.0",
  },
  {
    id: "v0-12-pre-review-hardening",
    type: "release",
    icon: "🧭",
    title: "Pre-review hardening is complete",
    summary:
      "Security boundaries, community data integrity, accessibility, deployment targeting and recovery behaviour have been strengthened before the full product review.",
    body:
      "Invitation codes can no longer be enumerated, league capacity is enforced transactionally, completed season contributions remain permanent, stale weekly team totals are ignored, navigation accessibility is stronger and production chunk-loading failures can recover safely. This remains a pre-1.0 release for integrated review and further refinement.",
    publishedAt: "2026-08-01",
    featured: false,
    version: "0.12.0",
  },
  {
    id: "v0-11-community-coaching",
    type: "release",
    icon: "🤝",
    title: "Teams, leagues and Legacy Coach are ready",
    summary:
      "Build a team, enter a consistency-weighted seasonal league and receive transparent guidance based only on your own factual activity.",
    body:
      "Team progress reuses existing entries, league rules are frozen for each season, and every Legacy Coach recommendation explains the evidence behind it. These systems remain part of the pre-1.0 development cycle and will be reviewed before final release.",
    publishedAt: "2026-08-01",
    featured: false,
    version: "0.11.0",
  },
  {
    id: "v0-10-release-hardening",
    type: "release",
    icon: "🧪",
    title: "Pre-release hardening and shared library releases",
    summary:
      "Approved community suggestions can now enter versioned shared libraries, while emulator tests and preview deployments strengthen release confidence.",
    body:
      "Platform Administrators can publish reviewed exercises, cardio activities and skills in deliberate releases. Error reporting, paginated operations and Firebase Hosting preview tools support the final review period before any v1.0 decision.",
    publishedAt: "2026-08-01",
    version: "0.10.0",
  },
  {
    id: "v0-9-live-administration",
    type: "release",
    icon: "🛡️",
    title: "Live announcements and trusted administration",
    summary:
      "Platform Administrators can now publish announcements, review suggestions, manage trusted roles and inspect immutable audit history.",
    body:
      "Announcement read status now follows players across devices. Administrative changes are protected by Firestore rules and recorded in audit events so authority remains transparent and accountable.",
    publishedAt: "2026-08-01",
    featured: false,
    version: "0.9.0",
  },
  {
    id: "v0-8-profile-announcements",
    type: "release",
    icon: "🪪",
    title: "Legacy Avatars and smarter announcements",
    summary:
      "Profiles can now use built-in Legacy Avatars, while announcements remember what you have read on this device.",
    body:
      "Choose an avatar and display name without uploading an image. Announcement filters, unread status and navigation badges make important updates easier to find.",
    publishedAt: "2026-08-01",
    version: "0.8.0",
  },
  {
    id: "v0-7-navigation",
    type: "release",
    icon: "🚀",
    title: "A new command centre has arrived",
    summary:
      "Champions Legacy Challenge now has dedicated Dashboard, Log & Journal, Progress, Announcements and Profile areas.",
    body:
      "The new navigation keeps frequent actions close while giving every major system room to grow. Logging and journal history now live together on their own focused page.",
    publishedAt: "2026-08-01",
    version: "0.7.0",
  },
  {
    id: "progression-foundation",
    type: "feature",
    icon: "🔥",
    title: "Streaks, experience points and achievements are live",
    summary:
      "Daily consistency now builds streaks, personal experience points, levels, achievements and records.",
    body:
      "Experience points remain separate from competitive points. Goal and streak bonuses stay moderate, explainable and derived from factual activity entries.",
    publishedAt: "2026-07-31",
    version: "0.6.0",
  },
  {
    id: "honest-logging",
    type: "community",
    icon: "🧭",
    title: "Honest progress matters more than impressive data",
    summary:
      "Champions Legacy Challenge rewards honest effort—not impressive-looking data.",
    body:
      "Record what happened, learn from it and continue. A modest truthful entry is more useful than a perfect fictional week.",
    publishedAt: "2026-07-30",
  },
]);
