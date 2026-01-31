import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FiAlertCircle, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { FaFan } from "react-icons/fa";
import { Appcontent } from "../context/Appcontext";

const TemperatureDashboard = () => {
  const { backendUrl, key } = useContext(Appcontent);

  const [data, setData] = useState({
    currentTemperature: 0,
    predictedTemperature: 0,
    futureTemperatures: [],
    trend: "STABLE",
    fanSpeed: 0,
    buzzer: false,
    alert: "NORMAL",
    history: []
  });

  const fetchData = async () => {
    try {
      if (!key || !backendUrl) return;
      const res = await axios.get(
        `${backendUrl}/api/dashboard/predict/${key}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching temperature:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const alertColor =
    data.alert === "NORMAL"
      ? "text-green-500"
      : data.alert === "RISING_TEMP"
      ? "text-yellow-500"
      : "text-red-500";

  const trendIcon =
    data.trend === "RISING" ? (
      <FiTrendingUp className="text-red-500 ml-2" />
    ) : data.trend === "FALLING" ? (
      <FiTrendingDown className="text-green-500 ml-2" />
    ) : null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 dark:bg-zinc-900 dark:text-zinc-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center">
        Temperature Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

        {/* Current Temp */}
        <Card title="Current Temp">
          <Value value={`${data.currentTemperature}°C`} danger={data.currentTemperature > 45} />
        </Card>

        {/* Predicted Temp */}
        <Card title="Predicted Temp">
          <Value value={`${data.predictedTemperature}°C`} danger={data.predictedTemperature > 45} />
        </Card>

        {/* Trend */}
        <Card title="Trend">
          <p className="text-xl font-bold flex items-center justify-center">
            {data.trend}
            {trendIcon}
          </p>
        </Card>

        {/* Fan Speed */}
        <Card title="Fan Speed">
          <div className="flex items-center space-x-2">
            <FaFan
              className="text-3xl animate-spin-slow"
              style={{ animationDuration: `${3 - data.fanSpeed / 60}s` }}
            />
            <span className="text-xl font-bold">{data.fanSpeed}%</span>
          </div>
        </Card>

        {/* Buzzer */}
        <Card title="Buzzer">
          <p
            className={`text-xl font-bold ${
              data.buzzer ? "text-red-500 animate-pulse" : "text-gray-400"
            }`}
          >
            {data.buzzer ? "ON 🔊" : "OFF"}
          </p>
        </Card>

        {/* Alert */}
        <Card title="Alert">
          <p className={`text-xl font-bold flex items-center justify-center ${alertColor}`}>
            <FiAlertCircle className="mr-2" />
            {data.alert}
          </p>
        </Card>
      </div>

      {/* 🔮 Future Temperature Prediction */}
      <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow">
        <h3 className="text-lg font-semibold mb-2">
          Future Temperature (Next Readings)
        </h3>
        <div className="flex space-x-4">
          {data.futureTemperatures.map((t, i) => (
            <div
              key={i}
              className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-center"
            >
              <p className="text-sm">+{(i + 1) * 30}s</p>
              <p className="font-bold">{t}°C</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* 🔧 Reusable components */
const Card = ({ title, children }) => (
  <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow text-center">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const Value = ({ value, danger }) => (
  <p className={`text-2xl font-bold ${danger ? "text-red-500" : ""}`}>
    {value}
  </p>
);

export default TemperatureDashboard;
