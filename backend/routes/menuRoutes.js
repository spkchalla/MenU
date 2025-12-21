import express from "express";
import {createWeeklyMenu, getWeeklyMenu, updateWeeklyMenu, deleteWeeklyMenu} from "../controller/menuController.js"

const menuRouter = express.Router();

menuRouter.post('/createMenu', express.text(), createWeeklyMenu);
menuRouter.get("/:weekStartDate", getWeeklyMenu);
menuRouter.put("/:weekStartDate", updateWeeklyMenu);
menuRouter.delete("/:weekStartDate", deleteWeeklyMenu);

export default menuRouter;