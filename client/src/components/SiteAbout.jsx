export default function SiteAbout() {
  return (
    <div className="page-grid">
      <section className="simple-page about-page">
        <p className="eyebrow">About Chef&apos;s Atlas</p>
        <h1>A more credible, community-first home for recipes.</h1>
        <p className="section-copy">
          Chef&apos;s Atlas brings together recipe discovery, creator publishing, community
          reviews, and moderation tools in one thoughtful experience for modern home cooks.
        </p>

        <div className="about-page__metrics">
          <div className="home-stat-pill">
            <strong>Curated discovery</strong>
            <span>Browse standout dishes, new uploads, and community favorites.</span>
          </div>
          <div className="home-stat-pill">
            <strong>Trusted feedback</strong>
            <span>Ratings and reviews help quality recipes rise naturally.</span>
          </div>
          <div className="home-stat-pill">
            <strong>Clear moderation</strong>
            <span>Admin controls keep the platform responsible and welcoming.</span>
          </div>
        </div>
      </section>

      <div className="content-grid">
        <article className="info-card about-page__card">
          <p className="eyebrow">For Cooks</p>
          <h2>Publish recipes with structure and confidence.</h2>
          <p className="section-copy">
            Members can create recipes, organize them by category, manage their own posts,
            and build a reputation through useful contributions.
          </p>
        </article>
        <article className="info-card about-page__card">
          <p className="eyebrow">For Reviewers</p>
          <h2>Help great recipes stand out.</h2>
          <p className="section-copy">
            Thoughtful ratings and comments make discovery stronger, helping other cooks find
            dishes worth trying.
          </p>
        </article>
        <article className="info-card about-page__card">
          <p className="eyebrow">For Admins</p>
          <h2>Maintain quality across the platform.</h2>
          <p className="section-copy">
            Admin tools support recipe removal, user moderation, and a healthier community
            experience as the platform grows.
          </p>
        </article>
      </div>
    </div>
  );
}
