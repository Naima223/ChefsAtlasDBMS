import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
import RecipePanel from "../components/RecipePanel";
import { useToast } from "../components/useToast";

export default function RecipeLibrary({ user, onRequireAuth }) {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", categories: [], page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState(null);
  const { showToast } = useToast();

  const loadRecipes = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const [recipeResponse, categoryResponse] = await Promise.all([
        api.recipes(nextFilters),
        categories.length ? Promise.resolve({ data: categories }) : api.categories(),
      ]);
      setRecipes(recipeResponse.data);
      setMeta(recipeResponse.meta);
      if (!categories.length) setCategories(categoryResponse.data);
    } catch (loadError) {
      setError(loadError.message);
      showToast(loadError.message, "error");
    } finally {
      setLoading(false);
    }
  }, [categories, filters, showToast]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  function toggleCategory(name) {
    const nextFilters = {
      ...filters,
      page: 1,
      categories: filters.categories.includes(name)
        ? filters.categories.filter((item) => item !== name)
        : [...filters.categories, name],
    };
    setFilters(nextFilters);
    loadRecipes(nextFilters);
  }

  function handleSearch(event) {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    loadRecipes(nextFilters);
  }

  function handlePageChange(page) {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadRecipes(nextFilters);
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
        <>
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

          {meta?.last_page > 1 && (
            <div className="pagination-bar">
              <button
                className="button button--ghost"
                disabled={meta.current_page <= 1}
                onClick={() => handlePageChange(meta.current_page - 1)}
                type="button"
              >
                Previous
              </button>
              <span className="pagination-bar__status">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                className="button button--ghost"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => handlePageChange(meta.current_page + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
