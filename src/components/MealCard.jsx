import React from 'react';

export function MealCard({ meal, selected, onSelect, onRemove }) {
  return (
    <article className="menu-card">
      <div className="menu-card-badge">{meal.mealType.toUpperCase()}</div>
      <h3>{meal.name}</h3>
      <p>{meal.description}</p>
      <div className="menu-card-meta">
        {meal.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="meta-pill">{tag}</span>
        ))}
      </div>
      <ul className="menu-card-list">
        <li>Calories: {meal.calories} kcal</li>
        <li>Proteïna: {meal.protein} g</li>
        <li>Hidrats: {meal.carbs} g</li>
        <li>Greixos: {meal.fats} g</li>
      </ul>
      <div className="btn-group">
        {selected ? (
          <button type="button" className="btn-secondary" onClick={() => onRemove(meal.id)}>
            Treure
          </button>
        ) : (
          <button type="button" className="action-button primary-action" onClick={() => onSelect(meal)}>
            Seleccionar
          </button>
        )}
      </div>
    </article>
  );
}
