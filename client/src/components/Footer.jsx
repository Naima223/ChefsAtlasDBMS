import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h3>Chef's Atlas</h3>
        <p>A recipe-sharing space for cooks, reviewers, and rising kitchen legends.</p>
      </div>
      <div className="site-footer__links">
        <Link to="/recipes">Recipes</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/profile">Dashboard</Link>
      </div>
    </footer>
  );
}
