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
  const { backendUrl, key ,IsOnlineDeviceData} = useContext(Appcontent);
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
  <div className="min-h-screen bg-zinc-950 h-[calc(100vh-56px)]  overflow-y-auto text-zinc-200 px-4 md:px-10 py-8 space-y-8">
   {/* HEADER */}
    <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
      🌡️ Temperature Dashboard
    </h1>

     <div className="flex items-center justify-start gap-3 mb-3">
      {/* Device Name */}

 
          <span className="px-3 py-1 rounded-full text-sm flex items-center justify-center select-none font-medium bg-zinc-200 dark:bg-zinc-800">
            {"Device"}:{" "}

            {IsOnlineDeviceData?.isOnline ? (
              <span>{IsOnlineDeviceData.deviceName} 😎</span>
            ) : (
              <span>{"inactive"} 😕</span>
            )}
          </span>



       <span
            className={`px-3 py-1 rounded-full  select-none text-sm font-semibold ${
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
          {data.trend === "RISING" && <FiTrendingUp className="ml-2 text-red-500" />}
          {data.trend === "FALLING" && <FiTrendingDown className="ml-2 text-green-500" />}
        </p>
      </Card>

      <Card title="Alert">
        <p
          className={`text-xl font-bold flex items-center justify-center ${
            data.alert === "NORMAL"
              ? "text-green-500"
              : data.alert === "RISING_TEMP"
              ? "text-yellow-400"
              : "text-red-500"
          }`}
        >
          <FiAlertCircle className="mr-2" />
          {data.alert}
        </p>
      </Card>


    </div>

     
    {/* CHART */}
    <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold mb-4">📈 Temperature History</h3>

      {chartData.length > 1 ? (
        <ResponsiveContainer width="100%" height={350}>
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
      ) : (
        <p className="text-zinc-400">No data yet</p>
      )}
    </div>

    {/* FUTURE */}
    <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold mb-4">🔮 Future Temperature</h3>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {data.futureTemperatures?.map((t, i) => (
          <div
            key={i}
            className="min-w-[110px] bg-zinc-800 rounded-xl p-3 text-center"
          >
            <p className="text-sm text-zinc-400">+{(i + 1) * 30}s</p>
            <p className="text-xl font-bold">{t}°C</p>
          </div>
        ))}
      </div>
    </div>

  </div>
);

};

const Card = ({ title, children }) => (
  <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg text-center">
    <h3 className="text-sm text-zinc-400 mb-2">{title}</h3>
    {children}
  </div>
);


const Value = ({ value, danger }) => (
  <p className={`text-3xl font-bold ${danger ? "text-red-500" : ""}`}>
    {value}
  </p>
);


export default TemperatureDashboard;
