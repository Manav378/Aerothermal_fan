
import mongoose from "mongoose";

const WeeklySummarySchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
    index: true
  },
  weekStart: { type: Date, required: true },
  expiresAt: { type: Date, index: true },
  data: [
    {
      day: String,
      temperature: Number,
      rpm: Number,
      pwm: Number,
      heatindex:Number,
      humidity:Number
    }
  ]
});

WeeklySummarySchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("WeeklySummary", WeeklySummarySchema);
