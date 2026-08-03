import {
  getAdjacentWorkspaceTabId,
  resolveWorkspaceTab,
} from "../../services/ui/workspaceModel";
import "./WorkspaceTabs.css";

export default function WorkspaceTabs({
  tabs,
  activeId,
  onChange,
  label = "Page sections",
  idPrefix = "workspace",
}) {
  const activeTab = resolveWorkspaceTab(tabs, activeId);

  if (!activeTab) {
    return null;
  }

  if (tabs.length < 2) {
    return (
      <span id={`${idPrefix}-tab-${activeTab.id}`} className="sr-only">
        {activeTab.label}
      </span>
    );
  }

  function handleKeyDown(event, tabId) {
    const nextId = getAdjacentWorkspaceTabId(tabs, tabId, event.key);
    if (nextId === tabId || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    onChange(nextId);
    window.requestAnimationFrame(() => {
      document.getElementById(`${idPrefix}-tab-${nextId}`)?.focus();
    });
  }

  return (
    <section className="workspace-switcher card" aria-label={label}>
      <div className="workspace-switcher__select">
        <label htmlFor={`${idPrefix}-section-select`}>View section</label>
        <select
          id={`${idPrefix}-section-select`}
          value={activeTab.id}
          onChange={(event) => onChange(event.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
        {activeTab.description && <p>{activeTab.description}</p>}
      </div>

      <div
        className="workspace-switcher__tabs"
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeTab.id;

          return (
            <button
              key={tab.id}
              id={`${idPrefix}-tab-${tab.id}`}
              className={`workspace-tab${selected ? " workspace-tab--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, tab.id)}
            >
              <span className="workspace-tab__icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="workspace-tab__copy">
                <strong>{tab.label}</strong>
                {tab.description && <small>{tab.description}</small>}
              </span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span className="workspace-tab__badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function WorkspacePanel({
  id,
  activeId,
  idPrefix = "workspace",
  className = "",
  children,
}) {
  if (id !== activeId) {
    return null;
  }

  return (
    <div
      id={`${idPrefix}-panel-${id}`}
      className={`workspace-panel${className ? ` ${className}` : ""}`}
      role="tabpanel"
      aria-labelledby={`${idPrefix}-tab-${id}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
