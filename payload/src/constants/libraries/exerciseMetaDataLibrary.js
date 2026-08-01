export const EQUIPMENT_OPTIONS = [
  "Bodyweight",
  "Dumbbell",
  "Barbell",
  "EZ Bar",
  "Cable",
  "Machine",
  "Resistance Band",
  "Pull-up Bar",
  "Dip Bars",
  "Gymnastic Rings",
  "Kettlebell",
  "Medicine Ball",
  "Sandbag",
  "Smith Machine",
  "Bench",
  "Box",
  "Parallettes",
  "TRX",
  "Suspension Trainer",
  "Sled",
  "Battle Rope",
  "Weighted Vest",
  "Ab Wheel",
  "Stability Ball",
  "Other",
];

export const MOVEMENT_PATTERN_OPTIONS = [
  "Horizontal Push",
  "Vertical Push",
  "Horizontal Pull",
  "Vertical Pull",
  "Squat",
  "Hip Hinge",
  "Lunge",
  "Carry",
  "Rotation",
  "Anti-Rotation",
  "Flexion",
  "Extension",
  "Lateral Flexion",
  "Anti-Extension",
  "Anti-Flexion",
  "Stability",
  "Stability Hold",
  "Gymnastics Hold",
  "Plyometric",
  "Isolation",
  "Locomotion",
  "Other",
];

export const MUSCLE_OPTIONS = [
  "Chest",
  "Upper Chest",
  "Lower Chest",

  "Lats",
  "Upper Back",
  "Middle Back",
  "Rhomboids",
  "Traps",
  "Lower Traps",

  "Front Delts",
  "Side Delts",
  "Rear Delts",
  "Rotator Cuff",

  "Biceps",
  "Brachialis",
  "Triceps",
  "Forearms",
  "Grip",

  "Rectus Abdominis",
  "Upper Abs",
  "Lower Abs",
  "Obliques",
  "Transverse Abdominis",
  "Hip Flexors",
  "Lower Back",
  "Erector Spinae",

  "Quads",
  "Hamstrings",
  "Glutes",
  "Glute Medius",
  "Calves",
  "Adductors",
  "Abductors",

  "Full Body",
];

export const DIFFICULTY_OPTIONS = [
  {
    tier: 1,
    difficulty: "Beginner",
    label: "Tier 1 — Beginner",
  },
  {
    tier: 2,
    difficulty: "Novice",
    label: "Tier 2 — Novice",
  },
  {
    tier: 3,
    difficulty: "Intermediate",
    label: "Tier 3 — Intermediate",
  },
  {
    tier: 4,
    difficulty: "Advanced",
    label: "Tier 4 — Advanced",
  },
  {
    tier: 5,
    difficulty: "Elite",
    label: "Tier 5 — Elite",
  },
];

export function getDifficultyByTier(tier) {
  return (
    DIFFICULTY_OPTIONS.find((option) => option.tier === Number(tier)) || null
  );
}
