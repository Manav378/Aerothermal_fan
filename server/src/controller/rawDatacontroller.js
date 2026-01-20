import DeviceRawData from "../models/DeviceRawData.js";

export const getWeeklyRawData = async (req, res) => {
   try {
    const { deviceId } = req.params;

    // Last 7 days ke data fetch
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyData = await DeviceRawData.find({
      device: deviceId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 }); // ascending by date

    // Agar data nahi hai, empty array return karo
    res.json(weeklyData.length ? weeklyData : []);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
