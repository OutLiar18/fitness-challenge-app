import { useEffect, useMemo, useRef, useState } from "react";
import "./SmartSelect.css";

function normalizeFlatOptions(options = []) {
  return options
    .map((option) => {
      if (typeof option === "string") {
        return option;
      }

      return option?.name;
    })
    .filter(Boolean);
}

function normalizeGroupedOptions(options = []) {
  return options
    .filter(
      (group) =>
        group &&
        typeof group === "object" &&
        typeof group.group === "string" &&
        Array.isArray(group.options),
    )
    .map((group) => ({
      group: group.group,
      options: normalizeFlatOptions(group.options),
    }))
    .filter((group) => group.options.length > 0);
}

export default function SmartSelect({
  label,
  value,
  options = [],
  onChange,
  disabled = false,
  allowCustom = true,
  customOptionLabel = "Suggest new",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const groupedMode = useMemo(
    () =>
      options.some(
        (option) =>
          option &&
          typeof option === "object" &&
          typeof option.group === "string" &&
          Array.isArray(option.options),
      ),
    [options],
  );

  const normalizedGroups = useMemo(
    () => (groupedMode ? normalizeGroupedOptions(options) : []),
    [groupedMode, options],
  );

  const normalizedFlatOptions = useMemo(
    () => (groupedMode ? [] : normalizeFlatOptions(options)),
    [groupedMode, options],
  );

  const allOptionNames = useMemo(() => {
    if (groupedMode) {
      return normalizedGroups.flatMap((group) => group.options);
    }

    return normalizedFlatOptions;
  }, [groupedMode, normalizedGroups, normalizedFlatOptions]);

  const filteredGroups = useMemo(() => {
    if (!groupedMode) {
      return [];
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return normalizedGroups;
    }

    return normalizedGroups
      .map((group) => {
        const groupMatches = group.group
          .toLowerCase()
          .includes(normalizedSearch);

        const matchingOptions = groupMatches
          ? group.options
          : group.options.filter((option) =>
              option.toLowerCase().includes(normalizedSearch),
            );

        return {
          ...group,
          options: matchingOptions,
        };
      })
      .filter((group) => group.options.length > 0);
  }, [groupedMode, normalizedGroups, search]);

  const filteredFlatOptions = useMemo(() => {
    if (groupedMode) {
      return [];
    }

    const normalizedSearch = search.trim().toLowerCase();

    return normalizedFlatOptions.filter((option) =>
      option.toLowerCase().includes(normalizedSearch),
    );
  }, [groupedMode, normalizedFlatOptions, search]);

  const visibleOptions = useMemo(() => {
    if (groupedMode) {
      return filteredGroups.flatMap((group) => group.options);
    }

    return filteredFlatOptions;
  }, [groupedMode, filteredGroups, filteredFlatOptions]);

  const exactMatch = allOptionNames.some(
    (option) => option.toLowerCase() === search.trim().toLowerCase(),
  );

  const showAddOption = allowCustom && search.trim() !== "" && !exactMatch;

  const totalItems = visibleOptions.length + (showAddOption ? 1 : 0);

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
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (totalItems === 0) {
      setHighlighted(0);
      return;
    }

    setHighlighted((current) => Math.min(current, totalItems - 1));
  }, [totalItems]);

  function resetAndClose() {
    setSearch("");
    setOpen(false);
    setHighlighted(0);
  }

  function selectLibraryOption(option) {
    onChange(option, {
      isCustom: false,
      source: "library",
    });

    resetAndClose();
  }

  function selectCustomOption() {
    const customName = search.trim();

    if (!customName) {
      return;
    }

    onChange(customName, {
      isCustom: true,
      source: "custom",
    });

    resetAndClose();
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setHighlighted((current) =>
          Math.min(current + 1, Math.max(totalItems - 1, 0)),
        );
        break;

      case "ArrowUp":
        event.preventDefault();

        setHighlighted((current) => Math.max(current - 1, 0));
        break;

      case "Enter":
        event.preventDefault();

        if (highlighted < visibleOptions.length) {
          selectLibraryOption(visibleOptions[highlighted]);
        } else if (showAddOption) {
          selectCustomOption();
        }

        break;

      case "Escape":
        setOpen(false);
        break;

      default:
        break;
    }
  }

  function renderGroupedOptions() {
    let optionIndex = 0;

    return filteredGroups.map((group) => (
      <div className="smart-select__group" key={group.group}>
        <div className="smart-select__group-label">{group.group}</div>

        {group.options.map((option) => {
          const currentIndex = optionIndex;
          optionIndex += 1;

          return (
            <div
              key={`${group.group}-${option}`}
              className={`smart-select__option ${
                highlighted === currentIndex
                  ? "smart-select__option--active"
                  : ""
              }`}
              onMouseEnter={() => setHighlighted(currentIndex)}
              onClick={() => selectLibraryOption(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    ));
  }

  if (disabled) {
    return (
      <div className="smart-select">
        <div className="smart-select__control">
          {value || `Select ${label}...`}
        </div>
      </div>
    );
  }

  return (
    <div className="smart-select" ref={wrapperRef}>
      <div className="smart-select__control" onClick={() => setOpen(true)}>
        {value || `Select ${label}...`}
      </div>

      {open && (
        <div className="smart-select__menu">
          <input
            ref={inputRef}
            className="smart-select__search"
            placeholder={`Search ${label}...`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
          />

          {groupedMode
            ? renderGroupedOptions()
            : filteredFlatOptions.map((option, index) => (
                <div
                  key={option}
                  className={`smart-select__option ${
                    highlighted === index ? "smart-select__option--active" : ""
                  }`}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => selectLibraryOption(option)}
                >
                  {option}
                </div>
              ))}

          {visibleOptions.length === 0 && !showAddOption && (
            <div className="smart-select__empty">No matching options</div>
          )}

          {showAddOption && (
            <>
              <div className="smart-select__divider" />

              <div
                className={`smart-select__add ${
                  highlighted === visibleOptions.length
                    ? "smart-select__option--active"
                    : ""
                }`}
                onMouseEnter={() => setHighlighted(visibleOptions.length)}
                onClick={selectCustomOption}
              >
                ➕ {customOptionLabel} “{search.trim()}”
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
