// server/controller/dashboard.controller.js
import { setpwmSlider, getpwmSlider, isAutomode, setAutomode } from './pwmSliderController.js';
import { Calculatepwm } from './autologicAutomode.js';
import DeviceModels from '../models/Device.model.js';

// In-memory storage for sensor data
export let DashData = {
    temperature: 0,
    rpm: 0,
    pwm:0,
    deviceName:"ESP32_FAN_1"
};

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

  
    if (typeof temperature === "number") DashData.temperature = temperature;
    if (typeof rpm === "number") DashData.rpm = rpm;
    if (typeof pwm === "number") DashData.pwm = pwm;

  
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

    if (isAutomode()) {
      const autoPwm = Calculatepwm(DashData.temperature);
      setpwmSlider(autoPwm);
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



// Get current temperature
export const tempController = (req, res) => {
    res.status(200).json({ success: true, data: DashData.temperature });
};

// Get current RPM
export const rpmController = (req, res) => {
    res.status(200).json({ success: true, data: DashData.rpm });
};

// Manual PWM slider
export const rpmSliderController = (req, res) => {
    const { duty } = req.body;

    if (isAutomode()) return res.status(200).json({ ignored: "Auto mode ON" });
    if (duty < 0 || duty > 255) return res.status(400).json({ error: "Invalid PWM value" });

    setpwmSlider(duty);
    res.status(200).json({ success: true });
};

// Check current PWM
export const checkpwm = (req, res) => {
    res.status(200).json({ pwm: getpwmSlider() });
};

// Enable/disable auto mode
export const autmode = (req, res) => {
    const { enabled } = req.body;
    setAutomode(enabled);
    res.status(200).json({ success: true });
};



// pwm from ESP32

export const pwm = (req,res)=>{
    console.log(DashData.pwm)
   res.status(200).json({ success: true, data: DashData.pwm }); 
}