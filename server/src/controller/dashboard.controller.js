
import DeviceModels from "../models/Device.model.js";
import { decryptPhone } from "../utils/crypto.js";
import { sendTempAlertSms } from "../utils/SMS.js";
import DeviceHistoryModel from "../models/DeviceHistory.model.js";
import client from "../utils/redis.js";

const ALERT_GAP = 2 * 60 * 1000;
const TEMP_LIMIT = 50;
export const sensorController = async (req, res) => {
  try {
    const { devicePass_Key, deviceName, temperature, rpm, pwm } = req.body;

    if (!devicePass_Key) {
      return res
        .status(400)
        .json({ success: false, message: "devicePass_Key is required" });
    }

    let device = await DeviceModels.findOne({ devicePass_Key }).populate({
      path: "user",
      select: "phone iv",
    });

    if (!device) {
      device = await DeviceModels.create({
        devicePass_Key,
        deviceName,
        temperature,
        rpm,
        pwm,
        isOnline: true,
        lastSeen: new Date(),
      });
    } else {
      device.deviceName = deviceName;
      device.temperature = temperature;
      device.rpm = rpm;
      device.pwm = pwm;
      device.isOnline = true;
      device.lastSeen = new Date();
      await device.save();
    }

    // 📌 History (Mongo only)
    await DeviceHistoryModel.create({
      device: device._id,
      temperature,
      rpm,
      pwm,
    });

const redisKey = `device:${device.devicePass_Key}:latest`;

await client.setEx(redisKey, 60, JSON.stringify({
  _id: device._id,
  devicePass_Key: device.devicePass_Key,
  deviceName: device.deviceName,
  temperature: device.temperature,
  rpm: device.rpm,
  pwm: device.pwm,
  pwmValue: device.pwmValue,
  autoMode: device.autoMode,
  isOnline: true,
  lastSeen: new Date()
}));



    if (
      temperature > TEMP_LIMIT &&
      (!device.lastAlertAt ||
        Date.now() - new Date(device.lastAlertAt).getTime() > ALERT_GAP)
    ) {
      for (const u of device.user) {
        if (u?.phone) {
          const phone = decryptPhone(u.phone, u.iv);
          await sendTempAlertSms(phone, temperature);
        }
      }
      device.lastAlertAt = new Date();
      await device.save();
    }

    res.json({
      success: true,
      deviceName: device.deviceName,
      temperature,
      rpm,
      pwm,
      isOnline: true,
    });
  } catch (error) {
    console.log("Sensor Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const pwmSliderController = async (req, res) => {
  const { duty } = req.body;
  const { devicekey } = req.params;

  if (duty < 80 || duty > 255) {
    return res.status(400).json({ error: "Invalid PWM" });
  }

  const device = await DeviceModels.findOne({
    devicePass_Key: devicekey,
    user: req.UserId,
  });

  if (!device) {
    return res.status(404).json({ success: false });
  }

  if (device.autoMode) {
    return res.json({ ignored: "Auto mode ON" });
  }

  device.pwmValue = duty;
  await device.save();

  res.json({ success: true, pwm: duty });
};
export const autoModeController = async (req, res) => {
  const { enabled } = req.body;
  const { devicekey } = req.params;

  const device = await DeviceModels.findOne({
    devicePass_Key: devicekey,
    user: req.UserId,
  });

  if (!device) {
    return res.status(404).json({ success: false });
  }

  device.autoMode = enabled;
  await device.save();

  res.json({
    success: true,
    autoMode: enabled,
    pwmValue: device.pwmValue,
  });
};

export const pwmStatusController = async (req, res) => {
  const { devicekey } = req.params;

  const device = await DeviceModels.findOne({
    devicePass_Key: devicekey,
  });

  if (!device) {
    return res.status(404).json({ success: false });
  }

  res.json({
    autoMode: device.autoMode,
    manualPWM: device.pwmValue,
  });
};


