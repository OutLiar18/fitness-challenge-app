import "./TopCategories.css";

export default function TopCategories({ categories }) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="top-categories">
      <h2>Top Categories</h2>

      {categories.length === 0 ? (
        <p>No points earned yet.</p>
      ) : (
        categories.map((category, index) => (
          <div
            key={category.id}
            className="top-category"
          >
            <span className="medal">
              {medals[index]}
            </span>

            <span className="category-name">
              {category.emoji} {category.name}
            </span>

            <span className="category-points">
              {category.points} pts
            </span>
          </div>
        ))
      )}
    </div>
  );
}