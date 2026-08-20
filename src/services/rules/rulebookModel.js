import {
  RULEBOOK_SECTIONS,
  RULE_STATUSES,
} from "../../constants/rulebook";

function normalizeSearch(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function numberRulebookSections(sections = RULEBOOK_SECTIONS) {
  return sections.map((section, sectionIndex) => ({
    ...section,
    number: String(sectionIndex + 1),
    rules: section.rules.map((item, ruleIndex) => ({
      ...item,
      number: String(sectionIndex + 1) + "." + String(ruleIndex + 1),
    })),
  }));
}

function getRuleSearchText(rule) {
  return [
    rule.id,
    rule.number,
    rule.text,
    rule.aside,
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
  const numberedSections = numberRulebookSections(sections);
  const exactRuleNumberQuery = /^\d+\.\d+$/.test(normalizedQuery);
  const exactSectionNumberQuery = /^\d+$/.test(normalizedQuery);

  return numberedSections
    .map((section) => {
      const sectionMatches = exactSectionNumberQuery
        ? section.number === normalizedQuery
        : !exactRuleNumberQuery &&
          [section.title, section.summary, section.id]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

      const rules = section.rules.filter((item) => {
        const statusMatches = matchesRuleStatus(item, status);

        let queryMatches = !normalizedQuery;
        if (!queryMatches && exactRuleNumberQuery) {
          queryMatches = item.number === normalizedQuery;
        } else if (!queryMatches && exactSectionNumberQuery) {
          queryMatches = section.number === normalizedQuery;
        } else if (!queryMatches) {
          queryMatches =
            sectionMatches || getRuleSearchText(item).includes(normalizedQuery);
        }

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
