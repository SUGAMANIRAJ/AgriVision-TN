import { Link, useLocation } from "react-router-dom";

export default function Navbar({ role }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-icon">🌾</span>
          <span className="logo-text">
            AgriVision <span className="highlight">TN</span>
          </span>
        </div>

        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>

          {/* Farmer Link */}
          {role === "farmer" && (
            <Link
              to="/farmer"
              className={location.pathname === "/farmer" ? "active" : ""}
            >
              Farmer Portal
            </Link>
          )}

          {/* Business Link - THIS WAS LIKELY HIDDEN */}
          {role === "business" && (
            <Link
              to="/business"
              className={location.pathname === "/business" ? "active" : ""}
            >
              Marketplace
            </Link>
          )}
        </div>

        <div className="nav-auth">
          <span className="role-badge">{role.toUpperCase()}</span>
          <button className="btn-secondary">Logout</button>
        </div>
      </div>
    </nav>
  );
}
  