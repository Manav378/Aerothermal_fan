import mongoose from "mongoose";

const WeeklySummarySchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: "DeviceRawData" },
  weekStart: Date,
  data: [
    {
      day: String, 
      temperature: Number,
      rpm: Number,
      pwm: Number,
    },
  ],
});

export default mongoose.model("WeeklySummary", WeeklySummarySchema);
