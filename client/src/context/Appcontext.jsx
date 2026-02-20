import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import { useEffect } from "react";
export const Appcontent = createContext()




export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedin, setisLoggedin] = useState(false);
  const [isverify, setisverify] = useState(false);
  const [userData, setuserData] = useState(false);
  const [language, setlanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [temprature, settemperature] = useState(0);
  const [rpm, setrpm] = useState(0);
  const [pwm, setpwm] = useState(0);
  const [humidity, sethumidity] = useState(0);
  const [heatindex, setheatindex] = useState(0);
  const [IsOnlineDeviceData, setIsOnlineDeviceData] = useState(null);
  const [key, setkey] = useState('');
  const [pwmSlider, setPwmSlider] = useState(null);
  const [autoMode, setAutoMode] = useState(null);
  useEffect(() => {
    if (!language) {
      setlanguage("en");
    }
  }, [language]);



  useEffect(() => {
    localStorage.setItem("language", language || "en");
  }, [language]);
  const fetchMyDevice = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/device/my-device`, { withCredentials: true });
      // console.log(data)


      if (data.success) {
        setIsOnlineDeviceData(data.device);
        console.log(data);


        settemperature(
          data?.device?.temperature != null
            ? Number(data.device.temperature.toFixed(2))
            : 0
        );
        setrpm(data.device.rpm || 0);
        setpwm(data.device.pwm || 0);
        sethumidity(data.device.humidity || 0);
        setheatindex(data.device.heatindex || 0);

        setkey(data.device.devicePass_Key);


        setAutoMode(prev =>
          prev === null ? data.device.autoMode : prev
        );

        setPwmSlider(prev =>
          prev === null ? data.device.pwmValue : prev
        );
      }
    } catch (err) {
      settemperature(0);
      setrpm(0);
      setpwm(0);
    }
  };




  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }




  useEffect(() => {
    axios.defaults.withCredentials = true;
    getAuthstate();

  }, []);





  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data')
      if (data.success) {

        setuserData(data.userData)
        setisverify(data.userData.isAccountVerified)
      } else {

        //  toast.info(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getAuthstate = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth', { withCredentials: true })
      if (data.success) {
        setisLoggedin(true)
        getUserData()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const value = {
    backendUrl,
    isLoggedin, setisLoggedin,
    userData, setuserData,
    getUserData, temprature, rpm,
    pwm, setIsOnlineDeviceData, IsOnlineDeviceData,
    settemperature, setrpm, setpwm, fetchMyDevice, key,
    pwmSlider, setPwmSlider, autoMode, setAutoMode, useDebounce,
    setisverify, isverify, setlanguage, language, sethumidity, humidity, heatindex, setheatindex
  }


  return (

    <Appcontent.Provider value={value}>
      {props.children}
    </Appcontent.Provider>
  )

}