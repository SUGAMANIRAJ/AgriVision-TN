import { Link } from "react-router-dom";

export default function Navbar({ role }) {
  return (
    <nav>
      <div className="logo">🌾 AgriVision TN</div>

      <Link to="/">Home</Link>

      {role === "farmer" && <Link to="/farmer">Portal</Link>}
      {role === "business" && <Link to="/marketplace">Marketplace</Link>}
    </nav>
  );
}
