import WeeklySummary from "../models/WeeklySummary.js";
import DeviceRawData from "../models/DeviceRawData.js";

export const aggregateWeeklyData = async () => {
  try {
    const devices = await DeviceRawData.distinct("device"); // unique devices
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

    for (const deviceId of devices) {
      const data = await DeviceRawData.find({ 
        device: deviceId,
        createdAt: { $gte: weekStart }
      });

      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const chartData = days.map(day => {
        const dayData = data.filter(d => new Date(d.createdAt).getDay() === days.indexOf(day));
        return {
          day,
          temperature: dayData.length ? Math.round(dayData.reduce((a,b)=>a+b.temperature,0)/dayData.length) : 0,
          rpm: dayData.length ? Math.round(dayData.reduce((a,b)=>a+b.rpm,0)/dayData.length) : 0,
          pwm: dayData.length ? Math.round(dayData.reduce((a,b)=>a+b.pwm,0)/dayData.length) : 0,
        };
      });

      await WeeklySummary.findOneAndUpdate(
        { device: deviceId, weekStart },
        { device: deviceId, weekStart, data: chartData },
        { upsert: true }
      );
    }
  } catch (err) {
    console.log("Weekly aggregation error:", err.message);
  }
};
