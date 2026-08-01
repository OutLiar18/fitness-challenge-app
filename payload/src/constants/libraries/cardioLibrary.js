import { DIFFICULTY } from "./difficulty";

function createActivities(
  names,
  group,
  cardioType,
  environment,
  equipment,
  difficulty,
) {
  return names.map((name) => ({
    name,
    group,
    cardioType,
    environment,
    equipment,

    tier: difficulty.tier,
    difficulty,
  }));
}

const activities = [
  // ==================================================
  // WALKING
  // ==================================================

  ...createActivities(
    ["Walking", "Treadmill Walking"],
    "Walking",
    "Steady State",
    "Either",
    "None",
    DIFFICULTY.TIER_1,
  ),

  ...createActivities(
    [
      "Brisk Walking",
      "Hill Walking",
      "Nordic Walking",
      "Power Walking",
      "Stair Walking",
      "Treadmill Incline Walking",
    ],
    "Walking",
    "Steady State",
    "Either",
    "None",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Rucking", "Weighted Walking"],
    "Walking",
    "Conditioning",
    "Outdoor",
    "Weights",
    DIFFICULTY.TIER_3,
  ),

  // ==================================================
  // CARDIO MACHINES
  // ==================================================

  ...createActivities(
    ["Elliptical", "Recumbent Bike"],
    "Cardio Machines",
    "Steady State",
    "Indoor",
    "Machine",
    DIFFICULTY.TIER_1,
  ),

  ...createActivities(
    [
      "Arc Trainer",
      "Cross Trainer",
      "Exercise Bike",
      "Stair Climber",
      "Stepper Machine",
    ],
    "Cardio Machines",
    "Steady State",
    "Indoor",
    "Machine",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    [
      "Air Bike",
      "Rowing Machine",
      "Ski Erg",
      "Spin Bike Intervals",
      "Versa Climber",
    ],
    "Cardio Machines",
    "Intervals",
    "Indoor",
    "Machine",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    [
      "Assault Bike",
      "High-Intensity Rowing Machine",
      "High-Intensity Ski Erg",
      "High-Intensity Stair Climber",
    ],
    "Cardio Machines",
    "Intervals",
    "Indoor",
    "Machine",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // CYCLING
  // ==================================================

  ...createActivities(
    ["Leisure Cycling", "Stationary Cycling"],
    "Cycling",
    "Steady State",
    "Either",
    "Bike",
    DIFFICULTY.TIER_1,
  ),

  ...createActivities(
    ["Cycling", "Indoor Cycling", "Road Cycling", "Spinning"],
    "Cycling",
    "Steady State",
    "Either",
    "Bike",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["BMX Cycling", "Cycling Intervals", "Mountain Biking", "Track Cycling"],
    "Cycling",
    "Intervals",
    "Outdoor",
    "Bike",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Competitive Cycling", "Mountain Bike Racing", "Track Cycling Sprints"],
    "Cycling",
    "Sport",
    "Outdoor",
    "Bike",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // SWIMMING AND AQUATIC FITNESS
  // ==================================================

  ...createActivities(
    ["Aqua Fitness", "Aqua Jogging", "Water Aerobics", "Water Walking"],
    "Swimming and Aquatic Fitness",
    "Steady State",
    "Water",
    "Pool",
    DIFFICULTY.TIER_1,
  ),

  ...createActivities(
    ["Lap Swimming", "Swimming"],
    "Swimming and Aquatic Fitness",
    "Steady State",
    "Water",
    "Pool",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Open Water Swimming", "Swimming Intervals", "Competitive Swimming"],
    "Swimming and Aquatic Fitness",
    "Intervals",
    "Water",
    "Pool",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Long-Distance Open Water Swimming", "Swimming Sprint Training"],
    "Swimming and Aquatic Fitness",
    "Conditioning",
    "Water",
    "Pool",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // PADDLING AND WATER SPORTS
  // ==================================================

  ...createActivities(
    ["Canoeing", "Kayaking", "Paddle Boarding", "Pedal Boating"],
    "Paddling and Water Sports",
    "Steady State",
    "Water",
    "Boat",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    [
      "Dragon Boat Paddling",
      "Kayak Racing",
      "Ocean Kayaking",
      "Rowing",
      "Surf Ski",
    ],
    "Paddling and Water Sports",
    "Sport",
    "Water",
    "Boat",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Competitive Rowing", "Whitewater Kayaking"],
    "Paddling and Water Sports",
    "Conditioning",
    "Water",
    "Boat",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // SKIPPING AND FOOTWORK
  // ==================================================

  ...createActivities(
    ["Basic Jump Rope", "Jump Rope"],
    "Skipping and Footwork",
    "Steady State",
    "Either",
    "Rope",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Agility Ladder", "Fast Jump Rope", "Jump Rope Intervals", "Speed Ladder"],
    "Skipping and Footwork",
    "Intervals",
    "Either",
    "Rope",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Double-Under Training", "High-Intensity Jump Rope"],
    "Skipping and Footwork",
    "Conditioning",
    "Either",
    "Rope",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // CONDITIONING
  // ==================================================

  ...createActivities(
    ["Bodyweight Cardio Circuit", "Low-Impact Cardio Circuit", "Step Aerobics"],
    "Conditioning",
    "Circuit",
    "Either",
    "None",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    [
      "Bear Crawl Circuit",
      "Cardio Circuit",
      "High-Intensity Interval Training",
      "Shuttle Runs",
      "Sprint Intervals",
    ],
    "Conditioning",
    "Intervals",
    "Either",
    "None",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    [
      "Battle Ropes",
      "Farmer Carry",
      "Medicine Ball Slams",
      "Sled Drag",
      "Sled Pull",
      "Sled Push",
      "Strongman Conditioning",
    ],
    "Conditioning",
    "Conditioning",
    "Either",
    "Weights",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // COMBAT SPORTS
  // ==================================================

  ...createActivities(
    ["Boxing Fitness", "Cardio Kickboxing", "Shadow Boxing"],
    "Combat Sports",
    "Conditioning",
    "Indoor",
    "None",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Boxing", "Karate", "Taekwondo"],
    "Combat Sports",
    "Sport",
    "Either",
    "None",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    [
      "Brazilian Jiu-Jitsu",
      "Judo",
      "Kickboxing",
      "Mixed Martial Arts",
      "Muay Thai",
      "Wrestling",
    ],
    "Combat Sports",
    "Sport",
    "Either",
    "None",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // DANCE FITNESS
  // ==================================================

  ...createActivities(
    ["Ballroom Dancing", "Beginner Dance Fitness", "Low-Impact Dance Fitness"],
    "Dance Fitness",
    "Dance",
    "Indoor",
    "None",
    DIFFICULTY.TIER_1,
  ),

  ...createActivities(
    [
      "Aerobics",
      "Contemporary Dance",
      "Dance Fitness",
      "Hip Hop Dance",
      "Jazz Dance",
      "Latin Dance",
      "Salsa",
      "Zumba",
    ],
    "Dance Fitness",
    "Dance",
    "Indoor",
    "None",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Advanced Dance Fitness", "High-Intensity Zumba", "Competitive Dance"],
    "Dance Fitness",
    "Dance",
    "Indoor",
    "None",
    DIFFICULTY.TIER_3,
  ),

  // ==================================================
  // RACQUET SPORTS
  // ==================================================

  ...createActivities(
    ["Badminton", "Pickleball", "Table Tennis"],
    "Racquet Sports",
    "Sport",
    "Either",
    "Other",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Padel", "Racquetball", "Squash", "Tennis"],
    "Racquet Sports",
    "Sport",
    "Either",
    "Other",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Competitive Squash", "Competitive Tennis"],
    "Racquet Sports",
    "Sport",
    "Either",
    "Other",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // TEAM SPORTS
  // ==================================================

  ...createActivities(
    ["Cricket", "Recreational Volleyball", "Softball"],
    "Team Sports",
    "Sport",
    "Either",
    "Ball",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    [
      "Basketball",
      "Beach Volleyball",
      "Field Hockey",
      "Football (Soccer)",
      "Futsal",
      "Handball",
      "Indoor Soccer",
      "Netball",
      "Rugby",
      "Ultimate Frisbee",
      "Volleyball",
    ],
    "Team Sports",
    "Sport",
    "Either",
    "Ball",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    [
      "Competitive Basketball",
      "Competitive Football",
      "Competitive Rugby",
      "Competitive Futsal",
    ],
    "Team Sports",
    "Sport",
    "Either",
    "Ball",
    DIFFICULTY.TIER_4,
  ),

  ...createActivities(
    ["Water Polo"],
    "Team Sports",
    "Sport",
    "Water",
    "Ball",
    DIFFICULTY.TIER_3,
  ),

  // ==================================================
  // HIKING AND CLIMBING
  // ==================================================

  ...createActivities(
    ["Hiking", "Treadmill Hiking"],
    "Hiking and Climbing",
    "Steady State",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Hill Hiking", "Indoor Rock Climbing", "Rock Climbing", "Trail Hiking"],
    "Hiking and Climbing",
    "Sport",
    "Either",
    "Other",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Mountain Climbing", "Speed Climbing", "Technical Climbing"],
    "Hiking and Climbing",
    "Conditioning",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // SKATING AND BOARD SPORTS
  // ==================================================

  ...createActivities(
    ["Leisure Roller Skating", "Skateboarding"],
    "Skating and Board Sports",
    "Steady State",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_1,
  ),

  ...createActivities(
    ["Ice Skating", "Inline Skating", "Roller Skating"],
    "Skating and Board Sports",
    "Steady State",
    "Either",
    "Other",
    DIFFICULTY.TIER_2,
  ),

  ...createActivities(
    ["Roller Derby", "Speed Skating"],
    "Skating and Board Sports",
    "Sport",
    "Either",
    "Other",
    DIFFICULTY.TIER_3,
  ),

  // ==================================================
  // WINTER SPORTS
  // ==================================================

  ...createActivities(
    ["Cross-Country Skiing", "Skiing", "Snowboarding", "Snowshoeing"],
    "Winter Sports",
    "Sport",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    ["Competitive Cross-Country Skiing", "Ski Mountaineering"],
    "Winter Sports",
    "Conditioning",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // OBSTACLE AND ADVENTURE TRAINING
  // ==================================================

  ...createActivities(
    ["Obstacle Course Training", "Parkour"],
    "Obstacle and Adventure Training",
    "Circuit",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_3,
  ),

  ...createActivities(
    [
      "Advanced Obstacle Course Training",
      "Military-Style Conditioning",
      "Obstacle Race Training",
    ],
    "Obstacle and Adventure Training",
    "Conditioning",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_4,
  ),

  // ==================================================
  // ELITE EVENTS
  // ==================================================

  ...createActivities(
    [
      "Adventure Race",
      "CrossFit Competition",
      "Hyrox Competition",
      "Ironman Triathlon",
      "Long-Distance Triathlon",
      "Spartan Beast",
      "Spartan Race",
      "Tough Mudder",
      "Triathlon",
    ],
    "Elite Events",
    "Circuit",
    "Outdoor",
    "Other",
    DIFFICULTY.TIER_5,
  ),
];

export const CARDIO_LIBRARY = Object.fromEntries(
  activities.map((activity) => [activity.name, activity]),
);
