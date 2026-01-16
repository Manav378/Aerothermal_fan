import React from "react";

const GaugeCard = ({ title, value, unit, color }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-md flex flex-col items-center">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-3xl font-semibold mt-2">{value}{unit}</h2>
      {/* Simple circular gauge */}
      <div className="w-24 h-24 mt-4 relative">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
          />
        </svg>
      </div>
    </div>
  );
};

export default GaugeCard;
