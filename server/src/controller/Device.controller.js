import DeviceModels from "../models/Device.model.js";

const OFFLINE_TIME = 30 * 1000;

export const getDevice = async (req, res) => {
  try {
    const devices = await DeviceModels.find();

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
    user: req.userId,
    isActive: true
  });

  if (!device) {
    return res.json({ success: false });
  }

  const isOnline =
    Date.now() - new Date(device.lastSeen).getTime() < 30000;

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
      deviceName: device.deviceName,
      temperature: device.temperature,
      rpm: device.rpm,
      pwm: device.pwm,
      isOnline
    }
  });
};


export const Adddevice = async (req, res) => {
  const { devicePass_Key, EnterdevicePass_Key } = req.body;
  const userId = req.userId;

  const device = await DeviceModels.findOne({ devicePass_Key });
  if (!device) return res.json({ success: false, message: "Invalid passkey" });

  if (EnterdevicePass_Key !== device.devicePass_Key)
    return res.json({ success: false, message: "Wrong passkey" });


  await DeviceModels.updateMany(
    { user: userId },
    { $set: { isActive: false } }
  );


  device.user = userId;
  device.isVerified = true;
  device.isActive = true;
  device.lastSeen = new Date();
  await device.save();

  res.json({ success: true, deviceId: device._id });
};









