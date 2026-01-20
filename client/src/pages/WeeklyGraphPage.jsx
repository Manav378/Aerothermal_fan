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

  // Fallback dummy data (7 days)
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

      // Agar device object exist kare
      if (!IsOnlineDeviceData?._id) {
        setData(dummyData);
        setLoading(false);
        return;
      }

      try {
        // Backend se weekly historical data fetch
        const res = await axios.get(
          `${backendUrl}/api/RawData/${IsOnlineDeviceData._id}/raw-weekly`
        );

        // Backend data mapping
        const last7 = res.data.slice(-7); // last 7 entries
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const chartData =
          last7.length > 0
            ? last7.map((item, index) => ({
                day: days[index % 7],
                temperature: item.temperature,
                rpm: item.rpm,
                pwm: item.pwm,
              }))
            : dummyData;

        setData(chartData);
      } catch (err) {
        console.log("Weekly data fetch error:", err.response?.data || err.message);
        setData(dummyData);
      }

      setLoading(false);
    };

    fetchWeeklyData();
  }, [IsOnlineDeviceData, backendUrl]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* Device name display */}
      {IsOnlineDeviceData && (
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Weekly Data for: {IsOnlineDeviceData.deviceName}
          {IsOnlineDeviceData.isOnline ? " (Online)" : " (Offline)"}
        </h2>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="day" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "temperature") return [`${value}°C`, name];
                if (name === "rpm") return [`${value} RPM`, name];
                if (name === "pwm") return [`${value}`, name];
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
            <Line type="monotone" dataKey="temperature" stroke="#FF5733" strokeWidth={2} />
            <Line type="monotone" dataKey="rpm" stroke="#33C3FF" strokeWidth={2} />
            <Line type="monotone" dataKey="pwm" stroke="#FFC300" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyGraphPage;
