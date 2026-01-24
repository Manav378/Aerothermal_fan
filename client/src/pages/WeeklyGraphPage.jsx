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
import { translations } from "../Theme/translation.js";

const STORAGE_KEY = "weekly_graph_data";

const WeeklyGraphPage = () => {
  const { backendUrl, IsOnlineDeviceData,language } = useContext(Appcontent);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 const t = translations[language];
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

      // 👉 DEVICE OFFLINE / NOT AVAILABLE
      if (!IsOnlineDeviceData?._id || !IsOnlineDeviceData.isOnline) {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
          setData(JSON.parse(savedData));
        } else {
          setData(dummyData);
        }

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

        // ✅ STATE UPDATE
        setData(chartData);

        // ✅ SAVE TO localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chartData));
      } catch (err) {
        console.log("Weekly data fetch error:", err.message);

        // 👉 ERROR CASE → LOAD FROM localStorage
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
          setData(JSON.parse(savedData));
        } else {
          setData(dummyData);
        }
      }

      setLoading(false);
    };

    fetchWeeklyData();
  }, [IsOnlineDeviceData, backendUrl]);

  // 🔢 WEEKLY AVERAGE CALCULATION
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

  if (loading) {
    return (
      <p className="text-center mt-20 text-lg text-gray-700 dark:text-gray-300">
        {t.loadingWeeklyData}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-4 sm:p-6 lg:p-10">
      {/* DEVICE INFO */}
      {IsOnlineDeviceData && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          {t.weeklyPerformance} – {IsOnlineDeviceData.deviceName}{" "}
            {IsOnlineDeviceData.isOnline
    ? `(${t.deviceOnline})`
    : `(${t.deviceOffline})`}
        </h2>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">{t.avgTemperature}</p>
          <p className="text-2xl font-bold text-red-500">
            {average.temperature}{t.degreeUnit}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">{t.avgRPM}</p>
          <p className="text-2xl font-bold text-blue-500">
            {average.rpm} {t.rpmUnit}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">{t.avgPWM}</p>
          <p className="text-2xl font-bold text-yellow-500">
            {average.pwm}
          </p>
        </div>
      </div>

      {/* GRAPH */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ef4444" />
            <Line type="monotone" dataKey="rpm" stroke="#3b82f6" />
            <Line type="monotone" dataKey="pwm" stroke="#facc15" />
          </LineChart>
        </ResponsiveContainer>

        {!IsOnlineDeviceData?.isOnline && (
          <p className="text-xs text-center text-gray-500 mt-3">
             {t.offlineWeeklyNote}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeeklyGraphPage;
