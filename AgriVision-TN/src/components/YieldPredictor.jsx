import { useState } from "react";

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
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setResult(data);
    } catch {
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-form">
      <h2>📊 Predict Your Yield</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input id="district" placeholder="District" onChange={handleChange} required />
          <select id="crop" onChange={handleChange} required>
            <option value="">Crop</option>
            <option>Rice</option>
            <option>Maize</option>
            <option>Groundnut</option>
          </select>
          <select id="season" onChange={handleChange}>
            <option>Kharif</option>
            <option>Rabi</option>
          </select>
          <input id="area" type="number" placeholder="Area (acres)" onChange={handleChange} required />
          <input id="rainfall" type="number" placeholder="Rainfall (mm)" onChange={handleChange} required />
        </div>

        <button disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Yield"}
        </button>
      </form>

      {result && (
        <>
          <div className="result-panel">
            <h3>Prduction : {Math.round(result.production_kg)} kg</h3>
            <p>Revenue : ₹ {Math.round(result.revenue_inr)}</p>
            <small> Efficiency: {result.yield_per_acre} kg / acre</small>
          </div>

          {/* EXTENSION POINT */}
          {children && children({ result, form })}
        </>
      )}
    </div>
  );
}
