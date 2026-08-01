import useLibrary from "../../../hooks/useLibrary";
import SearchSelect from "./SearchSelect";

const getBookKey = (item) => item.id;
const getBookLabel = (item) => item.title;

function renderBook(item) {
  const metadata = [
    item.author,
    item.totalPages ? `${item.totalPages} pages` : null,
  ].filter(Boolean);

  return (
    <>
      <strong>{item.title}</strong>
      {metadata.length > 0 && (
        <div className="library-option__meta">{metadata.join(" • ")}</div>
      )}
    </>
  );
}

export default function LibrarySelect({
  userId,
  itemType,
  value = "",
  onChange,
  onSelect,
  readOnly = false,
  label,
  placeholder,
  required = false,
}) {
  const { matchingItems, loading, error } = useLibrary({
    userId,
    itemType,
    searchText: value,
  });

  return (
    <SearchSelect
      label={label}
      value={value}
      items={matchingItems}
      loading={loading}
      error={error}
      disabled={readOnly}
      required={required}
      placeholder={placeholder}
      allowCustom
      customLabel="Use new title"
      onInputChange={onChange}
      onSelect={onSelect}
      getItemKey={getBookKey}
      getItemLabel={getBookLabel}
      renderItem={itemType === "books" ? renderBook : undefined}
    />
  );
}
