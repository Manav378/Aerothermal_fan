
import { getPWM, isAutoMode, setAutoMode,setPWM } from './pwmSliderController.js';
import DeviceRawData from '../models/DeviceRawData.js';
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


    //RAW DATA SAVE (history)
    await DeviceRawData.create({
      device:device._id,
      temperature,
      rpm,
      pwm
    })


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





export const pwmSliderController = async(req, res) => {
  const { duty } = req.body;
  console.log(duty);
  const {devicekey} = req.params

  if (isAutoMode())
    return res.json({ ignored: "Auto mode ON" });

  if (duty < 80 || duty > 255)
    return res.status(400).json({ error: "Invalid PWM" });

  const device = await DeviceModels.findOne({devicePass_Key:devicekey})

  if(!device) return res.status(404).json({success:false,message:"device not found"});
 
  device.pwmValue = duty;
  await device.save();


  setPWM(duty);
  res.json({ success: true  , message:duty});
};

export const autoModeController = async(req, res) => {
  const { enabled } = req.body;
  const {devicekey} = req.params

  const device = await DeviceModels.findOne({devicePass_Key:devicekey});
  if(!device) return res.status(404).json({success:false , message:"device not found!"});

  device.autoMode = enabled
  await device.save();
  setAutoMode(enabled);
  res.json({success:true ,  autoMode: enabled , pwmValue: device.pwmValue, });
};


export const pwmStatusController = (req, res) => {
  res.json({
    autoMode: isAutoMode(),
    manualPWM: getPWM(),
  });
};




