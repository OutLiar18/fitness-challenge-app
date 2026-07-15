import { useMemo, useRef, useState, useEffect } from "react";
import "./SmartSelect.css";

export default function SmartSelect({
  label,
  value,
  options = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const exactMatch = options.some(
    (option) =>
      option.toLowerCase() === search.trim().toLowerCase()
  );

  const showAddOption =
    search.trim() !== "" && !exactMatch;

  const totalItems =
    filteredOptions.length + (showAddOption ? 1 : 0);

  function selectOption(option) {
    onChange(option);
    setSearch("");
    setOpen(false);
    setHighlighted(0);
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) =>
          Math.min(h + 1, totalItems - 1)
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) =>
          Math.max(h - 1, 0)
        );
        break;

      case "Enter":
        e.preventDefault();

        if (highlighted < filteredOptions.length) {
          selectOption(filteredOptions[highlighted]);
        } else if (showAddOption) {
          selectOption(search.trim());
        }

        break;

      case "Escape":
        setOpen(false);
        break;

      default:
        break;
    }
  }

  return (
    <div
      className="smart-select"
      ref={wrapperRef}
    >
      <div
        className="smart-select__control"
        onClick={() => setOpen(true)}
      >
        {value || `Select ${label}...`}
      </div>

      {open && (
        <div className="smart-select__menu">
          <input
            ref={inputRef}
            className="smart-select__search"
            placeholder={`Search ${label}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
          />

          {filteredOptions.map((option, index) => (
            <div
              key={option}
              className={`smart-select__option ${
                highlighted === index
                  ? "smart-select__option--active"
                  : ""
              }`}
              onClick={() => selectOption(option)}
            >
              {option}
            </div>
          ))}

          {showAddOption && (
            <>
              <div className="smart-select__divider" />

              <div
                className={`smart-select__add ${
                  highlighted === filteredOptions.length
                    ? "smart-select__option--active"
                    : ""
                }`}
                onClick={() =>
                  selectOption(search.trim())
                }
              >
                ➕ Add "{search.trim()}"
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}