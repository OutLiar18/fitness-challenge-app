import Selector from "./Selector";

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
  return (
    <Selector
      label={label}
      required={required}
      mode="single"
      displayMode="input"
      value={value}
      items={items}
      disabled={disabled}
      placeholder={placeholder}
      loading={loading}
      error={error}
      allowCustom={allowCustom}
      customLabel={customLabel}
      recentLabel={recentLabel}
      resultsLabel={resultsLabel}
      emptyMessage={emptyMessage}
      maxResults={maxResults}
      showHeading
      getItemKey={getItemKey}
      getItemLabel={getItemLabel}
      renderItem={renderItem}
      onInputChange={onInputChange}
      onSelect={onSelect}
      onCustom={(customValue) => onInputChange(customValue)}
    />
  );
}
