import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

function sameUserId(left, right) {
  return String(left) === String(right);
}

function ReviewForm({ recipe, onSaved }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.submitReview(recipe.id, { rating: Number(rating), comment });
      setRating("");
      setComment("");
      onSaved();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="stack-form stack-form--tight" onSubmit={handleSubmit}>
      <div className="grid-two">
        <select value={rating} onChange={(event) => setRating(event.target.value)} required>
          <option value="">Rating</option>
          {[1, 2, 3, 4, 5].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="button button--secondary" disabled={saving} type="submit">
          {saving ? "Saving..." : "Submit Review"}
        </button>
      </div>
      <textarea
        placeholder="Add a review comment"
        rows="3"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default function RecipePanel({
  recipe,
  user,
  onDeleted,
  onChanged,
  onRequireAuth,
  showAdminActions = false,
}) {
  const [busy, setBusy] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const canEdit = user && sameUserId(user.id, recipe.user_id);
  const canReview = user && !sameUserId(user.id, recipe.user_id);
  const isFavorited = Boolean(recipe.favorited_by_auth_user);

  async function handleDelete() {
    if (!window.confirm("Delete this recipe?")) return;
    setBusy(true);
    try {
      await api.deleteRecipe(recipe.id);
      onDeleted?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminDeleteRecipe() {
    if (!window.confirm("Admin delete this recipe?")) return;
    setBusy(true);
    try {
      await api.adminDeleteRecipe(recipe.id);
      onDeleted?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminDeleteUser() {
    if (!window.confirm(`Delete user ${recipe.user?.name}?`)) return;
    setBusy(true);
    try {
      await api.adminDeleteUser(recipe.user_id);
      onDeleted?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleFavoriteToggle() {
    if (!user) {
      onRequireAuth?.();
      return;
    }

    setFavoriteBusy(true);
    try {
      if (isFavorited) {
        await api.unfavoriteRecipe(recipe.id);
      } else {
        await api.favoriteRecipe(recipe.id);
      }
      onChanged?.();
    } catch (error) {
      alert(error.message);
    } finally {
      setFavoriteBusy(false);
    }
  }

  return (
    <article className="recipe-card">
      <div className="recipe-card__header">
        <div>
          <div className="section-row section-row--tight">
            <h2>{recipe.title}</h2>
            <span className="rating-pill">{recipe.average_rating || 0}/5</span>
          </div>
          <p>{recipe.description}</p>
          <div className="meta-row">
            <span>By {recipe.user?.name || "Unknown"}</span>
            <span>{recipe.reviews_count || recipe.reviews?.length || 0} reviews</span>
          </div>
        </div>

        {canEdit && (
          <div className="section-row section-row--tight">
            <Link className="button button--ghost" to={`/recipes/${recipe.id}/edit`}>
              Edit
            </Link>
            <button className="button button--ghost" disabled={busy} onClick={handleDelete} type="button">
              Delete
            </button>
          </div>
        )}

        {!canEdit && (
          <button
            className={`button ${isFavorited ? "button--ghost" : "button--secondary"}`}
            disabled={favoriteBusy}
            onClick={handleFavoriteToggle}
            type="button"
          >
            {favoriteBusy ? "Saving..." : isFavorited ? "Remove Favourite" : "Add Favourite"}
          </button>
        )}
      </div>

      <div className="chip-row">
        {recipe.categories?.map((category) => (
          <span className="chip" key={category.id || category.name}>
            {category.name}
          </span>
        ))}
      </div>

      <div className="detail-grid">
        <div>
          <h3>Ingredients</h3>
          <ul className="detail-list">
            {(recipe.ingredients || []).map((ingredient, index) => (
              <li key={`${recipe.id}-ingredient-${index}`}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Instructions</h3>
          <ol className="detail-list">
            {(recipe.instructions || []).map((instruction, index) => (
              <li key={`${recipe.id}-instruction-${index}`}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>

      <section className="review-block">
        <div className="section-row">
          <h3>Reviews</h3>
          {!user && (
            <button className="button button--ghost" onClick={onRequireAuth} type="button">
              Log in to review
            </button>
          )}
        </div>

        <div className="review-list">
          {recipe.reviews?.length ? (
            recipe.reviews.map((review) => (
              <div className="review-item" key={review.id}>
                <div className="section-row section-row--tight">
                  <strong>{review.user?.name || "User"}</strong>
                  <span className="rating-pill">{review.rating}/5</span>
                </div>
                <p>{review.comment || "No written review."}</p>
              </div>
            ))
          ) : (
            <p className="muted">No reviews yet.</p>
          )}
        </div>

        {canReview && <ReviewForm recipe={recipe} onSaved={onChanged} />}
      </section>

      {showAdminActions && (
        <div className="section-row">
          <button className="button button--ghost" disabled={busy} onClick={handleAdminDeleteRecipe} type="button">
            Admin Delete Recipe
          </button>
          <button className="button button--ghost" disabled={busy} onClick={handleAdminDeleteUser} type="button">
            Admin Delete User
          </button>
        </div>
      )}
    </article>
  );
}
