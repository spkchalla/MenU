import express from "express";
import { mostDislikedFoods, mostLikedFoods } from "../controller/statsController.js";

const statsRouter = express.Router();

statsRouter.get("/topFoods", mostLikedFoods);
statsRouter.get("/bottomFoods", mostDislikedFoods);

export default statsRouter;