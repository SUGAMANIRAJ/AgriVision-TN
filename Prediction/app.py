from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the frontend

# --- LOAD THE TRAINED MODEL ---
MODEL_FILENAME = "agri_model.pkl"

print("Loading model...")
try:
    data = joblib.load(MODEL_FILENAME)
    model = data['model']
    le_district = data['le_district']
    le_season = data['le_season']
    le_crop = data['le_crop']
    rainfall_norms = data['rainfall_norms']
    price_dict = data['price_dict']
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"Error: {MODEL_FILENAME} not found. Please run your training script first.")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from frontend
        req = request.json
        district = req.get('district', '').strip().upper()
        crop = req.get('crop', '').strip()
        season = req.get('season', '').strip()
        area_acres = float(req.get('area', 0))
        rainfall_input_mm = float(req.get('rainfall', 0))

        # --- PREDICTION LOGIC (Same as before) ---
        
        # 1. Encode Inputs
        try:
            dist_enc = le_district.transform([district])[0]
        except ValueError:
            # Fallback for unknown district
            dist_enc = le_district.transform([le_district.classes_[0]])[0]

        try:
            crop_enc = le_crop.transform([crop])[0]
        except ValueError:
            return jsonify({'error': f"Crop '{crop}' not supported."}), 400

        try:
            season_enc = le_season.transform([season])[0]
        except ValueError:
            season_enc = le_season.transform([le_season.classes_[0]])[0]

        # 2. Predict Yield (Tonnes/Ha)
        predicted_yield_ha = model.predict([[dist_enc, season_enc, crop_enc]])[0]

        # 3. Rainfall Adjustment
        normal_rain = rainfall_norms.get(district, 0)
        rain_factor = 1.0
        
        if normal_rain > 0:
            ratio = rainfall_input_mm / normal_rain
            if ratio < 0.5:
                rain_factor = 0.6
            elif ratio < 0.8:
                rain_factor = 0.8
            elif ratio > 1.5:
                rain_factor = 0.9
        
        final_yield_ha = predicted_yield_ha * rain_factor

        # 4. Calculate Final Numbers
        area_ha = area_acres * 0.4047
        total_prod_kg = final_yield_ha * area_ha * 1000
        
        # Price Lookup
        price = 30 # Default
        for k, v in price_dict.items():
            if k.lower() in crop.lower():
                price = v
                break
        
        revenue = total_prod_kg * price

        return jsonify({
            'success': True,
            'production_kg': round(total_prod_kg, 2),
            'revenue_inr': round(revenue, 2),
            'yield_per_acre': round(total_prod_kg / area_acres, 2),
            'crop': crop,
            'price_used': price
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)