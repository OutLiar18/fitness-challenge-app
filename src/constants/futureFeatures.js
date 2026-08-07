export const FUTURE_FEATURES = Object.freeze({
  "power-play": {
    id: "power-play",
    icon: "⚡",
    eyebrow: "Inactive season mechanic",
    title: "Power Play is waiting for its rules",
    summary:
      "Category voting and House multipliers remain deliberately inactive until timing, fairness and scoring consequences are confirmed.",
    status: "Awaiting product decisions",
    capabilities: [
      "One category vote per season week",
      "Transparent multiplier announcement",
      "House-balanced scoring safeguards",
      "Immutable weekly result history",
    ],
    guardrail:
      "No multiplier may change historical personal points or activate without a frozen, player-visible season rule.",
  },
  "transfer-market": {
    id: "transfer-market",
    icon: "💎",
    eyebrow: "Inactive season mechanic",
    title: "The full Transfer Market remains sealed",
    summary:
      "Diamonds, player prices, House Immunity, timed bidding and voting need a complete design before they can replace the current balanced weekly swap.",
    status: "Awaiting late-season design",
    capabilities: [
      "House transfer budgets",
      "Player valuation rules",
      "Voting and timed windows",
      "Permanent transaction history",
    ],
    guardrail:
      "Roster movement must never rewrite points already earned for a previous House.",
  },
  "buddy-bonus": {
    id: "buddy-bonus",
    icon: "🤝",
    eyebrow: "Inactive reward mechanic",
    title: "Buddy Bonus needs verifiable teamwork",
    summary:
      "The original three-player reward remains inactive until group identity, duplicate-trio limits and evidence can be enforced fairly.",
    status: "Awaiting verification design",
    capabilities: [
      "Exactly-three participant groups",
      "Weekly reuse prevention",
      "Category minimum validation",
      "Audited bonus approval",
    ],
    guardrail:
      "A social reward must encourage shared effort without creating an easy duplicate-point exploit.",
  },
  "five-fires": {
    id: "five-fires",
    icon: "🔥",
    eyebrow: "Inactive side quest",
    title: "Five Fires has not been lit",
    summary:
      "The progressive running quest is preserved in the Rulebook but awards no points until participation, order and reward rules are confirmed.",
    status: "Awaiting side-quest design",
    capabilities: [
      "Ordered distance milestones",
      "Limited participation",
      "Progress visibility",
      "One final audited reward",
    ],
    guardrail:
      "Quest runs must reuse factual Running entries and must not be logged twice.",
  },
});
