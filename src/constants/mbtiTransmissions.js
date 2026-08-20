const freezeEntries = (entries) =>
  Object.freeze(entries.map((entry) => Object.freeze(entry)));

export const MBTI_TRANSMISSIONS = Object.freeze({
  ISTJ: freezeEntries([
    {
      quote: "You do not need a dramatic day. Keep the standard, complete the next duty, and let consistency compound.",
      coachNote: "No reinvention required. Follow the structure that already works.",
    },
    {
      quote: "Reliability becomes strength when you keep showing up after the novelty is gone.",
      coachNote: "Check the plan, do the work, record the truth. Simple is allowed.",
    },
    {
      quote: "A strong foundation is built before anyone notices that it was needed.",
      coachNote: "Protect tomorrow by finishing one ordinary responsibility today.",
    },
    {
      quote: "Adjusting a plan is not abandoning discipline. Good systems survive contact with reality.",
      coachNote: "Change what the evidence requires, then resume execution.",
    },
  ]),
  ISFJ: freezeEntries([
    {
      quote: "The care you give everyone else also belongs to the person carrying your body through this challenge.",
      coachNote: "Do one useful thing for future-you without needing to earn it first.",
    },
    {
      quote: "Quiet consistency counts. You do not need applause for a habit to be protecting your future.",
      coachNote: "Gentle does not mean optional. Keep one small promise to yourself.",
    },
    {
      quote: "You can support the people around you without spending every last piece of yourself.",
      coachNote: "Leave some energy in reserve. Recovery is part of being dependable.",
    },
    {
      quote: "A missed goal needs a calm return, not a guilty punishment.",
      coachNote: "Restart with the easiest meaningful action and let steadiness take over.",
    },
  ]),
  INFJ: freezeEntries([
    {
      quote: "The future you can imagine still needs one ordinary action from you today.",
      coachNote: "Meaning is powerful, but it has to touch the ground somewhere.",
    },
    {
      quote: "Do not wait for the day to feel perfectly aligned. Serve the direction even when the moment is imperfect.",
      coachNote: "Choose the smallest action that still honours the bigger reason.",
    },
    {
      quote: "Insight becomes transformation only when it survives the friction of real life.",
      coachNote: "Less interpretation for ten minutes. More movement.",
    },
    {
      quote: "You are allowed to care deeply without carrying every problem at once.",
      coachNote: "Protect your energy so your convictions still have strength tomorrow.",
    },
  ]),
  INTJ: freezeEntries([
    {
      quote: "Stop refining the blueprint. Execute the highest-value move and make reality answer you.",
      coachNote: "You have enough information for the next step. Ship the experiment.",
    },
    {
      quote: "Mastery is not endless preparation. It is a system that produces results under pressure.",
      coachNote: "Cut the low-value motion. Do what moves the metric.",
    },
    {
      quote: "A strategy earns its name when it survives contact with the day you actually have.",
      coachNote: "Adapt the method, preserve the objective, continue.",
    },
    {
      quote: "Your future advantage is being built in the disciplined work nobody else can see yet.",
      coachNote: "Do not seek motivation. Protect the leverage.",
    },
  ]),
  ISTP: freezeEntries([
    {
      quote: "Touch the problem. Ten minutes of real practice beats another hour of thinking about practice.",
      coachNote: "Pick a measurable target and start.",
    },
    {
      quote: "Competence grows from contact with reality, not from perfect conditions.",
      coachNote: "Test it. Fix what fails. Keep what works.",
    },
    {
      quote: "You do not need a speech. You need the next rep, kilometre, page, or useful action.",
      coachNote: "Short instruction: begin.",
    },
    {
      quote: "Freedom works better when one reliable default keeps you from drifting.",
      coachNote: "Use the simple fallback today. Optimise later.",
    },
  ]),
  ISFP: freezeEntries([
    {
      quote: "You do not have to become someone else to grow stronger. Build a version of progress that still feels like yours.",
      coachNote: "Choose the action that feels authentic and moves you forward.",
    },
    {
      quote: "A gentle step can still be brave when it moves you toward something you genuinely value.",
      coachNote: "No performance for anyone else. Just one honest action.",
    },
    {
      quote: "Your mood can have a voice without being given the steering wheel.",
      coachNote: "Keep the direction; adjust the shape of the effort.",
    },
    {
      quote: "Progress does not need to be loud to be real.",
      coachNote: "Notice one tangible improvement and give it another repetition.",
    },
  ]),
  INFP: freezeEntries([
    {
      quote: "Your ideals deserve a place in the real world, even if the first version is small and imperfect.",
      coachNote: "Give one thing you care about ten honest minutes today.",
    },
    {
      quote: "You are not betraying the dream by taking an ordinary step toward it.",
      coachNote: "Meaning survives imperfect execution. Begin gently.",
    },
    {
      quote: "The life that feels true to you is built from choices, not only from beautiful intentions.",
      coachNote: "Choose one action that matches the person you want to be.",
    },
    {
      quote: "Be compassionate with yourself, but do not let compassion quietly become avoidance.",
      coachNote: "Kindness can include a firm little push forward.",
    },
  ]),
  INTP: freezeEntries([
    {
      quote: "You already understand enough to run the experiment. Let the result teach you what theory cannot.",
      coachNote: "Five minutes of data beats another hypothetical.",
    },
    {
      quote: "The interesting question today is not whether the plan is perfect. It is what happens when you actually test it.",
      coachNote: "Form hypothesis. Act. Observe. Adjust.",
    },
    {
      quote: "Curiosity becomes useful when it produces contact with reality.",
      coachNote: "Turn one idea into one measurable attempt.",
    },
    {
      quote: "You may redesign the system after you have given the current version a fair trial.",
      coachNote: "No seventeenth alternative until one option has evidence.",
    },
  ]),
  ESTP: freezeEntries([
    {
      quote: "The opening is here. Move now, hit the target, and make the choice tomorrow-you can still respect.",
      coachNote: "Fast does not mean careless. Commit cleanly.",
    },
    {
      quote: "Momentum likes decisiveness. Pick the challenge and attack the next measurable piece.",
      coachNote: "Less waiting. More controlled action.",
    },
    {
      quote: "You can handle intensity. The real edge is knowing when recovery protects the next performance.",
      coachNote: "Go hard when it matters. Recover on purpose.",
    },
    {
      quote: "The moment rewards people who can see what is real and act before hesitation closes the door.",
      coachNote: "Choose the useful risk, not merely the exciting one.",
    },
  ]),
  ESFP: freezeEntries([
    {
      quote: "Bring the energy, but give it a destination. Finish one meaningful thing before chasing the next spark.",
      coachNote: "Make the win vivid—and complete.",
    },
    {
      quote: "Your enthusiasm can turn effort into an experience worth repeating.",
      coachNote: "Make today's healthy choice enjoyable enough to want again.",
    },
    {
      quote: "A fun life and a disciplined life are not enemies. Structure can protect the experiences you want more of.",
      coachNote: "One small plan now buys more freedom later.",
    },
    {
      quote: "Let people feel your energy, but keep one promise today that belongs only to your own growth.",
      coachNote: "Celebrate after the follow-through.",
    },
  ]),
  ENFP: freezeEntries([
    {
      quote: "You do not need fewer possibilities. You need one possibility carried far enough to become real.",
      coachNote: "Choose the exciting path—and stay with it today.",
    },
    {
      quote: "Freedom becomes powerful when it has enough structure to survive distraction.",
      coachNote: "Keep the destination. Vary the route if you need to.",
    },
    {
      quote: "Your next idea can wait long enough for this good idea to receive a finish line.",
      coachNote: "Follow-through is creativity made visible.",
    },
    {
      quote: "There is more ahead of you, but today still deserves your full presence.",
      coachNote: "Explore after you complete one meaningful commitment.",
    },
  ]),
  ENTP: freezeEntries([
    {
      quote: "Yes, there is probably a cleverer route. Prove this one works before inventing another.",
      coachNote: "The challenge today is finishing, not discovering option seventeen.",
    },
    {
      quote: "Treat the plan like an argument with reality: make a claim, test it, and accept the evidence.",
      coachNote: "You are allowed to debate the result after you generate one.",
    },
    {
      quote: "Ingenuity is strongest when it solves the boring part instead of merely escaping it.",
      coachNote: "Automate the friction. Keep the commitment.",
    },
    {
      quote: "Break assumptions, not your own follow-through.",
      coachNote: "Experiment boldly inside a fixed review window.",
    },
  ]),
  ESTJ: freezeEntries([
    {
      quote: "Set the standard. Meet it yourself. Then review the result without excuses or theatre.",
      coachNote: "Clear target. Clear deadline. Execute.",
    },
    {
      quote: "Order is useful only when it produces action. Run the plan.",
      coachNote: "Stop reorganising what is already clear.",
    },
    {
      quote: "Discipline includes changing a method that no longer serves the mission.",
      coachNote: "Protect the objective, not your attachment to the old procedure.",
    },
    {
      quote: "If it matters, put it on the schedule and make the standard visible.",
      coachNote: "Accountability begins with the promise you made yourself.",
    },
  ]),
  ESFJ: freezeEntries([
    {
      quote: "You are allowed to belong without earning your place through constant service.",
      coachNote: "Keep one promise today that is only for your own growth.",
    },
    {
      quote: "The care that strengthens a community also has to include the person doing the caring.",
      coachNote: "Support yourself with the same practicality you offer everyone else.",
    },
    {
      quote: "Encouragement works best when comparison does not steal the joy from your own progress.",
      coachNote: "Notice your improvement before checking anyone else's.",
    },
    {
      quote: "A healthy boundary can protect both your relationships and your goals.",
      coachNote: "You can say yes to your own training time.",
    },
  ]),
  ENFJ: freezeEntries([
    {
      quote: "Lead by example, but do not disappear inside everyone else's needs.",
      coachNote: "Your foundation is part of what makes your influence sustainable.",
    },
    {
      quote: "The fire you give other people needs fuel of its own.",
      coachNote: "Protect one action today that restores or strengthens you.",
    },
    {
      quote: "Inspiration is strongest when it is backed by a life that quietly practices what it encourages.",
      coachNote: "Do the thing you would lovingly ask someone else to do.",
    },
    {
      quote: "You can help others rise without making their progress your entire responsibility.",
      coachNote: "Guide, encourage, then return to your own path.",
    },
  ]),
  ENTJ: freezeEntries([
    {
      quote: "Choose the objective. Remove the excuse. Execute the next decisive step.",
      coachNote: "Momentum is waiting for a command. Give it one.",
    },
    {
      quote: "Ambition without recovery eventually becomes bad strategy.",
      coachNote: "Protect the machine that is expected to carry the mission.",
    },
    {
      quote: "Do not confuse being busy with advancing the objective.",
      coachNote: "Cut the low-value work and move the result.",
    },
    {
      quote: "The standard is not what you intend to dominate someday. It is what you execute today.",
      coachNote: "Lead yourself with the same clarity you expect from everyone else.",
    },
  ]),
});

const EMPTY_LIBRARY = Object.freeze([]);

export function getMbtiTransmissionLibrary(type) {
  const normalized = String(type ?? "").trim().toUpperCase();
  return MBTI_TRANSMISSIONS[normalized] ?? EMPTY_LIBRARY;
}
