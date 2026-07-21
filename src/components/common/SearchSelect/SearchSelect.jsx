import { useEffect, useMemo, useRef, useState } from "react";

import "./SearchSelect.css";

export default function SearchSelect({
  label,
  value = "",
  items = [],
  onInputChange,
  onSelect,
  getItemKey = (item) => item.id,
  getItemLabel = (item) => item.label ?? "",
  renderItem,
  loading = false,
  error = "",
  disabled = false,
  required = false,
  placeholder = "Start typing...",
  recentLabel = "Recently used",
  resultsLabel = "Suggestions",
  emptyMessage = "No matching items found.",
  allowCustom = false,
  customLabel = "Use new entry",
  maxResults = 5,
}) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

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
    if (!open) {
      return;
    }

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [open]);

  const trimmedValue = value.trim();

  const exactMatch = useMemo(() => {
    if (!trimmedValue) {
      return null;
    }

    return (
      items.find(
        (item) =>
          getItemLabel(item).trim().toLowerCase() ===
          trimmedValue.toLowerCase(),
      ) ?? null
    );
  }, [items, trimmedValue, getItemLabel]);

  const displayedItems = useMemo(
    () => items.slice(0, maxResults),
    [items, maxResults],
  );

  const canUseCustom = allowCustom && Boolean(trimmedValue) && !exactMatch;

  const totalSelectableItems = displayedItems.length + (canUseCustom ? 1 : 0);

  useEffect(() => {
    if (totalSelectableItems === 0) {
      setHighlightedIndex(0);
      return;
    }

    setHighlightedIndex((currentIndex) =>
      Math.min(currentIndex, totalSelectableItems - 1),
    );
  }, [totalSelectableItems]);

  const handleSelectItem = (item) => {

    onSelect(item);

    setOpen(false);
    setHighlightedIndex(0);
  };

  const handleUseCustom = () => {
    onInputChange(trimmedValue);
    setOpen(false);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (totalSelectableItems === 0) {
        return;
      }

      setHighlightedIndex((currentIndex) =>
        Math.min(currentIndex + 1, totalSelectableItems - 1),
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((currentIndex) => Math.max(currentIndex - 1, 0));

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (highlightedIndex < displayedItems.length) {
        handleSelectItem(displayedItems[highlightedIndex]);

        return;
      }

      if (canUseCustom) {
        handleUseCustom();
      }

      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="search-select">
      {label && (
        <label className="search-select__label">
          <strong>
            {label}
            {required ? " *" : ""}
          </strong>
        </label>
      )}

      <input
        ref={inputRef}
        type="text"
        className="search-select__input"
        disabled={disabled}
        required={required}
        autoComplete="off"
        spellCheck
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        onChange={(event) => {
          onInputChange(event.target.value);
          setHighlightedIndex(0);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />

      {open && !disabled && (
        <div className="search-select__menu">
          {loading && <div className="search-select__message">Loading...</div>}

          {!loading && error && (
            <div className="search-select__message search-select__message--error">
              {error}
            </div>
          )}

          {!loading && !error && displayedItems.length > 0 && (
            <>
              <div className="search-select__heading">
                {trimmedValue ? resultsLabel : recentLabel}
              </div>

              {displayedItems.map((item, index) => {
                const itemKey = getItemKey(item);

                const itemLabel = getItemLabel(item);

                return (
                  <button
                    key={itemKey}
                    type="button"
                    className={`search-select__option ${
                      highlightedIndex === index
                        ? "search-select__option--active"
                        : ""
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelectItem(item)}
                  >
                    {renderItem ? renderItem(item) : itemLabel}
                  </button>
                );
              })}
            </>
          )}

          {!loading && !error && canUseCustom && (
            <>
              {displayedItems.length > 0 && (
                <div className="search-select__divider" />
              )}

              <button
                type="button"
                className={`search-select__custom ${
                  highlightedIndex === displayedItems.length
                    ? "search-select__option--active"
                    : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(displayedItems.length)}
                onClick={handleUseCustom}
              >
                ＋ {customLabel}: <strong>{trimmedValue}</strong>
              </button>
            </>
          )}

          {!loading &&
            !error &&
            displayedItems.length === 0 &&
            !canUseCustom && (
              <div className="search-select__message">
                {trimmedValue ? emptyMessage : "Start typing to search."}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
