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

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [options, search]);

  function selectOption(option) {
    onChange(option);
    setSearch("");
    setOpen(false);
  }

  const exactMatch = options.some(
    (option) =>
      option.toLowerCase() ===
      search.trim().toLowerCase()
  );

  const showAddOption =
    search.trim() !== "" && !exactMatch;

  return (
    <div
      className="smart-select"
      ref={wrapperRef}
    >
      <div
        className="smart-select__control"
        onClick={() => setOpen(!open)}
      >
        {value || `Select ${label}...`}
      </div>

      {open && (
        <div className="smart-select__menu">
          <input
            autoFocus
            className="smart-select__search"
            placeholder={`Search ${label}...`}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {filteredOptions.map((option) => (
            <div
              key={option}
              className="smart-select__option"
              onClick={() =>
                selectOption(option)
              }
            >
              {option}
            </div>
          ))}

          {showAddOption && (
            <>
              <div className="smart-select__divider" />

              <div
                className="smart-select__add"
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