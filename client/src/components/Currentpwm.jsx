import React from "react";

const CurrentPWMCard = ({ pwm }) => {
  return (
    <div
      className="
        w-full
        sm:w-64
        md:w-72
        bg-white
        dark:bg-zinc-800
        rounded-xl
        shadow
        px-3
        py-3
        sm:px-4
        sm:py-4
        transition-colors
      "
    >
      {/* Label */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        Current PWM
      </p>

      {/* Value */}
      <h2
        className="
          mt-1
          sm:mt-2
          text-3xl
          sm:text-4xl
          font-bold
          text-blue-600
          dark:text-blue-400
        "
      >
        {pwm}
      </h2>
    </div>
  );
};

export default CurrentPWMCard;
