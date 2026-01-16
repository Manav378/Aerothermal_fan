import React from "react";

const AutoModeCard = ({ autoMode, setAutoMode }) => {
  return (
    <div className="w-50 bg-white dark:bg-zinc-800 rounded-md shadow px-4 py-3 flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">Auto Mode</p>

      <button
        onClick={() => setAutoMode(!autoMode)}
        className={`w-11 h-6 rounded-full relative transition ${
          autoMode ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
            autoMode ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default AutoModeCard;
