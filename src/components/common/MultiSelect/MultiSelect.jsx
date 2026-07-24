import { useEffect, useMemo, useRef, useState } from "react";
import "./MultiSelect.css";

export default function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  disabled = false,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : [];

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
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedSearch),
    );
  }, [options, search]);

  function toggleOption(option) {
    if (disabled) {
      return;
    }

    const alreadySelected = selectedValues.includes(option);

    const updatedValues = alreadySelected
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];

    onChange(updatedValues);
  }

  function removeOption(option, event) {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onChange(selectedValues.filter((item) => item !== option));
  }

  function clearSelection(event) {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onChange([]);
  }

  return (
    <div className="multi-select" ref={wrapperRef}>
      {label && <label className="multi-select__label">{label}</label>}

      <div
        className={`multi-select__control ${
          disabled ? "multi-select__control--disabled" : ""
        }`}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
      >
        <div className="multi-select__values">
          {selectedValues.length === 0 ? (
            <span className="multi-select__placeholder">
              {placeholder || `Select ${label || "options"}...`}
            </span>
          ) : (
            selectedValues.map((option) => (
              <span key={option} className="multi-select__tag">
                {option}

                {!disabled && (
                  <button
                    type="button"
                    className="multi-select__tag-remove"
                    onClick={(event) => removeOption(option, event)}
                    aria-label={`Remove ${option}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          )}
        </div>

        <div className="multi-select__actions">
          {!disabled && selectedValues.length > 0 && (
            <button
              type="button"
              className="multi-select__clear"
              onClick={clearSelection}
              aria-label="Clear selections"
            >
              Clear
            </button>
          )}

          <span className="multi-select__arrow">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && !disabled && (
        <div className="multi-select__menu">
          <input
            ref={searchInputRef}
            type="text"
            className="multi-select__search"
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="multi-select__options">
            {filteredOptions.length === 0 && (
              <div className="multi-select__empty">No matching options.</div>
            )}

            {filteredOptions.map((option) => {
              const selected = selectedValues.includes(option);

              return (
                <label
                  key={option}
                  className={`multi-select__option ${
                    selected ? "multi-select__option--selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleOption(option)}
                  />

                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
