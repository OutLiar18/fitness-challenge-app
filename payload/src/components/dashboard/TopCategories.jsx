import { formatPoints } from "../../utils/displayFormatters";
import "./TopCategories.css";

export default function TopCategories({ categories }) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <section className="top-categories card" aria-labelledby="top-categories-title">
      <div className="top-categories__header">
        <p>Strongest areas</p>
        <h2 id="top-categories-title">Top categories</h2>
      </div>

      {categories.length === 0 ? (
        <div className="top-categories__empty">
          <span aria-hidden="true">🌱</span>
          <p>Your first points will reveal your strongest categories.</p>
        </div>
      ) : (
        <ol className="top-categories__list">
          {categories.map((category, index) => (
            <li key={category.id} className="top-category">
              <span className="top-category__rank" aria-label={`Rank ${index + 1}`}>
                {medals[index]}
              </span>
              <span className="top-category__name">
                <span aria-hidden="true">{category.emoji}</span>
                <span>{category.name}</span>
              </span>
              <strong>{formatPoints(category.points)}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
