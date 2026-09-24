import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

//  what is an endpoint?
//  An endpoint is a combination of a URL + HTTP method that lets the client interect with a specific resource.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Allows us to read cookies from requests
app.use(cookieParser());

// Rate limiter
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Connect MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server started on port:", PORT);
  });
});