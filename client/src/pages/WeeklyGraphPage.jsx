// WeeklyGraphPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { Appcontent } from "../context/Appcontext";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const WeeklyGraphPage = () => {
  const { backendUrl, IsOnlineDeviceData } = useContext(Appcontent);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyData = [
    { day: "Mon", temperature: 0, rpm: 0, pwm: 0 },
    { day: "Tue", temperature: 0, rpm: 0, pwm: 0 },
    { day: "Wed", temperature: 0, rpm: 0, pwm: 0 },
    { day: "Thu", temperature: 0, rpm: 0, pwm: 0 },
    { day: "Fri", temperature: 0, rpm: 0, pwm: 0 },
    { day: "Sat", temperature: 0, rpm: 0, pwm: 0 },
    { day: "Sun", temperature: 0, rpm: 0, pwm: 0 },
  ];

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);

      if (!IsOnlineDeviceData?._id) {
        setData(dummyData);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/api/RawData/${IsOnlineDeviceData._id}/raw-weekly`
        );

        const last7 = res.data.slice(-7);
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const chartData =
          last7.length > 0
            ? last7.map((item, index) => ({
                day: days[index % 7],
                temperature: item.temperature,
                rpm: item.rpm,
                pwm: item.pwm,
              }))
            : days.map((day) => ({
                day,
                temperature: IsOnlineDeviceData.temperature,
                rpm: IsOnlineDeviceData.rpm,
                pwm: IsOnlineDeviceData.pwm,
              }));

        setData(chartData);
      } catch (err) {
        console.log("Weekly data fetch error:", err.response?.data || err.message);
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const fallbackData = days.map((day) => ({
          day,
          temperature: IsOnlineDeviceData.temperature,
          rpm: IsOnlineDeviceData.rpm,
          pwm: IsOnlineDeviceData.pwm,
        }));
        setData(fallbackData);
      }

      setLoading(false);
    };

    fetchWeeklyData();
  }, [IsOnlineDeviceData, backendUrl]);

  // Calculate weekly summary
  const summary = data.reduce(
    (acc, item) => {
      acc.temperature += item.temperature;
      acc.rpm += item.rpm;
      acc.pwm += item.pwm;
      return acc;
    },
    { temperature: 0, rpm: 0, pwm: 0 }
  );

  const average = {
    temperature: data.length ? (summary.temperature / data.length).toFixed(1) : 0,
    rpm: data.length ? Math.round(summary.rpm / data.length) : 0,
    pwm: data.length ? Math.round(summary.pwm / data.length) : 0,
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-700 dark:text-gray-300">
        Loading weekly data...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-4 sm:p-6 lg:p-10">
      {/* Device Info */}
      {IsOnlineDeviceData && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-6  text-gray-800 dark:text-gray-200 text-center">
          Weekly Performance - {IsOnlineDeviceData.deviceName}{" "}
          {IsOnlineDeviceData.isOnline ? "(Online)" : "(Offline)"}
        </h2>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg text-gray-800 dark:text-gray-200  font-semibold mb-2">Avg Temperature</h3>
          <p className="text-2xl font-bold text-red-500">{average.temperature}°C</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg text-gray-800 dark:text-gray-200  font-semibold mb-2">Avg RPM</h3>
          <p className="text-2xl font-bold text-blue-500">{average.rpm} RPM</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg text-gray-800 dark:text-gray-200  font-semibold mb-2">Avg PWM</h3>
          <p className="text-2xl font-bold text-yellow-500">{average.pwm}</p>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base leading-relaxed">
        The line chart below represents the weekly performance of your ESP32 Smart Fan Controller. 
        Temperature, RPM, and PWM values are recorded daily to help you analyze trends and optimize fan performance.
      </p>

      {/* Graph */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="day" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "temperature") return [`${value}°C`, "Temperature"];
                if (name === "rpm") return [`${value} RPM`, "RPM"];
                if (name === "pwm") return [`${value}`, "PWM"];
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "5px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#FF5733"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="rpm"
              stroke="#33C3FF"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="pwm"
              stroke="#FFC300"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyGraphPage;
