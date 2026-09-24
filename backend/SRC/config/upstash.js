import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV?.trim().toLowerCase();

const isTestEnvironment = nodeEnv === "test";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),

  limiter: isTestEnvironment
    ? Ratelimit.slidingWindow(1000, "60 s")
    : Ratelimit.slidingWindow(100, "60 s"),
});

export default ratelimit;