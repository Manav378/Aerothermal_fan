import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";

// Components
import TemperatureGauge from "../components/Temp.jsx";
import RpmGauge from "../components/RpmCard.jsx";
import PWMSliderCard from "../components/pwm.jsx";
import AutoModeCard from "../components/automode.jsx";
import CurrentPWMCard from "../components/Currentpwm.jsx";
import { translations } from "../Theme/translation.js";
const Dashboard = () => {
  const {
    backendUrl,
    temprature,
    rpm,
    pwm,
    IsOnlineDeviceData,
    settemperature,
    setrpm,
    setpwm,
    fetchMyDevice,key, pwmSlider, setPwmSlider,autoMode,
setAutoMode,useDebounce,language
  } = useContext(Appcontent);

const t = translations[language];
const debouncedPwm = useDebounce(pwmSlider, 300);
  // Load assigned device
useEffect(() => {
  fetchMyDevice(); // initial load

  const interval = setInterval(() => {
    fetchMyDevice();
  }, 2000); // 2 sec polling

  return () => clearInterval(interval);
}, []);



  // Update PWM live if not auto mode
useEffect(() => {
  if (!backendUrl || autoMode || !key) return;

  const sendpwm = async () => {
    try {
      if (debouncedPwm !== null && debouncedPwm !== undefined) {
        // Make sure it's a number
        const pwmValue = Number(debouncedPwm);

        // Optional: clamp between 80-255 to prevent backend 400
        if (pwmValue < 80 || pwmValue > 255) return;

        await axios.post(
          `${backendUrl}/api/dashboard/pwm/${key}`,
          { duty: pwmValue },
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.log("PWM update error:", error.response?.data || error.message);
    }
  };

  sendpwm();
}, [key, autoMode, backendUrl, debouncedPwm]);


  // Auto mode toggle
  useEffect(() => {
   const sendauto = async()=>{
    if(!backendUrl || !key) return
    try {
      const res = await axios.post(backendUrl+`/api/dashboard/auto/${key}` , {enabled:autoMode},{withCredentials:true})
     

      
    } catch (error) {
      console.log(error)
      
    }
   }
   sendauto()
  }, [autoMode, backendUrl]);

  // Update live device data
  useEffect(() => {
    if (!IsOnlineDeviceData) return;

    if (!IsOnlineDeviceData.isOnline) {
      settemperature(0);
      setrpm(0);
      setpwm(0);
    } else {
      settemperature(IsOnlineDeviceData.temperature || 0);
      setrpm(IsOnlineDeviceData.rpm || 0);
      setpwm(IsOnlineDeviceData.pwm || 0);
    }
  }, [IsOnlineDeviceData]);

  return (
    <div className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8 bg-slate-100 text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl  select-none font-bold">{t.deviceDashboard}</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Device Name */}
          <span className="px-4 py-1 rounded-full text-sm  select-none font-medium bg-zinc-200 dark:bg-zinc-800">
            {t.deviceLabel}:{" "}

            {IsOnlineDeviceData?.isOnline ? (
              <span>{IsOnlineDeviceData.deviceName} 😎</span>
            ) : (
              <span>{t.inactive} 😕</span>
            )}
          </span>

          {/* Online / Offline */}
          <span
            className={`px-3 py-1 rounded-full  select-none text-sm font-semibold ${
              IsOnlineDeviceData?.isOnline
                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            ● {IsOnlineDeviceData?.isOnline ? t.online : t.offline}
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        
        {/* Temperature */}
        <div className="w-full bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl shadow transition-colors duration-300">
          <TemperatureGauge value={temprature} />
        </div>

        {/* RPM */}
        <div className="w-full bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl shadow transition-colors duration-300">
          <RpmGauge value={rpm} />
        </div>

        {/* Current PWM */}
        <div className="w-full bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl shadow transition-colors duration-300">
          <CurrentPWMCard pwm={pwm} />
        </div>

        {/* PWM Slider */}
        <div className="w-full bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl shadow transition-colors duration-300">
          <PWMSliderCard value={pwmSlider} setValue={setPwmSlider} disabled={autoMode} />
        </div>

        {/* Auto Mode */}
        <div className="w-full bg-white dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl shadow transition-colors duration-300">
          <AutoModeCard autoMode={autoMode} setAutoMode={setAutoMode} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
