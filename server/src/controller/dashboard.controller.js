
import { getPWM, isAutoMode, setAutoMode,setPWM } from './pwmSliderController.js';

import DeviceModels from '../models/Device.model.js';


// ESP32 POST: update temperature & RPM
export const sensorController = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const {deviceName, devicePass_Key, temperature, rpm, pwm } = req.body;

  
    if (!devicePass_Key) {
      return res.status(400).json({
        success: false,
        message: "devicePass_Key is required"
      });
    }
  
    let device = await DeviceModels.findOne({ devicePass_Key });

    if (!device) {
      device = await DeviceModels.create({
        deviceName,
        devicePass_Key,
        temperature,
        rpm,
        pwm,
        isOnline: true,
        lastSeen: new Date()
      });
    } else {
      device.temperature = temperature;
      device.rpm = rpm;
      device.pwm = pwm;
      device.isOnline = true;
      device.lastSeen = new Date();
      await device.save();
    }


    res.status(200).json({
      success: true,
      message: "Sensor data stored successfully",
      device
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





export const pwmSliderController = (req, res) => {
  const { duty } = req.body;

  if (isAutoMode())
    return res.json({ ignored: "Auto mode ON" });

  if (duty < 80 || duty > 255)
    return res.status(400).json({ error: "Invalid PWM" });

  setPWM(duty);
  res.json({ success: true });
};

export const autoModeController = (req, res) => {
  const { enabled } = req.body;
  setAutoMode(enabled);
  res.json({ autoMode: enabled });
};


export const pwmStatusController = (req, res) => {
  res.json({
    autoMode: isAutoMode(),
    manualPWM: getPWM(),
  });
};




