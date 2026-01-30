import DeviceModels from "../models/Device.model.js";

const OFFLINE_TIME = 30 * 1000;

export const getDevice = async (req, res) => {
  try {
    const userId = req.UserId

    const devices = await DeviceModels.find({user: userId });

    const updatedIsOnline = devices.map((device) => {
      const isOnline =
        device.lastSeen &&
        Date.now() - new Date(device.lastSeen).getTime() < OFFLINE_TIME;

      return {
        ...device._doc,
        isOnline,
      };
    });

    res.status(200).json({
      success: true,
      data: updatedIsOnline,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyActiveDevice = async (req, res) => {
  const device = await DeviceModels.findOne({
    user: req.UserId,
    isActive: true
  });

  if (!device) {
    return res.json({ success: false });
  }

  const isOnline =
    Date.now() - new Date(device.lastSeen).getTime() < OFFLINE_TIME;

  if (!isOnline) {
    device.isActive = false;
    device.isVerified = false;
    device.temperature = 0;
    device.rpm = 0;
    device.pwm = 0;
    await device.save();
  }

  res.json({
    success: true,
    device: {
      _id: device._id,  
      devicePass_Key:device.devicePass_Key,
      deviceName: device.deviceName,
      temperature: device.temperature,
      rpm: device.rpm,
      pwm: device.pwm,
    pwmValue: device.pwmValue,
    autoMode: device.autoMode,
      isOnline
    }
  });
};

export const Adddevice = async (req, res) => {
  const { devicePass_Key, EnterdevicePass_Key } = req.body;
  const userId = req.UserId;


  // 1️⃣ Find the device by passkey
  const device = await DeviceModels.findOne({ devicePass_Key });
  if (!device) {
    return res.json({ success: false, message: "Invalid passkey" });
  }

  // 2️⃣ Check if entered passkey matches
  if (EnterdevicePass_Key !== device.devicePass_Key) {
    return res.json({ success: false, message: "Wrong passkey" });
  }

 

  // 3️⃣ Initialize users array if not present
  if (!device.user) device.user = [];

  // 4️⃣ Add current user to users array if not already added
  if (!device.user.includes(userId)) {
    device.user.push(userId);
  }

  // 5️⃣ Deactivate all other devices of this user
  await DeviceModels.updateMany(
    { user: userId },
    { $set: { isActive: false } }
  );

  // 6️⃣ Update device info for this user
  device.isVerified = true;
  device.isActive = true;


  await device.save();

  // 7️⃣ Respond with success
  res.json({ success: true, deviceId: device._id });
};









