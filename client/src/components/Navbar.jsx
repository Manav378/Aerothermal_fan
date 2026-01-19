import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";
import React from "react";
const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setuserData, setisLoggedin } = useContext(Appcontent);
  const [open, setOpen] = useState(false);

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setisLoggedin(false);
        setuserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- SEND VERIFY OTP ----------------
  const sendVerificationotp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- OUTSIDE CLICK TO CLOSE ----------------
  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 sm:px-24 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img
          src={assets.aero}
          alt="AeroFan Tech"
          className="w-28 sm:w-32 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Right Side */}
        {userData ? (
          <div
            className="relative group"
            onMouseEnter={() => setOpen(true)} // desktop hover
            onMouseLeave={() => setOpen(false)}
          >
            {/* Avatar */}
            <div
              onClick={(e) => {
                e.stopPropagation(); // mobile click
                setOpen((prev) => !prev);
              }}
              className="
                w-9 h-9 flex items-center justify-center
                rounded-full
                bg-linear-to-br from-cyan-400 to-blue-600
                text-white font-semibold cursor-pointer
                select-none
              "
            >
              {userData.name[0].toUpperCase()}
            </div>

            {/* Dropdown */}
            <div
              className={`
                absolute right-0 mt-1
                bg-[#020617]
                rounded-lg shadow-xl w-40
                border border-cyan-500/20
                z-50
                ${open ? "block" : "hidden"}
                group-hover:block
              `}
            >
              <ul className="text-sm py-2 text-cyan-100">
                {!userData.isAccountVerified && (
                  <li
                    onClick={() => {
                      sendVerificationotp();
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-cyan-500/10 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}

                <li
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-red-500/10 text-red-400 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="
              px-6 py-2 rounded-full cursor-pointer
              bg-linear-to-r from-cyan-500 to-blue-700
              text-white font-medium
              hover:from-cyan-400 hover:to-blue-600
              transition
            "
          >
            Login →
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
