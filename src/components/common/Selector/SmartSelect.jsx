import Selector from "./Selector";

function normalizeFlatOptions(options = []) {
  return options
    .map((option) => {
      if (typeof option === "string") {
        return {
          key: option,
          label: option,
          group: "",
          originalValue: option,
        };
      }

      const label = option?.name;

      if (!label) {
        return null;
      }

      return {
        key: label,
        label,
        group: "",
        originalValue: label,
      };
    })
    .filter(Boolean);
}

function normalizeOptions(options = []) {
  const groupedMode = options.some(
    (option) =>
      option &&
      typeof option === "object" &&
      typeof option.group === "string" &&
      Array.isArray(option.options),
  );

  if (!groupedMode) {
    return normalizeFlatOptions(options);
  }

  return options.flatMap((group) => {
    if (
      !group ||
      typeof group.group !== "string" ||
      !Array.isArray(group.options)
    ) {
      return [];
    }

    return normalizeFlatOptions(group.options).map((option) => ({
      ...option,
      key: `${group.group}-${option.key}`,
      group: group.group,
    }));
  });
}

export default function SmartSelect({
  label,
  value = "",
  options = [],
  onChange,
  disabled = false,
  allowCustom = true,
  customOptionLabel = "Suggest new",
}) {
  const normalizedOptions = normalizeOptions(options);

  return (
    <Selector
      mode="single"
      displayMode="control"
      value={value}
      items={normalizedOptions}
      disabled={disabled}
      placeholder={`Select ${label}...`}
      searchPlaceholder={`Search ${label}...`}
      allowCustom={allowCustom}
      customLabel={customOptionLabel}
      getItemKey={(item) => item.key}
      getItemLabel={(item) => item.label}
      getItemGroup={(item) => item.group}
      onSelect={(item) =>
        onChange(item.originalValue, {
          isCustom: false,
          source: "library",
        })
      }
      onCustom={(customValue) =>
        onChange(customValue, {
          isCustom: true,
          source: "custom",
        })
      }
    />
  );
}
