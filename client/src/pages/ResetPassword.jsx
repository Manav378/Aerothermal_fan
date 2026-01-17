import React, { useContext, useState, useRef } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl, darkMode } = useContext(Appcontent);

  axios.defaults.withCredentials = true;

  // States
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [otp, setOtp] = useState("");

  const inputRefs = useRef([]);

  // OTP input handlers
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleDelete = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    paste.split("").forEach((char, idx) => {
      if (inputRefs.current[idx]) inputRefs.current[idx].value = char;
    });
  };

  // Submit email
  const submitEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/auth/is-setreset`, { email });
      toast[res.data.success ? "success" : "error"](res.data.message);
      res.data.success && setIsEmailSent(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Submit OTP
  const submitOtp = (e) => {
    e.preventDefault();
    const otpStr = inputRefs.current.map((i) => i.value).join("");
    setOtp(otpStr);
    setOtpSubmitted(true);
  };

  // Submit new password
  const submitNewPassword = async (e) => {
    e.preventDefault();
    try {
      if (!email || !otp || !newPassword) return toast.error("All fields are required!");
      const { data } = await axios.post(`${backendUrl}/api/auth/is-resetpass`, {
        email,
        otp,
        newPassword,
      });
      toast[data.success ? "success" : "error"](data.message);
      data.success && navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Common form classes
  const formBaseClass = `p-8 rounded-lg shadow-lg w-96 text-sm transition-colors duration-500 ${
    darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
  }`;
  const inputBaseClass = `w-full px-3 py-2 rounded-full outline-none transition-colors duration-500 ${
    darkMode ? "bg-zinc-800 text-white placeholder-zinc-400" : "bg-gray-100 text-black placeholder-gray-500"
  }`;

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-6 sm:px-0 ${
        darkMode ? "bg-zinc-900" : "bg-linear-to-br from-blue-200 to-purple-400"
      }`}
    >
      <img
        src={assets.aero}
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt="Logo"
      />

      {/* Step 1: Enter Email */}
      {!isEmailSent && (
        <form onSubmit={submitEmail} className={formBaseClass}>
          <h1 className="text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
          <div className={`mb-4 flex items-center gap-3 ${darkMode ? "bg-zinc-800" : "bg-gray-100"} px-5 py-2.5 rounded-full`}>
            <img src={assets.mail_icon} className="w-4 h-4" alt="" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email ID"
              className={inputBaseClass}
            />
          </div>
          <button className="w-full py-2.5 bg-blue-600 text-white rounded-full mt-3 hover:bg-blue-700 transition">
            Submit
          </button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {isEmailSent && !otpSubmitted && (
        <form onSubmit={submitOtp} className={formBaseClass}>
          <h1 className="text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>

          <div className="flex justify-center gap-[5px] mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className={`w-12 h-12 rounded-md text-center text-lg transition-colors duration-500 ${
                    darkMode ? "bg-zinc-800 text-white" : "bg-gray-100 text-black"
                  }`}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleDelete(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Submit
          </button>
        </form>
      )}

      {/* Step 3: Enter New Password */}
      {isEmailSent && otpSubmitted && (
        <form onSubmit={submitNewPassword} className={formBaseClass}>
          <h1 className="text-2xl font-semibold text-center mb-4">New Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your new password below</p>
          <div className={`mb-4 flex items-center gap-3 ${darkMode ? "bg-zinc-800" : "bg-gray-100"} px-5 py-2.5 rounded-full`}>
            <img src={assets.lock_icon} className="w-4 h-4" alt="" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="New Password"
              className={inputBaseClass}
            />
          </div>
          <button className="w-full py-2.5 bg-blue-600 text-white rounded-full mt-3 hover:bg-blue-700 transition">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
