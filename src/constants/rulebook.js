export const RULEBOOK_VERSION = "2026-08-v2";

export const RULE_STATUSES = Object.freeze({
  CURRENT: "current",
  SEASON: "season",
  INACTIVE: "inactive",
});

export const RULE_STATUS_META = Object.freeze({
  [RULE_STATUSES.CURRENT]: {
    label: "Current rule",
    description: "Applies throughout the current platform experience.",
    tone: "current",
  },
  [RULE_STATUSES.SEASON]: {
    label: "Season option",
    description:
      "Applies only when a league or official announcement activates it.",
    tone: "season",
  },
  [RULE_STATUSES.INACTIVE]: {
    label: "Not currently active",
    description:
      "Retained from the 2025 challenge for transparency, but not enforced by the app.",
    tone: "inactive",
  },
});

export const CHALLENGE_PARTICULARS = Object.freeze([
  {
    id: "name",
    label: "Name",
    value: "Champions Legacy Challenge",
    icon: "🏆",
  },
  {
    id: "week",
    label: "Challenge week",
    value: "Monday through Sunday",
    icon: "🗓️",
  },
  {
    id: "entry-window",
    label: "Editable entries",
    value: "Today and yesterday",
    icon: "🔒",
  },
  {
    id: "objective",
    label: "Objective",
    value:
      "Sweat, smile, and stumble forward together. Progress over perfection, laughter over limits.",
    icon: "🌱",
  },
]);

function rule(id, legacyRule, text, options = {}) {
  return Object.freeze({
    id,
    legacyRule,
    text,
    status: RULE_STATUSES.CURRENT,
    bullets: [],
    note: "",
    ...options,
  });
}

function seasonRule(id, legacyRule, text, options = {}) {
  return rule(id, legacyRule, text, {
    status: RULE_STATUSES.SEASON,
    ...options,
  });
}

export const RULEBOOK_SECTIONS = Object.freeze([
  {
    id: "absolutes",
    icon: "🛡️",
    title: "Absolutes and non-negotiables",
    summary: "The standards that protect trust, effort and fair competition.",
    rules: [
      rule("no-excuses", 1, "No excuses!", {
        note:
          "This is a call to take responsibility, not permission to ignore illness, injury or genuine emergencies.",
      }),
      rule("integrity", 2, "No cheating, integrity is everything."),
      rule(
        "cheating-consequences",
        3,
        "If a player is found to have deliberately cheated, their entry may be removed and their participation may be suspended or terminated after administrator review.",
        {
          note:
            "This replaces the 2025 novelty punishment with a clear, reviewable process.",
        },
      ),
      rule(
        "bug-exploitation",
        null,
        "Do not exploit application bugs, duplicate submissions, device errors or known scoring loopholes. Report them to a Platform Administrator.",
      ),
      rule(
        "own-account",
        null,
        "Each player must use their own account and record only activities they personally completed.",
      ),
    ],
  },
  {
    id: "structure",
    icon: "📅",
    title: "Challenge structure and participation",
    summary: "How weeks, dates, entries and official season instructions work.",
    rules: [
      rule(
        "challenge-week",
        4,
        "Each challenge week starts on Monday and ends on Sunday, a duration of 7 days.",
        {
          note:
            "The app uses Monday-to-Sunday local calendar weeks rather than the 2025 Tuesday-to-Monday format.",
        },
      ),
      rule(
        "official-dates-only",
        25,
        "Only activities started and completed during the official challenge or league period count toward that season.",
      ),
      rule(
        "record-in-app",
        5,
        "Record completed activities directly in Champions Legacy Challenge as soon as reasonably possible.",
        {
          note:
            "The app replaces the 2025 WhatsApp submission process.",
        },
      ),
      rule(
        "editable-window",
        6,
        "Activities may be added or deleted for today and yesterday. Older factual history becomes read-only.",
        {
          note:
            "This is the app equivalent of the original 24-hour submission rule.",
        },
      ),
      rule(
        "correct-date",
        13,
        "Use the correct activity date and provide the information requested by the entry form. This clears up ambiguity and protects accurate statistics.",
      ),
      rule(
        "personal-submission",
        26,
        "Each participant must record activities for themselves, even when the activity was completed with others. Shared effort is powerful, but personal responsibility is non-negotiable.",
      ),
      rule(
        "multiple-sessions",
        null,
        "Multiple genuine sessions may be recorded on the same day. Do not split or duplicate one activity merely to receive points more than once.",
      ),
      rule(
        "season-announcements",
        null,
        "Official league dates, special requirements and rule changes must be published through Announcements before they apply.",
      ),
    ],
  },
  {
    id: "evidence",
    icon: "✅",
    title: "Evidence and truthful recording",
    summary: "What the app records now and how optional proof may work in a season.",
    rules: [
      rule(
        "device-tracking",
        7,
        "Step counts, cardiovascular exercises and runs should be tracked with a suitable smart device or application where practical.",
      ),
      rule(
        "evidence-season-rule",
        7,
        "Evidence is not uploaded to the app at present. A league may require screenshots, GPS records or other proof through an organiser-approved process.",
        { status: RULE_STATUSES.SEASON },
      ),
      rule(
        "text-facts",
        9,
        "Upper Body, Core, Lower Body, Water, Fruit, Skill Development and Reading may be recorded from the player’s truthful account of what was completed.",
      ),
      rule(
        "proof-does-not-replace-integrity",
        null,
        "The absence of a proof requirement does not reduce the obligation to record activities honestly.",
      ),
      rule(
        "administrator-verification",
        null,
        "A Platform Administrator or League Administrator may request clarification when an entry appears incomplete, duplicated or inconsistent with the rules.",
      ),
    ],
  },
  {
    id: "points-and-standings",
    icon: "⭐",
    title: "Points, progress and standings",
    summary: "Where points come from and how competitive totals are separated.",
    rules: [
      rule(
        "official-points-guide",
        14,
        "Points are earned and accumulated according to the official Points Guide and the versioned scoring engine.",
        {
          note:
            "The 2025 ‘Calculus Laplace Transformation’ wording was a joke and is not an actual calculation method.",
        },
      ),
      rule(
        "single-source",
        null,
        "The application calculates points from recorded facts. Players must not manually alter calculated points or competitive history.",
      ),
      rule(
        "personal-vs-league",
        15,
        "Personal points and league standings serve different purposes. League scoring may cap activity points and reward participation without changing personal point totals.",
      ),
      rule(
        "xp-separate",
        null,
        "Experience points, levels and achievements are personal progression systems. They are not added to competitive point totals unless a published rule explicitly says otherwise.",
      ),
      rule(
        "ruleset-freeze",
        null,
        "An active league keeps the scoring ruleset with which it started. Later balancing changes must not rewrite completed seasonal history.",
      ),
      rule(
        "leaderboards",
        15,
        "Individual and team leaderboards may track progress when an active league supports them.",
        { status: RULE_STATUSES.SEASON },
      ),
    ],
  },
  {
    id: "workouts",
    icon: "💪",
    title: "Upper Body, Core and Lower Body",
    summary: "Exercise classification, form and Effective Repetitions.",
    rules: [
      rule(
        "upper-body-definition",
        27,
        "Any exercise, whether performed at home or in the gym, that targets the upper body qualifies. This includes movements engaging the back, biceps, triceps, chest, hands, arms, forearms, shoulders and neck.",
      ),
      rule(
        "core-definition",
        32,
        "Core workouts include exercises that activate and stabilise the region between the hips and chest. This zone is the core of our strength, balance and resilience.",
        {
          note:
            "The app uses the name Core instead of the 2025 term Mid Body.",
        },
      ),
      rule(
        "lower-body-definition",
        34,
        "Any exercise, whether performed at home or in the gym, that activates the region from the waist to the feet qualifies. This includes the glutes, quadriceps, hamstrings and calves.",
      ),
      rule(
        "repetition-integrity",
        28,
        "Each repetition must reflect a safe, intentional range of motion performed with controlled form. Quality over quantity, always.",
      ),
      rule(
        "hold-conversion",
        28,
        "Static and duration-based exercises are converted into base repetitions using the exercise’s configured seconds-per-repetition value.",
        {
          note:
            "This replaces the fixed 30-second rule because different holds have different configured difficulty and timing.",
        },
      ),
      rule(
        "effective-repetitions",
        null,
        "Workout points use Effective Repetitions. The app applies the configured exercise difficulty multiplier before the workout point table is used.",
      ),
      rule(
        "single-workout-category",
        30,
        "A full-body exercise may be logged under one workout category only. It cannot be duplicated across Upper Body, Core and Lower Body.",
      ),
      rule(
        "upper-examples",
        29,
        "Typical Upper Body exercises include push-ups, pull-ups, rows, presses, curls, dips and similar movements.",
      ),
      rule(
        "core-examples",
        33,
        "Common Core exercises include sit-ups, bicycle crunches, plank holds, Russian twists and similar movements.",
      ),
      rule(
        "lower-examples",
        35,
        "Common Lower Body exercises include squats, lunges, calf raises, wall sits, hinges and similar movements.",
      ),
      rule(
        "exercise-selection",
        31,
        "Use an existing exercise from the library where possible. New exercises may be suggested for administrator review.",
      ),
    ],
  },
  {
    id: "water-and-fruit",
    icon: "💧",
    title: "Water and fresh fruit",
    summary: "Hydration, whole-fruit portions and culinary classification.",
    rules: [
      rule(
        "water-recording",
        36,
        "Water intake may be logged progressively or recorded as a truthful total for the day while that date remains editable.",
      ),
      rule(
        "plain-water-only",
        37,
        "Only plain still water, whether tap, filtered or purchased, counts toward Water progress.",
      ),
      rule(
        "water-exclusions",
        40,
        "Tea, coffee, juice, milk, sports drinks, energy drinks, flavoured beverages, alcohol and water mixed with other substances do not count.",
      ),
      rule(
        "sparkling-water",
        41,
        "Sparkling water does not count toward Water progress.",
      ),
      rule(
        "water-measures",
        38,
        "If water is consumed in a standard glass, one glass may be counted as 250 millilitres. Labelled containers should use their stated capacity.",
      ),
      rule(
        "water-safety",
        39,
        "Excessive water intake can be dangerous. Drink responsibly, consider your circumstances and seek professional guidance when appropriate.",
        {
          note:
            "The original safety warning was reworded because insulting language is not acceptable health guidance.",
        },
      ),
      rule(
        "fruit-recording",
        43,
        "Fresh fruit may be logged progressively or recorded as a truthful total for the day while that date remains editable.",
      ),
      rule(
        "fruit-identification",
        44,
        "Identify the fruit being recorded. The activity form should reflect the fruit actually consumed.",
      ),
      rule(
        "fruit-whole",
        45,
        "Fruit must be freshly consumed on its own to qualify. Fruit that is cooked, frozen, blended, juiced, mashed or mixed into another dish does not count.",
      ),
      rule(
        "fruit-portion",
        46,
        "One standard serving of fruit should typically be proportional to the size of your fist. Proper discretion and fairness are expected.",
      ),
      rule(
        "fruit-size-adjustments",
        48,
        "A large whole fruit may count as one serving. Several small fruits, berries or grapes should form a portion approximately proportional to your fist.",
      ),
      rule(
        "culinary-fruit",
        54,
        "The challenge uses culinary classification: a plant product typically sweet or tart and eaten as a snack or used in sweet dishes. Tomato, cucumber, pepper, squash and avocado do not count.",
        {
          note:
            "This resolves the contradiction in the 2025 document, which listed avocado before later applying culinary classification.",
        },
      ),
      rule(
        "vegetables",
        50,
        "Vegetables do not count toward Fruit progress."),
      rule(
        "wine-not-grapes",
        51,
        "Wine does not count as consuming grapes, irrespective of the quantity consumed.",
      ),
      rule(
        "fruit-products",
        55,
        "Red velvet Swiss rolls do not count as strawberries and earn zero Fruit points.",
      ),
      rule(
        "lemon",
        56,
        "Adding lemon juice to another item does not count. To record a lemon serving, you must eat an actual qualifying portion of the fruit.",
      ),
    ],
  },
  {
    id: "movement",
    icon: "🏃",
    title: "Steps, Cardio and Running",
    summary: "Device totals, intentional activity and Running eligibility.",
    rules: [
      rule(
        "steps-all-day",
        59,
        "Your step count may include movement completed throughout the day, across any activity or location. Every step tells a story.",
      ),
      rule(
        "steps-device",
        60,
        "Step counts should be tracked with a smartphone, smartwatch or fitness device where practical.",
      ),
      rule(
        "steps-no-overlap",
        null,
        "When logging a device’s cumulative daily total, record that total once. Do not submit overlapping snapshots as separate step entries.",
      ),
      rule(
        "cardio-intentional",
        65,
        "Cardio includes exercise or sport for which you intentionally and deliberately set aside time for physical activity.",
      ),
      rule(
        "cardio-examples",
        65,
        "Examples include walking, cycling, swimming, boxing, dancing, rowing, hiking, racquet sports, team sports and similar conditioning activities.",
      ),
      rule(
        "workout-not-cardio",
        66,
        "Upper Body, Core and Lower Body workouts may not be logged again as Cardio.",
      ),
      rule(
        "no-double-category",
        67,
        "One session may not be duplicated across categories. Choose the category that best represents the activity, except where the app automatically applies a documented contribution.",
      ),
      rule(
        "running-proof",
        69,
        "Runs should be recorded using a tracking device or application such as Strava, Garmin, Samsung Health or a similar platform.",
      ),
      rule(
        "running-distance",
        70,
        "A minimum continuous distance of 3 kilometres is required to earn Running points.",
      ),
      rule(
        "running-pace",
        71,
        "An average pace of 11:00 per kilometre or faster is required to earn Running points.",
      ),
      rule(
        "running-cardio",
        72,
        "One Running entry may earn distance points under Running and duration points under Cardio. The app calculates both automatically.",
      ),
      rule(
        "running-still-recorded",
        null,
        "A run that misses the distance or pace requirement is still recorded and still contributes its duration to Cardio.",
      ),
      rule(
        "multiple-runs",
        75,
        "You may complete multiple runs in one day, provided every entry represents a separate genuine run.",
      ),
    ],
  },
  {
    id: "learning",
    icon: "📚",
    title: "Skill Development and Reading",
    summary: "Deliberate learning, meaningful reading and minimum scoring time.",
    rules: [
      rule(
        "skill-deliberate",
        76,
        "Skill Development must involve deliberate practice in a useful domain such as art, hobbies, language, music, science, communication, fitness or technology.",
      ),
      rule(
        "skill-new-or-reclaimed",
        "77, 82",
        "A challenge skill should be genuinely new or a skill you have lost the ability to execute and wish to reclaim after a meaningful break from practice.",
      ),
      rule(
        "skill-growth",
        78,
        "A chosen skill should be developed long enough to show meaningful progress rather than being changed merely to collect entries.",
      ),
      rule(
        "primary-skill",
        79,
        "A season may require one primary skill focus. The general app may still record more than one legitimate skill.",
        { status: RULE_STATUSES.SEASON },
      ),
      rule(
        "skill-partner",
        80,
        "A journey is often more significant when shared. Players are encouraged, but not required, to learn alongside another person.",
      ),
      rule(
        "skill-minimum",
        null,
        "A Skill Development session under 10 minutes earns no activity points.",
      ),
      rule(
        "reading-purpose",
        83,
        "Reading should be intentional and beneficial, educational or meaningfully chosen for personal growth or thoughtful leisure. We read to grow, not just to consume.",
      ),
      rule(
        "reading-continue",
        84,
        "When a book is completed, players are encouraged to continue with another book.",
      ),
      rule(
        "reading-record",
        null,
        "Every Reading entry must identify the book or material. Reflections are optional but encouraged.",
      ),
      rule(
        "reading-work",
        88,
        "Routine reading completed as part of ordinary job duties does not count unless the season explicitly includes professional study.",
      ),
      rule(
        "reading-social",
        92,
        "Reading posts on social media does not count.",
      ),
      rule(
        "reading-rules",
        91,
        "Reading the challenge rules does not count toward Reading points. However, understanding the terrain may prove highly beneficial and strategic.",
      ),
      rule(
        "reading-minimum",
        93,
        "There is no required daily minimum to record Reading, but a session under 10 minutes earns no activity points.",
      ),
    ],
  },
  {
    id: "teams-and-leagues",
    icon: "🏰",
    title: "Seasons, Houses and Pocket Week",
    summary: "Season registration, C.H.A.O.S., leadership, roster movement and stored activity.",
    rules: [
      seasonRule(
        "season-scoped-houses",
        21,
        "Every House belongs to one league season. Houses do not continue as permanent teams outside that season.",
      ),
      seasonRule(
        "league-registration",
        null,
        "Players register for a season as individuals while Registration is open. A player may withdraw only before the season becomes Active, unless an Administrator corrects an exceptional error.",
      ),
      seasonRule(
        "house-minimum-roster",
        null,
        "C.H.A.O.S. requires at least two registered players for every House so each opening roster can appoint a Captain and Vice-Captain.",
      ),
      seasonRule(
        "chaos-assignment",
        12,
        "At the start of a House season, a League or Platform Administrator may Activate C.H.A.O.S. to assign every registered player across the Houses created for that season.",
        {
          bullets: [
            "C.H.A.O.S. means Citizens Handpicked for Assignment via Operational Sorting.",
            "Assignments are randomised from a fixed season seed and balanced so House sizes differ by no more than one player.",
            "C.H.A.O.S. may be activated only once per season.",
          ],
        },
      ),
      seasonRule(
        "chaos-notification",
        null,
        "When C.H.A.O.S. is activated, every assigned player receives a private notification naming their opening House.",
      ),
      seasonRule(
        "dual-leaderboards",
        15,
        "Each House season tracks an Individual Leaderboard for personal performance and a House Leaderboard for collective impact and bragging rights.",
      ),
      seasonRule(
        "historical-house-points",
        null,
        "Points earned while representing a House remain with that House. After a roster move, the player’s future eligible points support the new House; earlier House contributions are never transferred or rewritten.",
      ),
      seasonRule(
        "power-play-theme-pool",
        "22-23, 95-107",
        "A Power Play season begins with ten base plays—one for each activity category. Season creators must give every enabled play a unique name that fits the season theme and configure enough unique plays to cover every official season week before Registration opens.",
      ),
      seasonRule(
        "power-play-weekly-draw",
        "22-23, 95-107",
        "One enabled Power Play is selected at random for each official season week. A selected, redrawn or corrected Power Play is permanently considered used and may not appear again during that season.",
      ),
      seasonRule(
        "power-play-scoring",
        "22-23, 95-107",
        "A Power Play multiplies eligible competitive activity points by two or three before the normal daily league activity cap. It does not multiply goal, mission, streak, Experience Point, participation, evidence-bonus or administrative adjustment points.",
      ),
      seasonRule(
        "power-play-activity-date",
        null,
        "The activity date determines which weekly Power Play applies. Running or Steps points released after proof review still use the Power Play from the week when the activity occurred.",
      ),
      seasonRule(
        "power-play-lock-and-visibility",
        null,
        "Players see a Power Play when its official week starts. Administrators may prepare or redraw a future week before it starts with an audited reason; after the week begins, only a Platform Administrator may record an audited factual correction using an unused replacement.",
      ),
      seasonRule(
        "weekly-leadership-vote",
        null,
        "During an active season, each House may hold one 24-hour leadership vote per challenge week. Every current House member may vote once for one current House member.",
      ),
      seasonRule(
        "leadership-result",
        null,
        "The player with the most votes becomes Captain and the player with the second-most votes becomes the primary Vice-Captain for that week.",
      ),
      seasonRule(
        "leadership-resolution",
        null,
        "When no votes are cast, or a tie prevents a complete result, a League or Platform Administrator must appoint the Captain and primary Vice-Captain after the full voting day closes.",
      ),
      seasonRule(
        "additional-vice-captain",
        null,
        "The elected Captain may appoint one additional Vice-Captain from the current House roster. A House may have no more than two Vice-Captains. The additional appointment ends when the next weekly election is finalised.",
      ),
      seasonRule(
        "house-leader-duty",
        null,
        "Captains and Vice-Captains must manage House identity and roster responsibilities respectfully. Leadership does not permit anyone to alter another player’s personal activity, individual points or account data.",
      ),
      seasonRule(
        "weekly-roster-move",
        "24, 108-128",
        "Each House may take part in one balanced player swap per challenge week. A Captain, Vice-Captain, League Administrator or Platform Administrator may complete the swap.",
        {
          note: "This is the app-supported roster system. Diamonds, player prices, House Immunity and timed Transfer Market bidding remain inactive.",
        },
      ),
      seasonRule(
        "leader-movement",
        null,
        "A Captain or Vice-Captain must first be replaced in House leadership before that player can move to another House.",
      ),
      seasonRule(
        "season-composition-privacy",
        null,
        "Season composition responses are optional, self-declared and private. They belong only to that season, may be removed by the player, never change points, and are hidden from House leaders and ordinary players at individual level.",
      ),
      seasonRule(
        "weekly-house-balance",
        null,
        "Once per active season week, an authorised administrator may preserve a privacy-safe House balance snapshot. House composition is compared with the season-wide disclosed distribution only when at least three disclosed responses protect each House. The result is informational only and can never add, remove, reduce or multiply earned points.",
      ),
      seasonRule(
        "pocket-window",
        "16-17",
        "The Pocket Week Window opens seven days before the official season begins and closes at the end of the day immediately before the season start date.",
      ),
      seasonRule(
        "pocket-purpose",
        17,
        "Use Pocket Week to bank extra activities. Life happens; during the challenge there may be days where you are busy, injured, sick, or experience another unforeseen circumstance which prevents you from achieving a category target. Your Pocket is your safety net.",
      ),
      seasonRule(
        "pocket-zero-points",
        18,
        "Pocket activities are recorded but earn zero points while stored. Points are calculated only when the player activates an available Pocket amount during the Active season.",
      ),
      seasonRule(
        "pocket-control",
        "18, 20",
        "Players decide when to activate their Pocket and how much of an available partial balance to apply to an eligible season day.",
      ),
      seasonRule(
        "pocket-whole-sessions",
        null,
        "Running and workout sessions are redeemed as complete stored sessions. Water, Fruit, Reading, Skill Development, Cardio and Steps may be redeemed in valid partial amounts.",
      ),
      seasonRule(
        "pocket-empty",
        null,
        "When the remaining balance for a stored activity reaches zero, that Pocket activity is empty and cannot be used again. A category not recorded during Pocket Week has no balance to redeem.",
      ),
      seasonRule(
        "pocket-personal",
        19,
        "Pocket activities are non-transferable. Only the player who completed and stored the activity may activate it.",
      ),
      seasonRule(
        "pocket-final",
        null,
        "Pocket activation is final. Activated amounts cannot be returned to the Pocket, edited into another category or deleted to recover the stored balance.",
      ),
      seasonRule(
        "league-lifecycle",
        null,
        "A season moves forward through Draft, Registration, Active, Completed and Archived stages. Stages may not be skipped or reversed.",
      ),
      seasonRule(
        "league-contributions",
        null,
        "During an Active season, one factual activity entry creates the eligible individual and House contribution. Players must not record a second copy of the same activity for league credit.",
      ),
      seasonRule(
        "completed-history",
        null,
        "Completed and archived season contributions remain permanent competitive history, even if a recent personal entry would otherwise be editable.",
      ),
      seasonRule(
        "league-conduct",
        null,
        "Competition should inspire. Harassment, humiliation, collusion, vote manipulation or interference with another player’s participation is not permitted.",
      ),
    ],
  },
  {
    id: "safety-and-conduct",
    icon: "❤️",
    title: "Safety, respect and platform conduct",
    summary: "Rules added for a sustainable, inclusive application experience.",
    rules: [
      rule(
        "personal-safety",
        null,
        "Participate within your ability. Stop an activity when you experience concerning pain, dizziness or unusual symptoms, and seek qualified advice where needed.",
      ),
      rule(
        "medical-boundary",
        null,
        "Champions Legacy Challenge and Legacy Coach do not provide medical diagnosis, treatment or personalised professional advice.",
      ),
      rule(
        "respect",
        null,
        "Treat players, Captains and Administrators with respect. Discrimination, threats, bullying and harassment are not permitted.",
      ),
      rule(
        "privacy",
        null,
        "Do not publish another player’s personal information, activity evidence or account details without permission.",
      ),
      rule(
        "account-security",
        null,
        "Keep account credentials private. Do not share passwords or attempt to access another player’s account.",
      ),
      rule(
        "admin-audit",
        null,
        "Trusted administrative changes must follow the app’s role permissions and immutable audit process.",
      ),
      rule(
        "rule-interpretation",
        null,
        "When uncertainty exists, the interpretation that best supports honesty, fairness, safety and long-term personal growth takes precedence over competitive advantage.",
      ),
    ],
  },
  {
    id: "season-awards",
    icon: "👑",
    title: "Champions and season awards",
    summary: "Recognition that may be activated by an official season.",
    rules: [
      seasonRule(
        "legacy-champion",
        134,
        "A season displays a Legacy Champion and category champions based on its published standings and eligibility rules. Honours remain provisional until the season is completed.",
      ),
      seasonRule(
        "one-title",
        134,
        "Each player may hold only one individual championship title, awarded in the published prestige order.",
      ),
      seasonRule(
        "team-champion",
        135,
        "Each House displays a House Champion based on the points that player contributed while representing that House.",
      ),
      seasonRule(
        "team-of-champions",
        136,
        "The highest-ranked House is recognised as the House of Champions.",
      ),
      seasonRule(
        "award-announcement",
        null,
        "Final honours are confirmed only when the season is completed. Live honours shown during an Active season are provisional and may change.",
      ),
    ],
  },
  {
    id: "inactive-legacy",
    icon: "🗃️",
    title: "2025 mechanics not currently active",
    summary:
      "Preserved so players can distinguish historical challenge ideas from live app rules.",
    rules: [
      rule(
        "transfer-market",
        "24, 108-128",
        "Diamonds, player price tags, House Immunity, timed bidding and the former Transfer Market currency are not currently supported. The app uses one balanced House swap per week instead.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "buddy-bonus",
        "129-133",
        "Buddy Bonuses for exactly three participants are not currently supported and award no points.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "photo-bonus",
        "8, 37",
        "Photo evidence bonuses are not currently supported and award no points.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "five-fires",
        "Side quest",
        "Five Fires to Forge Footsteps of the Fearless is not currently active and does not award the former 200-point bonus.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "whatsapp-administration",
        "5-10, 109",
        "WhatsApp posting, House group chats and manual administrator logging have been replaced by direct app entries, Announcements and Firestore-backed administration.",
        { status: RULE_STATUSES.INACTIVE },
      ),
    ],
  },
]);

export const RULEBOOK_SECTION_IDS = Object.freeze(
  RULEBOOK_SECTIONS.map((section) => section.id),
);

export const RULEBOOK_RULES = Object.freeze(
  RULEBOOK_SECTIONS.flatMap((section) =>
    section.rules.map((item) => ({ ...item, sectionId: section.id })),
  ),
);
