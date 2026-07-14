import { CATEGORIES } from "../../constants/categories";

export default function CategoryGrid({
  selected,
  onSelect,
}) {
  return (
    <>
      <h2>Select Category</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelect(category.id)}
            style={{
              cursor: "pointer",
              padding: "20px",
              borderRadius: "12px",

              border:
                selected === category.id
                  ? "3px solid royalblue"
                  : "1px solid #ddd",

              textAlign: "center",

              transition: ".2s",

              background:
                selected === category.id
                  ? "#eef5ff"
                  : "white",
            }}
          >
            <h1>{category.emoji}</h1>

            <strong>{category.name}</strong>
          </div>
        ))}
      </div>
    </>
  );
}