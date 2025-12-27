import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../config/firebase"

export default function YieldPredictor({ children }) {
  const [form, setForm] = useState({
    district: "",
    crop: "",
    season: "Kharif",
    area: "",
    rainfall: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Connects to your Node.js server on port 3000
      const res = await fetch("http://localhost:3000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data);


      await setDoc(doc(db, "cities", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
      });


    } catch (err) {
      alert("Prediction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-form">
      <h2>📊 Predict Your Yield</h2>

      <form onSubmit={handleSubmit} id="predictForm">
        <div className="form-grid">
          {/* District Input with Datalist */}
          <div className="input-group full-width">
            <label htmlFor="district">District</label>
            <input
              id="district"
              list="districts"
              placeholder="Search District (e.g. Coimbatore)..."
              onChange={handleChange}
              required
            />
            <datalist id="districts">
              <option value="Coimbatore" />
              <option value="Thanjavur" />
              <option value="Madurai" />
              <option value="Salem" />
              <option value="Erode" />
              <option value="Vellore" />
              <option value="Tirunelveli" />
              <option value="Kancheepuram" />
              <option value="Tiruppur" />
            </datalist>
          </div>

          {/* Crop Selection */}
          <div className="input-group">
            <label htmlFor="crop">Crop Type</label>
            <select
              id="crop"
              onChange={handleChange}
              required
              value={form.crop}
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="Rice">Rice</option>
              <option value="Maize">Maize</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Cotton(lint)">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Banana">Banana</option>
              <option value="Coconut">Coconut</option>
              <option value="Ragi">Ragi</option>
            </select>
          </div>

          {/* Season Selection */}
          <div className="input-group">
            <label htmlFor="season">Season</label>
            <select id="season" onChange={handleChange} value={form.season}>
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Whole Year">Whole Year</option>
            </select>
          </div>

          {/* Area Input */}
          <div className="input-group">
            <label htmlFor="area">Land Area (Acres)</label>
            <input
              id="area"
              type="number"
              step="0.1"
              placeholder="1.0"
              onChange={handleChange}
              required
            />
          </div>

          {/* Rainfall Input */}
          <div className="input-group">
            <label htmlFor="rainfall">Rainfall (mm)</label>
            <input
              id="rainfall"
              type="number"
              placeholder="Avg: 600"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-predict" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Yield"}
        </button>

        {/* Loading Bar */}
        {loading && (
          <div className="loader" style={{ display: "block" }}>
            <div className="loader-bar"></div>
          </div>
        )}
      </form>

      {/* Result Display Section */}
      {result && (
        <>
          <div className="result-panel" style={{ display: "block" }}>
            <div className="result-row">
              <div>
                <div className="sub-text">Total Production</div>
                <div className="big-number" style={{ color: "#2ecc71" }}>
                  {Math.round(result.production_kg).toLocaleString()} kg
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="sub-text">Est. Revenue</div>
                <div className="big-number" style={{ color: "#219150" }}>
                  ₹ {Math.round(result.revenue_inr).toLocaleString()}
                </div>
              </div>
            </div>
            <hr
              style={{
                border: 0,
                borderTop: "1px solid #bbf7d0",
                margin: "15px 0",
              }}
            />
            <div className="sub-text" style={{ textAlign: "center" }}>
              Yield Efficiency:{" "}
              <span style={{ fontWeight: 600, color: "#2d3436" }}>
                {result.yield_per_acre} kg/acre
              </span>
            </div>
          </div>

          {/* Extension point for child components */}
          {children && children({ result, form })}
        </>
      )}
    </div>
  );
}
