import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sliders,
  Settings,
  Plus,
  Menu,
  X,
  BarChart2,
} from "lucide-react";
import { Appcontent } from "../context/Appcontext";
import { translations } from "../Theme/translation.js";

const Sidebar = () => {
  const { language } = useContext(Appcontent);
  const [open, setOpen] = useState(false);
  const t = translations[language];

  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md text-gray-300 hover:bg-slate-800 dark:hover:bg-zinc-800 transition";

  const activeClass =
    "bg-slate-800 dark:bg-zinc-800 text-white";

  return (
    <>
      {/* ☰ Mobile Menu Button (ONLY WHEN SIDEBAR CLOSED) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed top-2 left-2 z-50
            md:hidden
            p-2
            rounded-md
            bg-slate-800
            text-white
            shadow-lg
          "
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed inset-0 z-30
            bg-black/50
            md:hidden
          "
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static
          top-0 left-0 z-40
          w-64
          min-h-screen
          px-4 pt-16 md:pt-6
          flex flex-col
          bg-slate-900
          dark:bg-zinc-950
          transform
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ❌ Close Button (ONLY WHEN SIDEBAR OPEN) */}
        {open && (
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h1 className="text-lg font-semibold select-none text-white tracking-wide">
              {t?.controlPanel}
            </h1>
            <button onClick={() => setOpen(false)}>
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        )}

        {/* Desktop Title */}
        <h1 className="hidden md:block text-xl select-none font-semibold text-white mb-8 text-center tracking-wide">
          {t?.controlPanel}
        </h1>

        {/* Nav */}
        <nav className="flex flex-col select-none gap-2 flex-1">
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <LayoutDashboard size={18} />
            {t?.dashboard}
          </NavLink>

          <NavLink
            to="/add-device"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Plus size={18} />
            {t?.addDevice}
          </NavLink>

          <NavLink
            to="/week-data"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <BarChart2 size={18} />
            {t?.weeklyData}
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Sliders size={18} />
            {t?.about}
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Settings size={18} />
            {t?.settings}
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
