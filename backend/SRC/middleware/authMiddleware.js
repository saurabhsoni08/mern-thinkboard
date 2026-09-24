import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
};

export default protect;