import express from "express";
import {createWeeklyMenu, updateWeeklyMenu, deleteWeeklyMenu, showTodayMenu, getSpecificMenu, currentMeal, otherMeals, specificDayMenu, getAllMenus, getWeeklyMenu} from "../controller/menuController.js"
import { protectAdmin, protectUser } from "../middleware/middleware.js";

const menuRouter = express.Router();

menuRouter.post('/createMenu', express.text(), protectUser, protectAdmin, createWeeklyMenu);
menuRouter.get('/allMenus', protectUser, protectAdmin, getAllMenus);
menuRouter.get('/todayMenu', showTodayMenu);
menuRouter.get('/specificDay/:date', getSpecificMenu);
menuRouter.get('/weeklyMenu/:date', getWeeklyMenu);
menuRouter.get('/currentMeal', currentMeal);
menuRouter.get('/otherMeals', otherMeals);
menuRouter.get('/dayOfPresentWeek/:day', specificDayMenu);
//menuRouter.get("/:weekStartDate", getWeeklyMenu);
menuRouter.put("/updateMenu/:weekStartDate", protectUser, protectAdmin, updateWeeklyMenu);
menuRouter.delete("/deleteMenu/:weekStartDate", protectUser, protectAdmin, deleteWeeklyMenu);

export default menuRouter;