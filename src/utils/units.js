export function getUnit(fieldId) {
  const units = {
    amount: "ml",
    quantity: "",
    minutes: "min",
    distance: "km",
    time: "min",
    sets: "sets",
    reps: "reps",
    weight: "kg",
    duration: "min",
    steps: "steps",
  };

  return units[fieldId] || "";
}