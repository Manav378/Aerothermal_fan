// TemperatureDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FiAlertCircle } from "react-icons/fi";
import { FaFan } from "react-icons/fa";
import { Appcontent } from "../context/Appcontext";

const TemperatureDashboard = () => {
  const { backendUrl, key } = useContext(Appcontent);

  const [data, setData] = useState({
    currentTemperature: 0,
    predictedTemperature: 0,
    fanSpeed: 0,
    buzzer: false,
    alert: "NORMAL",
  });

  // Fetch data every 30 seconds
  const fetchData = async () => {
    try {
      if (!key || !backendUrl) return;
      const response = await axios.get(`${backendUrl}/api/dashboard/predict/${key}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching temperature:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Alert color
  const alertColor =
    data.alert === "NORMAL"
      ? "text-green-500 dark:text-green-400"
      : data.alert === "RISING_TEMP"
      ? "text-yellow-500 dark:text-yellow-400"
      : "text-red-500 dark:text-red-400";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 dark:bg-zinc-900 dark:text-zinc-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center">Temperature Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Current Temp */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow text-center transition-colors">
          <h3 className="text-lg font-semibold">Current Temp</h3>
          <p
            className={`text-2xl font-bold ${
              data.currentTemperature > 45
                ? "text-red-500 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-200"
            }`}
          >
            {data.currentTemperature}°C
          </p>
        </div>

        {/* Predicted Temp */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow text-center transition-colors">
          <h3 className="text-lg font-semibold">Predicted Temp</h3>
          <p
            className={`text-2xl font-bold ${
              data.predictedTemperature > 45
                ? "text-red-500 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-200"
            }`}
          >
            {data.predictedTemperature}°C
          </p>
        </div>

        {/* Fan Speed */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow text-center flex flex-col items-center justify-center transition-colors">
          <h3 className="text-lg font-semibold">Fan Speed</h3>
          <div className="flex items-center space-x-2 mt-2">
            <FaFan
              className="text-3xl animate-spin-slow dark:text-zinc-200"
              style={{ animationDuration: `${3 - data.fanSpeed / 60}s` }}
            />
            <span className="text-xl font-bold">{data.fanSpeed}%</span>
          </div>
        </div>

        {/* Buzzer */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow text-center transition-colors">
          <h3 className="text-lg font-semibold">Buzzer</h3>
          <p
            className={`text-xl font-bold ${
              data.buzzer
                ? "text-red-500 dark:text-red-400 animate-pulse"
                : "text-gray-500 dark:text-zinc-400"
            }`}
          >
            {data.buzzer ? "ON 🔊" : "OFF"}
          </p>
        </div>

        {/* Alert */}
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow text-center transition-colors">
          <h3 className="text-lg font-semibold">Alert</h3>
          <p className={`text-xl font-bold flex items-center justify-center ${alertColor}`}>
            <FiAlertCircle className="mr-2" />
            {data.alert}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureDashboard;
