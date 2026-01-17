import React from "react";

const GaugeCard = ({ title, value, unit, color }) => {
  return (
    <div
      className="
        w-full
        sm:w-64
        md:w-72
        bg-slate-800
        rounded-xl
        px-3
        py-4
        sm:px-4
        sm:py-5
        shadow-md
        flex
        flex-col
        items-center
      "
    >
      {/* Title */}
      <p className="text-xs sm:text-sm text-slate-400">
        {title}
      </p>

      {/* Value */}
      <h2
        className="
          mt-1
          sm:mt-2
          text-2xl
          sm:text-3xl
          font-semibold
          text-white
        "
      >
        {value}
        {unit}
      </h2>

      {/* Gauge */}
      <div
        className="
          w-20 h-20
          sm:w-24 sm:h-24
          mt-3
          sm:mt-4
          relative
        "
      >
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {/* Background circle */}
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* Progress circle */}
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            className="transition-all duration-300"
          />
        </svg>
      </div>
    </div>
  );
};

export default GaugeCard;
