import { SKILL_LIBRARY } from "../constants/libraries/skillLibrary";

export function getSkill(name) {
  return SKILL_LIBRARY[name] || null;
}

export function getSkills() {
  return Object.values(SKILL_LIBRARY);
}

export function getSkillNames() {
  return Object.values(SKILL_LIBRARY)
    .map((skill) => skill.name)
    .sort((a, b) => a.localeCompare(b));
}

export function getSkillsByArea(area) {
  return Object.values(SKILL_LIBRARY)
    .filter((skill) => skill.area === area)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSkillNamesByArea(area) {
  return getSkillsByArea(area).map((skill) => skill.name);
}