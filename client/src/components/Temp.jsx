import React, { useContext } from "react";
import { Appcontent } from "../context/Appcontext";
import { translations } from "../Theme/translation";

export default function TemperatureGauge({ value, predicted }) {
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

  const pred = typeof predicted === "number" ? predicted : null;

  let trend = null;
  if (pred !== null) {
    if (pred > safeTemp + 1) trend = "up";
    else if (pred < safeTemp - 1) trend = "down";
    else trend = "stable";
  }

  const { language } = useContext(Appcontent);
  const t = translations[language];

  return (
    <div className="w-full sm:w-64 md:w-72 bg-white dark:bg-zinc-800 rounded-lg shadow px-3 py-3 sm:px-4 sm:py-4 select-none">
      <h2 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
        {t?.temperature}
      </h2>

      <div className="relative flex justify-center">
        <svg className="w-40 h-20 sm:w-44 sm:h-24" viewBox="0 0 200 120">
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
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute top-8 sm:top-10 text-center">
          <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-100">
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
            {safeTemp < 30
              ? t?.normal
              : safeTemp <= 45
              ? t?.warning
              : t?.danger}
          </p>

          {/* 🔮 Predicted Temperature (Enhanced UX) */}
          {pred !== null && (
            <p
              className={`text-xs mt-1 font-medium select-none ${
                pred > safeTemp ? "text-orange-500" : "text-blue-500"
              }`}
            >
              {t?.predicted || "Predicted"}: {pred}°C{" "}
              {trend === "up" && "⬆️"}
              {trend === "down" && "⬇️"}
              {trend === "stable" && "➖"}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 px-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
