// models/DeviceHistory.js
import mongoose from "mongoose";

const DeviceHistorySchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
    index: true
  },
  temperature: Number,
  rpm: Number,
  pwm: Number,
}, { timestamps: true });

DeviceHistorySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 } // 7 days
);

export default mongoose.model("DeviceHistory", DeviceHistorySchema);
