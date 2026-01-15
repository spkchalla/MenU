import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


import geminiRouter from "./routes/geminiRoutes.js";

import "./config/db.js";
import menuRouter from "./routes/menuRoutes.js";
import userRouter from "./routes/userRoutes.js";
import voteRouter from "./routes/voteRoutes.js";
import statsRouter from "./routes/statsRouter.js";
import https from "https";

const app = express();
app.use(cors());
app.use(express.json());

// Root route to handle pings and basic health checks
app.get("/", (req, res) => {
  res.send("MenU Backend is active!");
});

app.use("/api/gemini", geminiRouter);
app.use("/api/menu", menuRouter);
app.use("/api/user", userRouter);
app.use("/api/vote", voteRouter);
app.use("/api/stats", statsRouter);

// Self-pinging logic to keep the Render instance from spinning down
const RENDER_URL = "https://menu-4p83.onrender.com";
setInterval(() => {
  https.get(RENDER_URL, (res) => {
    console.log(`Self-ping successful: Status ${res.statusCode}`);
  }).on("error", (err) => {
    console.error("Self-ping failed:", err.message);
  });
}, 14 * 60 * 1000); // Ping every 14 minutes (Render timeout is 15 mins)

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message
  });
});

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...');
  console.error(err.name, err.message);
  // In production, you might want to exit, but for dev/request we keep it running or restart
  // process.exit(1); 
});

// Catch Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(err.name, err.message);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("Server running on port 5000");
});

export default app;