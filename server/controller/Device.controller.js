import DeviceModels from "../models/Device.model.js";

  const OFFLINE_TIME = 30 * 1000




export const getDevice = async (req, res) => {
  try {
    const devices = await DeviceModels.find();

    const updatedIsOnline = devices.map((device) => {
      const isOnline =
        device.lastSeen &&
        Date.now() - new Date(device.lastSeen).getTime() < OFFLINE_TIME;

      return {
        ...device._doc,
        isOnline
      };
    });

    res.status(200).json({
      success: true,
      data: updatedIsOnline
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export  const Adddevice= async(req,res)=>{
       try {
    const { devicePass_Key,EnterdevicePass_Key } = req.body;
    const userId = req.userId;

    const device = await DeviceModels.findOne({ devicePass_Key });

    if(EnterdevicePass_Key !== device.devicePass_Key) return res.json({success:false , message:"wrong device Pass key!"})

    

    if (!device) {
      return res.status(400).json({
        success: false,
        message: "Invalid Device ID"
      });
    }

    if (device.user) {
      return res.status(400).json({
        success: false,
        message: "Device already linked"
      });
    }

    device.user = userId;
    await device.save();

    res.json({
      success: true,
      message: "Device added successfully",
      device
    });

    } catch (error) {
       console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
    }
  }