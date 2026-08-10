import { getMbtiProfileByType } from "../../constants/mbtiProfiles.js";

export const MBTI_QUICK_QUESTIONS = Object.freeze([
  {
    id: "ei-recharge",
    dimension: "EI",
    prompt: "After a demanding week, which usually restores your energy better?",
    a: { letter: "I", label: "Quiet time alone or with one familiar person" },
    b: { letter: "E", label: "Being around people, activity or conversation" },
  },
  {
    id: "ei-group",
    dimension: "EI",
    prompt: "When you enter a new group, what feels more natural?",
    a: { letter: "I", label: "Observe first and join once I understand the room" },
    b: { letter: "E", label: "Start interacting and learn the room through conversation" },
  },
  {
    id: "ei-ideas",
    dimension: "EI",
    prompt: "When working through an idea, which approach is more typical?",
    a: { letter: "I", label: "Think it through privately before I explain it" },
    b: { letter: "E", label: "Talk it through and discover the idea while speaking" },
  },
  {
    id: "sn-learning",
    dimension: "SN",
    prompt: "When learning something new, what helps you most at first?",
    a: { letter: "S", label: "Clear examples, practical steps and proven methods" },
    b: { letter: "N", label: "The big idea, patterns and possible ways it could work" },
  },
  {
    id: "sn-training",
    dimension: "SN",
    prompt: "When planning training, which sounds more appealing?",
    a: { letter: "S", label: "A concrete routine with specific exercises and targets" },
    b: { letter: "N", label: "A flexible concept I can adapt and experiment with" },
  },
  {
    id: "sn-notice",
    dimension: "SN",
    prompt: "What do you tend to notice first when evaluating progress?",
    a: { letter: "S", label: "Specific facts, details and what has happened so far" },
    b: { letter: "N", label: "Patterns, possibilities and where things may be heading" },
  },
  {
    id: "tf-disagreement",
    dimension: "TF",
    prompt: "In a disagreement, what usually guides your first instinct?",
    a: { letter: "T", label: "Use consistent principles and the most logical solution" },
    b: { letter: "F", label: "Consider people's needs and preserve the relationship" },
  },
  {
    id: "tf-decision",
    dimension: "TF",
    prompt: "For a difficult decision, what carries more weight?",
    a: { letter: "T", label: "Evidence, trade-offs and internal logic" },
    b: { letter: "F", label: "Values, human impact and what feels right" },
  },
  {
    id: "tf-feedback",
    dimension: "TF",
    prompt: "When giving useful feedback, what comes more naturally?",
    a: { letter: "T", label: "Be direct and objective about what needs to change" },
    b: { letter: "F", label: "Shape the message so the person feels understood and encouraged" },
  },
  {
    id: "jp-week",
    dimension: "JP",
    prompt: "How do you prefer a normal week to feel?",
    a: { letter: "J", label: "Planned, decided and organised around clear priorities" },
    b: { letter: "P", label: "Flexible, open and able to change as things unfold" },
  },
  {
    id: "jp-deadline",
    dimension: "JP",
    prompt: "With a deadline ahead, which pattern is more comfortable?",
    a: { letter: "J", label: "Decide early and finish with time to spare" },
    b: { letter: "P", label: "Keep options open and use the available time flexibly" },
  },
  {
    id: "jp-change",
    dimension: "JP",
    prompt: "If an unexpected change disrupts your plan, what is your first tendency?",
    a: { letter: "J", label: "Rebuild structure and establish a new plan quickly" },
    b: { letter: "P", label: "Adapt in the moment and see what the new situation allows" },
  },
]);

const DIMENSIONS = Object.freeze([
  { id: "EI", letters: ["E", "I"] },
  { id: "SN", letters: ["S", "N"] },
  { id: "TF", letters: ["T", "F"] },
  { id: "JP", letters: ["J", "P"] },
]);

export function scoreMbtiQuickTest(answers = {}) {
  const counts = new Map(MBTI_TYPES_FOR_SCORING.map((letter) => [letter, 0]));
  let answered = 0;

  MBTI_QUICK_QUESTIONS.forEach((question) => {
    const choice = answers[question.id];
    if (choice !== "a" && choice !== "b") return;
    counts.set(question[choice].letter, counts.get(question[choice].letter) + 1);
    answered += 1;
  });

  const complete = answered === MBTI_QUICK_QUESTIONS.length;
  if (!complete) {
    return { complete: false, answered, total: MBTI_QUICK_QUESTIONS.length, type: "", dimensions: [] };
  }

  const dimensions = DIMENSIONS.map(({ id, letters }) => {
    const [first, second] = letters;
    const firstCount = counts.get(first);
    const secondCount = counts.get(second);
    const total = firstCount + secondCount;
    const preferred = firstCount >= secondCount ? first : second;
    return {
      id,
      first,
      second,
      firstCount,
      secondCount,
      firstPercent: Math.round((firstCount / total) * 100),
      secondPercent: Math.round((secondCount / total) * 100),
      preferred,
    };
  });

  const type = dimensions.map((dimension) => dimension.preferred).join("");
  return {
    complete: true,
    answered,
    total: MBTI_QUICK_QUESTIONS.length,
    type,
    profile: getMbtiProfileByType(type),
    dimensions,
  };
}

const MBTI_TYPES_FOR_SCORING = Object.freeze(["E", "I", "S", "N", "T", "F", "J", "P"]);
