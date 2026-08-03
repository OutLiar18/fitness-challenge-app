export function resolveWorkspaceTab(tabs, activeId) {
  if (!Array.isArray(tabs) || tabs.length === 0) return null;
  return tabs.find((tab) => tab.id === activeId) ?? tabs[0] ?? null;
}

export function getAdjacentWorkspaceTabId(tabs, activeId, key) {
  if (!Array.isArray(tabs) || tabs.length === 0) return "";

  const currentIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  );

  if (key === "Home") return tabs[0].id;
  if (key === "End") return tabs[tabs.length - 1].id;
  if (key === "ArrowRight" || key === "ArrowDown") {
    return tabs[(currentIndex + 1) % tabs.length].id;
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return tabs[(currentIndex - 1 + tabs.length) % tabs.length].id;
  }

  return tabs[currentIndex]?.id ?? tabs[0].id;
}
