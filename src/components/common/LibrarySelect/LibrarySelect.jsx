import SearchSelect from "../SearchSelect/SearchSelect";

import useLibrary from "../../../hooks/useLibrary";

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
  const {
    matchingItems,
    loading,
    error,
  } = useLibrary({
    userId,
    itemType,
    searchText: value,
  });

  function renderBook(item) {
    return (
      <>
        <strong>{item.title}</strong>

        {(item.author || item.totalPages) && (
          <div
            style={{
              fontSize: "0.85rem",
              color: "#666",
              marginTop: 2,
            }}
          >
            {[
              item.author,
              item.totalPages
                ? `${item.totalPages} pages`
                : null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </div>
        )}
      </>
    );
  }

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
      getItemKey={(item) => item.id}
      getItemLabel={(item) => item.title}
      renderItem={
        itemType === "books"
          ? renderBook
          : undefined
      }
    />
  );
}