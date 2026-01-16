import React from "react";

export default function TemperatureGauge({ value }) {
  const min = -10;
  const max = 60;

  const temp = typeof value === "number" ? value : min;
  const safeTemp = Math.min(Math.max(temp, min), max);
  const percent = (safeTemp - min) / (max - min);

  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent);

  let strokeColor = "#22c55e";
  if (safeTemp >= 30 && safeTemp <= 45) strokeColor = "#f59e0b";
  else if (safeTemp > 45) strokeColor = "#ef4444";

  return (
    <div className="w-55 bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
      <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Temperature
      </h2>

      <div className="relative flex justify-center">
        <svg width="180" height="100" viewBox="0 0 200 120">
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke 0.4s ease" }}
          />
        </svg>

        <div className="absolute top-10 text-center">
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-100">
            {safeTemp}
            <span className="text-sm">°C</span>
          </p>

          <p
            className={`text-xs mt-1 font-medium ${
              safeTemp < 30
                ? "text-green-600"
                : safeTemp <= 45
                ? "text-orange-500"
                : "text-red-600"
            }`}
          >
            {safeTemp < 30 ? "Normal" : safeTemp <= 45 ? "Warning" : "Danger"}
          </p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1 px-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
