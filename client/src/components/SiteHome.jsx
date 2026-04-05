import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function SiteHome({ user, onOpenAuth }) {
  const [leaderboards, setLeaderboards] = useState({ top_users: [], top_recipes: [] });

  useEffect(() => {
    api.leaderboards().then(setLeaderboards).catch(() => {});
  }, []);

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Cook. Share. Climb the board.</p>
          <h1>The recipe-sharing hub for community-driven cooking.</h1>
          <p className="section-copy">
            Explore recipes, upload your own, earn points from contributions and ratings,
            and discover the top cooks and dishes in Chef&apos;s Atlas.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/recipes">
              Explore Recipes
            </Link>
            {user ? (
              <Link className="button button--secondary" to="/recipes/new">
                Share a Recipe
              </Link>
            ) : (
              <button className="button button--secondary" onClick={() => onOpenAuth("signup")} type="button">
                Join Free
              </button>
            )}
          </div>
        </div>
        <div className="hero-card">
          <span>Top community features</span>
          <ul className="feature-list">
            <li>Google sign-in and email sign-in</li>
            <li>Recipe CRUD with category chips</li>
            <li>Ratings, reviews, points, and leaderboards</li>
            <li>User and admin dashboards</li>
          </ul>
        </div>
      </section>

      <section className="content-grid">
        <article className="info-card">
          <p className="eyebrow">How it works</p>
          <h2>Share recipes and earn recognition.</h2>
          <p className="section-copy">
            Uploading recipes earns points. Extra points arrive when other users rate your food,
            with 5-star ratings bringing the biggest reward.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">Browse smarter</p>
          <h2>Search by title and filter by category.</h2>
          <p className="section-copy">
            Find recipes quickly with title search, category chips, and a detailed recipe feed
            that shows ratings and reviews inline.
          </p>
        </article>
      </section>

      <section className="leaderboards">
        <div className="leaderboard-card">
          <h2>Top Users</h2>
          <ol>
            {leaderboards.top_users.map((userItem) => (
              <li key={userItem.id}>
                <span>{userItem.name}</span>
                <strong>{userItem.points} pts</strong>
              </li>
            ))}
          </ol>
        </div>

        <div className="leaderboard-card">
          <h2>Top Recipes</h2>
          <ol>
            {leaderboards.top_recipes.map((recipe) => (
              <li key={recipe.id}>
                <span>{recipe.title}</span>
                <strong>{recipe.average_rating || 0}/5</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
