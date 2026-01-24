import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { translations } from "../Theme/translation.js";
const AddDevice = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [passKey, setPassKey] = useState("");
  const [connecting, setConnecting] = useState(false);

  const { backendUrl,language } = useContext(Appcontent);
  const navigate = useNavigate();
const t = translations[language];
  // 🔹 Fetch already added devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/device`, {
          withCredentials: true,
        });
        setDevices(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [backendUrl]);

  // 🔹 Add device using passkey
  const handleAddDevice = async () => {
    if (!passKey) return;

    try {
      setConnecting(true);

      const res = await axios.post(
        `${backendUrl}/api/device/add`,
        {
          devicePass_Key: passKey,
          EnterdevicePass_Key: passKey,
        },
        { withCredentials: true }
      );

      if (!res.data.success) {
       toast.error(res.data.message || t.toastAddFail);
        return;
      }

      const statusRes = await axios.get(
        `${backendUrl}/api/device/my-device`,
        { withCredentials: true }
      );

      if (
        statusRes.data.success &&
        statusRes.data.device &&
        statusRes.data.device.isOnline
      ) {
       toast.success(t.toastAddedSuccess);
        navigate("/dashboard");
      } else {
       toast.info(t.toastDeviceOffline);
      }
    } catch (err) {
      toast.error(t.toastConnectFail);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8 bg-slate-100 text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold select-none">
         {t.addDeviceTitle}
        </h2>
      </div>

      {/* ADD DEVICE FORM */}
      <div className="max-w-sm mb-10 bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow transition-colors duration-300">
        <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
           {t.devicePassKey}
        </label>

        <input
          type="text"
          placeholder={t.enterPassKey}
          value={passKey}
          onChange={(e) => setPassKey(e.target.value)}
          className="w-full rounded-lg px-3 py-2 mb-3
                     bg-zinc-100 dark:bg-zinc-900
                     text-black dark:text-white
                     border border-zinc-300 dark:border-zinc-700
                     placeholder-zinc-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAddDevice}
          disabled={!passKey || connecting}
          className="w-full py-2 rounded-lg font-medium
                     bg-blue-600 hover:bg-blue-700
                     text-white cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connecting ? t.connecting : t.addDeviceBtn}
        </button>

        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
           {t.passKeyHelp}
        </p>
      </div>

      {/* MY DEVICES */}
      <h3 className="text-xl font-semibold mb-4 select-none">
        {t.myDevices}
      </h3>

      {loading ? (
        <p className="text-zinc-500 dark:text-zinc-400">
        <p>{t.loadingDevices}</p>
        </p>
      ) : devices.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
        <p>{t.noDevices}</p>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device._id}
              className="rounded-2xl p-4 bg-white dark:bg-zinc-800 shadow
                         border border-zinc-200 dark:border-zinc-700
                         transition-colors duration-300"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">
                  {device.deviceName}
                </h4>

                <span
                  className={`h-3 w-3 rounded-full ${
                    device.isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              <p className="text-sm mt-2">
                {t.status}:{" "}
                <span
                  className={
                    device.isOnline
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
              {device.isOnline ? t.online : t.offline}
                </span>
              </p>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {t.lastSeen}: {new Date(device.lastSeen).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddDevice;
