import Selector from "./Selector";

export default function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  disabled = false,
  required = false,
  placeholder,
}) {
  const normalizedOptions = options
    .map((option) => {
      if (typeof option === "string") {
        return {
          key: option,
          label: option,
        };
      }

      const label = option?.name ?? option?.label;

      if (!label) {
        return null;
      }

      return {
        key: option.id ?? label,
        label,
      };
    })
    .filter(Boolean);

  return (
    <Selector
      label={label}
      required={required}
      mode="multiple"
      displayMode="control"
      value={Array.isArray(value) ? value : []}
      items={normalizedOptions}
      disabled={disabled}
      placeholder={placeholder || `Select ${label || "options"}...`}
      searchPlaceholder="Search..."
      getItemKey={(item) => item.key}
      getItemLabel={(item) => item.label}
      onChange={onChange}
    />
  );
}
