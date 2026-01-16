import React from "react";

const RPMCard = ({ value = 0 }) => {
  return (
    <div className="w-45 bg-white dark:bg-zinc-800 rounded-lg shadow px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
        Fan Speed
      </p>

      <div className="flex items-end gap-1">
        <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {value.toLocaleString()}
        </p>
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          RPM
        </span>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        Live rotation speed
      </p>
    </div>
  );
};

export default RPMCard;
