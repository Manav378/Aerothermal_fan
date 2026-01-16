import React from "react";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-black p-8">
      <h1 className="text-3xl font-bold mb-6">Aerothermal Project Overview</h1>

      <p className="mb-4">
        Welcome to the Smart Aerothermal Panel. This page provides a high-level overview of the system.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card Example */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">System Status</h2>
          <p>All sensors are operational.</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Recent Data</h2>
          <p>Last updated: 10:55 PM</p>
          {/* You can add mini charts / summary here */}
        </div>
      </div>

      <div className="mt-6">
        <p>Use the Dashboard to monitor live Temperature, RPM, PWM, and Auto Mode settings.</p>
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default MainPage;
