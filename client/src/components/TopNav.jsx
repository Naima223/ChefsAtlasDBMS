import { Link, NavLink } from "react-router-dom";

export default function TopNav({ user, onOpenAuth, onLogout }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand-mark">
          <span className="brand-mark__badge">CA</span>
          <span>
            <strong>Chef&apos;s Atlas</strong>
            <small>Recipe community</small>
          </span>
        </Link>

        <nav className="site-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user && <NavLink to="/profile">Dashboard</NavLink>}
          {user?.is_admin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="site-actions">
          {user ? (
            <>
              <div className="user-pill">
                <span>{user.name}</span>
                <small>{user.points} pts</small>
              </div>
              <Link className="button button--secondary" to="/recipes/new">
                Share Recipe
              </Link>
              <button className="button button--ghost" onClick={onLogout} type="button">
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="button button--ghost" onClick={() => onOpenAuth("login")} type="button">
                Log In
              </button>
              <button className="button" onClick={() => onOpenAuth("signup")} type="button">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
