import React from "react";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { Appcontent } from "../context/Appcontext";
import axios from 'axios'
import { toast } from "react-toastify";
import { translations } from "../Theme/translation.js";
import { useNavigate } from "react-router-dom";
const Settings = () => {
 const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

 const {backendUrl,setlanguage,language,setuserData, setisLoggedin} = useContext(Appcontent)
 const t = translations[language];

 const navigate = useNavigate()

   const logout = async () => {
    await axios.post(backendUrl + "/api/auth/logout",  { withCredentials: true });
    setisLoggedin(false);
    setuserData(false);
    navigate("/");
  };
 useEffect(() => {
  
  if(dark){
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme" , "dark")
  }else{
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme" , "light");
  }  
 
 }, [dark]);


// get languages function 
 const gethandeler = async()=>{
  try {
    const res = await axios.get(backendUrl+'/api/pref/language' , {withCredentials:true});
   if(res.data.success){
    setlanguage(res.data.message);
      localStorage.setItem("language", res.data.language);
   }else{
    toast.error(res.data.error);
   }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
 }
 useEffect(() => {
    
    gethandeler()
  }, []);

  useEffect(() => {
    if(language){
      updatelanguage(language)
    }
   
  }, [language]);



  // update languages function


  const updatelanguage = async(lang)=>{
    try {
      await axios.put(backendUrl+"/api/pref/language" ,{languages:lang}, {withCredentials:true});
       localStorage.setItem("language", lang);
    } catch (error) {
      console(error);
      toast.error(error.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900  select-none dark:text-gray-100">
        {t?.settingsPreferences}
      </h1>

      {/* Theme Section */}
      <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-md flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-gray-100  select-none">
          {t?.theme}
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
              transition-transform duration-300  select-none
              ${dark ? "translate-x-6" : "translate-x-0"}
            `}
          >
            {dark ? "🌙" : "☀️"}
          </span>
        </button>
      </div>



      {/* Languages section */}

      <div className="mt-6 p-4 bg-gray-100 dark:bg-zinc-800 rounded-md">
  <span className="font-medium text-gray-900 dark:text-gray-100 select-none">
      {t?.language}
  </span>
  <div className="flex gap-4 mt-2">
    <button
    onClick={()=>{
      setlanguage('en')
      updatelanguage(language)
    }}
      className={`px-4 py-2 rounded-lg cursor-pointer font-semibold transition ${
        language === "en" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
      } hover:bg-blue-600`}
    >
   {t?.english}
    </button>

    <button
    onClick={()=>{
      setlanguage('hi')
      updatelanguage(language)
    }}
      className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition ${
        language === "hi" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
      } hover:bg-blue-600`}
    >
      {t?.hindi}
    </button>
  </div>
</div>


<div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4 shadow space-y-4 mt-6 w-full max-w-4xl mx-auto">
  <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
   {t?.security}
  </h2>

  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300 mb-2">
  {t?.Manage}
  </p>

  {/* Change Password */}
  <div className="rounded-lg p-4 bg-blue-100 dark:bg-blue-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
    <span className="text-blue-700 dark:text-blue-300 font-medium">
      {t?.changereset}
    </span>
    <button
      onClick={() => navigate("/reset-password")}
      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded transition-colors duration-200 self-start sm:self-auto"
    >
      {t?.go}
    </button>
  </div>

  {/* Logout */}
  <div className="rounded-lg p-4 bg-red-100 dark:bg-red-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
    <span className="text-red-700 dark:text-red-300 font-medium">
        {t?.logout}
    </span>
    <button
      onClick={logout}
      className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded transition-colors duration-200 self-start sm:self-auto"
    >
      {t?.logout}
    </button>
  </div>
</div>



    </div>
  );
};

export default Settings;
