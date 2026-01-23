import React, { useContext } from "react";
import { assets } from "../temp/assets.js";
import { Appcontent } from "../context/Appcontext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  const { userData ,isLoggedin,isverify} = useContext(Appcontent);
console.log(isLoggedin)
  return (
    <section
      className="
        w-full min-h-screen
        flex flex-col items-center justify-center
        px-4 sm:px-6 lg:px-8
        text-center
        bg-linear-to-br from-[#020617] via-[#041b2d] to-[#020617]
        text-cyan-100
        overflow-hidden
      "
    >
      {/* Avatar */}
      <div
        className="
          mb-4 sm:mb-6
          p-1 rounded-full
          bg-linear-to-br from-cyan-400 to-blue-600
          shadow-xl
        "
      >
        <img
          src={assets.header_img}
          alt="profile"
          className="
            w-24 h-24
            sm:w-32 sm:h-32
            md:w-36 md:h-36 select-none
            rounded-full
            bg-[#020617]
          "
        />
      </div>

      {/* Greeting */}
      <h1
        className="
          flex items-center justify-center gap-2
          text-cyan-200
          text-lg sm:text-2xl md:text-3xl
          font-medium
          mb-1 sm:mb-2 select-none
        "
      >
        Hey {userData?.name || "Developer"}
        <img
          src={assets.hand_wave}
          alt="wave"
          className="w-6 sm:w-8"
        />
      </h1>

      {/* Main Title */}
      <h2
        className="
          text-3xl
          sm:text-5xl
          md:text-6xl
          font-bold
          mb-3 sm:mb-4
          bg-linear-to-r from-cyan-400 to-blue-500
          text-transparent bg-clip-text select-none
        "
      >
        Welcome to AeroFan Tech
      </h2>

      {/* Subtitle */}
      <p
        className="
          max-w-md sm:max-w-xl
          text-sm sm:text-base
          mb-8 sm:mb-10
          text-cyan-100/80 select-none
        "
      >
        Let’s optimize airflow, thermal efficiency, and performance
        with our intelligent aerothermal system.
      </p>

      {/* CTA */}
      <button
      onClick={()=>{
       if(!isLoggedin ){
        toast.info("Please Login/Signup")
       }else if(!isverify){
        toast.info("Please Verify your Email")
       }else{
        navigate("/dashboard")
       }
      }}
        className=" cursor-pointer
          px-8 sm:px-12
          py-2.5 sm:py-3
          rounded-full
          bg-linear-to-r from-cyan-500 to-blue-700
          text-white
          text-sm sm:text-base
          font-semibold
          shadow-lg
          hover:scale-105
          active:scale-95
          transition-all
          duration-300
        "
      >
        Get Started
      </button>
    </section>
  );
};

export default Header;
