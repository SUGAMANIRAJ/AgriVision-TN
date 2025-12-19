
//Express creates the sever from where the HTTPs req and res all are handled & CORS - It is used to allow Cross origin req (By default , browser not allowed bcz, React-5173 != Node-5000),so frontend and backend can talk eachother now !
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

//Values
let counter = 0;


//express.json converts all the RAW JSON format to json format understandable by express ,like ading header and body to json...
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Backend is Running!");
});
app.get("/predict", (req,res)=>{
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


app.post("/api/increment",(req,res)=>{
    counter += 1;
    res.json({
        value : counter
    })
});




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});