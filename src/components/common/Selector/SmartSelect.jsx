import { useMemo } from "react";
import Selector from "./Selector";

function normalizeFlatOptions(options = []) {
  return options
    .map((option) => {
      if (typeof option === "string") {
        return { key: option, label: option, group: "", originalValue: option };
      }

      const label = option?.name ?? option?.label;

      return label
        ? {
            key: option.id ?? label,
            label,
            group: option.group ?? "",
            originalValue: option.value ?? label,
          }
        : null;
    })
    .filter(Boolean);
}

function normalizeOptions(options = []) {
  const grouped = options.some(
    (option) => option && typeof option === "object" && Array.isArray(option.options),
  );

  if (!grouped) {
    return normalizeFlatOptions(options);
  }

  return options.flatMap((group) =>
    normalizeFlatOptions(group?.options ?? []).map((option) => ({
      ...option,
      key: `${group.group}-${option.key}`,
      group: group.group ?? "Other",
    })),
  );
}

const getItemKey = (item) => item.key;
const getItemLabel = (item) => item.label;
const getItemGroup = (item) => item.group;

export default function SmartSelect({
  label,
  value = "",
  options = [],
  onChange,
  disabled = false,
  required = false,
  allowCustom = true,
  customOptionLabel = "Suggest new",
}) {
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  return (
    <Selector
      label={label}
      required={required}
      mode="single"
      displayMode="control"
      value={value}
      items={normalizedOptions}
      disabled={disabled}
      placeholder={`Select ${String(label || "option").toLocaleLowerCase()}…`}
      searchPlaceholder={`Search ${String(label || "options").toLocaleLowerCase()}…`}
      allowCustom={allowCustom}
      customLabel={customOptionLabel}
      getItemKey={getItemKey}
      getItemLabel={getItemLabel}
      getItemGroup={getItemGroup}
      onSelect={(item) =>
        onChange(item.originalValue, { isCustom: false, source: "library" })
      }
      onCustom={(customValue) =>
        onChange(customValue, { isCustom: true, source: "custom" })
      }
    />
  );
}
