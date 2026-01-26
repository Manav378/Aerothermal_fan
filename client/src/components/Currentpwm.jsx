import React from "react";
import { translations } from "../Theme/translation";
import { useContext } from "react";
import { Appcontent } from "../context/Appcontext";
const CurrentPWMCard = ({ pwm }) => {
  const {language} = useContext(Appcontent)
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
        select-none
      "
    >
      {/* Label */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {translations[language]?.currentPWM || translations.en.currentPWM}
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
