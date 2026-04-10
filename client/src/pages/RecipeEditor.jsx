import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";

function linesToArray(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sameUserId(left, right) {
  return String(left) === String(right);
}

export default function RecipeEditor({ user }) {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const isEditing = Boolean(recipeId);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(isEditing);

  useEffect(() => {
    api.categories().then((response) => setCategories(response.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    setLoadingRecipe(true);
    api
      .recipe(recipeId)
      .then((response) => {
        const recipe = response.data;
        if (!sameUserId(recipe.user_id, user.id)) {
          navigate("/recipes");
          return;
        }

        setForm({
          title: recipe.title,
          description: recipe.description,
          ingredients: (recipe.ingredients || []).join("\n"),
          instructions: (recipe.instructions || []).join("\n"),
          categories: (recipe.categories || []).map((item) => item.name),
        });
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoadingRecipe(false));
  }, [isEditing, recipeId, user.id, navigate]);

  function toggleCategory(name) {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(name)
        ? current.categories.filter((item) => item !== name)
        : [...current.categories, name],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.saveRecipe(
        {
          title: form.title,
          description: form.description,
          ingredients: linesToArray(form.ingredients),
          instructions: linesToArray(form.instructions),
          categories: form.categories,
        },
        recipeId
      );
      navigate(isEditing ? "/profile" : "/recipes");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingRecipe) {
    return <div className="feedback">Loading selected recipe...</div>;
  }

  return (
    <div className="simple-page">
      <p className="eyebrow">{isEditing ? "Update Recipe" : "Share Recipe"}</p>
      <h1>{isEditing ? "Edit your recipe" : "Publish a new community recipe"}</h1>
      {isEditing && (
        <div className="section-row">
          <p className="muted">You are editing only the recipe you selected.</p>
          <Link className="button button--ghost" to="/profile">
            Back to Dashboard
          </Link>
        </div>
      )}
      <form className="stack-form recipe-form" onSubmit={handleSubmit}>
        <input
          placeholder="Recipe title"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          required
        />
        <textarea
          placeholder="Short description"
          rows="4"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          required
        />
        <textarea
          placeholder="Ingredients, one per line"
          rows="6"
          value={form.ingredients}
          onChange={(event) =>
            setForm((current) => ({ ...current, ingredients: event.target.value }))
          }
          required
        />
        <textarea
          placeholder="Instructions, one step per line"
          rows="6"
          value={form.instructions}
          onChange={(event) =>
            setForm((current) => ({ ...current, instructions: event.target.value }))
          }
          required
        />
        <div>
          <p className="field-label">Categories</p>
          <div className="chip-row">
            {categories.map((category) => (
              <button
                className={`chip chip--button ${
                  form.categories.includes(category.name) ? "chip--active" : ""
                }`}
                key={category.id}
                onClick={() => toggleCategory(category.name)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="button" disabled={saving} type="submit">
          {saving ? "Saving..." : isEditing ? "Update Recipe" : "Upload Recipe"}
        </button>
      </form>
    </div>
  );
}
