import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setuserData, setisLoggedin } =
    useContext(Appcontent);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/logout"
      );
      if (data.success) {
        setisLoggedin(false);
        setuserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationotp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
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

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        px-4 sm:px-10 lg:px-24
        py-3 sm:py-4
        backdrop-blur
      "
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img
          src={assets.aero}
          alt="AeroFan Tech"
          className="
            w-24 sm:w-28 md:w-32
            cursor-pointer
          "
          onClick={() => navigate("/")}
        />

        {/* Right Side */}
        {userData ? (
          <div className="relative group">
            {/* Avatar */}
            <div
              className="
                w-8 h-8 sm:w-9 sm:h-9
                flex items-center justify-center
                rounded-full
                bg-linear-to-br from-cyan-400 to-blue-600
                text-white font-semibold
                cursor-pointer
                select-none
              "
            >
              {userData.name[0].toUpperCase()}
            </div>

            {/* Dropdown */}
            <div
              className="
                absolute right-0 mt-2
                hidden group-hover:block
                bg-[#020617]
                rounded-lg
                shadow-xl
                w-40
                border border-cyan-500/20
              "
            >
              <ul className="text-sm py-2 text-cyan-100">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationotp}
                    className="
                      px-4 py-2
                      hover:bg-cyan-500/10
                      cursor-pointer
                    "
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="
                    px-4 py-2
                    hover:bg-red-500/10
                    text-red-400
                    cursor-pointer
                  "
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
              px-5 sm:px-6
              py-2
              rounded-full
              text-sm sm:text-base
              cursor-pointer
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
