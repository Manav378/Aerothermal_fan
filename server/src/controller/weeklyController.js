import WeeklySummary from "../models/WeeklySummary.js";
import DeviceHistoryModel from "../models/DeviceHistory.model.js";

export const aggregateWeeklyData = async () => {
  const devices = await DeviceHistoryModel.distinct("device");

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0,0,0,0);

  for (const deviceId of devices) {
    const weeklyData = await DeviceHistoryModel.aggregate([
      {
        $match: {
          device: deviceId,
          createdAt: { $gte: weekStart }
        }
      },
      {
        $group: {
          _id: { day: { $dayOfWeek: "$createdAt" } },
          avgTemp: { $avg: "$temperature" },
          avgRpm: { $avg: "$rpm" },
          avgPwm: { $avg: "$pwm" }
        }
      }
    ]);

    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const chartData = days.map((day, i) => {
      const found = weeklyData.find(d => d._id.day === i + 1);
      return {
        day,
        temperature: found ? Math.round(found.avgTemp) : 0,
        rpm: found ? Math.round(found.avgRpm) : 0,
        pwm: found ? Math.round(found.avgPwm) : 0,
      };
    });

    await WeeklySummary.findOneAndUpdate(
      { device: deviceId, weekStart },
      {
        device: deviceId,
        weekStart,
        data: chartData,
        expiresAt: new Date(Date.now() + 30*24*60*60*1000)
      },
      { upsert: true }
    );
  }
};
