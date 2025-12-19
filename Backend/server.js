require("dotenv").config();

//Express creates the sever from where the HTTPs req and res all are handled & CORS - It is used to allow Cross origin req (By default , browser not allowed bcz, React-5173 != Node-5000),so frontend and backend can talk eachother now !
const express = require("express");
const cors = require("cors");

const pinata = require("./config/pinata");
const fs = require("fs");
const path = require("path");


const app = express();
const PORT = 5000;




//express.json converts all the RAW JSON format to json format understandable by express ,like ading header and body to json...
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Backend is Running!");
});


app.post("/predict", (req,res) => {
    res.json({
        production_kg : 10000,
        revenue_inr:20000000,
        yield_per_acre:222,
        success:true
    });
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