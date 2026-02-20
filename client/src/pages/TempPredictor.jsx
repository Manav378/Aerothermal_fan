import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import {
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
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
  const { backendUrl, key, IsOnlineDeviceData } = useContext(Appcontent);
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
        { timeout: 15000 }
      );

      setData(res.data);
      localStorage.setItem("temp-dashboard", JSON.stringify(res.data));
    } catch (err) {
      if (err.response?.status === 502) return;
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

  const chartData = Array.isArray(data.history)
    ? data.history.map((item, index) => ({
        time: index + 1,
        temperature: item.temperature,
      }))
    : [];

  return (
    <div className="min-h-screen h-[calc(100vh-56px)] overflow-y-auto 
    bg-gray-100 dark:bg-zinc-950
    text-gray-800 dark:text-zinc-200
    px-4 md:px-10 py-8 space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        🌡️ Temperature Dashboard
      </h1>

      {/* DEVICE INFO */}
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 rounded-full text-sm font-medium
        bg-white dark:bg-zinc-800
        border border-gray-200 dark:border-zinc-700
        shadow-sm">
          Device:{" "}
          {IsOnlineDeviceData?.isOnline ? (
            <span>{IsOnlineDeviceData.deviceName} 😎</span>
          ) : (
            <span>inactive 😕</span>
          )}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            IsOnlineDeviceData?.isOnline
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          ● {IsOnlineDeviceData?.isOnline ? "online" : "offline"}
        </span>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
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
            {data.trend === "RISING" && (
              <FiTrendingUp className="ml-2 text-red-500" />
            )}
            {data.trend === "FALLING" && (
              <FiTrendingDown className="ml-2 text-green-500" />
            )}
          </p>
        </Card>

        <Card title="Alert">
          <p
            className={`text-xl font-bold flex items-center justify-center ${
              data.alert === "NORMAL"
                ? "text-green-500"
                : data.alert === "RISING_TEMP"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            <FiAlertCircle className="mr-2" />
            {data.alert}
          </p>
        </Card>
      </div>

      {/* CHART */}
      <div className="mt-6 p-6 rounded-2xl shadow-xl
      bg-white dark:bg-zinc-900
      border border-gray-200 dark:border-zinc-700">

        <h3 className="text-lg font-semibold mb-4">
          📈 Temperature History
        </h3>

        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid
                stroke="#e5e7eb"
                strokeDasharray="3 3"
                className="dark:stroke-zinc-700"
              />
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
        ) : (
          <p className="text-gray-400 dark:text-zinc-500">
            No data yet
          </p>
        )}
      </div>

      {/* FUTURE TEMPERATURE */}
      <div className="mt-6 p-6 rounded-2xl shadow-xl
      bg-white dark:bg-zinc-900
      border border-gray-200 dark:border-zinc-700">

        <h3 className="text-lg font-semibold mb-4">
          🔮 Future Temperature
        </h3>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {data.futureTemperatures?.map((t, i) => (
            <div
              key={i}
              className="min-w-[110px] p-3 text-center rounded-xl
              bg-gray-100 dark:bg-zinc-800
              shadow-sm"
            >
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                +{(i + 1) * 30}s
              </p>
              <p className="text-xl font-bold">
                {t}°C
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="rounded-2xl p-5 text-center shadow-lg
  bg-white dark:bg-zinc-900
  border border-gray-200 dark:border-zinc-700">

    <h3 className="text-sm mb-2 text-gray-500 dark:text-zinc-400">
      {title}
    </h3>
    {children}
  </div>
);

const Value = ({ value, danger }) => (
  <p className={`text-3xl font-bold ${danger ? "text-red-500" : ""}`}>
    {value}
  </p>
);

export default TemperatureDashboard;