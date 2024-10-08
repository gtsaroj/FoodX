import { createClient } from "redis";

const redisClient = createClient();
redisClient.on("error", (error) => {
  console.error(`Redis client error:`, error);
});
await redisClient.connect();

export { redisClient };
