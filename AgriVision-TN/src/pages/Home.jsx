import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-hero">
      <section className="welcome-section">
        <h1>
          Welcome to <span>AgriVision TN</span>
        </h1>
        <p>
          Choose your portal to get started with AI-powered agriculture
          insights.
        </p>

        <div className="portal-cards">
          <Link to="/farmer" className="path-card">
            <div className="path-icon">👨‍🌾</div>
            <h2>Farmer Portal</h2>
            <p>
              Predict crop yields, analyze rainfall, and secure data on IPFS.
            </p>
            <span className="btn-path">Enter Portal</span>
          </Link>

          <Link to="/business" className="path-card">
            <div className="path-icon">🏢</div>
            <h2>Business Portal</h2>
            <p>
              Access marketplace data, verify yields, and connect with farmers.
            </p>
            <span className="btn-path">Enter Marketplace</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
