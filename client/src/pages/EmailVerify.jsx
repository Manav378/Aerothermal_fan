import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../temp/assets.js";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedin, userData, getUserData,setisverify } = useContext(Appcontent);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Auto-focus next input
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
  };

  // Backspace handling
  const handleDelete = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otp = inputRefs.current.map((i) => i.value).join("");
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-account`, { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Redirect if already verified
  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) navigate("/dashboard");
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 bg-linear-to-br select-none from-slate-900 via-blue-950 to-slate-800 relative overflow-hidden transition-colors duration-300">

      {/* Thermal glow */}
      <div className="absolute inset-0 bg-[radial-linear(circle_at_top,rgba(56,189,248,0.15),transparent_60%)] pointer-events-none"></div>

      {/* Logo */}
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        alt="Logo"
        className="absolute left-4 sm:left-6 top-4 sm:top-6 w-24 sm:w-28 cursor-pointer opacity-90 hover:opacity-100 transition"
      />

      {/* OTP Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-sky-800/40 p-6 sm:p-8 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)] transition-colors duration-300"
      >
        <h1 className="text-center text-2xl sm:text-3xl  select-none font-bold text-sky-300 mb-3 tracking-wide">
          Email Verification
        </h1>

        <p className="text-center mb-6 text-sky-400  select-none text-xs sm:text-sm">
          Enter the 6-digit OTP to activate the aerothermal control system
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                required
                ref={(el) => (inputRefs.current[idx] = el)}
                onInput={(e) => handleInput(e, idx)}
                onKeyDown={(e) => handleDelete(e, idx)}
                className="
                  w-12 h-12 sm:w-14 sm:h-14
                  bg-slate-800 border border-sky-800/50
                  text-sky-200 text-center text-lg sm:text-xl
                  rounded-xl outline-none
                  focus:border-sky-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.5)]
                  transition-all
                "
              />
            ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full py-3 sm:py-4 rounded-xl
            bg-linear-to-r from-sky-500 to-cyan-700
            text-white font-semibold tracking-wide
            hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]
            transition-all  select-none
          "
        >
          Verify & Activate System
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
