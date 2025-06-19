const redisClient = require("redis");

const redis = redisClient.createClient();

redis.on("error", (err) => console.error("Redis Error:", err));

async function connectRedis()
{
  try {
    await redis.connect();
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}
connectRedis();
module.exports = redis;