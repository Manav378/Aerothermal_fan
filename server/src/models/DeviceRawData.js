// models/RawData.js
import mongoose from "mongoose";

const RawDataSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
  temperature: Number,
  rpm: Number,
  pwm: Number,
  timestamp: { type: Date, default: Date.now, index: true }
});


RawDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("RawData", RawDataSchema);
