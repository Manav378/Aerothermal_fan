import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("sign-up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, setisLoggedin, getUserData, darkMode } = useContext(Appcontent);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      const url =
        state === "sign-up"
          ? `${backendUrl}/api/auth/register`
          : `${backendUrl}/api/auth/login`;

      const payload =
        state === "sign-up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        setisLoggedin(true);
        await getUserData();
        navigate(state === "sign-up" ? "/" : "/dashboard");

        toast.success(
          state === "sign-up"
            ? "System Initialized Successfully ⚙️"
            : "Access Granted 🚀"
        );
      } else {
        toast.error(data.message || "Authentication Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server Error ❌");
    }
  };

  return (
    <div
      className={`
        relative flex items-center justify-center min-h-screen px-4
        ${darkMode ? "bg-slate-900" : "bg-linear-to-br from-sky-200 via-blue-300 to-cyan-200"}
      `}
    >
      {/* airflow glow */}
      <div className="absolute inset-0 bg-[radial-linear(circle_at_top,rgba(56,189,248,0.15),transparent_60%)]"></div>

      {/* logo */}
      <img
        src={assets.aero}
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 w-28 cursor-pointer opacity-90 hover:opacity-100 transition"
        alt="Logo"
      />

      <div
        className={`
          relative z-10 p-10 w-full sm:w-104 rounded-2xl shadow-lg 
          border border-sky-800/30 backdrop-blur-xl
          transition-all duration-500 transform
          ${darkMode ? "bg-slate-900/80 text-sky-200" : "bg-white/80 text-slate-900"}
          animate-fadeIn
        `}
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2 tracking-wide text-sky-500">
          {state === "sign-up"
            ? "Aerothermal System Access"
            : "Control Panel Login"}
        </h2>
        <p className="text-center text-xs mb-6 text-sky-400">
          {state === "sign-up"
            ? "Initialize fan monitoring & thermal control module"
            : "Authenticate to access real-time airflow data"}
        </p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {state === "sign-up" && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/70 border border-sky-800/50">
              <img src={assets.person_icon} alt="" className="opacity-80 w-6 h-6" />
              <input
                type="text"
                placeholder="Engineer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none w-full placeholder-sky-500 text-sky-100"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/70 border border-sky-800/50">
            <img src={assets.mail_icon} alt="" className="opacity-80 w-6 h-6" />
            <input
              type="email"
              placeholder="System Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full placeholder-sky-500 text-sky-100"
              required
            />
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/70 border border-sky-800/50 relative">
            <img src={assets.lock_icon} alt="" className="opacity-80 w-6 h-6" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Secure Access Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full placeholder-sky-500 text-sky-100"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer text-sky-400 hover:text-sky-300 transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="text-xs text-sky-400 cursor-pointer hover:text-sky-300 text-right"
          >
            Reset Access Credentials?
          </p>

          <button
            type="submit"
            className="py-3 rounded-xl bg-linear-to-r from-sky-500 to-cyan-700 text-white font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition"
          >
            {state === "sign-up" ? "Initialize System" : "Enter Control Panel"}
          </button>
        </form>

        <p className="text-center text-xs mt-5 text-slate-400">
          {state === "sign-up" ? "Existing Operator?" : "New Deployment?"}{" "}
          <span
            onClick={() => setState(state === "sign-up" ? "login" : "sign-up")}
            className="text-sky-400 cursor-pointer underline ml-1"
          >
            {state === "sign-up" ? "Login" : "Create Access"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
