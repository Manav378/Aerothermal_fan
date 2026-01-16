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
const {backendUrl , temprature,rpm,pwm} = useContext(Appcontent);
const [pwmslider, setpwmslider] = useState(0);
  const [data, setData] = useState({ temperature: 32, rpm: 1200 });
  const [graphData, setGraphData] = useState([]);
const [autoMode, setAutoMode] = useState(false);
const [value, setvalue] = useState(126);

// PWM slider live change backend req
useEffect(() => {
  if(!backendUrl || autoMode) return;

  const sendpwm = async()=>{
    try {
      await axios.post(`${backendUrl}/api/dashboard/rpmslider`,{
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
  axios.post(`${backendUrl}/api/dashboard/automode`,{
    enabled: autoMode
  })
  
}, [autoMode , backendUrl]);





useEffect(() => {
  
 console.log(temprature)
}, [temprature]);


useEffect(() => {
  
 console.log(pwm)
}, [pwm]);





  return (

  <div className="
    min-h-screen flex-1 rounded-md p-6
    bg-slate-50 text-black
    dark:bg-zinc-900 dark:text-white
  ">
    <h1 className="
      text-2xl font-bold mb-6 text-center
      text-black dark:text-white
    ">
      Temperature & RPM Monitor
    </h1>

    {/* Gauges */}
    <div className="
      grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 place-items-center
    ">
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow">
        <TemperatureGauge value={temprature} />
      </div>

      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow">
        <RpmGauge value={rpm } />
      </div>

      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow">
        <PWMSliderCard
          value={value}
          disabled={autoMode}
          setValue={setvalue}
        />
      </div>

      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow">
        <AutoModeCard
          autoMode={autoMode}
          setAutoMode={setAutoMode}
        />
      </div>
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow">
        <CurrentPWMCard
          pwm={pwm}
        />
      </div>
    </div>
  </div>
);

  
};

export default Dashboard;
