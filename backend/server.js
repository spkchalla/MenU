import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import geminiRouter from "./routes/geminiRoutes.js";

import "./config/db.js";
import menuRouter from "./routes/menuRoutes.js";
import userRouter from "./routes/userRoutes.js";
import voteRouter from "./routes/voteRoutes.js";
import statsRouter from "./routes/statsRouter.js";
import authRoutes from "./routes/authRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import suggestionRouter from "./routes/suggestionRoutes.js";
import https from "https";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

console.log("CORS policy: Allowed all origins with credentials");
app.use(express.json());
app.use(cookieParser());

// Root route to handle pings and basic health checks
app.get("/", (req, res) => {
  res.send("MenU Backend is active!");
});

// Morgan logger middleware to log HTTP requests in development
// Terminal output example: GET /tiny 200 2 - 0.188 ms

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

app.use("/api/gemini", geminiRouter);
app.use("/api/menu", menuRouter);
app.use("/api/user", userRouter);
app.use("/api/vote", voteRouter);
app.use("/api/stats", statsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/noti", notificationRouter);
app.use("/api/suggestions", suggestionRouter);

// Self-pinging logic to keep the Render instance from spinning down
const RENDER_URL = "https://menu-4p83.onrender.com";
setInterval(
  () => {
    https
      .get(RENDER_URL, (res) => {
        console.log(`Self-ping successful: Status ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error("Self-ping failed:", err.message);
      });
  },
  14 * 60 * 1000,
); // Ping every 14 minutes (Render timeout is 15 mins)

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
  });
});

// Catch Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...");
  console.error(err.name, err.message);
  // In production, you might want to exit, but for dev/request we keep it running or restart
  // process.exit(1);
});

// Catch Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥");
  console.error(err.name, err.message);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
