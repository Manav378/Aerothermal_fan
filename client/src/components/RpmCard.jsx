import React from "react";

const RPMCard = ({ value = 0 }) => {
  return (
    <div
      className="
        w-full
        sm:w-56
        md:w-64
        bg-white
        dark:bg-zinc-800
        rounded-lg
        shadow
        px-3
        py-3
        sm:px-4
        sm:py-4
      "
    >
      {/* Label */}
      <p className="text-xs uppercase tracking-wide  select-none text-gray-400 dark:text-gray-500 mb-1">
        Fan Speed
      </p>

      {/* Value */}
      <div className="flex items-end gap-1">
        <p className="text-2xl sm:text-3xl font-semibold  select-none text-gray-800 dark:text-gray-100">
          {value.toLocaleString()}
        </p>
        <span className="text-xs sm:text-sm  select-none text-gray-500 dark:text-gray-400 mb-1">
          RPM
        </span>
      </div>

      {/* Sub text */}
      <p className="text-xs text-gray-400  select-none dark:text-gray-500 mt-1">
        Live rotation speed
      </p>
    </div>
  );
};

export default RPMCard;
