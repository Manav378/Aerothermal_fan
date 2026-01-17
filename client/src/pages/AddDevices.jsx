import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddDevice = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [enterdevice, setenterdevice] = useState("");
  const [connecting, setConnecting] = useState(false);

  const { backendUrl, setIsOnlineDeviceData } = useContext(Appcontent);
  const navigate = useNavigate();

  // Fetch devices from backend
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/device`);
        if (res.data && Array.isArray(res.data.data)) {
          setDevices(res.data.data);
        } else {
          setDevices([]);
          console.warn("API returned unexpected format:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch devices", err);
        setError("Failed to load devices.");
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [backendUrl]);

  // Connect device handler
  const handleConnectDevice = async () => {
    if (!selectedDeviceId || !enterdevice) return;

    try {
      setConnecting(true);
      const res = await axios.post(`${backendUrl}/api/device/add`, {
        devicePass_Key: selectedDeviceId,
        EnterdevicePass_Key: enterdevice,
      });

      if (res.data.success) {
        setIsOnlineDeviceData(res.data.device);
        toast.success("Device connected!");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to connect device");
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500 dark:text-gray-400">Loading devices...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">My Devices</h2>

      {devices.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No devices available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div
              key={device._id}
              className="
                cursor-pointer
                rounded-xl
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-zinc-800
                p-4
                hover:shadow-lg
                transition
              "
              onClick={() => {
                if (!device.isOnline) {
                  toast.error("Cannot connect an offline device");
                  return;
                }
                setSelectedDeviceId(device.devicePass_Key);
                setIsModalOpen(true);
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {device.deviceName}
                </h3>
                <span
                  className={`h-3 w-3 rounded-full ${device.isOnline ? "bg-green-500" : "bg-red-500"}`}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Status:{" "}
                <span className={`font-medium ${device.isOnline ? "text-green-600" : "text-red-600"}`}>
                  {device.isOnline ? "Online" : "Offline"}
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Last Seen: {new Date(device.lastSeen).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-72 sm:w-80 relative shadow-lg transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Connect Device</h3>
            <input
              type="text"
              placeholder="Enter Device ID"
              value={enterdevice}
              onChange={(e) => setenterdevice(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-4 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                onClick={() => setIsModalOpen(false)}
                disabled={connecting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                onClick={handleConnectDevice}
                disabled={connecting || !selectedDeviceId || !enterdevice}
              >
                {connecting ? "Connecting..." : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDevice;
