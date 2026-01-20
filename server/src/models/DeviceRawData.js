import mongoose  from "mongoose";


const deviceRawDataSchema = new mongoose.Schema({

     device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
  temperature: Number,
  rpm: Number,
  fanSpeed: Number,
  pwm: Number,
  createdAt: { type: Date, default: Date.now }
})


export default mongoose.model("DeviceRawData" , deviceRawDataSchema);