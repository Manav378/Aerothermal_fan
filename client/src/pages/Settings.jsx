import { useState, useEffect } from "react";
import React from "react";

const Settings = () => {
 const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

 useEffect(() => {
  
  if(dark){
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme" , "dark")
  }else{
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme" , "light");
  }
 
 }, [dark]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Settings Preferences
      </h1>

      {/* Theme Section */}
      <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-md flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          Theme
        </span>
        <button
          onClick={() => setDark(!dark)}
          className="
            relative w-14 h-8 rounded-full
            bg-gray-300 dark:bg-gray-700
            transition-colors duration-300
            flex items-center cursor-pointer
          "
        >
          <span
            className={`
              absolute left-1 top-1
              w-6 h-6 rounded-full
              bg-white
              flex items-center justify-center
              text-xs
              transition-transform duration-300
              ${dark ? "translate-x-6" : "translate-x-0"}
            `}
          >
            {dark ? "🌙" : "☀️"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
