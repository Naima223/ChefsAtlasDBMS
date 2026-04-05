import { useEffect, useState } from "react";
import { api } from "../api/api";
import RecipePanel from "../components/RecipePanel";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  function loadDashboard() {
    api.adminDashboard().then(setDashboard).catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (error) {
    return <div className="feedback feedback--error">{error}</div>;
  }

  if (!dashboard) {
    return <div className="feedback">Loading admin dashboard...</div>;
  }

  return (
    <div className="simple-page">
      <p className="eyebrow">Admin Dashboard</p>
      <h1>Moderation and platform overview</h1>

      <div className="stats-grid">
        <div className="stat-card"><span>Users</span><strong>{dashboard.stats.users}</strong></div>
        <div className="stat-card"><span>Recipes</span><strong>{dashboard.stats.recipes}</strong></div>
        <div className="stat-card"><span>Reviews</span><strong>{dashboard.stats.reviews}</strong></div>
        <div className="stat-card"><span>Contacts</span><strong>{dashboard.stats.contacts}</strong></div>
      </div>

      <section className="stack-section">
        <h2>Recent Contact Messages</h2>
        <div className="recipe-list">
          {dashboard.recent_contacts.map((submission) => (
            <article className="info-card" key={submission.id}>
              <h3>{submission.name}</h3>
              <p>{submission.email}</p>
              <p className="section-copy">{submission.message}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stack-section">
        <h2>Recent Recipes</h2>
        <div className="recipe-list">
          {dashboard.recent_recipes.map((recipe) => (
            <RecipePanel
              key={recipe.id}
              recipe={{ ...recipe, categories: recipe.categories || [], reviews: [] }}
              showAdminActions
              onDeleted={loadDashboard}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
