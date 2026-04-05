export default function SiteAbout() {
  return (
    <div className="simple-page">
      <p className="eyebrow">About Chef&apos;s Atlas</p>
      <h1>A recipe community built around sharing and trust.</h1>
      <p className="section-copy">
        Chef&apos;s Atlas is a recipe-sharing website where cooks can publish their own dishes,
        discover ideas from others, leave ratings and reviews, and rise through point-based
        leaderboards. The platform is designed for both community discovery and accountable
        moderation through an admin dashboard.
      </p>
      <div className="content-grid">
        <article className="info-card">
          <h2>For everyday cooks</h2>
          <p className="section-copy">
            Users can sign up, log in, browse recipes, search by name, filter by category,
            upload their own recipes, and manage what they publish.
          </p>
        </article>
        <article className="info-card">
          <h2>For platform admins</h2>
          <p className="section-copy">
            Admins can review contacts, delete harmful recipes, remove users, and keep the
            community healthy while the points system reflects moderation outcomes.
          </p>
        </article>
      </div>
    </div>
  );
}
