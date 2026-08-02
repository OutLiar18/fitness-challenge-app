import {
  RULEBOOK_SECTIONS,
  RULE_STATUSES,
} from "../../constants/rulebook";

function normalizeSearch(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getRuleSearchText(rule) {
  return [
    rule.id,
    rule.legacyRule,
    rule.text,
    rule.note,
    ...(rule.bullets ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function matchesRuleStatus(rule, statusFilter = "current") {
  if (statusFilter === "all") {
    return true;
  }

  if (statusFilter === "current") {
    return rule.status === RULE_STATUSES.CURRENT;
  }

  return rule.status === statusFilter;
}

export function filterRulebookSections(
  sections = RULEBOOK_SECTIONS,
  { query = "", status = "current" } = {},
) {
  const normalizedQuery = normalizeSearch(query);

  return sections
    .map((section) => {
      const sectionMatches = [section.title, section.summary, section.id]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

      const rules = section.rules.filter((item) => {
        const statusMatches = matchesRuleStatus(item, status);
        const queryMatches =
          !normalizedQuery ||
          sectionMatches ||
          getRuleSearchText(item).includes(normalizedQuery);

        return statusMatches && queryMatches;
      });

      return { ...section, rules };
    })
    .filter((section) => section.rules.length > 0);
}

export function getRulebookStats(sections = RULEBOOK_SECTIONS) {
  const rules = sections.flatMap((section) => section.rules);

  return {
    sections: sections.length,
    rules: rules.length,
    current: rules.filter((item) => item.status === RULE_STATUSES.CURRENT)
      .length,
    season: rules.filter((item) => item.status === RULE_STATUSES.SEASON).length,
    inactive: rules.filter((item) => item.status === RULE_STATUSES.INACTIVE)
      .length,
  };
}
