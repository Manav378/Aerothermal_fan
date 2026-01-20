import React, { useContext } from "react";
import { Appcontent } from "../context/Appcontext.jsx";

const MainPage = () => {
  const { darkMode } = useContext(Appcontent);

  return (
    <div
      className={`min-h-screen  select-none p-8 transition-colors duration-500 ${
        darkMode ? "bg-zinc-900 text-white" : "bg-slate-50 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold  select-none mb-6">Aerothermal Project Overview</h1>

      <p className="mb-4  select-none">
        Welcome to the Smart Aerothermal Panel. This page provides a high-level overview of the system.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card Example */}
        <div
          className={`rounded-lg shadow p-4  select-none transition-colors duration-500 ${
            darkMode ? "bg-zinc-800 shadow-zinc-700" : "bg-white shadow-gray-200"
          }`}
        >
          <h2 className="font-semibold  select-none mb-2">System Status</h2>
          <p>All sensors are operational.</p>
        </div>

        <div
          className={`rounded-lg shadow p-4  select-none transition-colors duration-500 ${
            darkMode ? "bg-zinc-800 shadow-zinc-700" : "bg-white shadow-gray-200"
          }`}
        >
          <h2 className="font-semibold  select-none mb-2">Recent Data</h2>
          <p>Last updated: 10:55 PM</p>
          {/* Mini charts / summary can go here */}
        </div>
      </div>

      <div className="mt-6  select-none">
        <p>
          Use the Dashboard to monitor live Temperature, RPM, PWM, and Auto Mode settings.
        </p>
        <a
          href="/dashboard"
          className={`mt-2 inline-block  select-none ${
            darkMode
              ? "text-cyan-400 hover:text-cyan-300"
              : "text-blue-600 hover:text-blue-500"
          } underline`}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default MainPage;
