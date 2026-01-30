import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filepath = fileURLToPath(import.meta.url)
console.log("filePath" , __filepath)
const __dirname = path.dirname(__filepath)

const pythonPath = path.join(__dirname,'../../../ai-ml/app.py')


export const getTemperaturePrediction = (req, res) => {
  console.log("PYTHON FILE PATH:", pythonPath);
  // const { devicekey } = req.params;
  exec(`python "${pythonPath}" `, (error, stdout, stderr) => {
    if (error) {
      console.error("EXEC ERROR:", error);
      return res.status(500).json({ error: "Prediction failed" });
    }

    if (stderr) {
      console.error("PYTHON STDERR:", stderr);
    }

    try {
      const data = JSON.parse(stdout);
      return res.json(data);
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);
      return res.status(500).json({
        error: "Python output is not valid JSON",
        rawOutput: stdout,
      });
    }
  });
};
