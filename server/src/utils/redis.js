import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();


const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${encodeURIComponent(
    process.env.REDIS_PASSWORD
  )}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on("connect", () => {
  console.log("✅ Redis Cloud connected");
});

redisClient.on("error", (err) => {
  console.log("❌ Redis error:", err.message);
});

await redisClient.connect();

export default redisClient;
