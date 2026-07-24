import { useEffect, useMemo, useRef, useState } from "react";

import "./Selector.css";

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

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

  getItemKey = (item) => item?.id ?? item?.label ?? item,
  getItemLabel = (item) => item?.label ?? item?.name ?? String(item ?? ""),
  getItemGroup = () => "",
  renderItem,

  disabled = false,

  placeholder = "Select an option...",
  searchPlaceholder = "Search...",

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
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open || inputDisplay) {
      return;
    }

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  }, [open, inputDisplay]);

  const filteredItems = useMemo(() => {
    const matchingItems = !normalizedSearch
      ? items
      : items.filter((item) => {
          const labelText = normalizeText(getItemLabel(item));
          const groupText = normalizeText(getItemGroup(item));

          return (
            labelText.includes(normalizedSearch) ||
            groupText.includes(normalizedSearch)
          );
        });

    if (Number.isFinite(maxResults)) {
      return matchingItems.slice(0, maxResults);
    }

    return matchingItems;
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
    const normalItems = filteredItems.map((item) => ({
      type: "item",
      item,
    }));

    if (canUseCustom) {
      normalItems.push({
        type: "custom",
        value: searchText.trim(),
      });
    }

    return normalItems;
  }, [filteredItems, canUseCustom, searchText]);

  const groupedItems = useMemo(() => {
    const groups = [];
    const groupMap = new Map();

    filteredItems.forEach((item, flatIndex) => {
      const groupName = getItemGroup(item) || "";

      if (!groupMap.has(groupName)) {
        const group = {
          name: groupName,
          items: [],
        };

        groupMap.set(groupName, group);
        groups.push(group);
      }

      groupMap.get(groupName).items.push({
        item,
        flatIndex,
      });
    });

    return groups;
  }, [filteredItems, getItemGroup]);

  function resetSearch() {
    if (!inputDisplay) {
      setInternalSearch("");
    }

    setHighlightedIndex(0);
  }

  function closeSelector() {
    setOpen(false);
    resetSearch();
  }

  function isItemSelected(item) {
    const itemLabel = getItemLabel(item);

    return selectedValues.includes(itemLabel);
  }

  function selectSingleItem(item) {
    onSelect?.(item);
    closeSelector();
  }

  function toggleMultipleItem(item) {
    const itemLabel = getItemLabel(item);

    const nextValues = selectedValues.includes(itemLabel)
      ? selectedValues.filter((selectedValue) => selectedValue !== itemLabel)
      : [...selectedValues, itemLabel];

    onChange?.(nextValues);
  }

  function selectItem(item) {
    if (disabled) {
      return;
    }

    if (multiple) {
      toggleMultipleItem(item);
      return;
    }

    selectSingleItem(item);
  }

  function selectCustomValue() {
    const customValue = searchText.trim();

    if (!customValue || disabled) {
      return;
    }

    onCustom?.(customValue);
    closeSelector();
  }

  function removeSelectedValue(selectedValue, event) {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onChange?.(
      selectedValues.filter((valueItem) => valueItem !== selectedValue),
    );
  }

  function clearSelectedValues(event) {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onChange?.([]);
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
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        return;
      }

      setHighlightedIndex((currentIndex) => {
        const maxIndex = Math.max(selectableItems.length - 1, 0);
        return Math.min(currentIndex + 1, maxIndex);
      });

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((currentIndex) => Math.max(currentIndex - 1, 0));

      return;
    }

    if (event.key === "Enter") {
      if (!open) {
        setOpen(true);
        return;
      }

      event.preventDefault();

      const safeHighlightedIndex = Math.min(
        highlightedIndex,
        Math.max(selectableItems.length - 1, 0),
      );

      const highlightedItem = selectableItems[safeHighlightedIndex];

      if (!highlightedItem) {
        return;
      }

      if (highlightedItem.type === "custom") {
        selectCustomValue();
        return;
      }

      selectItem(highlightedItem.item);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function renderOption(item, flatIndex) {
    const itemKey = getItemKey(item);
    const itemLabel = getItemLabel(item);
    const selected = multiple && isItemSelected(item);
    const highlighted = highlightedIndex === flatIndex;

    return (
      <button
        key={itemKey}
        type="button"
        role="option"
        aria-selected={selected}
        className={[
          "selector__option",
          selected ? "selector__option--selected" : "",
          highlighted ? "selector__option--active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseEnter={() => setHighlightedIndex(flatIndex)}
        onClick={() => selectItem(item)}
      >
        {multiple && (
          <input type="checkbox" tabIndex={-1} checked={selected} readOnly />
        )}

        <span className="selector__option-content">
          {renderItem ? renderItem(item) : itemLabel}
        </span>
      </button>
    );
  }

  function renderMenuContent() {
    if (loading) {
      return <div className="selector__message">Loading...</div>;
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
              type="button"
              className={[
                "selector__custom",
                highlightedIndex === filteredItems.length
                  ? "selector__option--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => setHighlightedIndex(filteredItems.length)}
              onClick={selectCustomValue}
            >
              ＋ {customLabel}: <strong>{searchText.trim()}</strong>
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
      className={["selector", multiple ? "selector--multiple" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label className="selector__label">
          <strong>
            {label}
            {required ? " *" : ""}
          </strong>
        </label>
      )}

      {inputDisplay ? (
        <input
          type="text"
          className="selector__input"
          disabled={disabled}
          required={required}
          autoComplete="off"
          spellCheck
          value={String(value ?? "")}
          placeholder={placeholder}
          onFocus={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
          onChange={(event) => handleSearchChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className={[
            "selector__control",
            disabled ? "selector__control--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) {
              setOpen((currentValue) => !currentValue);
            }
          }}
          onKeyDown={handleKeyDown}
        >
          <div className="selector__values">
            {multiple ? (
              selectedValues.length > 0 ? (
                selectedValues.map((selectedValue) => (
                  <span key={selectedValue} className="selector__tag">
                    {selectedValue}

                    {!disabled && (
                      <button
                        type="button"
                        className="selector__tag-remove"
                        aria-label={`Remove ${selectedValue}`}
                        onClick={(event) =>
                          removeSelectedValue(selectedValue, event)
                        }
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <span className="selector__placeholder">{placeholder}</span>
              )
            ) : (
              <span
                className={
                  value ? "selector__selected-value" : "selector__placeholder"
                }
              >
                {value || placeholder}
              </span>
            )}
          </div>

          <div className="selector__actions">
            {multiple && !disabled && selectedValues.length > 0 && (
              <button
                type="button"
                className="selector__clear"
                onClick={clearSelectedValues}
              >
                Clear
              </button>
            )}

            <span className="selector__arrow">{open ? "▲" : "▼"}</span>
          </div>
        </div>
      )}

      {open && !disabled && (
        <div className="selector__menu">
          {!inputDisplay && (
            <input
              ref={searchInputRef}
              type="text"
              className="selector__search"
              placeholder={searchPlaceholder}
              value={internalSearch}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}

          <div
            className="selector__options"
            role="listbox"
            aria-multiselectable={multiple}
          >
            {renderMenuContent()}
          </div>
        </div>
      )}
    </div>
  );
}
