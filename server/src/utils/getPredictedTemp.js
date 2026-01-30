import axios from "axios";

export const getTemperaturePrediction = async (req, res) => {
  try {
    // Production me python API ka URL environment variable se use karo
const PYTHON_API_URL = process.env.PYTHON_API_URL || "https://aerothermal-fan-ai-ml.vercel.app/api/predict";


    const response = await axios.get(PYTHON_API_URL);
    console.log(res.data)
    res.json(response.data);
  } catch (error) {
    console.error("Prediction fetch error:", error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};
