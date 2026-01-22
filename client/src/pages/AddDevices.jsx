import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddDevice = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [passKey, setPassKey] = useState("");
  const [connecting, setConnecting] = useState(false);

  const { backendUrl } = useContext(Appcontent);
  const navigate = useNavigate();

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

      if (res.data.success) {
        toast.success("Device added successfully");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Failed to add device");
      }
    } catch (err) {
      toast.error("Failed to connect device");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">Add Device</h2>

      {/* 🔹 ADD DEVICE FORM */}
      <div className="max-w-sm mb-10">
        <label className="block mb-2 text-sm font-medium">
          Device Pass Key
        </label>
        <input
          type="text"
          placeholder="Enter device pass key"
          value={passKey}
          onChange={(e) => setPassKey(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <button
          onClick={handleAddDevice}
          disabled={!passKey || connecting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Add Device"}
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Enter the pass key provided with your ESP32 device.
        </p>
      </div>

      {/* 🔹 MY DEVICES LIST */}
      <h3 className="text-xl font-semibold mb-4">My Devices</h3>

      {loading ? (
        <p className="text-gray-500">Loading devices...</p>
      ) : devices.length === 0 ? (
        <p className="text-gray-500">
          No devices available. Add a device using its pass key.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div
              key={device._id}
              className="rounded-xl border p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{device.deviceName}</h4>
                <span
                  className={`h-3 w-3 rounded-full ${
                    device.isOnline ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={
                    device.isOnline ? "text-green-600" : "text-red-600"
                  }
                >
                  {device.isOnline ? "Online" : "Offline"}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last Seen: {new Date(device.lastSeen).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddDevice;
