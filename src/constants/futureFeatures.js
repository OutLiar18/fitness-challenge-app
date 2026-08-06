export const FUTURE_FEATURES = Object.freeze({
  "transfer-market": {
    id: "transfer-market",
    icon: "💎",
    eyebrow: "Retired competition concept",
    title: "Diamonds and player prices remain retired",
    summary:
      "Buying players made strong performers into commodities, risked demotivating developing players and did not reliably balance Houses. The former Transfer Market will not return without a fundamentally fair redesign.",
    status: "Rejected unless redesigned",
    capabilities: [
      "Growth-focused roster balancing",
      "No player prices or disposable-player incentives",
      "Transparent weekly movement rules",
      "Permanent historical House attribution",
    ],
    guardrail:
      "Roster movement must support player growth and must never rewrite points already earned for a previous House.",
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
