import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

function sameUserId(left, right) {
  return String(left) === String(right);
}

export default function UserHub() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.dashboard().then(setDashboard).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="feedback feedback--error">{error}</div>;
  }

  if (!dashboard) {
    return <div className="feedback">Loading dashboard...</div>;
  }

  return (
    <div className="simple-page">
      <p className="eyebrow">Your Dashboard</p>
      <h1>{dashboard.user.name}</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Points</span>
          <strong>{dashboard.stats.points}</strong>
        </div>
        <div className="stat-card">
          <span>Uploads</span>
          <strong>{dashboard.stats.recipes_count}</strong>
        </div>
        <div className="stat-card">
          <span>Avg. recipe rating</span>
          <strong>{dashboard.stats.average_recipe_rating || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Favourites</span>
          <strong>{dashboard.stats.favorites_count}</strong>
        </div>
      </div>

      <section className="stack-section">
        <div className="section-row">
          <h2>Your Recipes</h2>
          <Link className="button button--secondary" to="/recipes/new">
            Add Recipe
          </Link>
        </div>
        {dashboard.user.recipes.length === 0 ? (
          <div className="feedback">You have not uploaded any recipes yet.</div>
        ) : (
          <div className="recipe-list">
            {dashboard.user.recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                <div className="recipe-card__header">
                  <div>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                  </div>
                  <Link className="button button--ghost" to={`/recipes/${recipe.id}/edit`}>
                    Edit
                  </Link>
                </div>
                <div className="chip-row">
                  {recipe.categories.map((category) => (
                    <span className="chip" key={category.id}>
                      {category.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="stack-section">
        <div className="section-row">
          <h2>Your Favourites</h2>
          <Link className="button button--ghost" to="/recipes">
            Browse Recipes
          </Link>
        </div>
        {dashboard.user.favorites.length === 0 ? (
          <div className="feedback">You have not favourited any recipes yet.</div>
        ) : (
          <div className="recipe-list">
            {dashboard.user.favorites.map((recipe) => (
              <article className="recipe-card" key={`favorite-${recipe.id}`}>
                <div className="recipe-card__header">
                  <div>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    <div className="meta-row">
                      <span>By {recipe.user?.name || "Unknown"}</span>
                      <span>{recipe.average_rating || 0}/5 rating</span>
                    </div>
                  </div>
                  {sameUserId(recipe.user_id, dashboard.user.id) ? (
                    <Link className="button button--ghost" to={`/recipes/${recipe.id}/edit`}>
                      Edit
                    </Link>
                  ) : (
                    <Link className="button button--ghost" to="/recipes">
                      View in Library
                    </Link>
                  )}
                </div>
                <div className="chip-row">
                  {recipe.categories.map((category) => (
                    <span className="chip" key={`favorite-category-${recipe.id}-${category.id}`}>
                      {category.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
