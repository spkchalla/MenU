import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


import geminiRouter from "./routes/geminiRoutes.js";

import "./config/db.js";
import menuRouter from "./routes/menuRoutes.js";
import userRouter from "./routes/userRoutes.js";
const app = express();
app.use(express.json());

app.use("/api/gemini", geminiRouter);
app.use("/api/menu", menuRouter);
app.use("/api/user", userRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("Server running on port 5000");
});

export default app;