import React, { useContext, useState } from "react";
import { assets } from "../temp/assets.js";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setstate] = useState("sign-up");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();
  const { backendUrl, setisLoggedin, getUserData } = useContext(Appcontent);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      let url =
        state === "sign-up"
          ? `${backendUrl}/api/auth/register`
          : `${backendUrl}/api/auth/login`;

      let payload =
        state === "sign-up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        setisLoggedin(true);
        await getUserData();
        state === "sign-up" ? navigate("/") : navigate("/dashboard")
      
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
    <div className="flex items-center justify-center min-h-screen px-6 bg-linear-to-br from-slate-900 via-blue-950 to-slate-800 relative overflow-hidden">
      
      {/* airflow glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%)]"></div>

      {/* logo */}
      <img
        src={assets.aero}
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 w-28 cursor-pointer opacity-90 hover:opacity-100 transition"
        alt=""
      />

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-sky-800/40 p-10 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)] w-full sm:w-104 text-sky-200 text-sm">

        <h2 className="text-3xl font-bold text-center mb-2 tracking-wide text-sky-300">
          {state === "sign-up" ? "Aerothermal System Access" : "Control Panel Login"}
        </h2>

        <p className="text-center text-xs mb-6 text-sky-400">
          {state === "sign-up"
            ? "Initialize fan monitoring & thermal control module"
            : "Authenticate to access real-time airflow data"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "sign-up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-slate-800 border border-sky-800/50">
              <img src={assets.person_icon} alt="" className="opacity-80" />
              <input
                onChange={(e) => setname(e.target.value)}
                value={name}
                className="bg-transparent text-sky-100 outline-none w-full placeholder-sky-500"
                type="text"
                placeholder="Engineer Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-slate-800 border border-sky-800/50">
            <img src={assets.mail_icon} alt="" className="opacity-80" />
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              className="bg-transparent text-sky-100 outline-none w-full placeholder-sky-500"
              type="email"
              placeholder="System Email ID"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-slate-800 border border-sky-800/50">
            <img src={assets.lock_icon} alt="" className="opacity-80" />
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              className="bg-transparent text-sky-100 outline-none w-full placeholder-sky-500"
              type="password"
              placeholder="Secure Access Key"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-5 text-sky-400 cursor-pointer text-xs hover:text-sky-300 transition"
          >
            Reset Access Credentials?
          </p>

          <button className="w-full py-3 rounded-xl bg-linear-to-r cursor-pointer from-sky-500 to-cyan-700 text-white font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition">
            {state === "sign-up" ? "Initialize System" : "Enter Control Panel"}
          </button>
        </form>

        {state === "sign-up" ? (
          <p className="text-slate-400 text-center text-xs mt-5">
            Existing Operator?
            <span
              onClick={() => setstate("login")}
              className="text-sky-400 cursor-pointer underline ml-1"
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-slate-400 text-center text-xs mt-5">
            New Deployment?
            <span
              onClick={() => setstate("sign-up")}
              className="text-sky-400 cursor-pointer underline ml-1"
            >
              Create Access
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;