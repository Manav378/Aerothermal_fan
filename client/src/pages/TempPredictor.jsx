import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import {
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { FaFan } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Appcontent } from "../context/Appcontext";

const DEFAULT_DATA = {
  currentTemperature: 0,
  predictedTemperature: 0,
  futureTemperatures: [],
  trend: "STABLE",
  fanSpeed: 0,
  buzzer: false,
  alert: "NORMAL",
  history: [],
};

const TemperatureDashboard = () => {
  const { backendUrl, key } = useContext(Appcontent);
  const intervalRef = useRef(null);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("temp-dashboard");
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

const fetchData = async () => {
  try {
    if (!backendUrl || !key) return;

    const res = await axios.get(
      `${backendUrl}/api/dashboard/predict/${key}`,
      { timeout: 15000 } // ⬅️ VERY IMPORTANT
    );

    setData(res.data);
    localStorage.setItem("temp-dashboard", JSON.stringify(res.data));

  } catch (err) {
    if (err.response?.status === 502) {
      console.warn("⚠️ Backend temporarily unavailable");
      return; // ⛔ STOP updating UI
    }

    console.error("Prediction fetch error:", err.message);
  }
};


  useEffect(() => {
    fetchData();

    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [backendUrl, key]);

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

  const chartData = Array.isArray(data.history)
    ? data.history.map((item, index) => ({
        time: index + 1,
        temperature: item.temperature,
      }))
    : [];

  return (
    <div className="h-screen overflow-y-auto px-6 py-6 space-y-8 dark:bg-zinc-900 dark:text-zinc-200">
      <h1 className="text-3xl font-bold text-center">
        🌡️ Temperature Dashboard
      </h1>

      {/* 🔲 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card title="Current Temp">
          <Value
            value={`${data.currentTemperature}°C`}
            danger={data.currentTemperature > 45}
          />
        </Card>

        <Card title="Predicted Temp">
          <Value
            value={`${data.predictedTemperature}°C`}
            danger={data.predictedTemperature > 45}
          />
        </Card>

        <Card title="Trend">
          <p className="text-xl font-bold flex items-center justify-center">
            {data.trend}
            {trendIcon}
          </p>
        </Card>

        <Card title="Fan Speed">
          <div className="flex items-center justify-center gap-3">
            <FaFan
              className="text-3xl animate-spin-slow"
              style={{
                animationDuration: `${Math.max(
                  0.8,
                  3 - data.fanSpeed / 60
                )}s`,
              }}
            />
            <span className="text-xl font-bold">
              {data.fanSpeed}%
            </span>
          </div>
        </Card>

        <Card title="Buzzer">
          <p
            className={`text-xl font-bold ${
              data.buzzer
                ? "text-red-500 animate-pulse"
                : "text-gray-400"
            }`}
          >
            {data.buzzer ? "ON 🔊" : "OFF"}
          </p>
        </Card>

        <Card title="Alert">
          <p
            className={`text-xl font-bold flex items-center justify-center ${alertColor}`}
          >
            <FiAlertCircle className="mr-2" />
            {data.alert}
          </p>
        </Card>
      </div>

      {/* 📊 Temperature History Chart */}
     <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl p-5 shadow">
  <h3 className="text-lg font-semibold mb-4">
    📈 Temperature History
  </h3>

  {chartData.length > 1 && (
    <div className="w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )}
</div>


      {/* 🔮 Future Prediction */}
      <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 shadow">
        <h3 className="text-lg font-semibold mb-3">
          🔮 Future Temperature
        </h3>

        <div className="flex gap-3 overflow-x-auto">
          {Array.isArray(data.futureTemperatures) &&
            data.futureTemperatures.map((t, i) => (
              <div
                key={i}
                className="min-w-[90px] px-3 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg text-center"
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

/* 🔧 Reusable Components */
const Card = ({ title, children }) => (
  <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl p-4 shadow text-center">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

const Value = ({ value, danger }) => (
  <p
    className={`text-2xl font-bold ${
      danger ? "text-red-500" : ""
    }`}
  >
    {value}
  </p>
);

export default TemperatureDashboard;
