import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Sliders, Settings, LogOut,Plus  } from "lucide-react";
import { Appcontent } from "../context/Appcontext";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const { backendUrl, setuserData, setisLoggedin } = useContext(Appcontent);

  const logout = async () => {
    await axios.post(backendUrl + "/api/auth/logout");
    setisLoggedin(false);
    setuserData(false);
    navigate("/");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md text-gray-300 hover:bg-slate-800 dark:hover:bg-zinc-800 transition";
  
  const activeClass =
    "bg-slate-800 dark:bg-zinc-800 text-white";

  return (
    <div className="w-60 min-h-screen px-4 py-6 flex flex-col bg-slate-900 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold text-white mb-8 text-center tracking-wide">
        Control Panel
      </h1>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to="/dashboard" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

         <NavLink to="/add-device" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
         
          <Plus size={18}/>
          Add-Device
        </NavLink>

        <NavLink to="/about" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Sliders size={18} />
          About
        </NavLink>

       

       

        <NavLink to="/settings" className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }>
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-800 dark:hover:bg-zinc-800 rounded-md transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
