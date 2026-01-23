import express from "express";
import { mostDislikedFoods, mostLikedFoods, getTrends } from "../controller/statsController.js";

const statsRouter = express.Router();

statsRouter.get("/topFoods", mostLikedFoods);
statsRouter.get("/bottomFoods", mostDislikedFoods);
statsRouter.get("/trends", getTrends);

export default statsRouter;