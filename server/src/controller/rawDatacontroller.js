import WeeklySummary from "../models/WeeklySummary.js";

export const getWeeklySummary = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const summary = await WeeklySummary
      .findOne({ device: deviceId })
      .sort({ weekStart: -1 });

    res.json(summary ? summary.data : []);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
