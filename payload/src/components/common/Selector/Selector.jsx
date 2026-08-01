import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./Selector.css";

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase();
}

const defaultGetItemKey = (item) => item?.id ?? item?.label ?? item;
const defaultGetItemLabel = (item) =>
  item?.label ?? item?.name ?? String(item ?? "");
const defaultGetItemGroup = () => "";

export default function Selector({
  label,
  required = false,
  mode = "single",
  displayMode = "control",
  value = "",
  items = [],
  onInputChange,
  onSelect,
  onChange,
  onCustom,
  getItemKey = defaultGetItemKey,
  getItemLabel = defaultGetItemLabel,
  getItemGroup = defaultGetItemGroup,
  renderItem,
  disabled = false,
  placeholder = "Select an option…",
  searchPlaceholder = "Search…",
  allowCustom = false,
  customLabel = "Use new entry",
  loading = false,
  error = "",
  recentLabel = "Recently used",
  resultsLabel = "Suggestions",
  emptyMessage = "No matching options found.",
  maxResults,
  showHeading = false,
}) {
  const generatedId = useId().replaceAll(":", "");
  const controlId = `selector-${generatedId}`;
  const menuId = `${controlId}-menu`;
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const multiple = mode === "multiple";
  const inputDisplay = displayMode === "input";
  const selectedValues = multiple && Array.isArray(value) ? value : [];
  const searchText = inputDisplay ? String(value ?? "") : internalSearch;
  const normalizedSearch = normalizeText(searchText);

  useEffect(() => {
    function handlePointerOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerOutside);
    return () => document.removeEventListener("pointerdown", handlePointerOutside);
  }, []);

  useEffect(() => {
    if (!open || inputDisplay) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, inputDisplay]);

  const filteredItems = useMemo(() => {
    const matches = !normalizedSearch
      ? items
      : items.filter((item) => {
          const labelText = normalizeText(getItemLabel(item));
          const groupText = normalizeText(getItemGroup(item));

          return (
            labelText.includes(normalizedSearch) ||
            groupText.includes(normalizedSearch)
          );
        });

    return Number.isFinite(maxResults) ? matches.slice(0, maxResults) : matches;
  }, [items, normalizedSearch, getItemLabel, getItemGroup, maxResults]);

  const exactMatch = useMemo(() => {
    if (!normalizedSearch) {
      return null;
    }

    return (
      items.find(
        (item) => normalizeText(getItemLabel(item)) === normalizedSearch,
      ) ?? null
    );
  }, [items, normalizedSearch, getItemLabel]);

  const canUseCustom =
    allowCustom && Boolean(normalizedSearch) && !exactMatch && !multiple;

  const selectableItems = useMemo(() => {
    const result = filteredItems.map((item) => ({ type: "item", item }));

    if (canUseCustom) {
      result.push({ type: "custom", value: searchText.trim() });
    }

    return result;
  }, [filteredItems, canUseCustom, searchText]);

  const groupedItems = useMemo(() => {
    const groups = [];
    const groupMap = new Map();

    filteredItems.forEach((item, flatIndex) => {
      const groupName = getItemGroup(item) || "";

      if (!groupMap.has(groupName)) {
        const group = { name: groupName, items: [] };
        groupMap.set(groupName, group);
        groups.push(group);
      }

      groupMap.get(groupName).items.push({ item, flatIndex });
    });

    return groups;
  }, [filteredItems, getItemGroup]);

  const safeHighlightedIndex = Math.min(
    highlightedIndex,
    Math.max(selectableItems.length - 1, 0),
  );

  const activeDescendant =
    open && selectableItems.length > 0
      ? `${menuId}-option-${safeHighlightedIndex}`
      : undefined;

  function closeSelector() {
    setOpen(false);
    setHighlightedIndex(0);

    if (!inputDisplay) {
      setInternalSearch("");
    }
  }

  function isItemSelected(item) {
    return selectedValues.includes(getItemLabel(item));
  }

  function selectItem(item) {
    if (disabled) {
      return;
    }

    if (multiple) {
      const itemLabel = getItemLabel(item);
      const nextValues = selectedValues.includes(itemLabel)
        ? selectedValues.filter((selectedValue) => selectedValue !== itemLabel)
        : [...selectedValues, itemLabel];

      onChange?.(nextValues);
      return;
    }

    onSelect?.(item);
    closeSelector();
  }

  function selectCustomValue() {
    const customValue = searchText.trim();

    if (!customValue || disabled) {
      return;
    }

    onCustom?.(customValue);
    closeSelector();
  }

  function handleSearchChange(nextValue) {
    if (inputDisplay) {
      onInputChange?.(nextValue);
    } else {
      setInternalSearch(nextValue);
    }

    setHighlightedIndex(0);
    setOpen(true);
  }

  function handleKeyDown(event) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSelector();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        return;
      }

      const direction = event.key === "ArrowDown" ? 1 : -1;
      const lastIndex = Math.max(selectableItems.length - 1, 0);

      setHighlightedIndex((current) =>
        Math.min(lastIndex, Math.max(0, current + direction)),
      );
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      setHighlightedIndex(Math.max(selectableItems.length - 1, 0));
      return;
    }

    if (event.key !== "Enter" || !open) {
      return;
    }

    event.preventDefault();
    const highlightedItem = selectableItems[safeHighlightedIndex];

    if (highlightedItem?.type === "custom") {
      selectCustomValue();
    } else if (highlightedItem?.item) {
      selectItem(highlightedItem.item);
    }
  }

  function renderOption(item, flatIndex) {
    const itemKey = getItemKey(item);
    const itemLabel = getItemLabel(item);
    const selected = multiple
      ? isItemSelected(item)
      : normalizeText(value) === normalizeText(itemLabel);
    const highlighted = safeHighlightedIndex === flatIndex;
    const optionId = `${menuId}-option-${flatIndex}`;

    return (
      <button
        id={optionId}
        key={itemKey}
        type="button"
        role="option"
        aria-selected={selected}
        className={`selector__option${selected ? " selector__option--selected" : ""}${highlighted ? " selector__option--active" : ""}`}
        onMouseEnter={() => setHighlightedIndex(flatIndex)}
        onClick={() => selectItem(item)}
      >
        {multiple && (
          <span className="selector__check" aria-hidden="true">
            {selected ? "✓" : ""}
          </span>
        )}
        <span className="selector__option-content">
          {renderItem ? renderItem(item) : itemLabel}
        </span>
      </button>
    );
  }

  function renderMenuContent() {
    if (loading) {
      return <div className="selector__message">Loading…</div>;
    }

    if (error) {
      return (
        <div className="selector__message selector__message--error">
          {error}
        </div>
      );
    }

    return (
      <>
        {showHeading && filteredItems.length > 0 && (
          <div className="selector__heading">
            {normalizedSearch ? resultsLabel : recentLabel}
          </div>
        )}

        {groupedItems.map((group) => (
          <div key={group.name || "ungrouped"} className="selector__group">
            {group.name && (
              <div className="selector__group-label">{group.name}</div>
            )}
            {group.items.map(({ item, flatIndex }) =>
              renderOption(item, flatIndex),
            )}
          </div>
        ))}

        {canUseCustom && (
          <>
            {filteredItems.length > 0 && <div className="selector__divider" />}
            <button
              id={`${menuId}-option-${filteredItems.length}`}
              type="button"
              role="option"
              aria-selected="false"
              className={`selector__custom${safeHighlightedIndex === filteredItems.length ? " selector__option--active" : ""}`}
              onMouseEnter={() => setHighlightedIndex(filteredItems.length)}
              onClick={selectCustomValue}
            >
              <span aria-hidden="true">＋</span>
              <span>
                {customLabel}: <strong>{searchText.trim()}</strong>
              </span>
            </button>
          </>
        )}

        {filteredItems.length === 0 && !canUseCustom && (
          <div className="selector__message">
            {normalizedSearch ? emptyMessage : "Start typing to search."}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`selector${multiple ? " selector--multiple" : ""}`}
    >
      {label && (
        <label className="selector__label" htmlFor={controlId}>
          {label}
          {required && (
            <span className="form-required" aria-hidden="true">
              {" "}*
            </span>
          )}
        </label>
      )}

      {inputDisplay ? (
        <input
          id={controlId}
          type="text"
          role="combobox"
          className="selector__input"
          aria-autocomplete="list"
          aria-controls={menuId}
          aria-expanded={open}
          aria-activedescendant={activeDescendant}
          disabled={disabled}
          required={required}
          autoComplete="off"
          spellCheck
          value={String(value ?? "")}
          placeholder={placeholder}
          onFocus={() => !disabled && setOpen(true)}
          onChange={(event) => handleSearchChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className={`selector__control${disabled ? " selector__control--disabled" : ""}`}
        >
          {multiple && selectedValues.length > 0 && (
            <div className="selector__tags" aria-label="Selected values">
              {selectedValues.map((selectedValue) => (
                <span key={selectedValue} className="selector__tag">
                  <span>{selectedValue}</span>
                  {!disabled && (
                    <button
                      type="button"
                      className="selector__tag-remove"
                      aria-label={`Remove ${selectedValue}`}
                      onClick={() =>
                        onChange?.(
                          selectedValues.filter((item) => item !== selectedValue),
                        )
                      }
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          <button
            id={controlId}
            type="button"
            className="selector__trigger"
            aria-haspopup="listbox"
            aria-controls={menuId}
            aria-expanded={open}
            disabled={disabled}
            onClick={() => setOpen((current) => !current)}
            onKeyDown={handleKeyDown}
          >
            <span
              className={
                multiple || !value
                  ? "selector__placeholder"
                  : "selector__selected-value"
              }
            >
              {multiple ? (selectedValues.length ? "Add more…" : placeholder) : value || placeholder}
            </span>
            <span className="selector__arrow" aria-hidden="true">
              {open ? "▲" : "▼"}
            </span>
          </button>

          {multiple && !disabled && selectedValues.length > 0 && (
            <button
              className="selector__clear"
              type="button"
              onClick={() => onChange?.([])}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {open && !disabled && (
        <div className="selector__menu">
          {!inputDisplay && (
            <input
              ref={searchInputRef}
              type="text"
              role="combobox"
              className="selector__search"
              aria-label={searchPlaceholder}
              aria-controls={menuId}
              aria-expanded="true"
              aria-activedescendant={activeDescendant}
              placeholder={searchPlaceholder}
              value={internalSearch}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
          <div
            id={menuId}
            className="selector__options"
            role="listbox"
            aria-multiselectable={multiple || undefined}
          >
            {renderMenuContent()}
          </div>
        </div>
      )}
    </div>
  );
}
