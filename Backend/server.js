require("dotenv").config();
const axios = require('axios'); 


//Express creates the sever from where the HTTPs req and res all are handled & CORS - It is used to allow Cross origin req (By default , browser not allowed bcz, React-5173 != Node-5000),so frontend and backend can talk eachother now !
const express = require("express");
const cors = require("cors");

const pinata = require("./config/pinata");
const fs = require("fs");
const path = require("path");


const app = express();
const PORT = 3000;




//express.json converts all the RAW JSON format to json format understandable by express ,like ading header and body to json...
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Backend is Running!");
});



app.post("/predict", async (req, res) => {
  try {
    // 1. Get data sent from your frontend (Form or JSON)
    const { district, crop, season, area, rainfall } = req.body;

    // 2. Forward the data to the Flask Server (Running on Port 5000)
    // Ensure your Python app is running before calling this!
    const flaskResponse = await axios.post("http://127.0.0.1:5000/predict", {
      district: district,
      crop: crop,
      season: season,
      area: area,
      rainfall: rainfall,
    });

    // 3. Extract the dynamic results from the Python response
    const predictionData = flaskResponse.data;

    // 4. Send the real ML data back to your frontend
    res.json({
      production_kg: predictionData.production_kg,
      revenue_inr: predictionData.revenue_inr,
      yield_per_acre: predictionData.yield_per_acre,
      crop: predictionData.crop,
      price_used: predictionData.price_used,
      success: true,
    });
  } catch (error) {
    console.error("Error communicating with Python ML server:", error.message);

    // Handle cases where Python server might be down
    res.status(500).json({
      success: false,
      message: "The ML prediction engine is currently unreachable.",
      error: error.message,
    });
  }
});



app.post("/ipfs/upload", async (req, res) => {
  try {
     const payload = {
      pinataMetadata: {
        name: `yield-report-${Date.now()}`,
      },
      pinataContent: req.body,
    };

    if (!payload){
      return res.status(400).json({ error: "No payload provided" });
    }

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();

    console.log(data);


    return res.json({
      cid: data.IpfsHash,
      timestamp: data.Timestamp,
    });


  } catch (err) {
    console.error("IPFS upload error:", err.message);
    return res.status(500).json({ error: "IPFS upload failed" });
  }
});



app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
}); 