import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Recipes", href: "/recipes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : "top"}`}>
        <div className="nav-inner">

          <Link to="/" className="logo">
            <img src={logo} alt="Chef's Atlas Logo" style={{ height: "102px", width: "auto" }} />
            <div className="logo-text">
              <span className="logo-title">Chef's Atlas</span>
              <span className="logo-sub">World Kitchen</span>
            </div>
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`nav-link ${
                    location.pathname === link.href ? "active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a7060" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search recipes, cuisines…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="nav-right">
            <div className="nav-divider" />

            <Link to="/profile" className="profile-btn">
              <div className="profile-avatar">A</div>
              <span className="profile-label">User Profile</span>
            </Link>

            <Link to="/recipes/new" className="cta-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Share Recipe
            </Link>

            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a7060" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Search recipes, cuisines, chefs…" />
        </div>

        <ul className="mobile-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`mobile-nav-link ${
                  location.pathname === link.href ? "active" : ""
                }`}
              >
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-footer">
          <Link to="/profile" className="mobile-profile">
            <div
              className="profile-avatar"
              style={{
                width: 34,
                height: 34,
                fontSize: 15,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c9742b 0%, #e8935c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                flexShrink: 0
              }}
            >
              A
            </div>
            <div className="mobile-profile-info">
              <span className="mobile-profile-name">User Profile</span>
              <span className="mobile-profile-role">View Profile</span>
            </div>
          </Link>

          <Link to="/recipes/new" className="mobile-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Share
          </Link>
        </div>
      </div>
    </>
  );
}
