import React from "react";
import { translations } from "../Theme/translation";
import { useContext } from "react";
import { Appcontent } from "../context/Appcontext";

const AutoModeCard = ({ autoMode, setAutoMode }) => {

const {language} = useContext(Appcontent)
  return (
    <div
      className="
        w-full
        sm:w-64
        md:w-72
        bg-white
        dark:bg-zinc-800
        rounded-lg
        shadow
        px-3
        py-2
        sm:px-4
        sm:py-3
        flex
        items-center
        justify-between
      "
    >
      {/* Text */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
       {translations[language]?.autoMode || translations.en.autoMode}
      </p>

      {/* Toggle Button */}
      <button
        onClick={() => setAutoMode(!autoMode)}
        className={`
          w-10 h-5
          sm:w-11 sm:h-6
          rounded-full
          relative
          transition-colors cursor-pointer
          duration-300
          ${autoMode ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <span
          className={`
            absolute
            top-0.5
            left-0.5
            w-4 h-4
            sm:w-5 sm:h-5
            bg-white
            rounded-full
            transition-transform
            duration-300
            ${autoMode ? "translate-x-5 sm:translate-x-6" : ""}
          `}
        />
      </button>
    </div>
  );
};

export default AutoModeCard;
