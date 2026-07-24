import { CARDIO_LIBRARY } from "../constants/libraries/cardioLibrary";

export function getCardioActivity(name) {
  return CARDIO_LIBRARY[name] || null;
}

export function getCardioActivities() {
  return Object.values(CARDIO_LIBRARY);
}

export function getCardioActivityNames() {
  return getCardioActivities()
    .map((activity) => activity.name)
    .sort((a, b) => a.localeCompare(b));
}

export function getCardioActivitiesByType(cardioType) {
  return getCardioActivities()
    .filter((activity) => activity.cardioType === cardioType)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCardioActivityNamesByType(cardioType) {
  return getCardioActivitiesByType(cardioType).map((activity) => activity.name);
}

export function getGroupedCardioActivities() {
  const groupedActivities = getCardioActivities().reduce((groups, activity) => {
    const groupName = activity.group || "Other";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(activity.name);

    return groups;
  }, {});

  return Object.entries(groupedActivities)
    .map(([group, options]) => ({
      group,
      options: options.sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => {
      if (a.group === "Other") {
        return 1;
      }

      if (b.group === "Other") {
        return -1;
      }

      return a.group.localeCompare(b.group);
    });
}
