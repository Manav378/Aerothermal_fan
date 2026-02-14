import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";

import TemperatureGauge from "../components/Temp.jsx";
import RpmGauge from "../components/RpmCard.jsx";
import PWMSliderCard from "../components/pwm.jsx";
import AutoModeCard from "../components/automode.jsx";
import CurrentPWMCard from "../components/Currentpwm.jsx";
import Humidity from "../components/humidity.jsx";
import Heatindex from "../components/heatindex.jsx";
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
    setheatindex,
    sethumidity,
    humidity,
    heatindex,
    fetchMyDevice,
    key,
    pwmSlider,
    setPwmSlider,
    autoMode,
    setAutoMode,
    useDebounce,
    language
  } = useContext(Appcontent);

  const [predTemp, setpredTemp] = useState(null);

  // 🔥 SAFE TRANSLATION (CRASH FIX)
  const t = translations?.[language] || translations?.en || {};

  const debouncedPwm = useDebounce(pwmSlider, 300);

  // DEVICE FETCH
  useEffect(() => {
    fetchMyDevice();
    const interval = setInterval(fetchMyDevice, 2000);
    return () => clearInterval(interval);
  }, []);

  // PREDICTED TEMP
  useEffect(() => {
    if (!backendUrl || !key || !IsOnlineDeviceData?.isOnline) {
      setpredTemp(0);
      return;
    }

    let mounted = true;

    const fetchpredTemp = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/dashboard/predict/${key}`
        );
        if (mounted) {
          setpredTemp(res.data.predictedTemperature);
        }
      } catch (err) {
        console.log("Prediction fetch error:", err.message);
      }
    };

    fetchpredTemp();
    const interval = setInterval(fetchpredTemp, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [backendUrl, key, IsOnlineDeviceData?.isOnline]);

  // PWM SEND
  useEffect(() => {
    if (!backendUrl || autoMode || !key) return;

    const sendpwm = async () => {
      try {
        if (debouncedPwm !== null && debouncedPwm !== undefined) {
          const pwmValue = Number(debouncedPwm);
          if (pwmValue < 80 || pwmValue > 255) return;

          await axios.post(
            `${backendUrl}/api/dashboard/pwm/${key}`,
            { duty: pwmValue },
            { withCredentials: true }
          );
        }
      } catch (error) {
        console.log("PWM update error:", error.message);
      }
    };

    sendpwm();
  }, [key, autoMode, backendUrl, debouncedPwm]);

  // AUTO MODE
  useEffect(() => {
    if (!backendUrl || !key) return;

    const sendauto = async () => {
      try {
        await axios.post(
          backendUrl + `/api/dashboard/auto/${key}`,
          { enabled: autoMode },
          { withCredentials: true }
        );
      } catch (error) {
        console.log(error);
      }
    };

    sendauto();
  }, [autoMode, backendUrl]);

  // LIVE DEVICE DATA
  useEffect(() => {
    if (!IsOnlineDeviceData) return;

    if (!IsOnlineDeviceData.isOnline) {
      settemperature(0);
      setrpm(0);
      setpwm(0);
      sethumidity(0);
      setheatindex(0);
    } else {
      settemperature(IsOnlineDeviceData.temperature || 0);
      setrpm(IsOnlineDeviceData.rpm || 0);
      setpwm(IsOnlineDeviceData.pwm || 0);
      setheatindex(IsOnlineDeviceData.heatindex || 0);
      sethumidity(IsOnlineDeviceData.humidity || 0);
    }
  }, [IsOnlineDeviceData]);

  return (
    <div className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8 bg-slate-100 h-[calc(100vh-56px)] overflow-y-auto text-black select-none dark:bg-zinc-900 dark:text-white transition-colors duration-300">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t?.deviceDashboard}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span className="px-4 py-1 rounded-full text-sm font-medium bg-zinc-200 dark:bg-zinc-800">
            {t?.deviceLabel}:{" "}
            {IsOnlineDeviceData?.isOnline ? (
              <span>{IsOnlineDeviceData.deviceName} 😎</span>
            ) : (
              <span>{t?.inactive} 😕</span>
            )}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              IsOnlineDeviceData?.isOnline
                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            ● {IsOnlineDeviceData?.isOnline ? t?.online : t?.offline}
          </span>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <TemperatureGauge
            value={temprature}
            predicted={predTemp !== null ? predTemp : temprature}
          />
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <RpmGauge value={rpm} />
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <CurrentPWMCard pwm={pwm} />
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <Humidity parameter={humidity} />
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <Heatindex parameter={heatindex} />
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <PWMSliderCard
            value={pwmSlider}
            setValue={setPwmSlider}
            disabled={autoMode}
          />
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow">
          <AutoModeCard autoMode={autoMode} setAutoMode={setAutoMode} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;