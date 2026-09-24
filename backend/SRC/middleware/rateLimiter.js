import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];

    const identifier =
      (typeof forwardedFor === "string"
        ? forwardedFor.split(",")[0].trim()
        : null) ||
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next(error);
  }
};

export default rateLimiter;