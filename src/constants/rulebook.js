export const RULEBOOK_VERSION = "2026-08-v1";

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
    icon: "🤝",
    title: "Teams and leagues",
    summary: "Membership, captain responsibility and seasonal competition.",
    rules: [
      rule(
        "one-team",
        21,
        "A player may belong to one active team at a time. Teams provide shared identity, accountability and optional league competition.",
      ),
      rule(
        "team-joining",
        12,
        "Teams are joined through invitation codes. Players are not automatically or randomly assigned by the app.",
        {
          note:
            "This replaces the 2025 C.H.A.O.S. house assignment method.",
        },
      ),
      rule(
        "invite-code",
        null,
        "Invitation codes should be shared only with intended participants. They are access codes, not secure passwords.",
      ),
      rule(
        "captain-duty",
        null,
        "Team Captains must manage team identity respectfully and may not use their role to alter another player’s personal activity or points.",
      ),
      rule(
        "captain-transfer",
        null,
        "A Team Captain must transfer captaincy before leaving the team.",
      ),
      rule(
        "league-registration",
        null,
        "Players may join or withdraw from a league only while Registration is open, unless an administrator corrects an exceptional error.",
      ),
      rule(
        "league-lifecycle",
        null,
        "A league moves forward through Draft, Registration, Active, Completed and Archived stages. Stages may not be skipped or reversed.",
      ),
      rule(
        "league-contributions",
        null,
        "During an Active league, eligible entries contribute automatically. Players must not record a second copy of the same activity for league credit.",
      ),
      rule(
        "completed-history",
        null,
        "Completed and archived league contributions remain permanent competitive history, even if a recent personal entry would otherwise be editable.",
      ),
      rule(
        "league-conduct",
        null,
        "Competition should inspire. Harassment, humiliation, collusion or manipulation of another player’s participation is not permitted.",
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
      rule(
        "legacy-champion",
        134,
        "A season may crown a Legacy Champion and category champions based on its published standings and eligibility rules.",
        { status: RULE_STATUSES.SEASON },
      ),
      rule(
        "one-title",
        134,
        "A season may limit each player to one individual championship title, awarded in a published prestige order.",
        { status: RULE_STATUSES.SEASON },
      ),
      rule(
        "team-champion",
        135,
        "A season may recognise the top-performing player within each team.",
        { status: RULE_STATUSES.SEASON },
      ),
      rule(
        "team-of-champions",
        136,
        "A team league may declare the highest-ranked team the Team of Champions.",
        { status: RULE_STATUSES.SEASON },
      ),
      rule(
        "award-announcement",
        null,
        "Season awards do not exist automatically unless they are defined and announced before the relevant competition closes.",
        { status: RULE_STATUSES.SEASON },
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
        "pocket-week",
        "16-20",
        "Pocket Week and banked activities are not currently supported. Activities cannot be stored and redeemed later for challenge credit.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "random-houses",
        "12, 21",
        "Random assignment to six Houses using the C.H.A.O.S. method is not currently active. The app uses persistent, invitation-based Teams.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "power-play",
        "22-23, 95-107",
        "Weekly Power Play voting, house multipliers and the 40 percent contribution penalty are not currently supported.",
        { status: RULE_STATUSES.INACTIVE },
      ),
      rule(
        "transfer-market",
        "24, 108-128",
        "Diamonds, player price tags, House Immunity and the weekly Transfer Market are not currently supported.",
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
