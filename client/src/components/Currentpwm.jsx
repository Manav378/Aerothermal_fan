import React from "react";

const CurrentPWMCard = ({ pwm }) => {
  return (
    <div
      className="
        w-full max-w-xs
        bg-white dark:bg-zinc-800
        rounded-xl shadow
        p-5
        transition-colors
      "
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Current PWM
      </p>

      <h2
        className="
          mt-2
          text-4xl font-bold
          text-blue-600 dark:text-blue-400
        "
      >
        {pwm}
      </h2>
    </div>
  );
};

export default CurrentPWMCard;
