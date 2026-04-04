import { useEffect, useState } from "react";
import { api } from "../api/api";
import RecipePanel from "../components/RecipePanel";

export default function RecipeLibrary({ user, onRequireAuth }) {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecipes(nextFilters = filters) {
    setLoading(true);
    setError("");
    try {
      const [recipeResponse, categoryResponse] = await Promise.all([
        api.recipes(nextFilters),
        categories.length ? Promise.resolve({ data: categories }) : api.categories(),
      ]);
      setRecipes(recipeResponse.data);
      if (!categories.length) setCategories(categoryResponse.data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function toggleCategory(name) {
    const nextFilters = {
      ...filters,
      categories: filters.categories.includes(name)
        ? filters.categories.filter((item) => item !== name)
        : [...filters.categories, name],
    };
    setFilters(nextFilters);
    loadRecipes(nextFilters);
  }

  function handleSearch(event) {
    event.preventDefault();
    loadRecipes(filters);
  }

  return (
    <div className="simple-page">
      <div className="section-row">
        <div>
          <p className="eyebrow">Recipe Library</p>
          <h1>Find, rate, and review community recipes.</h1>
        </div>
      </div>

      <form className="filter-panel" onSubmit={handleSearch}>
        <input
          placeholder="Search by recipe name"
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
        />
        <button className="button" type="submit">
          Search
        </button>
      </form>

      <div className="chip-row">
        {categories.map((category) => (
          <button
            className={`chip chip--button ${
              filters.categories.includes(category.name) ? "chip--active" : ""
            }`}
            key={category.id}
            onClick={() => toggleCategory(category.name)}
            type="button"
          >
            {category.name}
          </button>
        ))}
      </div>

      {error && <div className="feedback feedback--error">{error}</div>}
      {loading ? (
        <div className="feedback">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="feedback">No recipes matched your search.</div>
      ) : (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipePanel
              key={recipe.id}
              recipe={recipe}
              user={user}
              onDeleted={() => loadRecipes()}
              onChanged={() => loadRecipes()}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
