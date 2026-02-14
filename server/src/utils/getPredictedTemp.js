import dotenv from 'dotenv'
dotenv.config()
import axios from "axios";

export const getTemperaturePrediction = async (req, res) => {
  try {
 const main_url = process.env.NODE_ENV === "production" ?  "https://aerothermal-fan-ai-ml.onrender.com/api/predict" :  "http://127.0.0.1:8000/api/predict"
  
const PYTHON_API_URL = process.env.PYTHON_API_URL || main_url;


    const response = await axios.get(PYTHON_API_URL);

 
    res.json(response.data);
  } catch (error) {
    console.error("Prediction fetch error:", error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};
