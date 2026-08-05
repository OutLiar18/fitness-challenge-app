export const ANNOUNCEMENTS = Object.freeze([
  {
    id: "v0-22-trusted-account-deletion",
    type: "release",
    icon: "🧹",
    title: "Account deletion now has a trusted, privacy-preserving process",
    summary:
      "Players receive a seven-day cancellation window before private account records are removed and shared season history is anonymised.",
    body:
      "A Platform Administrator can now audit an acknowledged request with a private local tool, review blocking findings and begin irreversible processing only after an explicit confirmation. The processor removes the Firebase Authentication account and eligible private records, preserves shared competition results under a stable Former Player identity, protects the final Platform Administrator account and records an immutable completion receipt. A deleted person may register again as a completely fresh account, but previous history is never restored or automatically reconnected.",
    publishedAt: "2026-08-05",
    featured: true,
    version: "0.22.0",
  },
  {
    id: "v0-21-trusted-season-reconciliation",
    type: "release",
    icon: "🧮",
    title: "Season standings can now be checked from a trusted calculation",
    summary:
      "Platform Administrators can run a free local reconciliation, inspect integrity findings and publish an immutable trusted leaderboard snapshot.",
    body:
      "The trusted season tool rebuilds individual and House standings from frozen season rules, memberships and immutable competition contributions. A safe dry run creates a local JSON report without changing Firebase. Publication is blocked when evidence, correction or contribution links are incomplete, and a successful publication records a stable fingerprint, immutable snapshot, trusted run and audit event. The tool uses a private administrator credential kept outside the project and runs manually, so no paid Cloud Functions or automatic background schedule are required.",
    publishedAt: "2026-08-05",
    featured: false,
    version: "0.21.0",
  },
  {
    id: "v0-20-audited-entry-corrections",
    type: "release",
    icon: "🧾",
    title: "Incorrect activity facts can now be corrected without rewriting history",
    summary:
      "Platform Administrators can create immutable replacement entries, preserve earlier records and reconcile linked season points and proof claims.",
    body:
      "The new Entry Integrity workspace searches by entry ID or WhatsApp verification ID, diagnoses linked proof and competition records, and creates a factual replacement instead of silently editing or deleting history. Season activity points are reconciled through immutable reversal and replacement contributions, superseded proof remains visible, House attribution stays fixed to the original activity moment, and players see only the current factual version in goals and personal statistics. Journal history now renders seven recorded days at a time while retaining the complete active history for calculations.",
    publishedAt: "2026-08-04",
    featured: false,
    version: "0.20.0",
  },
  {
    id: "v0-19-season-command-centre",
    type: "release",
    icon: "🎛️",
    title: "Season operations now have one command centre",
    summary:
      "Authorised season operators can see next actions, evidence workload, leadership status and publication history in one focused workspace.",
    body:
      "The new Season Command Centre combines existing House, C.H.A.O.S., leadership, WhatsApp proof and leaderboard records without creating an alternate score. Administrators receive clear next-action guidance, evidence workload by category, immutable decision and snapshot history, plus a downloadable operations report. Category reviewers remain limited to their assigned evidence categories, and no WhatsApp media is stored or exported.",
    publishedAt: "2026-08-04",
    featured: false,
    version: "0.19.0",
  },
  {
    id: "v0-18-whatsapp-evidence-published-standings",
    type: "release",
    icon: "✅",
    title: "WhatsApp proof now connects cleanly to season scoring",
    summary:
      "Verification IDs, category review queues and controlled daily leaderboard snapshots keep proof practical without storing media in the app.",
    body:
      "Running and Steps submissions now hold proof-dependent season points until an authorised reviewer accepts the matching WhatsApp evidence. Water and Fruit can earn one daily three-point proof bonus after their configured target is met. Players send the short verification ID shown beside the entry, while the app stores only structured decisions and audit history. Administrators retain live standings; players see the latest published daily snapshot, with a 10:00 Johannesburg administrator-session fallback when no manual snapshot has been published.",
    publishedAt: "2026-08-04",
    featured: false,
    version: "0.18.0",
  },
  {
    id: "v0-17-player-readiness-account-control",
    type: "release",
    icon: "🛟",
    title: "A clearer start and stronger account control",
    summary:
      "New players receive a concise guided introduction, while Help & Privacy explains data boundaries, personal exports and account deletion requests.",
    body:
      "New accounts now begin with an accessible four-step introduction to honest logging, progression and season competition. Help & Privacy provides getting-started guidance, a plain-language data map, personal JSON export and a reviewable account deletion request workflow. Platform Administrators can acknowledge those requests with an audit record, while the app remains honest that final Firebase deletion requires a trusted operational process.",
    publishedAt: "2026-08-04",
    featured: false,
    version: "0.17.0",
  },
  {
    id: "v0-16-progressive-disclosure",
    type: "release",
    icon: "🪟",
    title: "More breathing room across your journey",
    summary:
      "Dense pages now open with a focused overview and let you choose achievements, history, analytics, season tools and other detail when you need it.",
    body:
      "Progress, logging, analytics, profile, Legacy Coach, Points Guide, Seasons, Houses, Pocket Week and Administration now share a clearer section workspace. Desktop tabs include descriptions and keyboard navigation, while smaller screens use a straightforward section selector. Nothing about your points, activity history or season contributions has changed—this release simply makes the same tools calmer to explore.",
    publishedAt: "2026-08-03",
    featured: false,
    version: "0.16.0",
  },
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
    featured: false,
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
