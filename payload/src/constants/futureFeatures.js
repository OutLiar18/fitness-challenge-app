export const FUTURE_FEATURES = Object.freeze({
  teams: {
    id: "teams",
    icon: "⚑",
    eyebrow: "Community foundation",
    title: "Teams are being assembled",
    summary:
      "Teams will let players pursue shared goals without turning personal growth into pressure.",
    status: "Planned after secure administration",
    capabilities: [
      "Team membership and invitations",
      "Shared challenge progress",
      "Encouragement without public shaming",
      "Team roles and moderation",
    ],
    guardrail:
      "Team systems will use the existing factual entries and versioned scoring rules rather than creating a second scoring engine.",
  },
  leagues: {
    id: "leagues",
    icon: "♛",
    eyebrow: "Competition foundation",
    title: "Leagues are warming up",
    summary:
      "Seasonal leagues will make competition motivating while keeping consistency more important than natural athletic ability.",
    status: "Requires frozen rulesets and audit history",
    capabilities: [
      "Seasons and divisions",
      "Fair, explainable leaderboards",
      "Personal ranking context",
      "Versioned challenge scoring",
    ],
    guardrail:
      "No league will launch until scores can be frozen against an immutable ruleset and corrected through secure admin workflows.",
  },
  coach: {
    id: "coach",
    icon: "✦",
    eyebrow: "Intelligence foundation",
    title: "Legacy Coach is still studying",
    summary:
      "The future coach will help players understand patterns and choose realistic next actions—not replace their judgement.",
    status: "Planned after trend analytics",
    capabilities: [
      "Weekly progress summaries",
      "Transparent recommendations",
      "User-controlled coaching preferences",
      "Explainable habit and training insights",
    ],
    guardrail:
      "Guidance must be transparent, optional and grounded in the player’s own data. Champions Legacy Challenge will never optimise for screen addiction.",
  },
});
