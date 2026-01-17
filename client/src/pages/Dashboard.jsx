// Dashboard.jsx
import React from "react";
import TemperatureGauge from "../components/Temp.jsx";
import RpmGauge from "../components/RpmCard.jsx";
import PWMSliderCard from "../Components/pwm.jsx";
import AutoModeCard from "../Components/automode.jsx";
import CurrentPWMCard from "../components/currentpwm.jsx";

import axios from "axios";
import { useState } from "react";
import { Appcontent } from "../context/Appcontext.jsx";
import { useContext } from "react";
import { useEffect } from "react";

import { THEMES } from "../Theme/theme.js";

const Dashboard = () => {


//Themes 
const {backendUrl , temprature,rpm,pwm,IsOnlineDeviceData,settemperature,setrpm,setpwm,fetchDeviceInfo,isLoggedin,fetchMyDevice} = useContext(Appcontent);

const [pwmslider, setpwmslider] = useState(0);
  const [data, setData] = useState({ temperature: 32, rpm: 1200 });
  const [graphData, setGraphData] = useState([]);
const [autoMode, setAutoMode] = useState(false);
const [value, setvalue] = useState(126);


useEffect(() => {
  fetchMyDevice(); // load device assigned to user
}, []);

// PWM slider live change backend req
useEffect(() => {
  if(!backendUrl || autoMode) return;

  const sendpwm = async()=>{
    try {
      await axios.post(`${backendUrl}/api/dashboard/pwm`,{
        duty:value
      })
    } catch (error) {
      console.log(error);
    }
  }
    sendpwm();
}, [value ,autoMode, backendUrl]);


// auto mode on off
useEffect(() => {
  if(!backendUrl) return;
  axios.post(`${backendUrl}/api/dashboard/auto`,{
    enabled: autoMode
  })
  
}, [autoMode , backendUrl]);


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
  <div className="
    min-h-screen flex-1 p-6
    bg-slate-100 text-black
    dark:bg-zinc-900 dark:text-white
  ">

    {/* HEADER */}
    <div className="mb-8 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">
        Device Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {/* Device Name */}
      <span className="px-4 py-1 rounded-full text-sm font-medium
  bg-zinc-200 dark:bg-zinc-800">
  Device:
  {IsOnlineDeviceData?.isOnline ? (
  <span>{IsOnlineDeviceData.deviceName} 😎</span>
) : (
  <span>Inactive 😕</span>
)}

</span>


        {/* Online / Offline */}
     <span
  className={`
    px-3 py-1 rounded-full text-sm font-semibold
    ${
      IsOnlineDeviceData?.isOnline
        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
    }
  `}
>
  ● {IsOnlineDeviceData?.isOnline ? "Online" : "Offline"}
</span>

      </div>
    </div>

    {/* MAIN GRID */}
    <div className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
      gap-6 place-items-center
    ">

      {/* Temperature */}
      <div className="w-full bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow">
        <TemperatureGauge value={temprature} />
      </div>

      {/* RPM */}
      <div className="w-full bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow">
        <RpmGauge value={rpm} />
      </div>

      {/* Current PWM */}
      <div className="w-full bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow">
        <CurrentPWMCard pwm={pwm} />
      </div>

      {/* PWM Slider */}
      <div className="w-full bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow">
        <PWMSliderCard
          value={value}
          disabled={autoMode}
          setValue={setvalue}
        />
      </div>

      {/* Auto Mode */}
      <div className="w-full bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow">
        <AutoModeCard
          autoMode={autoMode}
          setAutoMode={setAutoMode}
        />
      </div>

    </div>
  </div>
);


  
};

export default Dashboard;
