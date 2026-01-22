
import { getPWM, isAutoMode, setAutoMode,setPWM } from './pwmSliderController.js';
import DeviceRawData from '../models/DeviceRawData.js';
import DeviceModels from '../models/Device.model.js';


// ESP32 POST: update temperature & RPM
export const sensorController = async (req, res) => {
  try {
    const { devicePass_Key, deviceName, temperature, rpm, pwm } = req.body;

    if (!devicePass_Key) {
      return res.status(400).json({
        success: false,
        message: "devicePass_Key is required",
      });
    }

    let device = await DeviceModels.findOne({ devicePass_Key });

    if (!device) {
      device = await DeviceModels.create({
        devicePass_Key,
        deviceName,      // 👈 directly save
        temperature,
        rpm,
        pwm,
        isOnline: true,
        lastSeen: new Date(),
      });
    } else {
      device.deviceName = deviceName;  // 👈 UI ke liye allow
      device.temperature = temperature;
      device.rpm = rpm;
      device.pwm = pwm;
      device.isOnline = true;
      device.lastSeen = new Date();
      await device.save();
    }

    await DeviceRawData.create({
      device: device._id,
      temperature,
      rpm,
      pwm,
    });

    // 🔥 UI READY RESPONSE
    res.json({
      success: true,
      deviceName: device.deviceName,
      temperature: device.temperature,
      rpm: device.rpm,
      pwm: device.pwm,
      isOnline: true,
    });

  } catch (error) {
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
    user: req.UserId
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
    user: req.UserId
  });

  if (!device) {
    return res.status(404).json({ success: false });
  }

  device.autoMode = enabled;
  await device.save();

  res.json({
    success: true,
    autoMode: enabled,
    pwmValue: device.pwmValue
  });
};



export const pwmStatusController = async (req, res) => {
  const { devicekey } = req.query;

  const device = await DeviceModels.findOne({ devicePass_Key: devicekey });

  if (!device) {
    return res.status(404).json({ success: false });
  }

  res.json({
    autoMode: device.autoMode,
    manualPWM: device.pwmValue
  });
};



