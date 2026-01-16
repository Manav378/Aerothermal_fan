import axios from "axios";
import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import { useEffect } from "react";
export const Appcontent = createContext()




export const AppContextProvider = (props)=>{
        const backendUrl = import.meta.env.VITE_BACKEND_URL 
       const [isLoggedin, setisLoggedin] = useState(false);
       const [userData, setuserData] = useState(false);
     
   const [temprature, settemperature] = useState(0);
   const [rpm, setrpm] = useState(0);
   const [pwm, setpwm] = useState(0);


       const getUserData = async()=>{
           try {
               const {data} = await axios.get(backendUrl+ '/api/user/data')
               data.success ? setuserData(data.userData) : toast.error(data.message)
           } catch (error) {
               toast.error(error.message)
           }
       }
    const getAuthstate = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth',{withCredentials:true} )
            if(data.success){
                setisLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    
    // for temperatue fetching 
    useEffect(() => {
      const gettemp = async()=>{
      try {
        const res = await axios.get(`${backendUrl}/api/dashboard/temp`);
    
        settemperature(res.data.data);
      } catch (error) {
        console.log(error);
      }
      
    }
    gettemp();
    const interval = setInterval(gettemp , 3000);
    
    return ()=>clearInterval(interval);
     
    }, [backendUrl]);
    
    
    // for PWM fetching 
    useEffect(() => {
      const getpwm = async()=>{
      try {
        const res = await axios.get(`${backendUrl}/api/dashboard/pwm`);
    
        setpwm(res.data.data);
      } catch (error) {
        console.log(error);
      }
      
    }
    getpwm();
    const interval = setInterval(getpwm , 3000);
    
    return ()=>clearInterval(interval);
     
    }, [backendUrl]);
    
    
    
    
    
    // for rpm fetching 
    
    
    useEffect(() => {
     
        const getrpm = async()=>{
          try {
            const res = await axios.get(`${backendUrl}/api/dashboard/rpm`)
            setrpm(res.data.data)
            
          } catch (error) {
            console.log(error);
          }
        }
    
      getrpm();
    
      const interval = setInterval(getrpm , 3000);
      return ()=>clearInterval(interval);
      
    }, [backendUrl]);
    

        useEffect(() => {
              axios.defaults.withCredentials = true;
            getAuthstate()
        }, []);

        // useEffect(() => {
        //   const interval = setInterval(() => {
        //     const newTemp = Math.floor(Math.random() * 30) + 20; // 20–50
        //     const newRpm = Math.floor(Math.random() * 2000) + 1000; // 1000–3000
      
        //     setData({ temperature: newTemp, rpm: newRpm });
      
        //     setGraphData(prev => [
        //       ...prev.slice(-10),
        //       {
        //         time: new Date().toLocaleTimeString([], {
        //           hour: "2-digit",
        //           minute: "2-digit"
        //         }),
        //         temperature: newTemp,
        //         rpm: newRpm
        //       }
        //     ]);
        //   }, 1000);
      
        //   return () => clearInterval(interval);
        // }, []);

    const value = {
        backendUrl,
        isLoggedin, setisLoggedin,
        userData , setuserData,
        getUserData,temprature,rpm,
        pwm
    }


    return (

        <Appcontent.Provider value={value}>
            {props.children}
        </Appcontent.Provider>
        )
    
}