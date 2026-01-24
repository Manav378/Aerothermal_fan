import React, { useContext, useState, useRef } from "react";
import { assets } from "../temp/assets.js";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(Appcontent);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // OTP helpers
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

  // Step 1: Send OTP to email
  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(backendUrl + "/api/auth/is-setreset", { email });
      res.data.success
        ? toast.success(res.data.message)
        : toast.error(res.data.message);
      res.data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP
  const submitOtp = (e) => {
    e.preventDefault();
    const otpStr = inputRefs.current.map((input) => input.value).join("");
    setOtp(otpStr);
    setIsOtpSubmitted(true);
  };

  // Step 3: Submit new password
  const submitNewPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword)
      return toast.error("Email, OTP, and new password are required");
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/is-resetpass", {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen select-none px-6 bg-linear-to-br from-slate-900 via-blue-950 to-slate-800 relative overflow-hidden">
      {/* Airflow glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%)]"></div>

      {/* Logo */}
      <img
        src={assets.aero}
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 w-28 cursor-pointer opacity-90 hover:opacity-100 transition"
        alt=""
      />

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-sky-800/40 p-10 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)] w-full sm:w-104 text-sky-200 text-sm">
        {!isEmailSent && (
          <form onSubmit={submitEmail}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 tracking-wide text-sky-300">
              Verify Email
            </h2>
            <p className="text-center text-xs mb-6 text-sky-400">
              Enter your registered email to receive OTP
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-slate-800 border border-sky-800/50">
              <img src={assets.mail_icon} alt="" className="opacity-80" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                required
                className="bg-transparent text-sky-100 outline-none w-full placeholder-sky-500"
              />
            </div>
            <button
              disabled={loading}
              className={`w-full py-3 ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              } bg-linear-to-r from-sky-500 to-cyan-700 rounded-xl text-white font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin m-auto" /> : "Send OTP"}
            </button>
          </form>
        )}

        {isEmailSent && !isOtpSubmitted && (
          <form onSubmit={submitOtp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 tracking-wide text-sky-300">
              Enter OTP
            </h2>
            <p className="text-center text-xs mb-6 text-sky-400">
              Enter the 6-digit code sent to your email
            </p>
            <div
              className="flex justify-center gap-2 mb-8"
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-lg rounded-md"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleDelete(e, index)}
                    required
                  />
                ))}
            </div>
            <button
              className="w-full py-3 bg-linear-to-r from-sky-500 to-cyan-700 rounded-xl text-white font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition"
              type="submit"
            >
              Verify OTP
            </button>
          </form>
        )}

        {isEmailSent && isOtpSubmitted && (
          <form onSubmit={submitNewPassword}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 tracking-wide text-sky-300">
              Set New Password
            </h2>
            <p className="text-center text-xs mb-6 text-sky-400">
              Enter your new password below
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-slate-800 border border-sky-800/50">
              <img src={assets.lock_icon} alt="" className="opacity-80" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                className="bg-transparent text-sky-100 outline-none w-full placeholder-sky-500"
              />
            </div>
            <button
              disabled={loading}
              className={`w-full py-3 ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              } bg-linear-to-r from-sky-500 to-cyan-700 rounded-xl text-white font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin m-auto" /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
