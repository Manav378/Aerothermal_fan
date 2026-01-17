import React from "react";

const PWMSliderCard = ({ value = 126, setValue, disabled = false }) => {
  const MIN = 0;
  const MAX = 255;
  const percent = Math.round((value / MAX) * 100);

  return (
    <div className="w-65 bg-white dark:bg-zinc-800 rounded-md shadow px-4 py-3">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        PWM CONTROL
      </p>

      <p className="text-lg font-semibold text-center text-emerald-600 mb-2">
        {percent}%
      </p>

      <div className="flex items-center gap-3">
        <button
          disabled={disabled}
          onClick={() => value > MIN && setValue(value - 1)}
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          −
        </button>

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1 accent-emerald-500"
        />

        <button
          disabled={disabled}
          onClick={() => value < MAX && setValue(value + 1)}
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          +
        </button>

        <span className="text-gray-500 dark:text-gray-400 text-sm w-10 text-right">
          {value}
        </span>
      </div>

      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
        <span>0</span>
        <span>255</span>
      </div>

    </div>
  );
};

export default PWMSliderCard;
