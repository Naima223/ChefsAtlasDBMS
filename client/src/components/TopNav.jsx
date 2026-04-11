import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function TopNav({ user, onOpenAuth, onLogout }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand-mark">
          <img src={logo} alt="Chef's Atlas" className="brand-mark__logo" />
          <strong>Chef's Atlas</strong>
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