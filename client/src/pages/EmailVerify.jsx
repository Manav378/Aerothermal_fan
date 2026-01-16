import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(Appcontent);

  const inputrefs = React.useRef([]);
  const navigate = useNavigate();

  const handelInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputrefs.current.length - 1) {
      inputrefs.current[index + 1].focus();
    }
  };

  const handelPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pastArray = paste.split("");
    pastArray.forEach((char, index) => {
      if (inputrefs.current[index]) {
        inputrefs.current[index].value = char;
      }
    });
  };

  const handelDelete = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputrefs.current[index - 1].focus();
    }
  };

  const onsubmithandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputrefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-account",
        { otp }
      );

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

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/dashboard");
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-linear-to-br from-slate-900 via-blue-950 to-slate-800 relative overflow-hidden">

      {/* thermal glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%)]"></div>

      {/* logo */}
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 w-28 cursor-pointer opacity-90 hover:opacity-100 transition"
        alt=""
      />

      <form
        onSubmit={onsubmithandler}
        className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-sky-800/40 p-8 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)] w-96 text-sm"
      >
        <h1 className="text-sky-300 text-2xl font-bold text-center mb-3 tracking-wide">
          Email Verification
        </h1>

        <p className="text-center mb-7 text-sky-400 text-xs">
          Enter the 6-digit OTP to activate the aerothermal control system
        </p>

        <div
          className="flex justify-center gap-2 mb-8"
          onPaste={handelPaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-slate-800 border border-sky-800/50 text-sky-200 text-center text-lg rounded-xl outline-none focus:border-sky-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.5)] transition"
                ref={(e) => (inputrefs.current[index] = e)}
                onInput={(e) => handelInput(e, index)}
                onKeyDown={(e) => handelDelete(e, index)}
              />
            ))}
        </div>

        <button className="w-full py-3 rounded-xl bg-linear-to-r cursor-pointer from-sky-500 to-cyan-700 text-white font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition">
          Verify & Activate System
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
